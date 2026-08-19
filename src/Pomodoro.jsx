import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#0A0B1A", surface: "#0F1128", card: "#141630", border: "#1E2245",
  accent: "#7C5CFC", accentSoft: "#9B7FFF", accentGlow: "rgba(124,92,252,0.18)",
  teal: "#38BDF8", tealGlow: "rgba(56,189,248,0.12)",
  success: "#34D399", warning: "#FBBF24", danger: "#F87171",
  textPrimary: "#E8EAFF", textSecondary: "#8892B8", textMuted: "#4A5280",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes ringPop{0%{transform:scale(1)}50%{transform:scale(1.04)}100%{transform:scale(1)}}
`;

const MODES = [
  { id: "focus",      label: "Focus",       defaultMins: 25, color: C.accentSoft, emoji: "🧠" },
  { id: "shortBreak", label: "Short Break", defaultMins: 5,  color: C.success,    emoji: "☕" },
  { id: "longBreak",  label: "Long Break",  defaultMins: 15, color: C.teal,       emoji: "🌿" },
];

const PRESETS = [
  { label: "Classic",   focus: 25, short: 5,  long: 15 },
  { label: "Deep Work", focus: 50, short: 10, long: 20 },
  { label: "Sprint",    focus: 15, short: 3,  long: 10 },
  { label: "Custom",    focus: null, short: null, long: null },
];

function pad(n) { return String(n).padStart(2, "0"); }

function CircleTimer({ pct, color, children }) {
  const r = 110, cx = 130, cy = 130;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;

  return (
    <div style={{ position: "relative", width: 260, height: 260, margin: "0 auto" }}>
      <svg width="260" height="260" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth="8" />
        {/* Progress */}
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: "stroke-dasharray .5s ease, stroke .4s ease" }}
        />
      </svg>
      {/* Glow */}
      <div style={{
        position: "absolute", inset: 20, borderRadius: "50%",
        background: `radial-gradient(circle, ${color}11 0%, transparent 70%)`,
        transition: "background .4s ease",
      }} />
      {/* Content */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, animation: "fadeUp .4s ease", ...style }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.textMuted, textTransform: "uppercase", marginBottom: 14 }}>{children}</div>;
}

export default function Pomodoro() {
  const [modeIdx, setModeIdx] = useState(0);
  const [durations, setDurations] = useState({ focus: 25, shortBreak: 5, longBreak: 15 });
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [preset, setPreset] = useState("Classic");
  const [customInput, setCustomInput] = useState({ focus: 25, short: 5, long: 15 });
  const [showSettings, setShowSettings] = useState(false);

  // Stats
  const [completedToday, setCompletedToday] = useState(3);
  const [totalMinsToday, setTotalMinsToday] = useState(75);
  const [streak, setStreak] = useState(5);
  const [sessionLog, setSessionLog] = useState([
    { type: "Focus", mins: 25, time: "9:00 AM" },
    { type: "Short Break", mins: 5, time: "9:25 AM" },
    { type: "Focus", mins: 25, time: "9:30 AM" },
  ]);

  const intervalRef = useRef(null);
  const mode = MODES[modeIdx];
  const totalSecs = durations[mode.id] * 60;
  const pct = secondsLeft / totalSecs;
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  // Update timer when mode or durations change
  useEffect(() => {
    if (!running) setSecondsLeft(durations[mode.id] * 60);
  }, [modeIdx, durations]);

  // Countdown
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            handleSessionComplete();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function handleSessionComplete() {
    setRunning(false);
    if (mode.id === "focus") {
      setCompletedToday(p => p + 1);
      setTotalMinsToday(p => p + durations.focus);
      setStreak(p => p + 1);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setSessionLog(prev => [{ type: "Focus", mins: durations.focus, time: timeStr }, ...prev]);
      // Auto advance to break
      const nextIdx = completedToday > 0 && (completedToday + 1) % 4 === 0 ? 2 : 1;
      setModeIdx(nextIdx);
    } else {
      setModeIdx(0);
    }
  }

  function switchMode(idx) {
    setRunning(false);
    setModeIdx(idx);
    setSecondsLeft(durations[MODES[idx].id] * 60);
  }

  function reset() {
    setRunning(false);
    setSecondsLeft(durations[mode.id] * 60);
  }

  function applyPreset(p) {
    setPreset(p.label);
    if (p.focus) {
      const newD = { focus: p.focus, shortBreak: p.short, longBreak: p.long };
      setDurations(newD);
      setSecondsLeft(newD[mode.id] * 60);
      setRunning(false);
    }
  }

  function applyCustom() {
    const newD = {
      focus: Math.max(1, Math.min(90, parseInt(customInput.focus) || 25)),
      shortBreak: Math.max(1, Math.min(30, parseInt(customInput.short) || 5)),
      longBreak: Math.max(1, Math.min(60, parseInt(customInput.long) || 15)),
    };
    setDurations(newD);
    setSecondsLeft(newD[mode.id] * 60);
    setRunning(false);
    setPreset("Custom");
    setShowSettings(false);
  }

  return (
    <>
      <style>{css}</style>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28, animation: "fadeUp .4s ease" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: C.accentSoft, textTransform: "uppercase", marginBottom: 6 }}>Stay in the zone</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Pomodoro Timer ⏱️</h1>
          <p style={{ fontSize: 14, color: C.textSecondary }}>Deep work in focused sprints. Rest. Repeat.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>

          {/* Left — Timer */}
          <div>
            {/* Mode tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: 20, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 6 }}>
              {MODES.map((m, i) => (
                <button key={m.id} onClick={() => switchMode(i)} style={{
                  flex: 1, padding: "9px 0", borderRadius: 8, fontSize: 13, fontWeight: modeIdx === i ? 600 : 400,
                  background: modeIdx === i ? m.color + "22" : "transparent",
                  border: `1px solid ${modeIdx === i ? m.color + "66" : "transparent"}`,
                  color: modeIdx === i ? m.color : C.textMuted,
                  cursor: "pointer", fontFamily: "inherit", transition: "all .2s",
                }}>{m.emoji} {m.label}</button>
              ))}
            </div>

            {/* Circle */}
            <Card style={{ textAlign: "center", marginBottom: 16 }}>
              <CircleTimer pct={pct} color={mode.color}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: mode.color, textTransform: "uppercase", marginBottom: 4 }}>{mode.label}</div>
                <div style={{
                  fontFamily: "'Space Grotesk',sans-serif", fontSize: 52, fontWeight: 700,
                  color: C.textPrimary, lineHeight: 1, letterSpacing: -2,
                  animation: running ? "none" : "none",
                }}>{pad(mins)}:{pad(secs)}</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 6 }}>
                  {running ? <span style={{ color: mode.color, animation: "pulse 2s infinite" }}>● Running</span> : "Paused"}
                </div>
              </CircleTimer>

              {/* Controls */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 24 }}>
                <button onClick={reset} style={{
                  width: 44, height: 44, borderRadius: "50%", background: "transparent",
                  border: `1px solid ${C.border}`, color: C.textMuted, fontSize: 16,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}>↺</button>

                <button onClick={() => setRunning(r => !r)} style={{
                  width: 70, height: 70, borderRadius: "50%", fontSize: 22,
                  background: `linear-gradient(135deg, ${mode.color}, ${mode.color}99)`,
                  border: "none", color: "#fff", cursor: "pointer",
                  boxShadow: `0 0 24px ${mode.color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all .2s",
                }}>{running ? "⏸" : "▶"}</button>

                <button onClick={() => { switchMode((modeIdx + 1) % MODES.length); }} style={{
                  width: 44, height: 44, borderRadius: "50%", background: "transparent",
                  border: `1px solid ${C.border}`, color: C.textMuted, fontSize: 16,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}>⏭</button>
              </div>
            </Card>

            {/* Presets */}
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <SectionLabel>Presets</SectionLabel>
                <button onClick={() => setShowSettings(s => !s)} style={{ fontSize: 12, color: C.accentSoft, background: "transparent", border: `1px solid ${C.accent}44`, borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" }}>
                  {showSettings ? "Done" : "Custom ✏️"}
                </button>
              </div>

              {!showSettings ? (
                <div style={{ display: "flex", gap: 8 }}>
                  {PRESETS.filter(p => p.focus).map(p => (
                    <button key={p.label} onClick={() => applyPreset(p)} style={{
                      flex: 1, padding: "10px 6px", borderRadius: 10, cursor: "pointer",
                      border: `1px solid ${preset === p.label ? C.accent : C.border}`,
                      background: preset === p.label ? C.accentGlow : C.surface,
                      fontFamily: "inherit", transition: "all .2s",
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: preset === p.label ? C.accentSoft : C.textPrimary, marginBottom: 4 }}>{p.label}</div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>{p.focus}/{p.short}/{p.long}m</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  {[
                    { label: "Focus (mins)", key: "focus", max: 90 },
                    { label: "Short Break (mins)", key: "short", max: 30 },
                    { label: "Long Break (mins)", key: "long", max: 60 },
                  ].map(f => (
                    <div key={f.key} style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>{f.label}</div>
                      <input
                        type="number" min="1" max={f.max}
                        value={customInput[f.key]}
                        onChange={e => setCustomInput(p => ({ ...p, [f.key]: e.target.value }))}
                        style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, color: C.textPrimary, outline: "none", fontFamily: "inherit" }}
                      />
                    </div>
                  ))}
                  <button onClick={applyCustom} style={{ width: "100%", padding: "10px", borderRadius: 10, background: `linear-gradient(135deg,${C.accent},${C.teal})`, border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginTop: 4 }}>
                    Apply Custom
                  </button>
                </div>
              )}
            </Card>
          </div>

          {/* Right — Stats + Log */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Today stats */}
            <Card>
              <SectionLabel>Today's Stats</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                {[
                  { label: "Sessions",    value: completedToday, color: C.accentSoft, icon: "🍅" },
                  { label: "Focus Time",  value: totalMinsToday + "m", color: C.teal, icon: "⏱️" },
                  { label: "Streak",      value: streak + " days", color: C.success, icon: "🔥" },
                  { label: "Goal",        value: "4/4", color: C.warning, icon: "🎯" },
                ].map((s, i) => (
                  <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Daily goal progress */}
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Daily goal: {completedToday}/4 sessions</div>
              <div style={{ height: 6, borderRadius: 3, background: C.border, overflow: "hidden" }}>
                <div style={{ height: "100%", width: Math.min(100, (completedToday / 4) * 100) + "%", borderRadius: 3, background: `linear-gradient(90deg,${C.accentSoft},${C.teal})`, transition: "width .6s ease" }} />
              </div>
            </Card>

            {/* Pomodoro dots */}
            <Card>
              <SectionLabel>Session Cycle</SectionLabel>
              <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>Every 4 sessions = 1 long break</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {Array.from({ length: 8 }).map((_, i) => {
                  const done = i < completedToday;
                  const isLong = (i + 1) % 4 === 0;
                  return (
                    <div key={i} style={{
                      width: 32, height: 32, borderRadius: isLong ? 8 : "50%",
                      background: done ? `linear-gradient(135deg,${C.accentSoft},${C.accent})` : C.border,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, transition: "background .3s",
                      boxShadow: done ? `0 0 8px ${C.accentSoft}44` : "none",
                    }}>{done ? "🍅" : ""}</div>
                  );
                })}
              </div>
            </Card>

            {/* Session log */}
            <Card style={{ flex: 1 }}>
              <SectionLabel>Session Log</SectionLabel>
              {sessionLog.length === 0
                ? <p style={{ fontSize: 13, color: C.textMuted }}>No sessions yet today.</p>
                : sessionLog.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 16 }}>{s.type === "Focus" ? "🍅" : "☕"}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{s.type}</div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>{s.mins} mins · {s.time}</div>
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.type === "Focus" ? C.accentSoft : C.success }} />
                  </div>
                ))
              }
            </Card>

          </div>
        </div>

        {/* Tip */}
        <div style={{ marginTop: 20, background: C.accentGlow, border: `1px solid ${C.accent}33`, borderRadius: 14, padding: "16px 20px" }}>
          <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.7 }}>
            💡 <strong style={{ color: C.accentSoft }}>Tip:</strong> The Pomodoro technique works best when you fully commit to the focus period — no phone, no tabs. 25 minutes of real focus beats 2 hours of distracted studying.
          </p>
        </div>

      </div>
    </>
  );
}