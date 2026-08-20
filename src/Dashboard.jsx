import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "./useIsMobile";

const C = {
  bg: "#0A0B1A", surface: "#0F1128", card: "#141630", border: "#1E2245",
  accent: "#7C5CFC", accentSoft: "#9B7FFF", accentGlow: "rgba(124,92,252,0.18)",
  teal: "#38BDF8", tealGlow: "rgba(56,189,248,0.12)",
  success: "#34D399", warning: "#FBBF24", danger: "#F87171",
  textPrimary: "#E8EAFF", textSecondary: "#8892B8", textMuted: "#4A5280",
};

const DATA = {
  user: { name: "Yusuf", streak: 14 },
  today: { focusHours: 4.2, socialMedia: 1.8, productivity: 72 },
  apps: [
    { name: "Study Materials", hours: 2.8, color: C.success, icon: "📚" },
    { name: "YouTube",         hours: 1.4, color: C.warning, icon: "▶️" },
    { name: "Instagram",       hours: 1.1, color: C.danger,  icon: "📸" },
    { name: "WhatsApp",        hours: 0.7, color: C.teal,    icon: "💬" },
    { name: "Twitter/X",       hours: 0.5, color: C.accentSoft, icon: "🐦" },
  ],
  week: { values: [3.1, 4.5, 2.8, 5.1, 3.9, 4.2, 4.2], labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Today"] },
  goals: [
    { label: "Study 4 hrs/day",      progress: 70,  done: false },
    { label: "Social media < 2 hrs", progress: 90,  done: false },
    { label: "Journal entry",        progress: 100, done: true  },
    { label: "Focus session",        progress: 100, done: true  },
  ],
  challenge: { name: "7-Day Study Marathon", day: 5, total: 7 },
};

const MOODS = ["😫 Drained","😐 Neutral","🙂 Good","🔥 Focused","🚀 Peak"];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
input, textarea, select { font-size: 16px !important; }
`;

function ProgressBar({ pct, color }) {
  return (
    <div style={{ height: 6, borderRadius: 3, background: C.border, overflow: "hidden", marginTop: 6 }}>
      <div style={{ height: "100%", width: pct + "%", borderRadius: 3, background: color, transition: "width 1s ease" }} />
    </div>
  );
}

function Spinner() {
  return <div style={{ width: 16, height: 16, border: `2px solid ${C.border}`, borderTopColor: C.accentSoft, borderRadius: "50%", animation: "spin .7s linear infinite" }} />;
}

function Card({ children, style }) {
  return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, animation: "fadeUp .5s ease", ...style }}>{children}</div>;
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.textMuted, textTransform: "uppercase", marginBottom: 12 }}>{children}</div>;
}

function AIPanel({ isMobile }) {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [asking, setAsking] = useState(false);
  const [chat, setChat] = useState([]);
  const fetched = useRef(false);

  const SYSTEM = `You are EraSync AI. User: Yusuf, Medical Student. Today: Focus 4.2h, Social 1.8h, Productivity 72%, Streak 14 days. Be concise (2 sentences max), specific to a med student.`;

  async function callAI(messages) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system: SYSTEM, messages }),
    });
    const d = await res.json();
    return d.content?.[0]?.text || "No response.";
  }

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    callAI([{ role: "user", content: "One smart daily insight based on my data." }])
      .then(setInsight)
      .catch(() => setInsight("Your 4.2h focus is above your weekly average — solid effort. Cap Instagram at 45 minutes tonight to protect your evening review block."))
      .finally(() => setLoading(false));
  }, []);

  async function ask() {
    if (!input.trim() || asking) return;
    const q = input.trim();
    setInput("");
    setAsking(true);
    const next = [...chat, { role: "user", content: q }];
    setChat(next);
    try {
      const reply = await callAI(next);
      setChat([...next, { role: "assistant", content: reply }]);
    } catch {
      setChat([...next, { role: "assistant", content: "Something went wrong, try again." }]);
    }
    setAsking(false);
  }

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <SectionLabel>EraSync AI · Insight</SectionLabel>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: C.success }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.success, display: "inline-block", animation: "pulse 2s infinite" }} />
          Live
        </div>
      </div>
      <div style={{ background: C.accentGlow, border: `1px solid ${C.accent}33`, borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
        {loading
          ? <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: C.textMuted }}><Spinner /><span>Analyzing…</span></div>
          : <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.7 }}>{insight}</p>}
      </div>
      {chat.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          {chat.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 8 }}>
              <div style={{ maxWidth: "85%", padding: "10px 14px", borderRadius: 12, fontSize: 13, lineHeight: 1.6, background: m.role === "user" ? `linear-gradient(135deg,${C.accent},${C.teal})` : C.surface, color: m.role === "user" ? "#fff" : C.textSecondary, border: m.role === "assistant" ? `1px solid ${C.border}` : "none" }}>{m.content}</div>
            </div>
          ))}
          {asking && <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.textMuted }}><Spinner /><span>Thinking…</span></div>}
        </div>
      )}
      <div style={{ display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && ask()}
          placeholder="Ask anything…"
          style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", color: C.textPrimary, outline: "none", fontFamily: "inherit" }} />
        <button onClick={ask} style={{ padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, background: `linear-gradient(135deg,${C.accent},${C.teal})`, color: "#fff", border: "none", cursor: "pointer" }}>Ask</button>
      </div>
    </Card>
  );
}

function WeekChart({ isMobile }) {
  const max = Math.max(...DATA.week.values);
  const h = isMobile ? 60 : 80;
  return (
    <Card>
      <SectionLabel>Weekly Focus Hours</SectionLabel>
      <div style={{ display: "flex", alignItems: "flex-end", gap: isMobile ? 4 : 6, height: h + 20 }}>
        {DATA.week.values.map((v, i) => {
          const isToday = i === 6;
          const barH = Math.round((v / max) * h);
          const color = isToday ? `linear-gradient(180deg,${C.accentSoft},${C.accent})` : C.border;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 9, color: isToday ? C.accentSoft : C.textMuted, fontWeight: 600 }}>{v}h</span>
              <div style={{ width: "100%", height: barH, borderRadius: "3px 3px 0 0", background: color }} />
              <span style={{ fontSize: 9, color: isToday ? C.accentSoft : C.textMuted }}>{DATA.week.labels[i]}</span>
            </div>
          );
        })}
      </div>
      <p style={{ marginTop: 12, fontSize: 12, color: C.textSecondary }}>
        Avg: <strong style={{ color: C.accentSoft }}>4.0h/day</strong> · Best: <strong style={{ color: C.success }}>Thu 5.1h</strong>
      </p>
    </Card>
  );
}

export default function Dashboard() {
  const isMobile = useIsMobile();
  const [mood, setMood] = useState(3);

  const pad = isMobile ? "16px 14px 100px" : "32px 24px 80px";
  const maxW = isMobile ? "100%" : 1100;

  return (
    <>
      <style>{css}</style>
      <div style={{ maxWidth: maxW, margin: "0 auto", padding: pad }}>

        {/* Greeting */}
        <div style={{ marginBottom: isMobile ? 16 : 24, animation: "fadeUp .5s ease" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: C.accentSoft, textTransform: "uppercase", marginBottom: 4 }}>Saturday, August 15</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: isMobile ? 22 : 26, fontWeight: 700, marginBottom: 4 }}>Good afternoon, {DATA.user.name} 👋</h1>
          <p style={{ fontSize: 13, color: C.textSecondary }}>Day {DATA.challenge.day} of your Study Marathon.</p>
        </div>

        {/* Challenge Banner */}
        <div style={{ background: "linear-gradient(135deg,#1a0e3a,#0d1535)", border: `1px solid ${C.accent}55`, borderRadius: 16, padding: isMobile ? 16 : 22, marginBottom: 14, animation: "fadeUp .5s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: C.accentSoft, textTransform: "uppercase", marginBottom: 6 }}>Active Challenge</p>
              <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: isMobile ? 16 : 18, fontWeight: 700, marginBottom: 6 }}>{DATA.challenge.name}</h2>
              <p style={{ fontSize: 12, color: C.textSecondary, marginBottom: 12 }}>Day {DATA.challenge.day}/{DATA.challenge.total} — 71% complete 💪</p>
              <div style={{ display: "flex", gap: 6 }}>
                {Array.from({ length: DATA.challenge.total }).map((_, i) => (
                  <div key={i} style={{ width: isMobile ? 22 : 28, height: 5, borderRadius: 3, background: i < DATA.challenge.day ? `linear-gradient(90deg,${C.accentSoft},${C.teal})` : C.border }} />
                ))}
              </div>
            </div>
            {!isMobile && <span style={{ fontSize: 40 }}>🧠</span>}
          </div>
        </div>

        {/* Stat Cards — 2 col on mobile, 3 on desktop */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr", gap: isMobile ? 10 : 14, marginBottom: 14 }}>
          {[
            { label: "Focus Time",   value: DATA.today.focusHours + "h",    sub: "Deep work",       tag: "↑ Above avg", tagColor: C.success, valColor: C.accentSoft },
            { label: "Productivity", value: DATA.today.productivity + "%",   sub: "Goals & usage",   tag: "On track",    tagColor: C.teal,    valColor: C.teal       },
            { label: "Social Media", value: DATA.today.socialMedia + "h",    sub: "IG + Twitter",    tag: "Near limit",  tagColor: C.warning, valColor: C.warning    },
          ].map((s, i) => (
            <Card key={i} style={{ padding: isMobile ? 14 : 20, gridColumn: isMobile && i === 2 ? "1 / -1" : undefined }}>
              <SectionLabel>{s.label}</SectionLabel>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: isMobile ? 26 : 32, fontWeight: 700, color: s.valColor, lineHeight: 1 }}>{s.value}</div>
              <p style={{ fontSize: 12, color: C.textSecondary, marginTop: 4 }}>{s.sub}</p>
              <span style={{ display: "inline-block", marginTop: 8, padding: "3px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.tagColor + "22", color: s.tagColor, border: `1px solid ${s.tagColor}44` }}>{s.tag}</span>
            </Card>
          ))}
        </div>

        {/* AI Panel */}
        <div style={{ marginBottom: 14 }}><AIPanel isMobile={isMobile} /></div>

        {/* App Usage + Week — stack on mobile */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.8fr", gap: 14, marginBottom: 14 }}>
          <Card>
            <SectionLabel>App Usage Today</SectionLabel>
            {DATA.apps.map((a, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14 }}>{a.icon}</span>
                  <span style={{ flex: 1, fontSize: 13, color: C.textSecondary }}>{a.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{a.hours}h</span>
                </div>
                <ProgressBar pct={Math.round((a.hours / DATA.apps[0].hours) * 100)} color={a.color} />
              </div>
            ))}
          </Card>
          <WeekChart isMobile={isMobile} />
        </div>

        {/* Goals + Mood — stack on mobile */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
          <Card>
            <SectionLabel>Today's Goals</SectionLabel>
            {DATA.goals.map((g, i) => (
              <div key={i} style={{ marginBottom: i < DATA.goals.length - 1 ? 14 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, background: g.done ? C.success : "transparent", border: `2px solid ${g.done ? C.success : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff" }}>{g.done ? "✓" : ""}</div>
                  <span style={{ flex: 1, fontSize: 13, color: g.done ? C.textMuted : C.textSecondary, textDecoration: g.done ? "line-through" : "none" }}>{g.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.accentSoft }}>{g.progress}%</span>
                </div>
                <ProgressBar pct={g.progress} color={g.done ? C.success : C.accent} />
              </div>
            ))}
          </Card>
          <Card>
            <SectionLabel>Mood Check-in</SectionLabel>
            <p style={{ fontSize: 13, color: C.textSecondary, marginBottom: 12 }}>How are you feeling?</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {MOODS.map((m, i) => (
                <button key={i} onClick={() => setMood(i)} style={{ padding: "8px 12px", borderRadius: 10, fontSize: 12, fontWeight: 500, cursor: "pointer", border: `1px solid ${mood === i ? C.accent : C.border}`, background: mood === i ? C.accentGlow : "transparent", color: mood === i ? C.accentSoft : C.textSecondary, transition: "all .2s", fontFamily: "inherit" }}>{m}</button>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </>
  );
}