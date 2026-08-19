import { useState } from "react";

const C = {
  bg: "#0A0B1A", surface: "#0F1128", card: "#141630", border: "#1E2245",
  accent: "#7C5CFC", accentSoft: "#9B7FFF", accentGlow: "rgba(124,92,252,0.18)",
  teal: "#38BDF8", tealGlow: "rgba(56,189,248,0.12)",
  success: "#34D399", warning: "#FBBF24", danger: "#F87171",
  textPrimary: "#E8EAFF", textSecondary: "#8892B8", textMuted: "#4A5280",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes growBar{from{height:0}to{height:var(--h)}}
`;

const WEEKS = ["Week 1", "Week 2", "Week 3", "Week 4"];

const DATA = {
  monthly: {
    focus:       [3.2, 3.8, 4.1, 4.2],
    social:      [2.8, 2.4, 2.0, 1.8],
    productivity:[58,  63,  68,  72 ],
    mood:        [2.8, 3.2, 3.6, 3.8],
  },
  appBreakdown: [
    { name: "Study Materials", hours: 87,  color: C.success,    icon: "📚", pct: 38 },
    { name: "YouTube",         hours: 43,  color: C.warning,    icon: "▶️", pct: 19 },
    { name: "Instagram",       hours: 34,  color: C.danger,     icon: "📸", pct: 15 },
    { name: "WhatsApp",        hours: 22,  color: C.teal,       icon: "💬", pct: 10 },
    { name: "Twitter/X",       hours: 15,  color: C.accentSoft, icon: "🐦", pct: 7  },
    { name: "Other",           hours: 25,  color: C.textMuted,  icon: "📱", pct: 11 },
  ],
  moodVsProductivity: [
    { day: "Mon", mood: 3, prod: 65 },
    { day: "Tue", mood: 4, prod: 74 },
    { day: "Wed", mood: 2, prod: 51 },
    { day: "Thu", mood: 5, prod: 82 },
    { day: "Fri", mood: 3, prod: 63 },
    { day: "Sat", mood: 4, prod: 70 },
    { day: "Sun", mood: 4, prod: 72 },
  ],
  streaks: [
    { label: "Study 4hrs",        current: 14, best: 21, color: C.accentSoft },
    { label: "Journal",           current: 7,  best: 14, color: C.teal       },
    { label: "Exercise",          current: 3,  best: 9,  color: C.success    },
    { label: "No late scrolling", current: 5,  best: 10, color: C.warning    },
  ],
};

const TABS = ["Overview", "App Usage", "Mood & Focus", "Streaks"];

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

function LineChart({ data, color, label, unit, max }) {
  const w = 420, h = 90, pad = 12;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - 0) / (max - 0)) * (h - pad * 2);
    return [x, y];
  });
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const area = `${path} L${pts[pts.length - 1][0]},${h} L${pts[0][0]},${h} Z`;

  return (
    <div>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8 }}>{label}</div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 90 }}>
        <defs>
          <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#grad-${label})`} />
        <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill={color} />
            <text x={x} y={h - 1} textAnchor="middle" fontSize="9" fill={C.textMuted}>{WEEKS[i]}</text>
            <text x={x} y={y - 8} textAnchor="middle" fontSize="9" fill={color} fontWeight="600">{data[i]}{unit}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function BarChart({ data, color, label, unit, max }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 10 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
        {data.map((v, i) => {
          const h = Math.round((v / max) * 64);
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 10, color, fontWeight: 600 }}>{v}{unit}</span>
              <div style={{ width: "100%", height: h, borderRadius: "4px 4px 0 0", background: `linear-gradient(180deg, ${color}, ${color}88)` }} />
              <span style={{ fontSize: 9, color: C.textMuted }}>{WEEKS[i]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.pct, 0);
  let cumulative = 0;
  const r = 60, cx = 80, cy = 80, strokeW = 24;
  const circ = 2 * Math.PI * r;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <svg width="160" height="160" style={{ flexShrink: 0 }}>
        {data.map((d, i) => {
          const offset = circ * (1 - cumulative / total);
          const dash = circ * (d.pct / total);
          const el = (
            <circle key={i} cx={cx} cy={cy} r={r}
              fill="none" stroke={d.color} strokeWidth={strokeW}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dasharray .8s ease" }}
            />
          );
          cumulative += d.pct;
          return el;
        })}
        <circle cx={cx} cy={cy} r={r - strokeW / 2 - 2} fill={C.card} />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="13" fontWeight="700" fill={C.textPrimary}>226h</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill={C.textMuted}>this month</text>
      </svg>
      <div style={{ flex: 1 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 14 }}>{d.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.textSecondary, marginBottom: 3 }}>
                <span>{d.name}</span>
                <span style={{ fontWeight: 600, color: d.color }}>{d.pct}%</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: C.border, overflow: "hidden" }}>
                <div style={{ height: "100%", width: d.pct + "%", borderRadius: 2, background: d.color, transition: "width .8s ease" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MoodFocusChart({ data }) {
  const maxProd = 100;
  const maxMood = 5;

  return (
    <div>
      <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.accentSoft }}><div style={{ width: 12, height: 3, borderRadius: 2, background: C.accentSoft }} /> Productivity %</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.teal }}><div style={{ width: 12, height: 3, borderRadius: 2, background: C.teal }} /> Mood (×20)</div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: "100%", display: "flex", gap: 3, alignItems: "flex-end", height: 80, justifyContent: "center" }}>
              <div style={{ width: "42%", borderRadius: "3px 3px 0 0", background: `linear-gradient(180deg,${C.accentSoft},${C.accent}88)`, height: Math.round((d.prod / maxProd) * 72) }} />
              <div style={{ width: "42%", borderRadius: "3px 3px 0 0", background: `linear-gradient(180deg,${C.teal},${C.teal}55)`, height: Math.round(((d.mood * 20) / maxProd) * 72) }} />
            </div>
            <span style={{ fontSize: 10, color: C.textMuted }}>{d.day}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: "12px 14px", background: C.surface, borderRadius: 10, border: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6 }}>
          📈 <strong style={{ color: C.accentSoft }}>Pattern detected:</strong> Your productivity peaks on days when mood is 4–5. Thursday was your best day this week — 🔥 Focused mood + 82% productivity.
        </p>
      </div>
    </div>
  );
}

