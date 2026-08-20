import { useState, useRef, useEffect } from "react";
import { useSettings } from "./SettingsContext";
import { useIsMobile } from "./useIsMobile";

const C = {
  bg: "#0A0B1A", surface: "#0F1128", card: "#141630", border: "#1E2245",
  accent: "#7C5CFC", accentSoft: "#9B7FFF", accentGlow: "rgba(124,92,252,0.18)",
  teal: "#38BDF8", success: "#34D399", warning: "#FBBF24", danger: "#F87171",
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
input, textarea, select { font-size: 16px !important; }
`;

const MOODS = [
  { emoji: "😫", label: "Drained", color: C.danger },
  { emoji: "😐", label: "Neutral", color: C.textMuted },
  { emoji: "🙂", label: "Good",    color: C.teal },
  { emoji: "🔥", label: "Focused", color: C.warning },
  { emoji: "🚀", label: "Peak",    color: C.success },
];

const INITIAL_GOALS = [
  { id: 1, text: "Study pharmacology for 2 hours",  priority: "high",   done: false, streak: 4, xp: 40 },
  { id: 2, text: "Complete 4 Pomodoro sessions",    priority: "high",   done: false, streak: 2, xp: 40 },
  { id: 3, text: "Keep social media under 1.5hrs",  priority: "medium", done: false, streak: 6, xp: 30 },
  { id: 4, text: "30 min exercise",                 priority: "medium", done: true,  streak: 3, xp: 30 },
  { id: 5, text: "Write journal entry",             priority: "low",    done: true,  streak: 7, xp: 20 },
  { id: 6, text: "Review yesterday's notes",        priority: "low",    done: false, streak: 0, xp: 20 },
];

const PRIORITY_COLORS = { high: C.danger, medium: C.warning, low: C.teal };
const PRIORITY_LABELS = { high: "High", medium: "Med", low: "Low" };

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good night";
}

function getDateStr() {
  return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function pad(n) { return String(n).padStart(2, "0"); }

function Card({ children, style }) {
  return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, ...style }}>{children}</div>;
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.textMuted, textTransform: "uppercase", marginBottom: 12 }}>{children}</div>;
}

function Spinner() {
  return <div style={{ width: 14, height: 14, border: `2px solid ${C.border}`, borderTopColor: C.accentSoft, borderRadius: "50%", animation: "spin .7s linear infinite" }} />;
}

function MiniPomodoro({ settings, isMobile }) {
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
  const r = isMobile ? 30 : 36;
  const size = isMobile ? 72 : 88;
  const circ = 2 * Math.PI * r;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 14 : 20 }}>
      <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={5} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={running ? C.accentSoft : C.accent} strokeWidth={5} strokeLinecap="round"
            strokeDasharray={`${circ * pct} ${circ}`} style={{ transition: "stroke-dasharray .5s ease" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: isMobile ? 12 : 15, fontWeight: 700, color: C.textPrimary }}>
            {pad(Math.floor(secs / 60))}:{pad(secs % 60)}
          </div>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 600, color: C.textPrimary, marginBottom: 3 }}>Focus Timer</div>
        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 10 }}>{sessions}/{settings?.pomodoroDaily || 4} sessions</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setRunning(r => !r)} style={{ padding: isMobile ? "8px 14px" : "7px 18px", borderRadius: 8, background: running ? C.surface : `linear-gradient(135deg,${C.accent},${C.teal})`, border: `1px solid ${running ? C.border : "transparent"}`, color: running ? C.textSecondary : "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            {running ? "⏸ Pause" : "▶ Start"}
          </button>
          <button onClick={() => { setRunning(false); setSecs(focusMins * 60); }} style={{ padding: "7px 12px", borderRadius: 8, background: "transparent", border: `1px solid ${C.border}`, color: C.textMuted, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>↺</button>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {Array.from({ length: settings?.pomodoroDaily || 4 }).map((_, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i < sessions ? C.accentSoft : C.border }} />
        ))}
      </div>
    </div>
  );
}

function AITip({ settings }) {
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false);

  const system = `You are EraSync AI Coach. User: ${settings?.name || "Yusuf"}, ${settings?.occupation || "Medical Student"}. Study goal: ${settings?.studyGoal || 4}h. Social limit: ${settings?.socialLimit || 2}h. ${settings?.inExamPeriod ? "In exam period." : ""} Give ONE specific actionable tip for today in 1-2 sentences. Be direct.`;

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system, messages: [{ role: "user", content: "My tip for today." }] }),
    })
      .then(r => r.json())
      .then(d => setTip(d.content?.[0]?.text || ""))
      .catch(() => setTip(`Block ${settings?.studyStart || "8AM"}–${settings?.studyEnd || "11AM"} for your hardest material. Don't let your peak window get eaten by easy tasks.`))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: C.accentGlow, border: `1px solid ${C.accent}33`, borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.accentSoft, textTransform: "uppercase", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.success, display: "inline-block", animation: "pulse 2s infinite" }} />
        AI Tip of the Day
      </div>
      {loading
        ? <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.textMuted }}><Spinner /><span>Generating…</span></div>
        : <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.7 }}>{tip}</p>
      }
    </div>
  );
}

