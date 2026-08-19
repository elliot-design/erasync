import { useState, useEffect, useRef } from "react";
import { useSettings } from "./SettingsContext";

const C = {
  bg: "#0A0B1A", surface: "#0F1128", card: "#141630", border: "#1E2245",
  accent: "#7C5CFC", accentSoft: "#9B7FFF", accentGlow: "rgba(124,92,252,0.18)",
  teal: "#38BDF8", tealGlow: "rgba(56,189,248,0.12)",
  success: "#34D399", warning: "#FBBF24", danger: "#F87171",
  gold: "#F59E0B",
  textPrimary: "#E8EAFF", textSecondary: "#8892B8", textMuted: "#4A5280",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes popIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes checkPop{0%{transform:scale(1)}50%{transform:scale(1.3)}100%{transform:scale(1)}}
@keyframes slideRight{from{width:0}to{width:100%}}
`;

const MOODS = [
  { emoji: "😫", label: "Drained",  color: C.danger     },
  { emoji: "😐", label: "Neutral",  color: C.textMuted  },
  { emoji: "🙂", label: "Good",     color: C.teal       },
  { emoji: "🔥", label: "Focused",  color: C.warning    },
  { emoji: "🚀", label: "Peak",     color: C.success    },
];

const INITIAL_GOALS = [
  { id: 1, text: "Study pharmacology for 2 hours",  priority: "high",   done: false, streak: 4,  xp: 40 },
  { id: 2, text: "Complete 4 Pomodoro sessions",    priority: "high",   done: false, streak: 2,  xp: 40 },
  { id: 3, text: "Keep social media under 1.5hrs",  priority: "medium", done: false, streak: 6,  xp: 30 },
  { id: 4, text: "30 min exercise",                 priority: "medium", done: true,  streak: 3,  xp: 30 },
  { id: 5, text: "Write journal entry",             priority: "low",    done: true,  streak: 7,  xp: 20 },
  { id: 6, text: "Review yesterday's notes",        priority: "low",    done: false, streak: 0,  xp: 20 },
];

const PRIORITY_COLORS = { high: C.danger, medium: C.warning, low: C.teal };
const PRIORITY_LABELS = { high: "High", medium: "Medium", low: "Low" };

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good night";
}

function getDateStr() {
  return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function pad(n) { return String(n).padStart(2, "0"); }

function Card({ children, style }) {
  return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 22, ...style }}>{children}</div>;
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.textMuted, textTransform: "uppercase", marginBottom: 14 }}>{children}</div>;
}

function Spinner() {
  return <div style={{ width: 14, height: 14, border: `2px solid ${C.border}`, borderTopColor: C.accentSoft, borderRadius: "50%", animation: "spin .7s linear infinite" }} />;
}

// ── Mini Pomodoro Timer ──────────────────────────────────────────────────────
function MiniPomodoro({ settings }) {
  const focusMins = settings?.focusDur || 25;
  const [secs, setSecs] = useState(focusMins * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => {
        setSecs(s => {
          if (s <= 1) {
            clearInterval(ref.current);
            setRunning(false);
            setSessions(p => p + 1);
            setSecs(focusMins * 60);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else clearInterval(ref.current);
    return () => clearInterval(ref.current);
  }, [running]);

  const pct = secs / (focusMins * 60);
  const r = 36, circ = 2 * Math.PI * r;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{ position: "relative", width: 88, height: 88, flexShrink: 0 }}>
        <svg width="88" height="88" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
          <circle cx={44} cy={44} r={r} fill="none" stroke={C.border} strokeWidth={6} />
          <circle cx={44} cy={44} r={r} fill="none" stroke={running ? C.accentSoft : C.accent} strokeWidth={6} strokeLinecap="round"
            strokeDasharray={`${circ * pct} ${circ}`} style={{ transition: "stroke-dasharray .5s ease" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700, color: C.textPrimary, lineHeight: 1 }}>{pad(Math.floor(secs / 60))}:{pad(secs % 60)}</div>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 4 }}>Focus Timer</div>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>{sessions} session{sessions !== 1 ? "s" : ""} done today · Goal: {settings?.pomodoroDaily || 4}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setRunning(r => !r)} style={{ padding: "7px 18px", borderRadius: 8, background: running ? C.surface : `linear-gradient(135deg,${C.accent},${C.teal})`, border: `1px solid ${running ? C.border : "transparent"}`, color: running ? C.textSecondary : "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            {running ? "⏸ Pause" : "▶ Start"}
          </button>
          <button onClick={() => { setRunning(false); setSecs(focusMins * 60); }} style={{ padding: "7px 12px", borderRadius: 8, background: "transparent", border: `1px solid ${C.border}`, color: C.textMuted, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>↺</button>
        </div>
      </div>
      {/* Session dots */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {Array.from({ length: settings?.pomodoroDaily || 4 }).map((_, i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: i < sessions ? C.accentSoft : C.border, transition: "background .3s" }} />
        ))}
      </div>
    </div>
  );
}

// ── AI Tip ───────────────────────────────────────────────────────────────────
function AITip({ settings }) {
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false);

  const system = `You are EraSync, an AI productivity coach. The user is ${settings?.name || "Yusuf"}, a ${settings?.occupation || "Medical Student"}.
Today's context: study goal ${settings?.studyGoal || 4}h, social media limit ${settings?.socialLimit || 2}h, ${settings?.inExamPeriod ? "currently in exam period" : "not in exam period"}.
Give ONE ultra-specific, actionable tip for today in 1-2 sentences. Be direct and personal. No fluff.`;

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system, messages: [{ role: "user", content: "Give me my one AI tip for today." }] }),
    })
      .then(r => r.json())
      .then(d => setTip(d.content?.[0]?.text || ""))
      .catch(() => setTip(`${settings?.inExamPeriod ? "Exam mode: " : ""}Block your best hours (${settings?.studyStart || "8AM"}–${settings?.studyEnd || "11AM"}) for your hardest material first. Don't let your peak window get eaten by easy tasks.`))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: C.accentGlow, border: `1px solid ${C.accent}33`, borderRadius: 12, padding: "14px 18px" }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.accentSoft, textTransform: "uppercase", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.success, display: "inline-block", animation: "pulse 2s infinite" }} />
        AI Tip of the Day
      </div>
      {loading
        ? <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.textMuted }}><Spinner /><span>Generating your tip…</span></div>
        : <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.7 }}>{tip}</p>
      }
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function Today() {
  const { settings } = useSettings();
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [mood, setMood] = useState(null);
  const [newGoal, setNewGoal] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [showAdd, setShowAdd] = useState(false);
  const [challenge1, setChallenge1] = useState(false);
  const [challenge2, setChallenge2] = useState(false);
  const [justChecked, setJustChecked] = useState(null);

  const name = settings?.name || "Yusuf";
  const done = goals.filter(g => g.done).length;
  const total = goals.length;
  const pct = Math.round((done / total) * 100);
  const scoreToday = Math.round(40 + (pct * 0.4) + (mood !== null ? mood * 4 : 0) + (challenge1 && challenge2 ? 10 : challenge1 || challenge2 ? 5 : 0));

  function toggleGoal(id) {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, done: !g.done } : g));
    setJustChecked(id);
    setTimeout(() => setJustChecked(null), 600);
  }

  function addGoal() {
    if (!newGoal.trim()) return;
    setGoals(prev => [...prev, { id: Date.now(), text: newGoal.trim(), priority: newPriority, done: false, streak: 0, xp: newPriority === "high" ? 40 : newPriority === "medium" ? 30 : 20 }]);
    setNewGoal("");
    setShowAdd(false);
  }

  function deleteGoal(id) {
    setGoals(prev => prev.filter(g => g.id !== id));
  }

  const byPriority = ["high", "medium", "low"].map(p => goals.filter(g => g.priority === p)).flat();

  return (
    <>
      <style>{css}</style>
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28, animation: "fadeUp .4s ease" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: C.accentSoft, textTransform: "uppercase", marginBottom: 6 }}>{getDateStr()}</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 30, fontWeight: 700, marginBottom: 6 }}>
            {getGreeting()}, {name} 👋
          </h1>
          <p style={{ fontSize: 14, color: C.textSecondary }}>
            {settings?.inExamPeriod ? "📚 Exam mode is on — let's make today count." : "Here's your day at a glance. Let's make it count."}
          </p>
        </div>

        {/* Score + Progress bar */}
        <div style={{ background: "linear-gradient(135deg,#1a0e3a,#0d1535)", border: `1px solid ${C.accent}44`, borderRadius: 16, padding: 24, marginBottom: 20, animation: "fadeUp .4s ease" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: C.accentSoft, textTransform: "uppercase", marginBottom: 6 }}>Today's Progress</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 32, fontWeight: 700, color: C.textPrimary }}>{done}/{total} <span style={{ fontSize: 16, color: C.textMuted, fontWeight: 400 }}>goals done</span></div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: C.teal, textTransform: "uppercase", marginBottom: 6 }}>Score</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 32, fontWeight: 700, color: scoreToday >= 70 ? C.success : scoreToday >= 50 ? C.warning : C.danger }}>{scoreToday}</div>
            </div>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: C.border, overflow: "hidden" }}>
            <div style={{ height: "100%", width: pct + "%", borderRadius: 4, background: `linear-gradient(90deg,${C.accent},${C.teal})`, transition: "width .6s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.textMuted, marginTop: 8 }}>
            <span>{pct}% complete</span>
            <span>{total - done} remaining</span>
          </div>
        </div>

        {/* AI Tip */}
        <div style={{ marginBottom: 20, animation: "fadeUp .4s ease .05s both" }}>
          <AITip settings={settings} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>

          {/* LEFT — Goals */}
          <div>
            <Card style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <SectionLabel>Today's Goals</SectionLabel>
                <button onClick={() => setShowAdd(s => !s)} style={{ padding: "6px 14px", borderRadius: 8, background: showAdd ? C.surface : `linear-gradient(135deg,${C.accent},${C.teal})`, border: showAdd ? `1px solid ${C.border}` : "none", color: showAdd ? C.textMuted : "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  {showAdd ? "Cancel" : "+ Add Goal"}
                </button>
              </div>

              {/* Add goal form */}
              {showAdd && (
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 16, animation: "popIn .25s ease" }}>
                  <input value={newGoal} onChange={e => setNewGoal(e.target.value)} onKeyDown={e => e.key === "Enter" && addGoal()}
                    placeholder="What do you want to accomplish today?"
                    style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: C.textPrimary, outline: "none", fontFamily: "inherit", marginBottom: 10 }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    {["high", "medium", "low"].map(p => (
                      <button key={p} onClick={() => setNewPriority(p)} style={{ flex: 1, padding: "6px 0", borderRadius: 8, fontSize: 12, fontWeight: newPriority === p ? 600 : 400, border: `1px solid ${newPriority === p ? PRIORITY_COLORS[p] : C.border}`, background: newPriority === p ? PRIORITY_COLORS[p] + "22" : "transparent", color: newPriority === p ? PRIORITY_COLORS[p] : C.textMuted, cursor: "pointer", fontFamily: "inherit" }}>
                        {PRIORITY_LABELS[p]}
                      </button>
                    ))}
                    <button onClick={addGoal} style={{ padding: "6px 16px", borderRadius: 8, background: `linear-gradient(135deg,${C.accent},${C.teal})`, border: "none", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Add</button>
                  </div>
                </div>
              )}

              {/* Goal list */}
              {byPriority.map((g, i) => (
                <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: i < goals.length - 1 ? `1px solid ${C.border}` : "none", animation: "fadeUp .3s ease" }}>
                  {/* Checkbox */}
                  <button onClick={() => toggleGoal(g.id)} style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0, cursor: "pointer",
                    background: g.done ? C.success : "transparent",
                    border: `2px solid ${g.done ? C.success : PRIORITY_COLORS[g.priority]}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, color: "#fff", transition: "all .2s",
                    animation: justChecked === g.id ? "checkPop .3s ease" : "none",
                  }}>{g.done ? "✓" : ""}</button>

                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, color: g.done ? C.textMuted : C.textPrimary, textDecoration: g.done ? "line-through" : "none", fontWeight: g.priority === "high" ? 600 : 400 }}>{g.text}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 4, alignItems: "center" }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: PRIORITY_COLORS[g.priority], background: PRIORITY_COLORS[g.priority] + "22", padding: "2px 6px", borderRadius: 6 }}>{PRIORITY_LABELS[g.priority]}</span>
                      {g.streak > 0 && <span style={{ fontSize: 10, color: C.warning }}>🔥 {g.streak}d streak</span>}
                      <span style={{ fontSize: 10, color: C.gold }}>+{g.xp} XP</span>
                    </div>
                  </div>

                  {/* Delete */}
                  <button onClick={() => deleteGoal(g.id)} style={{ background: "transparent", border: "none", color: C.textMuted, fontSize: 14, cursor: "pointer", padding: 4, opacity: 0.5 }}>✕</button>
                </div>
              ))}
            </Card>

            {/* Challenges quick check-in */}
            <Card>
              <SectionLabel>Challenge Check-ins</SectionLabel>
              {[
                { label: "7-Day Study Marathon", icon: "🧠", day: 5, total: 7, color: C.accentSoft, checked: challenge1, set: setChallenge1 },
                { label: "Social Media Detox",   icon: "📵", day: 2, total: 5, color: C.success,    checked: challenge2, set: setChallenge2 },
              ].map((ch, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i === 0 ? `1px solid ${C.border}` : "none" }}>
                  <span style={{ fontSize: 20 }}>{ch.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, marginBottom: 3 }}>{ch.label}</div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>Day {ch.day} of {ch.total}</div>
                  </div>
                  <button onClick={() => ch.set(v => !v)} style={{
                    padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                    background: ch.checked ? C.success + "22" : "transparent",
                    border: `1px solid ${ch.checked ? C.success : C.border}`,
                    color: ch.checked ? C.success : C.textMuted, transition: "all .2s",
                  }}>{ch.checked ? "✓ Done" : "Check in"}</button>
                </div>
              ))}
            </Card>
          </div>

          {/* RIGHT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Pomodoro */}
            <Card>
              <SectionLabel>Focus Timer</SectionLabel>
              <MiniPomodoro settings={settings} />
            </Card>

            {/* Mood */}
            <Card>
              <SectionLabel>Today's Mood</SectionLabel>
              <div style={{ display: "flex", gap: 6, justifyContent: "space-between" }}>
                {MOODS.map((m, i) => (
                  <button key={i} onClick={() => setMood(i)} style={{
                    flex: 1, padding: "10px 4px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", textAlign: "center",
                    border: `1px solid ${mood === i ? m.color : C.border}`,
                    background: mood === i ? m.color + "22" : "transparent",
                    transition: "all .2s",
                  }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{m.emoji}</div>
                    <div style={{ fontSize: 9, color: mood === i ? m.color : C.textMuted, fontWeight: mood === i ? 600 : 400 }}>{m.label}</div>
                  </button>
                ))}
              </div>
              {mood !== null && (
                <div style={{ marginTop: 12, fontSize: 12, color: C.textSecondary, textAlign: "center", animation: "fadeUp .3s ease" }}>
                  {["Today might be tough — take it one task at a time.", "A neutral day can still be a productive one.", "Good energy — channel it into your hardest task first.", "Focused mode activated 🔥 — protect this state.", "Peak performance unlocked 🚀 — this is your moment."][mood]}
                </div>
              )}
            </Card>

            {/* Quick stats */}
            <Card>
              <SectionLabel>Today at a Glance</SectionLabel>
              {[
                { label: "Study goal",     value: `${settings?.studyGoal || 4}h target`,    icon: "📚", color: C.accentSoft },
                { label: "Social limit",   value: `${settings?.socialLimit || 2}h max`,      icon: "📱", color: C.warning    },
                { label: "Sleep target",   value: `${settings?.sleepTime || "11 PM"}`,        icon: "🌙", color: C.teal       },
                { label: "Wake time",      value: `${settings?.wakeTime || "6:30 AM"}`,       icon: "☀️", color: C.gold       },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
                  <span style={{ fontSize: 16 }}>{s.icon}</span>
                  <span style={{ flex: 1, fontSize: 13, color: C.textSecondary }}>{s.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: s.color }}>{s.value}</span>
                </div>
              ))}
            </Card>

            {/* XP earned today */}
            <div style={{ background: `linear-gradient(135deg,#1a0e3a,#0d1535)`, border: `1px solid ${C.gold}33`, borderRadius: 14, padding: "16px 20px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.gold, textTransform: "uppercase", marginBottom: 8 }}>XP Earned Today</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, color: C.gold }}>{goals.filter(g => g.done).reduce((s, g) => s + g.xp, 0)} XP</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{goals.filter(g => !g.done).reduce((s, g) => s + g.xp, 0)} XP still available today</div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}