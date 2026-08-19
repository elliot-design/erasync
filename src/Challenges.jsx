import { useState } from "react";

const C = {
  bg: "#0A0B1A", surface: "#0F1128", card: "#141630", border: "#1E2245",
  accent: "#7C5CFC", accentSoft: "#9B7FFF", accentGlow: "rgba(124,92,252,0.18)",
  teal: "#38BDF8", tealGlow: "rgba(56,189,248,0.12)",
  success: "#34D399", warning: "#FBBF24", danger: "#F87171",
  gold: "#F59E0B", silver: "#94A3B8",
  textPrimary: "#E8EAFF", textSecondary: "#8892B8", textMuted: "#4A5280",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes popIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
`;

const CATEGORIES = ["All","Focus","Social Media","Sleep","Fitness","Study","Digital Detox"];

const DIFFICULTY_COLORS = { Easy: C.success, Medium: C.teal, Hard: C.warning, Legendary: C.gold };

const INITIAL_CHALLENGES = [
  { id:1,  name:"7-Day Study Marathon",    category:"Study",         desc:"Study for at least 4 hours every day for 7 days straight.",              icon:"🧠", color:C.accentSoft, xp:300,  duration:7,  progress:5, joined:true,  completed:false, daysLeft:2, badge:"Marathon Scholar",      tasks:["Study 4h today","Log a journal entry","Complete 2 Pomodoros"],              difficulty:"Hard"      },
  { id:2,  name:"3-Day Focus Sprint",      category:"Focus",         desc:"Complete at least 4 Pomodoro sessions daily for 3 days.",                 icon:"⏱️",color:C.teal,       xp:150,  duration:3,  progress:2, joined:true,  completed:false, daysLeft:1, badge:"Sprint King",           tasks:["4 Pomodoros today","No phone during sessions","Log focus time"],             difficulty:"Medium"    },
  { id:3,  name:"Social Media Detox",      category:"Social Media",  desc:"Keep social media under 30 minutes daily for 5 days.",                   icon:"📵", color:C.success,    xp:200,  duration:5,  progress:3, joined:true,  completed:false, daysLeft:2, badge:"Digital Warrior",       tasks:["Social media < 30 mins","No Instagram after 9PM","Log mood daily"],           difficulty:"Hard"      },
  { id:4,  name:"Early Bird Week",         category:"Sleep",         desc:"Wake up before 6:30 AM every day for 7 days.",                           icon:"🌅", color:C.warning,    xp:250,  duration:7,  progress:0, joined:false, completed:false, daysLeft:7, badge:"Early Bird",            tasks:["Wake up before 6:30 AM","No phone first 30 mins","Log energy level"],          difficulty:"Hard"      },
  { id:5,  name:"30-Day Productivity",     category:"Focus",         desc:"Maintain a productivity score above 70 for 30 days.",                    icon:"📈", color:C.accentSoft, xp:1000, duration:30, progress:0, joined:false, completed:false, daysLeft:30,badge:"Productivity Legend",    tasks:["Score > 70 today","Complete all goals","No missed Pomodoros"],                difficulty:"Legendary" },
  { id:6,  name:"Weekend Digital Detox",   category:"Digital Detox", desc:"Stay under 2 hours total screen time this weekend.",                     icon:"🌿", color:C.success,    xp:180,  duration:2,  progress:0, joined:false, completed:false, daysLeft:2, badge:"Detox Champion",        tasks:["Screen time < 2h","Spend time outdoors","Read a book"],                        difficulty:"Medium"    },
  { id:7,  name:"10K Steps Challenge",     category:"Fitness",       desc:"Hit 10,000 steps every day for 5 days.",                                  icon:"🏃", color:C.danger,     xp:220,  duration:5,  progress:0, joined:false, completed:false, daysLeft:5, badge:"Step Master",           tasks:["10,000 steps today","Log exercise","No elevator"],                             difficulty:"Medium"    },
  { id:8,  name:"No Social Before Noon",   category:"Social Media",  desc:"Avoid all social media until after 12 PM for 7 days.",                   icon:"🚫", color:C.warning,    xp:175,  duration:7,  progress:0, joined:false, completed:false, daysLeft:7, badge:"Morning Guardian",      tasks:["No social before noon","Morning study block","Log mood"],                      difficulty:"Medium"    },
  { id:9,  name:"Sleep Before 11PM",       category:"Sleep",         desc:"Be in bed before 11 PM for 5 consecutive nights.",                        icon:"🌙", color:C.teal,       xp:190,  duration:5,  progress:0, joined:false, completed:false, daysLeft:5, badge:"Night Tamer",           tasks:["In bed by 11 PM","Wind down at 9:30 PM","No screens 30 mins before bed"],      difficulty:"Medium"    },
  { id:10, name:"3-Day Journal Streak",    category:"Study",         desc:"Write a journal entry every day for 3 days.",                            icon:"✍️", color:C.gold,       xp:100,  duration:3,  progress:3, joined:true,  completed:true,  daysLeft:0, badge:"Reflector",             tasks:[],                                                                              difficulty:"Easy"      },
];

function Card({ children, style }) {
  return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, animation: "fadeUp .4s ease", ...style }}>{children}</div>;
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.textMuted, textTransform: "uppercase", marginBottom: 14 }}>{children}</div>;
}

function ChallengeCard({ ch, onJoin, onView, compact }) {
  const pct = Math.round((ch.progress / ch.duration) * 100);
  return (
    <div onClick={() => onView(ch)} style={{ background: C.surface, border: `1px solid ${ch.completed ? C.gold+"55" : ch.joined ? ch.color+"44" : C.border}`, borderRadius: 16, padding: 20, cursor: "pointer", transition: "border-color .2s, background .2s", animation: "fadeUp .4s ease", boxShadow: ch.joined && !ch.completed ? `0 0 16px ${ch.color}11` : "none" }}
      onMouseEnter={e => e.currentTarget.style.background = C.card}
      onMouseLeave={e => e.currentTarget.style.background = C.surface}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: ch.color+"22", border: `1px solid ${ch.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, animation: ch.joined ? "float 3s ease infinite" : "none" }}>
          {ch.completed ? "✅" : ch.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>{ch.name}</span>
            {ch.joined && !ch.completed && <span style={{ fontSize: 10, fontWeight: 700, color: ch.color, background: ch.color+"22", padding: "2px 8px", borderRadius: 10, animation: "pulse 2s infinite" }}>● ACTIVE</span>}
            {ch.completed && <span style={{ fontSize: 10, fontWeight: 700, color: C.gold, background: C.gold+"22", padding: "2px 8px", borderRadius: 10 }}>✓ DONE</span>}
          </div>
          <div style={{ fontSize: 12, color: C.textMuted }}>{ch.category} · {ch.duration} days · <span style={{ color: DIFFICULTY_COLORS[ch.difficulty] }}>{ch.difficulty}</span></div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.gold }}>+{ch.xp} XP</div>
          {ch.joined && !ch.completed && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{ch.daysLeft}d left</div>}
        </div>
      </div>
      {!compact && <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6, marginBottom: 14 }}>{ch.desc}</p>}
      {ch.joined && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.textMuted, marginBottom: 6 }}>
            <span>Day {ch.progress} of {ch.duration}</span>
            <span style={{ color: ch.color, fontWeight: 600 }}>{pct}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: C.border, overflow: "hidden", marginBottom: ch.completed ? 0 : 12 }}>
            <div style={{ height: "100%", width: pct+"%", borderRadius: 3, background: `linear-gradient(90deg,${ch.color},${ch.color}88)`, transition: "width .8s ease" }} />
          </div>
        </>
      )}
      {!ch.joined && (
        <button onClick={e => { e.stopPropagation(); onJoin(ch.id); }} style={{ width: "100%", padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 600, background: `linear-gradient(135deg,${ch.color},${ch.color}88)`, border: "none", color: "#fff", cursor: "pointer", fontFamily: "inherit", marginTop: 4 }}>
          Join Challenge
        </button>
      )}
    </div>
  );
}