export default function Today() {
  const { settings } = useSettings();
  const isMobile = useIsMobile();
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
  const xpEarned = goals.filter(g => g.done).reduce((s, g) => s + g.xp, 0);
  const xpLeft = goals.filter(g => !g.done).reduce((s, g) => s + g.xp, 0);

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

  function deleteGoal(id) { setGoals(prev => prev.filter(g => g.id !== id)); }

  const byPriority = ["high", "medium", "low"].flatMap(p => goals.filter(g => g.priority === p));
  const pad2 = isMobile ? "16px 14px 100px" : "32px 24px 80px";
  const maxW = isMobile ? "100%" : 920;

  return (
    <>
      <style>{css}</style>
      <div style={{ maxWidth: maxW, margin: "0 auto", padding: pad2 }}>

        {/* Header */}
        <div style={{ marginBottom: isMobile ? 16 : 24, animation: "fadeUp .4s ease" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: C.accentSoft, textTransform: "uppercase", marginBottom: 4 }}>{getDateStr()}</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: isMobile ? 22 : 28, fontWeight: 700, marginBottom: 4 }}>
            {getGreeting()}, {name} 👋
          </h1>
          <p style={{ fontSize: 13, color: C.textSecondary }}>
            {settings?.inExamPeriod ? "📚 Exam mode — let's make today count." : "Here's your day at a glance."}
          </p>
        </div>

        {/* Score banner */}
        <div style={{ background: "linear-gradient(135deg,#1a0e3a,#0d1535)", border: `1px solid ${C.accent}44`, borderRadius: 16, padding: isMobile ? 16 : 22, marginBottom: 14, animation: "fadeUp .4s ease" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.accentSoft, textTransform: "uppercase", marginBottom: 4 }}>Today's Progress</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: isMobile ? 22 : 28, fontWeight: 700, color: C.textPrimary }}>
                {done}/{total} <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 400 }}>goals</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.teal, textTransform: "uppercase", marginBottom: 4 }}>Score</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: isMobile ? 22 : 28, fontWeight: 700, color: scoreToday >= 70 ? C.success : scoreToday >= 50 ? C.warning : C.danger }}>{scoreToday}</div>
            </div>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: C.border, overflow: "hidden" }}>
            <div style={{ height: "100%", width: pct + "%", borderRadius: 4, background: `linear-gradient(90deg,${C.accent},${C.teal})`, transition: "width .6s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.textMuted, marginTop: 6 }}>
            <span>{pct}% complete</span>
            <span>{total - done} remaining</span>
          </div>
        </div>

        {/* AI Tip */}
        <div style={{ marginBottom: 14, animation: "fadeUp .4s ease .05s both" }}>
          <AITip settings={settings} />
        </div>

        {/* XP bar — mobile shows this prominently */}
        {isMobile && (
          <div style={{ background: `linear-gradient(135deg,#1a0e3a,#0d1535)`, border: `1px solid ${C.gold}33`, borderRadius: 14, padding: "14px 16px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, color: C.gold, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 2 }}>XP Today</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, color: C.gold }}>{xpEarned} XP</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 2 }}>Still available</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.textSecondary }}>{xpLeft} XP</div>
            </div>
          </div>
        )}

        {/* Main layout — stacked on mobile, side by side on desktop */}
        <div style={{ display: isMobile ? "flex" : "grid", flexDirection: isMobile ? "column" : undefined, gridTemplateColumns: isMobile ? undefined : "1.4fr 1fr", gap: 14 }}>

          {/* LEFT — Goals */}
          <div>
            <Card style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <SectionLabel>Today's Goals</SectionLabel>
                <button onClick={() => setShowAdd(s => !s)} style={{ padding: "7px 14px", borderRadius: 8, background: showAdd ? C.surface : `linear-gradient(135deg,${C.accent},${C.teal})`, border: showAdd ? `1px solid ${C.border}` : "none", color: showAdd ? C.textMuted : "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  {showAdd ? "Cancel" : "+ Add"}
                </button>
              </div>

              {showAdd && (
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, marginBottom: 14, animation: "popIn .25s ease" }}>
                  <input value={newGoal} onChange={e => setNewGoal(e.target.value)} onKeyDown={e => e.key === "Enter" && addGoal()}
                    placeholder="What do you want to accomplish today?"
                    style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", color: C.textPrimary, outline: "none", fontFamily: "inherit", marginBottom: 10 }} />
                  <div style={{ display: "flex", gap: 6 }}>
                    {["high", "medium", "low"].map(p => (
                      <button key={p} onClick={() => setNewPriority(p)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: newPriority === p ? 600 : 400, border: `1px solid ${newPriority === p ? PRIORITY_COLORS[p] : C.border}`, background: newPriority === p ? PRIORITY_COLORS[p] + "22" : "transparent", color: newPriority === p ? PRIORITY_COLORS[p] : C.textMuted, cursor: "pointer", fontFamily: "inherit" }}>
                        {PRIORITY_LABELS[p]}
                      </button>
                    ))}
                    <button onClick={addGoal} style={{ padding: "8px 14px", borderRadius: 8, background: `linear-gradient(135deg,${C.accent},${C.teal})`, border: "none", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Add</button>
                  </div>
                </div>
              )}

              {byPriority.map((g, i) => (
                <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < goals.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <button onClick={() => toggleGoal(g.id)} style={{
                    width: 24, height: 24, borderRadius: 7, flexShrink: 0, cursor: "pointer",
                    background: g.done ? C.success : "transparent",
                    border: `2px solid ${g.done ? C.success : PRIORITY_COLORS[g.priority]}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, color: "#fff", transition: "all .2s",
                    animation: justChecked === g.id ? "checkPop .3s ease" : "none",
                  }}>{g.done ? "✓" : ""}</button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: isMobile ? 13 : 14, color: g.done ? C.textMuted : C.textPrimary, textDecoration: g.done ? "line-through" : "none", fontWeight: g.priority === "high" ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: isMobile ? "normal" : "nowrap" }}>{g.text}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 3, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: PRIORITY_COLORS[g.priority], background: PRIORITY_COLORS[g.priority] + "22", padding: "1px 6px", borderRadius: 6 }}>{PRIORITY_LABELS[g.priority]}</span>
                      {g.streak > 0 && <span style={{ fontSize: 10, color: C.warning }}>🔥 {g.streak}d</span>}
                      <span style={{ fontSize: 10, color: C.gold }}>+{g.xp}XP</span>
                    </div>
                  </div>
                  <button onClick={() => deleteGoal(g.id)} style={{ background: "transparent", border: "none", color: C.textMuted, fontSize: 14, cursor: "pointer", padding: "4px 6px", flexShrink: 0 }}>✕</button>
                </div>
              ))}
            </Card>

            {/* Challenge check-ins */}
            <Card style={{ marginBottom: isMobile ? 14 : 0 }}>
              <SectionLabel>Challenge Check-ins</SectionLabel>
              {[
                { label: "Study Marathon", icon: "🧠", day: 5, total: 7, color: C.accentSoft, checked: challenge1, set: setChallenge1 },
                { label: "Social Detox",   icon: "📵", day: 2, total: 5, color: C.success,    checked: challenge2, set: setChallenge2 },
              ].map((ch, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: i === 0 ? `1px solid ${C.border}` : "none" }}>
                  <span style={{ fontSize: 20 }}>{ch.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{ch.label}</div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>Day {ch.day}/{ch.total}</div>
                  </div>
                  <button onClick={() => ch.set(v => !v)} style={{ padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", background: ch.checked ? C.success + "22" : "transparent", border: `1px solid ${ch.checked ? C.success : C.border}`, color: ch.checked ? C.success : C.textMuted, transition: "all .2s" }}>
                    {ch.checked ? "✓ Done" : "Check in"}
                  </button>
                </div>
              ))}
            </Card>
          </div>

          {/* RIGHT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Pomodoro */}
            <Card>
              <SectionLabel>Focus Timer</SectionLabel>
              <MiniPomodoro settings={settings} isMobile={isMobile} />
            </Card>

            {/* Mood */}
            <Card>
              <SectionLabel>Today's Mood</SectionLabel>
              <div style={{ display: "flex", gap: isMobile ? 4 : 6 }}>
                {MOODS.map((m, i) => (
                  <button key={i} onClick={() => setMood(i)} style={{ flex: 1, padding: isMobile ? "10px 2px" : "10px 4px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", textAlign: "center", border: `1px solid ${mood === i ? m.color : C.border}`, background: mood === i ? m.color + "22" : "transparent", transition: "all .2s" }}>
                    <div style={{ fontSize: isMobile ? 22 : 20, marginBottom: 3 }}>{m.emoji}</div>
                    <div style={{ fontSize: 9, color: mood === i ? m.color : C.textMuted, fontWeight: mood === i ? 600 : 400 }}>{m.label}</div>
                  </button>
                ))}
              </div>
              {mood !== null && (
                <div style={{ marginTop: 10, fontSize: 12, color: C.textSecondary, textAlign: "center", animation: "fadeUp .3s ease" }}>
                  {["Tough day — one task at a time.", "Neutral days can still be wins.", "Good energy — tackle your hardest task first.", "Focused mode 🔥 — protect this state.", "Peak performance 🚀 — make it count!"][mood]}
                </div>
              )}
            </Card>

            {/* Quick stats */}
            <Card>
              <SectionLabel>Today's Targets</SectionLabel>
              {[
                { label: "Study goal",   value: `${settings?.studyGoal || 4}h`,    icon: "📚", color: C.accentSoft },
                { label: "Social limit", value: `${settings?.socialLimit || 2}h max`, icon: "📱", color: C.warning    },
                { label: "Sleep by",     value: settings?.sleepTime || "11:00 PM",   icon: "🌙", color: C.teal       },
                { label: "Wake time",    value: settings?.wakeTime || "06:30",       icon: "☀️", color: C.gold       },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
                  <span style={{ fontSize: 16 }}>{s.icon}</span>
                  <span style={{ flex: 1, fontSize: 13, color: C.textSecondary }}>{s.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: s.color }}>{s.value}</span>
                </div>
              ))}
            </Card>

            {/* XP desktop only */}
            {!isMobile && (
              <div style={{ background: `linear-gradient(135deg,#1a0e3a,#0d1535)`, border: `1px solid ${C.gold}33`, borderRadius: 14, padding: "16px 20px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.gold, textTransform: "uppercase", marginBottom: 6 }}>XP Earned Today</div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 26, fontWeight: 700, color: C.gold }}>{xpEarned} XP</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>{xpLeft} XP still available</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}