function StreakCard({ streak }) {
  const pct = Math.round((streak.current / streak.best) * 100);
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{streak.label}</div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: streak.color }}>{streak.current}</div>
            <div style={{ fontSize: 10, color: C.textMuted }}>current</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: C.textMuted }}>{streak.best}</div>
            <div style={{ fontSize: 10, color: C.textMuted }}>best</div>
          </div>
        </div>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: C.border, overflow: "hidden" }}>
        <div style={{ height: "100%", width: pct + "%", borderRadius: 3, background: `linear-gradient(90deg,${streak.color},${streak.color}88)`, transition: "width .8s ease" }} />
      </div>
      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>{pct}% of personal best</div>
    </div>
  );
}

export default function Analytics() {
  const [tab, setTab] = useState("Overview");

  return (
    <>
      <style>{css}</style>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28, animation: "fadeUp .4s ease" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: C.accentSoft, textTransform: "uppercase", marginBottom: 6 }}>August 2026</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Analytics 📊</h1>
          <p style={{ fontSize: 14, color: C.textSecondary }}>Your monthly trends, patterns and performance breakdown.</p>
        </div>

        {/* Summary stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
          {[
            { label: "Avg Focus",    value: "3.8h",  sub: "per day",       color: C.accentSoft, trend: "↑ 31%" },
            { label: "Avg Productivity", value: "65%", sub: "this month",   color: C.teal,       trend: "↑ 12%" },
            { label: "Social Media", value: "2.3h",  sub: "avg per day",   color: C.warning,    trend: "↓ 36%" },
            { label: "Habit Score",  value: "78%",   sub: "completion rate",color: C.success,    trend: "↑ 8%"  },
          ].map((s, i) => (
            <Card key={i} style={{ padding: 18 }}>
              <SectionLabel>{s.label}</SectionLabel>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{s.sub}</div>
              <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: s.trend.startsWith("↑") ? C.success : C.danger }}>{s.trend} vs last month</div>
            </Card>
          ))}
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 6 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "9px 0", borderRadius: 8, fontSize: 13, fontWeight: tab === t ? 600 : 400,
              background: tab === t ? C.accentGlow : "transparent",
              border: `1px solid ${tab === t ? C.accent + "66" : "transparent"}`,
              color: tab === t ? C.accentSoft : C.textMuted,
              cursor: "pointer", fontFamily: "inherit", transition: "all .2s",
            }}>{t}</button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "Overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <SectionLabel>Focus Hours Trend</SectionLabel>
              <LineChart data={DATA.monthly.focus} color={C.accentSoft} label="" unit="h" max={6} />
            </Card>
            <Card>
              <SectionLabel>Social Media Trend</SectionLabel>
              <LineChart data={DATA.monthly.social} color={C.danger} label="" unit="h" max={4} />
            </Card>
            <Card>
              <SectionLabel>Productivity Score</SectionLabel>
              <BarChart data={DATA.monthly.productivity} color={C.teal} label="" unit="%" max={100} />
            </Card>
            <Card>
              <SectionLabel>Avg Mood Score</SectionLabel>
              <BarChart data={DATA.monthly.mood} color={C.warning} label="" unit="/5" max={5} />
            </Card>
          </div>
        )}

        {tab === "App Usage" && (
          <Card>
            <SectionLabel>Monthly Screen Time Breakdown</SectionLabel>
            <DonutChart data={DATA.appBreakdown} />
            <div style={{ height: 1, background: C.border, margin: "20px 0" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {DATA.appBreakdown.slice(0, 3).map((a, i) => (
                <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{a.icon}</div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: a.color }}>{a.hours}h</div>
                  <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{a.name}</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {tab === "Mood & Focus" && (
          <Card>
            <SectionLabel>Mood vs Productivity — This Week</SectionLabel>
            <MoodFocusChart data={DATA.moodVsProductivity} />
          </Card>
        )}

        {tab === "Streaks" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
              {DATA.streaks.map((s, i) => <StreakCard key={i} streak={s} />)}
            </div>
            <div style={{ background: C.accentGlow, border: `1px solid ${C.accent}33`, borderRadius: 14, padding: "16px 20px" }}>
              <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.7 }}>
                🔥 <strong style={{ color: C.accentSoft }}>You're on a 14-day study streak</strong> — your longest active streak. Keep it alive tonight and you'll set a new personal best in 7 days.
              </p>
            </div>
          </div>
        )}

      </div>
    </>
  );
}