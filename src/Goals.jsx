import { useState } from "react";

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
`;

const CATEGORIES = ["All", "Study", "Health", "Digital", "Mindfulness", "Career", "Personal"];
const PRIORITY_COLORS = { high: C.danger, medium: C.warning, low: C.teal };

const INITIAL_GOALS = [
  {
    id: 1, title: "Study 4 hours daily", category: "Study", priority: "high",
    target: 28, current: 22, unit: "hrs", deadline: "2026-08-31",
    streak: 14, bestStreak: 21, color: C.accentSoft, icon: "📚",
    subtasks: [
      { id: 1, text: "Read pharmacology chapter", done: true  },
      { id: 2, text: "Review anatomy notes",      done: true  },
      { id: 3, text: "Practice MCQs",             done: false },
    ],
    notes: "Focus on weak areas first. Use Pomodoro for deep sessions.",
    xpPerDay: 40, active: true,
  },
  {
    id: 2, title: "Keep social media under 2hrs/day", category: "Digital", priority: "high",
    target: 14, current: 10, unit: "days", deadline: "2026-08-31",
    streak: 6, bestStreak: 10, color: C.success, icon: "📵",
    subtasks: [
      { id: 1, text: "Remove apps from home screen", done: true  },
      { id: 2, text: "Set app timers",               done: true  },
      { id: 3, text: "No phone during meals",        done: false },
    ],
    notes: "Check social media only at scheduled times.",
    xpPerDay: 30, active: true,
  },
  {
    id: 3, title: "Exercise 30 mins daily", category: "Health", priority: "medium",
    target: 20, current: 12, unit: "sessions", deadline: "2026-09-15",
    streak: 3, bestStreak: 9, color: C.warning, icon: "🏃",
    subtasks: [
      { id: 1, text: "Morning walk or run",    done: false },
      { id: 2, text: "Stretching routine",     done: true  },
    ],
    notes: "Even 20 minutes counts. Consistency over intensity.",
    xpPerDay: 30, active: true,
  },
  {
    id: 4, title: "Journal every evening", category: "Mindfulness", priority: "medium",
    target: 30, current: 18, unit: "entries", deadline: "2026-09-30",
    streak: 7, bestStreak: 14, color: C.teal, icon: "✍️",
    subtasks: [],
    notes: "Write at least 3 sentences. Reflect on wins and lessons.",
    xpPerDay: 20, active: true,
  },
  {
    id: 5, title: "Sleep before 11 PM", category: "Health", priority: "low",
    target: 21, current: 8, unit: "nights", deadline: "2026-09-07",
    streak: 2, bestStreak: 5, color: C.danger, icon: "🌙",
    subtasks: [
      { id: 1, text: "Phone away by 10 PM",   done: false },
      { id: 2, text: "Wind down routine",     done: false },
    ],
    notes: "This one needs work. Sleep is non-negotiable.",
    xpPerDay: 25, active: true,
  },
];

function Card({ children, style }) {
  return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 22, ...style }}>{children}</div>;
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.textMuted, textTransform: "uppercase", marginBottom: 14 }}>{children}</div>;
}

function ProgressBar({ pct, color, height }) {
  return (
    <div style={{ height: height || 6, borderRadius: 3, background: C.border, overflow: "hidden" }}>
      <div style={{ height: "100%", width: Math.min(100, pct) + "%", borderRadius: 3, background: `linear-gradient(90deg,${color},${color}88)`, transition: "width .8s ease" }} />
    </div>
  );
}

function daysLeft(deadline) {
  const d = Math.ceil((new Date(deadline) - new Date()) / 86400000);
  return d > 0 ? d : 0;
}

function GoalCard({ goal, onToggleSubtask, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false);
  const pct = Math.round((goal.current / goal.target) * 100);
  const days = daysLeft(goal.deadline);
  const subtasksDone = goal.subtasks.filter(s => s.done).length;

  return (
    <div style={{ background: C.surface, border: `1px solid ${goal.color}33`, borderRadius: 16, padding: 20, marginBottom: 14, animation: "fadeUp .4s ease", transition: "border-color .2s" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: goal.color + "22", border: `1px solid ${goal.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
          {goal.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>{goal.title}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: PRIORITY_COLORS[goal.priority], background: PRIORITY_COLORS[goal.priority] + "22", padding: "2px 8px", borderRadius: 8, fontWeight: 600 }}>{goal.priority}</span>
            <span style={{ fontSize: 11, color: C.textMuted, background: C.border, padding: "2px 8px", borderRadius: 8 }}>{goal.category}</span>
            <span style={{ fontSize: 11, color: days <= 7 ? C.danger : C.textMuted, background: C.border, padding: "2px 8px", borderRadius: 8 }}>⏰ {days}d left</span>
            {goal.streak > 0 && <span style={{ fontSize: 11, color: C.warning }}>🔥 {goal.streak}-day streak</span>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setExpanded(e => !e)} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 10px", fontSize: 12, color: C.textMuted, cursor: "pointer", fontFamily: "inherit" }}>
            {expanded ? "▲" : "▼"}
          </button>
          <button onClick={() => onDelete(goal.id)} style={{ background: "transparent", border: `1px solid ${C.danger}33`, borderRadius: 8, padding: "5px 10px", fontSize: 12, color: C.danger, cursor: "pointer", fontFamily: "inherit" }}>✕</button>
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.textSecondary, marginBottom: 6 }}>
          <span>{goal.current} / {goal.target} {goal.unit}</span>
          <span style={{ fontWeight: 700, color: goal.color }}>{pct}%</span>
        </div>
        <ProgressBar pct={pct} color={goal.color} height={8} />
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 16 }}>
        {[
          { label: "Best streak", value: goal.bestStreak + "d", color: C.warning  },
          { label: "XP/day",      value: "+" + goal.xpPerDay,  color: C.gold     },
          { label: "Subtasks",    value: `${subtasksDone}/${goal.subtasks.length}`, color: C.teal },
        ].map((s, i) => (
          <div key={i}>
            <div style={{ fontSize: 10, color: C.textMuted }}>{s.label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Expanded */}
      {expanded && (
        <div style={{ marginTop: 16, animation: "fadeUp .3s ease" }}>
          <div style={{ height: 1, background: C.border, marginBottom: 14 }} />

          {/* Subtasks */}
          {goal.subtasks.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.textMuted, textTransform: "uppercase", marginBottom: 10 }}>Subtasks</div>
              {goal.subtasks.map(st => (
                <div key={st.id} onClick={() => onToggleSubtask(goal.id, st.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", cursor: "pointer" }}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${st.done ? C.success : C.border}`, background: st.done ? C.success : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", flexShrink: 0 }}>
                    {st.done ? "✓" : ""}
                  </div>
                  <span style={{ fontSize: 13, color: st.done ? C.textMuted : C.textSecondary, textDecoration: st.done ? "line-through" : "none" }}>{st.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          {goal.notes && (
            <div style={{ background: C.card, borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>Notes</div>
              <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6 }}>{goal.notes}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AddGoalModal({ onAdd, onClose }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Study");
  const [priority, setPriority] = useState("medium");
  const [target, setTarget] = useState(7);
  const [unit, setUnit] = useState("days");
  const [deadline, setDeadline] = useState("");
  const [icon, setIcon] = useState("🎯");
  const [notes, setNotes] = useState("");
  const [color, setColor] = useState(C.accentSoft);

  const ICONS = ["🎯","📚","🏃","🌙","✍️","💧","🧘","💪","🍎","🧠","📵","⭐","🔥","💎","🏆"];
  const COLORS = [C.accentSoft, C.teal, C.success, C.warning, C.danger, "#F472B6", C.gold];

  function submit() {
    if (!title.trim()) return;
    onAdd({
      id: Date.now(), title: title.trim(), category, priority, target, current: 0,
      unit, deadline: deadline || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      streak: 0, bestStreak: 0, color, icon, subtasks: [], notes, xpPerDay: priority === "high" ? 40 : priority === "medium" ? 30 : 20, active: true,
    });
    onClose();
  }

  const inp = { width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 12px", fontSize: 13, color: C.textPrimary, outline: "none", fontFamily: "inherit" };
  const sel = { ...inp, cursor: "pointer" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)", padding: 24 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, width: "100%", maxWidth: 520, animation: "popIn .25s ease", maxHeight: "88vh", overflowY: "auto" }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>New Goal 🎯</div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Goal Title</div>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="What do you want to achieve?" style={inp} onKeyDown={e => e.key === "Enter" && submit()} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Category</div>
            <select value={category} onChange={e => setCategory(e.target.value)} style={sel}>
              {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Priority</div>
            <select value={priority} onChange={e => setPriority(e.target.value)} style={sel}>
              {["high","medium","low"].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Target</div>
            <input type="number" value={target} onChange={e => setTarget(parseInt(e.target.value))} style={inp} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Unit</div>
            <select value={unit} onChange={e => setUnit(e.target.value)} style={sel}>
              {["days","hrs","sessions","entries","pages","km","reps"].map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Deadline</div>
            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} style={{ ...inp, colorScheme: "dark" }} />
          </div>
        </div>

        {/* Icon picker */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8 }}>Icon</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {ICONS.map(ic => (
              <button key={ic} onClick={() => setIcon(ic)} style={{ width: 38, height: 38, borderRadius: 8, fontSize: 18, cursor: "pointer", border: `2px solid ${icon === ic ? C.accent : C.border}`, background: icon === ic ? C.accentGlow : C.surface }}>
                {ic}
              </button>
            ))}
          </div>
        </div>

        {/* Color picker */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8 }}>Color</div>
          <div style={{ display: "flex", gap: 8 }}>
            {COLORS.map(col => (
              <button key={col} onClick={() => setColor(col)} style={{ width: 28, height: 28, borderRadius: "50%", background: col, border: `3px solid ${color === col ? "#fff" : "transparent"}`, cursor: "pointer", transition: "border .15s" }} />
            ))}
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Notes (optional)</div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any strategy, reminders or context…" rows={2} style={{ ...inp, resize: "vertical", lineHeight: 1.6 }} />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 10, background: "transparent", border: `1px solid ${C.border}`, color: C.textSecondary, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          <button onClick={submit} style={{ flex: 1, padding: "11px", borderRadius: 10, background: `linear-gradient(135deg,${C.accent},${C.teal})`, border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Add Goal</button>
        </div>
      </div>
    </div>
  );
}

export default function Goals() {
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("priority");

  function toggleSubtask(goalId, subtaskId) {
    setGoals(prev => prev.map(g => g.id !== goalId ? g : {
      ...g, subtasks: g.subtasks.map(st => st.id === subtaskId ? { ...st, done: !st.done } : st),
    }));
  }

  function deleteGoal(id) { setGoals(prev => prev.filter(g => g.id !== id)); }
  function addGoal(goal) { setGoals(prev => [...prev, goal]); }

  const filtered = goals
    .filter(g => category === "All" || g.category === category)
    .sort((a, b) => {
      if (sortBy === "priority") return ["high","medium","low"].indexOf(a.priority) - ["high","medium","low"].indexOf(b.priority);
      if (sortBy === "deadline") return new Date(a.deadline) - new Date(b.deadline);
      if (sortBy === "progress") return (b.current / b.target) - (a.current / a.target);
      return 0;
    });

  const totalXpAvailable = goals.reduce((s, g) => s + g.xpPerDay, 0);
  const avgProgress = Math.round(goals.reduce((s, g) => s + (g.current / g.target) * 100, 0) / goals.length);
  const highPriority = goals.filter(g => g.priority === "high").length;
  const onTrack = goals.filter(g => g.streak >= 3).length;

  return (
    <>
      <style>{css}</style>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28, animation: "fadeUp .4s ease" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: C.accentSoft, textTransform: "uppercase", marginBottom: 6 }}>Your Ambitions</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Goals 🎯</h1>
          <p style={{ fontSize: 14, color: C.textSecondary }}>Track what matters. Every goal has a streak, a deadline, and a reward.</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
          {[
            { label: "Total Goals",    value: goals.length,       color: C.accentSoft, icon: "🎯" },
            { label: "Avg Progress",   value: avgProgress + "%",  color: C.teal,       icon: "📈" },
            { label: "High Priority",  value: highPriority,       color: C.danger,     icon: "🔴" },
            { label: "On Track",       value: onTrack,            color: C.success,    icon: "✅" },
          ].map((s, i) => (
            <Card key={i} style={{ padding: 18, textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 6, flex: 1, flexWrap: "wrap" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: category === cat ? 600 : 400,
                border: `1px solid ${category === cat ? C.accent : C.border}`,
                background: category === cat ? C.accentGlow : "transparent",
                color: category === cat ? C.accentSoft : C.textMuted,
                cursor: "pointer", fontFamily: "inherit", transition: "all .2s",
              }}>{cat}</button>
            ))}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "7px 12px", fontSize: 12, color: C.textSecondary, outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
            <option value="priority">Sort: Priority</option>
            <option value="deadline">Sort: Deadline</option>
            <option value="progress">Sort: Progress</option>
          </select>
          <button onClick={() => setShowModal(true)} style={{ padding: "8px 18px", borderRadius: 10, background: `linear-gradient(135deg,${C.accent},${C.teal})`, border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            + New Goal
          </button>
        </div>

        {/* Goal cards */}
        {filtered.length === 0
          ? <Card style={{ textAlign: "center", padding: 48 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
              <div style={{ fontSize: 15, color: C.textPrimary, marginBottom: 8 }}>No goals in this category</div>
              <button onClick={() => setShowModal(true)} style={{ padding: "10px 24px", borderRadius: 10, background: `linear-gradient(135deg,${C.accent},${C.teal})`, border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Add Your First Goal</button>
            </Card>
          : filtered.map(g => <GoalCard key={g.id} goal={g} onToggleSubtask={toggleSubtask} onDelete={deleteGoal} />)
        }

        {/* XP available */}
        <div style={{ background: C.accentGlow, border: `1px solid ${C.accent}33`, borderRadius: 14, padding: "16px 20px", marginTop: 8 }}>
          <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.7 }}>
            ⭐ <strong style={{ color: C.accentSoft }}>You can earn up to {totalXpAvailable} XP per day</strong> by completing all your goals. Hit every goal for 7 days straight and you'll unlock the <strong style={{ color: C.gold }}>Week Warrior</strong> badge.
          </p>
        </div>

      </div>

      {showModal && <AddGoalModal onAdd={addGoal} onClose={() => setShowModal(false)} />}
    </>
  );
}