function DetailModal({ ch, onClose, onJoin }) {
  const pct = Math.round((ch.progress / ch.duration) * 100);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)", padding: 24 }}>
      <div style={{ background: C.card, border: `1px solid ${ch.color}44`, borderRadius: 20, padding: 32, width: "100%", maxWidth: 520, animation: "popIn .25s ease", maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: ch.color+"22", border: `1px solid ${ch.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
            {ch.completed ? "✅" : ch.icon}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>{ch.name}</h2>
            <div style={{ fontSize: 12, color: C.textMuted }}>{ch.category} · {ch.duration} days · <span style={{ color: DIFFICULTY_COLORS[ch.difficulty] }}>{ch.difficulty}</span></div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: C.textMuted, fontSize: 18, cursor: "pointer", padding: 4 }}>✕</button>
        </div>
        <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.7, marginBottom: 20 }}>{ch.desc}</p>
        <div style={{ background: C.gold+"11", border: `1px solid ${C.gold}33`, borderRadius: 12, padding: "14px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22 }}>🏅</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.gold }}>{ch.badge} Badge + {ch.xp} XP</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Awarded on completion</div>
          </div>
        </div>
        {ch.joined && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 10 }}>Day {ch.progress} of {ch.duration} — {pct}% complete</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {Array.from({ length: ch.duration }).map((_, i) => (
                <div key={i} style={{ flex: 1, minWidth: 20, height: 6, borderRadius: 3, background: i < ch.progress ? `linear-gradient(90deg,${ch.color},${ch.color}88)` : C.border }} />
              ))}
            </div>
          </div>
        )}
        {ch.tasks.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.textMuted, textTransform: "uppercase", marginBottom: 12 }}>Today's Tasks</div>
            {ch.tasks.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", marginBottom: 8 }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${ch.color}`, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: C.textSecondary }}>{t}</span>
              </div>
            ))}
          </div>
        )}
        {ch.completed ? (
          <div style={{ background: C.gold+"22", border: `1px solid ${C.gold}44`, borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>🏆</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>Challenge Complete!</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>You earned the {ch.badge} badge</div>
          </div>
        ) : ch.joined ? (
          <button onClick={onClose} style={{ width: "100%", padding: "12px", borderRadius: 12, background: `linear-gradient(135deg,${ch.color},${ch.color}88)`, border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Keep Going 💪</button>
        ) : (
          <button onClick={() => { onJoin(ch.id); onClose(); }} style={{ width: "100%", padding: "12px", borderRadius: 12, background: `linear-gradient(135deg,${ch.color},${ch.color}88)`, border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Join Challenge — +{ch.xp} XP</button>
        )}
      </div>
    </div>
  );
}

export default function Challenges() {
  const [challenges, setChallenges] = useState(INITIAL_CHALLENGES);
  const [category, setCategory] = useState("All");
  const [tab, setTab] = useState("active");
  const [viewing, setViewing] = useState(null);

  function joinChallenge(id) {
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, joined: true } : c));
  }

  const active    = challenges.filter(c => c.joined && !c.completed);
  const library   = challenges.filter(c => !c.joined && !c.completed);
  const completed = challenges.filter(c => c.completed);

  const listMap = { active, library, completed };
  const filtered = (listMap[tab] || []).filter(c => category === "All" || c.category === category);
  const totalXp  = completed.reduce((s, c) => s + c.xp, 0);
  const spotlight = active[0];

  return (
    <>
      <style>{css}</style>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28, animation: "fadeUp .4s ease" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: C.accentSoft, textTransform: "uppercase", marginBottom: 6 }}>Push Your Limits</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Challenges 🏆</h1>
          <p style={{ fontSize: 14, color: C.textSecondary }}>Complete challenges, earn XP and unlock badges.</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
          {[
            { label: "Active",    value: active.length,    color: C.accentSoft, icon: "⚡" },
            { label: "Completed", value: completed.length, color: C.gold,       icon: "🏆" },
            { label: "XP Earned", value: totalXp+" XP",   color: C.warning,    icon: "⭐" },
            { label: "Available", value: library.length,   color: C.teal,       icon: "📋" },
          ].map((s, i) => (
            <Card key={i} style={{ padding: 18, textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Spotlight */}
        {spotlight && tab !== "completed" && (
          <div style={{ background: "linear-gradient(135deg,#1a0e3a,#0d1535)", border: `1px solid ${spotlight.color}44`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: spotlight.color, textTransform: "uppercase", marginBottom: 10 }}>🔥 Most Urgent</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 36, animation: "float 3s ease infinite" }}>{spotlight.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>{spotlight.name}</div>
                <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 12 }}>{spotlight.daysLeft} day{spotlight.daysLeft !== 1 ? "s" : ""} remaining — Day {spotlight.progress} of {spotlight.duration}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {Array.from({ length: spotlight.duration }).map((_, i) => (
                    <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i < spotlight.progress ? `linear-gradient(90deg,${spotlight.color},${spotlight.color}88)` : C.border }} />
                  ))}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: spotlight.color, fontFamily: "'Space Grotesk',sans-serif" }}>{Math.round((spotlight.progress / spotlight.duration) * 100)}%</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>complete</div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 6 }}>
          {[
            { id: "active",    label: `Active (${active.length})`       },
            { id: "library",   label: `Library (${library.length})`     },
            { id: "completed", label: `Completed (${completed.length})` },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "9px 0", borderRadius: 8, fontSize: 13, fontWeight: tab === t.id ? 600 : 400, background: tab === t.id ? C.accentGlow : "transparent", border: `1px solid ${tab === t.id ? C.accent+"66" : "transparent"}`, color: tab === t.id ? C.accentSoft : C.textMuted, cursor: "pointer", fontFamily: "inherit", transition: "all .2s" }}>{t.label}</button>
          ))}
        </div>

        {/* Category filter */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: category === cat ? 600 : 400, border: `1px solid ${category === cat ? C.accent : C.border}`, background: category === cat ? C.accentGlow : "transparent", color: category === cat ? C.accentSoft : C.textSecondary, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}>{cat}</button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: C.textMuted }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏆</div>
            <p style={{ fontSize: 14 }}>{tab === "active" ? "No active challenges. Join one from the library!" : tab === "completed" ? "No completed challenges yet. Get going!" : "No challenges in this category."}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: tab === "library" ? "1fr 1fr" : "1fr", gap: 14 }}>
            {filtered.map(ch => <ChallengeCard key={ch.id} ch={ch} onJoin={joinChallenge} onView={setViewing} compact={tab === "library"} />)}
          </div>
        )}

        {/* Badges showcase */}
        {tab === "completed" && completed.length > 0 && (
          <Card style={{ marginTop: 20 }}>
            <SectionLabel>Badges Earned</SectionLabel>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {completed.map((c, i) => (
                <div key={i} style={{ textAlign: "center", background: C.surface, border: `1px solid ${C.gold}33`, borderRadius: 14, padding: "16px 20px", animation: `popIn .4s ease ${i*.1}s both` }}>
                  <div style={{ fontSize: 28, marginBottom: 6, animation: "float 3s ease infinite" }}>{c.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.gold }}>{c.badge}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 3 }}>+{c.xp} XP</div>
                </div>
              ))}
            </div>
          </Card>
        )}

      </div>
      {viewing && <DetailModal ch={viewing} onClose={() => setViewing(null)} onJoin={joinChallenge} />}
    </>
  );
}