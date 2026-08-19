import { useState } from "react";

const C = {
  bg: "#0A0B1A", surface: "#0F1128", card: "#141630", border: "#1E2245",
  accent: "#7C5CFC", accentSoft: "#9B7FFF", accentGlow: "rgba(124,92,252,0.18)",
  teal: "#38BDF8", tealGlow: "rgba(56,189,248,0.12)",
  success: "#34D399", warning: "#FBBF24", danger: "#F87171",
  textPrimary: "#E8EAFF", textSecondary: "#8892B8", textMuted: "#4A5280",
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DEFAULT_HABITS = [
  { id: 1, name: "Study 4 hours",       icon: "📚", color: C.accentSoft, completions: [1,1,1,1,0,1,1], streak: 6 },
  { id: 2, name: "Exercise",            icon: "🏃", color: C.success,    completions: [1,0,1,1,1,0,1], streak: 2 },
  { id: 3, name: "Read 30 mins",        icon: "📖", color: C.teal,       completions: [1,1,0,1,1,1,0], streak: 3 },
  { id: 4, name: "No social after 10pm",icon: "🌙", color: C.warning,    completions: [1,1,1,0,1,1,1], streak: 3 },
  { id: 5, name: "Journal entry",       icon: "✍️", color: C.danger,     completions: [0,1,1,1,0,1,1], streak: 3 },
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:${C.bg};color:${C.textPrimary};font-family:'Inter',sans-serif;min-height:100vh}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes popIn{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
`;

function Card({ children, style }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, animation: "fadeUp .4s ease", ...style }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.textMuted, textTransform: "uppercase", marginBottom: 16 }}>{children}</div>;
}

function HabitRow({ habit, onToggle, onDelete }) {
  const total = habit.completions.length;
  const done = habit.completions.filter(Boolean).length;
  const pct = Math.round((done / total) * 100);

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 20px", marginBottom: 12, animation: "fadeUp .4s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        {/* Icon + Name */}
        <span style={{ fontSize: 22 }}>{habit.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary }}>{habit.name}</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
            🔥 {habit.streak}-day streak &nbsp;·&nbsp; {pct}% this week
          </div>
        </div>
        {/* Delete */}
        <button onClick={() => onDelete(habit.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.textMuted, fontSize: 16, padding: 4 }}>✕</button>
      </div>

      {/* Weekly grid */}
      <div style={{ display: "flex", gap: 8 }}>
        {DAYS.map((day, i) => {
          const checked = habit.completions[i];
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ fontSize: 10, color: C.textMuted }}>{day}</div>
              <button
                onClick={() => onToggle(habit.id, i)}
                style={{
                  width: "100%", aspectRatio: "1", borderRadius: 8, border: `2px solid ${checked ? habit.color : C.border}`,
                  background: checked ? habit.color + "33" : "transparent",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, transition: "all .2s", animation: checked ? "popIn .2s ease" : "none",
                }}
              >
                {checked ? <span style={{ color: habit.color }}>✓</span> : ""}
              </button>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, borderRadius: 2, background: C.border, marginTop: 14, overflow: "hidden" }}>
        <div style={{ height: "100%", width: pct + "%", borderRadius: 2, background: `linear-gradient(90deg, ${habit.color}, ${habit.color}99)`, transition: "width .6s ease" }} />
      </div>
    </div>
  );
}

function AddHabitModal({ onAdd, onClose }) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("⭐");
  const [color, setColor] = useState(C.accentSoft);

  const ICONS = ["📚","🏃","📖","🌙","✍️","💧","🧘","🎯","💪","🍎","🎨","🎵","🖥️","🧠","⭐"];
  const COLORS = [C.accentSoft, C.teal, C.success, C.warning, C.danger, "#F472B6", "#FB923C"];

  function submit() {
    if (!name.trim()) return;
    onAdd({ id: Date.now(), name: name.trim(), icon, color, completions: [0,0,0,0,0,0,0], streak: 0 });
    onClose();
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, width: 380, animation: "popIn .25s ease" }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>New Habit</div>

        {/* Name */}
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.textMuted, textTransform: "uppercase", marginBottom: 8 }}>Habit Name</div>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="e.g. Drink 2L of water"
          style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 14, color: C.textPrimary, outline: "none", fontFamily: "inherit", marginBottom: 20 }}
        />

        {/* Icon picker */}
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.textMuted, textTransform: "uppercase", marginBottom: 8 }}>Icon</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {ICONS.map(ic => (
            <button key={ic} onClick={() => setIcon(ic)} style={{
              width: 40, height: 40, borderRadius: 10, fontSize: 18, cursor: "pointer",
              border: `2px solid ${icon === ic ? C.accent : C.border}`,
              background: icon === ic ? C.accentGlow : "transparent",
            }}>{ic}</button>
          ))}
        </div>

        {/* Color picker */}
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.textMuted, textTransform: "uppercase", marginBottom: 8 }}>Color</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {COLORS.map(col => (
            <button key={col} onClick={() => setColor(col)} style={{
              width: 28, height: 28, borderRadius: "50%", background: col, border: `3px solid ${color === col ? "#fff" : "transparent"}`,
              cursor: "pointer", transition: "border .15s",
            }} />
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 10, background: "transparent", border: `1px solid ${C.border}`, color: C.textSecondary, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          <button onClick={submit} style={{ flex: 1, padding: "11px", borderRadius: 10, background: `linear-gradient(135deg,${C.accent},${C.teal})`, border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Add Habit</button>
        </div>
      </div>
    </div>
  );
}

export default function HabitTracker() {
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [showModal, setShowModal] = useState(false);

  function toggleDay(habitId, dayIndex) {
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;
      const newComp = [...h.completions];
      newComp[dayIndex] = newComp[dayIndex] ? 0 : 1;
      // recalculate streak (consecutive from end)
      let streak = 0;
      for (let i = newComp.length - 1; i >= 0; i--) {
        if (newComp[i]) streak++; else break;
      }
      return { ...h, completions: newComp, streak };
    }));
  }

  function addHabit(habit) {
    setHabits(prev => [...prev, habit]);
  }

  function deleteHabit(id) {
    setHabits(prev => prev.filter(h => h.id !== id));
  }

  // Summary stats
  const totalHabits = habits.length;
  const todayIndex = 6; // "Today" = Sunday (last column)
  const completedToday = habits.filter(h => h.completions[todayIndex]).length;
  const overallPct = totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100);
  const bestStreak = habits.length ? Math.max(...habits.map(h => h.streak)) : 0;

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", background: C.bg, paddingBottom: 48 }}>

        {/* Nav */}
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", borderBottom: `1px solid ${C.border}`, background: C.surface + "CC", backdropFilter: "blur(16px)", position: "sticky", top: 0, zIndex: 100 }}>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, background: `linear-gradient(135deg,${C.accentSoft},${C.teal})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>EraSync</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.textSecondary }}>Habit Tracker</span>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${C.accent},${C.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>Y</div>
        </nav>

        <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 24px" }}>

          {/* Header */}
          <div style={{ marginBottom: 28, animation: "fadeUp .4s ease" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: C.accentSoft, textTransform: "uppercase", marginBottom: 6 }}>This Week</p>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Your Habits 🎯</h1>
            <p style={{ fontSize: 14, color: C.textSecondary }}>Small daily actions compound into massive results.</p>
          </div>

          {/* Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Today's Progress", value: `${completedToday}/${totalHabits}`, sub: "habits completed", color: C.accentSoft },
              { label: "Completion Rate", value: overallPct + "%", sub: "today", color: C.teal },
              { label: "Best Streak", value: bestStreak + " days", sub: "current best 🔥", color: C.success },
            ].map((s, i) => (
              <Card key={i} style={{ padding: 20 }}>
                <SectionLabel>{s.label}</SectionLabel>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{s.sub}</div>
              </Card>
            ))}
          </div>

          {/* Habit List */}
          <Card style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <SectionLabel>Weekly Habits</SectionLabel>
              <button
                onClick={() => setShowModal(true)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, background: `linear-gradient(135deg,${C.accent},${C.teal})`, border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
              >
                + Add Habit
              </button>
            </div>

            {habits.length === 0
              ? <div style={{ textAlign: "center", padding: "40px 0", color: C.textMuted, fontSize: 14 }}>No habits yet. Add your first one! 👆</div>
              : habits.map(h => <HabitRow key={h.id} habit={h} onToggle={toggleDay} onDelete={deleteHabit} />)
            }
          </Card>

          {/* Tip */}
          <div style={{ background: C.accentGlow, border: `1px solid ${C.accent}33`, borderRadius: 14, padding: "16px 20px" }}>
            <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.7 }}>
              💡 <strong style={{ color: C.accentSoft }}>Tip:</strong> Tap any day box to mark a habit as complete. Consistency beats intensity — even 5/7 days is a win.
            </p>
          </div>

        </div>
      </div>

      {showModal && <AddHabitModal onAdd={addHabit} onClose={() => setShowModal(false)} />}
    </>
  );
}