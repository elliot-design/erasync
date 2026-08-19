import { useState } from "react";

const C = {
  bg: "#0A0B1A", surface: "#0F1128", card: "#141630", border: "#1E2245",
  accent: "#7C5CFC", accentSoft: "#9B7FFF", accentGlow: "rgba(124,92,252,0.18)",
  teal: "#38BDF8", success: "#34D399", warning: "#FBBF24", danger: "#F87171",
  textPrimary: "#E8EAFF", textSecondary: "#8892B8", textMuted: "#4A5280",
};

const MOODS = [
  { label: "Drained",  emoji: "😫", color: C.danger },
  { label: "Neutral",  emoji: "😐", color: C.textMuted },
  { label: "Good",     emoji: "🙂", color: C.teal },
  { label: "Focused",  emoji: "🔥", color: C.warning },
  { label: "Peak",     emoji: "🚀", color: C.success },
];

const PROMPTS = [
  "What did I learn today that I didn't know yesterday?",
  "What's one thing I could have done better?",
  "What am I most grateful for right now?",
  "What's been draining my energy lately?",
  "What would make tomorrow a great day?",
  "What's one win I had today, no matter how small?",
  "What am I avoiding that I need to face?",
];

const SAMPLE_ENTRIES = [
  {
    id: 1,
    date: "August 14, 2026",
    title: "Crushed pharmacology today",
    body: "Finally got through the beta-blockers section. It clicked after I drew out the receptor pathways myself. Mood was high all morning but I hit a wall after lunch — need to figure out my post-lunch strategy. Maybe a 10 min walk instead of scrolling.",
    mood: MOODS[3],
  },
  {
    id: 2,
    date: "August 13, 2026",
    title: "Tough day but I showed up",
    body: "Didn't feel like studying at all. Managed 2 hours which is less than my goal but I still showed up. Realized I need to sleep earlier — been sleeping past midnight consistently this week and it's catching up.",
    mood: MOODS[0],
  },
  {
    id: 3,
    date: "August 12, 2026",
    title: "Group study session",
    body: "Had a really productive session with the study group. Teaching others forces you to actually understand the material. Covered renal physiology — GFR, tubular reabsorption, all of it. Feeling confident about this topic now.",
    mood: MOODS[4],
  },
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes popIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
`;

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

function EntryCard({ entry, onClick }) {
  return (
    <div
      onClick={() => onClick(entry)}
      style={{
        background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
        padding: "18px 20px", marginBottom: 12, cursor: "pointer",
        transition: "border-color .2s, background .2s", animation: "fadeUp .4s ease",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent + "66"; e.currentTarget.style.background = C.card; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface; }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary, marginBottom: 4 }}>{entry.title}</div>
          <div style={{ fontSize: 12, color: C.textMuted }}>{entry.date}</div>
        </div>
        <span style={{
          padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, flexShrink: 0,
          background: entry.mood.color + "22", color: entry.mood.color, border: `1px solid ${entry.mood.color}44`,
        }}>{entry.mood.emoji} {entry.mood.label}</span>
      </div>
      <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {entry.body}
      </p>
    </div>
  );
}

function ViewModal({ entry, onClose, onDelete }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)", padding: 24 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 32, width: "100%", maxWidth: 560, animation: "popIn .25s ease", maxHeight: "80vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>{entry.date}</div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: C.textPrimary }}>{entry.title}</h2>
          </div>
          <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600, background: entry.mood.color + "22", color: entry.mood.color, border: `1px solid ${entry.mood.color}44`, flexShrink: 0 }}>
            {entry.mood.emoji} {entry.mood.label}
          </span>
        </div>
        <div style={{ height: 1, background: C.border, marginBottom: 20 }} />
        <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{entry.body}</p>
        <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
          <button onClick={() => onDelete(entry.id)} style={{ padding: "10px 18px", borderRadius: 10, background: "transparent", border: `1px solid ${C.danger}44`, color: C.danger, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 10, background: `linear-gradient(135deg,${C.accent},${C.teal})`, border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default function Journal() {
  const [entries, setEntries] = useState(SAMPLE_ENTRIES);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState(null);
  const [promptIdx, setPromptIdx] = useState(0);
  const [saved, setSaved] = useState(false);

  function saveEntry() {
    if (!title.trim() || !body.trim() || !selectedMood) return;
    const now = new Date();
    const date = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const newEntry = { id: Date.now(), date, title: title.trim(), body: body.trim(), mood: selectedMood };
    setEntries(prev => [newEntry, ...prev]);
    setTitle("");
    setBody("");
    setSelectedMood(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function deleteEntry(id) {
    setEntries(prev => prev.filter(e => e.id !== id));
    setViewing(null);
  }

  function nextPrompt() {
    setPromptIdx(i => (i + 1) % PROMPTS.length);
    setBody(prev => prev ? prev : "");
  }

  const filtered = entries.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.body.toLowerCase().includes(search.toLowerCase())
  );

  const totalEntries = entries.length;
  const thisWeekEntries = entries.slice(0, 4).length;
  const moodCounts = MOODS.map(m => ({ ...m, count: entries.filter(e => e.mood.label === m.label).length }));
  const topMood = moodCounts.sort((a, b) => b.count - a.count)[0];

  return (
    <>
      <style>{css}</style>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28, animation: "fadeUp .4s ease" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: C.accentSoft, textTransform: "uppercase", marginBottom: 6 }}>Reflect & Grow</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Your Journal ✍️</h1>
          <p style={{ fontSize: 14, color: C.textSecondary }}>Track your thoughts, moods and progress every day.</p>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total Entries", value: totalEntries, sub: "all time", color: C.accentSoft },
            { label: "This Week",     value: thisWeekEntries, sub: "entries written", color: C.teal },
            { label: "Top Mood",      value: topMood.emoji,  sub: topMood.label, color: topMood.color },
          ].map((s, i) => (
            <Card key={i} style={{ padding: 20 }}>
              <SectionLabel>{s.label}</SectionLabel>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 30, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{s.sub}</div>
            </Card>
          ))}
        </div>

        {/* Write Entry */}
        <Card style={{ marginBottom: 24 }}>
          <SectionLabel>New Entry</SectionLabel>

          {/* Prompt suggestion */}
          <div style={{ background: C.accentGlow, border: `1px solid ${C.accent}33`, borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <p style={{ fontSize: 13, color: C.accentSoft, fontStyle: "italic", flex: 1 }}>💡 "{PROMPTS[promptIdx]}"</p>
            <button onClick={nextPrompt} style={{ background: "transparent", border: `1px solid ${C.accent}44`, borderRadius: 8, padding: "5px 12px", fontSize: 12, color: C.accentSoft, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>New prompt</button>
          </div>

          {/* Title */}
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Entry title…"
            style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 14px", fontSize: 15, fontWeight: 600, color: C.textPrimary, outline: "none", fontFamily: "inherit", marginBottom: 12 }}
          />

          {/* Body */}
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Write freely… what happened today? How are you feeling? What did you learn?"
            rows={6}
            style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", fontSize: 14, color: C.textPrimary, outline: "none", fontFamily: "inherit", resize: "vertical", lineHeight: 1.7, marginBottom: 16 }}
          />

          {/* Mood selector */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 600, marginBottom: 10 }}>HOW ARE YOU FEELING?</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {MOODS.map((m, i) => {
                const sel = selectedMood?.label === m.label;
                return (
                  <button key={i} onClick={() => setSelectedMood(m)} style={{
                    padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: "pointer",
                    border: `1px solid ${sel ? m.color : C.border}`,
                    background: sel ? m.color + "22" : "transparent",
                    color: sel ? m.color : C.textSecondary,
                    transition: "all .2s", fontFamily: "inherit",
                  }}>{m.emoji} {m.label}</button>
                );
              })}
            </div>
          </div>

          {/* Save button */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={saveEntry}
              disabled={!title.trim() || !body.trim() || !selectedMood}
              style={{
                padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600,
                background: (!title.trim() || !body.trim() || !selectedMood) ? C.border : `linear-gradient(135deg,${C.accent},${C.teal})`,
                color: (!title.trim() || !body.trim() || !selectedMood) ? C.textMuted : "#fff",
                border: "none", cursor: (!title.trim() || !body.trim() || !selectedMood) ? "not-allowed" : "pointer",
                fontFamily: "inherit", transition: "all .2s",
              }}
            >Save Entry</button>
            {saved && <span style={{ fontSize: 13, color: C.success, fontWeight: 600, animation: "fadeUp .3s ease" }}>✓ Entry saved!</span>}
          </div>
        </Card>

        {/* Past Entries */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <SectionLabel>Past Entries ({filtered.length})</SectionLabel>
          </div>

          {/* Search */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍  Search entries…"
            style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: C.textPrimary, outline: "none", fontFamily: "inherit", marginBottom: 16 }}
          />

          {filtered.length === 0
            ? <div style={{ textAlign: "center", padding: "32px 0", color: C.textMuted, fontSize: 14 }}>No entries found.</div>
            : filtered.map(e => <EntryCard key={e.id} entry={e} onClick={setViewing} />)
          }
        </Card>

      </div>

      {viewing && <ViewModal entry={viewing} onClose={() => setViewing(null)} onDelete={deleteEntry} />}
    </>
  );
}