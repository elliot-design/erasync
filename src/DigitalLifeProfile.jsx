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
@keyframes popIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes shimmer{0%{opacity:.6}50%{opacity:1}100%{opacity:.6}}
`;

const PROFILE = {
  name: "Yusuf",
  occupation: "Medical Student",
  memberSince: "June 2026",
  personalityType: "The Deep Thinker",
  personalityDesc: "You work best in long uninterrupted sessions and tend to go all-in when focused. Your challenge is consistency — you have strong peak days but need to smooth out the valleys.",
  personalityIcon: "🧠",
  stats: [
    { label: "Avg Daily Screen Time", value: "5h 12m",   icon: "📱", color: C.warning    },
    { label: "Peak Focus Duration",   value: "42 mins",  icon: "⏱️", color: C.accentSoft },
    { label: "Most Consistent Goal",  value: "Study",    icon: "✅", color: C.success    },
    { label: "Weakest Goal",          value: "Sleep",    icon: "😴", color: C.danger     },
    { label: "Avg Productivity Score",value: "69/100",   icon: "📈", color: C.teal       },
    { label: "Active Streak",         value: "14 days",  icon: "🔥", color: C.warning    },
  ],
  peakHours: [
    { hour: "6AM",  level: 1 }, { hour: "7AM",  level: 2 }, { hour: "8AM",  level: 4 },
    { hour: "9AM",  level: 5 }, { hour: "10AM", level: 5 }, { hour: "11AM", level: 4 },
    { hour: "12PM", level: 2 }, { hour: "1PM",  level: 1 }, { hour: "2PM",  level: 3 },
    { hour: "3PM",  level: 3 }, { hour: "4PM",  level: 4 }, { hour: "5PM",  level: 3 },
    { hour: "6PM",  level: 2 }, { hour: "7PM",  level: 3 }, { hour: "8PM",  level: 2 },
    { hour: "9PM",  level: 4 }, { hour: "10PM", level: 5 }, { hour: "11PM", level: 3 },
  ],
  categories: [
    { name: "Education",     pct: 38, color: C.success,    icon: "📚" },
    { name: "Entertainment", pct: 27, color: C.warning,    icon: "🎬" },
    { name: "Social",        pct: 19, color: C.danger,     icon: "💬" },
    { name: "Productivity",  pct: 10, color: C.teal,       icon: "⚡" },
    { name: "Other",         pct: 6,  color: C.textMuted,  icon: "📱" },
  ],
  detectedHabits: [
    { habit: "Opens Instagram within 10 mins of waking up",   status: "warning", trend: "Improving" },
    { habit: "Heavy YouTube usage before sleeping",            status: "danger",  trend: "Worsening" },
    { habit: "Study sessions peak between 8–11 AM",           status: "success", trend: "Stable"    },
    { habit: "Productivity dips after lunch (1–2 PM)",        status: "warning", trend: "Stable"    },
    { habit: "Most focused on Thursdays",                      status: "success", trend: "Stable"    },
    { habit: "Social media spikes on weekends",                status: "warning", trend: "Improving" },
  ],
  habitProgress: [
    { label: "Late-night social media", weeks: [135, 112, 80, 58], unit: "mins" },
    { label: "Morning Instagram check", weeks: [22,  18,  14, 10], unit: "mins" },
  ],
  strengths: ["Deep focus capacity", "Strong morning routine", "Consistent study habit", "High goal awareness"],
  growthAreas: ["Late-night screen control", "Post-lunch energy dip", "Sleep consistency", "Weekend digital balance"],
};

const TREND_COLORS = { Improving: C.success, Worsening: C.danger, Stable: C.teal };
const STATUS_COLORS = { success: C.success, warning: C.warning, danger: C.danger };

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

function HeatmapBar({ hour, level }) {
  const colors = ["transparent", C.accentSoft + "22", C.accentSoft + "44", C.accentSoft + "77", C.accentSoft + "AA", C.accentSoft];
  const isHigh = level >= 4;
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{
        width: "100%", height: 48, borderRadius: 6,
        background: colors[level],
        border: `1px solid ${isHigh ? C.accentSoft + "44" : C.border}`,
        boxShadow: isHigh ? `0 0 8px ${C.accentSoft}33` : "none",
        transition: "all .3s",
      }} />
      <span style={{ fontSize: 9, color: C.textMuted, writingMode: "vertical-rl", transform: "rotate(180deg)", lineHeight: 1 }}>{hour}</span>
    </div>
  );
}

function CategoryDonut({ data }) {
  const total = data.reduce((s, d) => s + d.pct, 0);
  let cumulative = 0;
  const r = 55, cx = 70, cy = 70;
  const circ = 2 * Math.PI * r;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <svg width="140" height="140" style={{ flexShrink: 0 }}>
        {data.map((d, i) => {
          const offset = circ * (1 - cumulative / total);
          const dash = circ * (d.pct / total);
          const el = (
            <circle key={i} cx={cx} cy={cy} r={r}
              fill="none" stroke={d.color} strokeWidth={20}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={offset}
              style={{ transform: "rotate(-90deg)", transformOrigin: "70px 70px" }}
            />
          );
          cumulative += d.pct;
          return el;
        })}
        <circle cx={cx} cy={cy} r={r - 12} fill={C.card} />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={C.textPrimary}>Screen</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fontWeight="700" fill={C.textPrimary}>Time</text>
      </svg>
      <div style={{ flex: 1 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 14 }}>{d.icon}</span>
            <span style={{ flex: 1, fontSize: 13, color: C.textSecondary }}>{d.name}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: d.color }}>{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HabitTrend({ item }) {
  const max = Math.max(...item.weeks);
  const improvement = Math.round(((item.weeks[0] - item.weeks[item.weeks.length - 1]) / item.weeks[0]) * 100);

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px", marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{item.label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.success }}>↓ {improvement}% improved</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 50 }}>
        {item.weeks.map((v, i) => {
          const h = Math.round((v / max) * 40);
          const isLatest = i === item.weeks.length - 1;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <span style={{ fontSize: 9, color: isLatest ? C.success : C.textMuted }}>{v}{item.unit}</span>
              <div style={{ width: "100%", height: h, borderRadius: "3px 3px 0 0", background: isLatest ? C.success : C.border }} />
              <span style={{ fontSize: 9, color: C.textMuted }}>W{i + 1}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const TABS = ["Overview", "Patterns & Habits", "Strengths & Growth", "Category Breakdown"];

export default function DigitalLifeProfile() {
  const [tab, setTab] = useState("Overview");

  return (
    <>
      <style>{css}</style>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 24, animation: "fadeUp .4s ease" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: C.accentSoft, textTransform: "uppercase", marginBottom: 6 }}>Know Yourself</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Digital Life Profile 🧩</h1>
          <p style={{ fontSize: 14, color: C.textSecondary }}>Your personalized behavioral summary — built from your real data.</p>
        </div>

        {/* Profile hero card */}
        <div style={{
          background: "linear-gradient(135deg, #1a0e3a, #0d1535)",
          border: `1px solid ${C.accent}44`, borderRadius: 20,
          padding: 28, marginBottom: 20, animation: "fadeUp .4s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%", flexShrink: 0,
              background: `linear-gradient(135deg,${C.accent},${C.teal})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, animation: "float 3s ease infinite",
              boxShadow: `0 0 24px ${C.accent}44`,
            }}>Y</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700, color: C.textPrimary }}>{PROFILE.name}</div>
              <div style={{ fontSize: 14, color: C.textSecondary, marginTop: 2 }}>{PROFILE.occupation}</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>EraSync member since {PROFILE.memberSince}</div>
            </div>
            <div style={{ textAlign: "center", background: C.accentGlow, border: `1px solid ${C.accent}44`, borderRadius: 16, padding: "16px 20px" }}>
              <div style={{ fontSize: 28, marginBottom: 6, animation: "float 3s ease infinite" }}>{PROFILE.personalityIcon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.accentSoft }}>{PROFILE.personalityType}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>Digital Personality</div>
            </div>
          </div>
          <div style={{ height: 1, background: C.border, margin: "20px 0" }} />
          <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.7, fontStyle: "italic" }}>
            "{PROFILE.personalityDesc}"
          </p>
        </div>

        {/* Key stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
          {PROFILE.stats.map((s, i) => (
            <Card key={i} style={{ padding: 18, animation: `popIn .4s ease ${i * 0.06}s both` }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 6 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "9px 0", borderRadius: 8, fontSize: 12, fontWeight: tab === t ? 600 : 400,
              background: tab === t ? C.accentGlow : "transparent",
              border: `1px solid ${tab === t ? C.accent + "66" : "transparent"}`,
              color: tab === t ? C.accentSoft : C.textMuted,
              cursor: "pointer", fontFamily: "inherit", transition: "all .2s",
            }}>{t}</button>
          ))}
        </div>

        {/* Tab: Overview */}
        {tab === "Overview" && (
          <Card>
            <SectionLabel>Productivity Heatmap — Typical Day</SectionLabel>
            <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 14 }}>Darker = higher focus/productivity. Based on your historical patterns.</p>
            <div style={{ display: "flex", gap: 4, alignItems: "flex-end" }}>
              {PROFILE.peakHours.map((h, i) => <HeatmapBar key={i} hour={h.hour} level={h.level} />)}
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", flex: 1 }}>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Peak Hours</div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: C.accentSoft }}>8 – 11 AM</div>
              </div>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", flex: 1 }}>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Distraction Zone</div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: C.danger }}>9 – 11 PM</div>
              </div>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", flex: 1 }}>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Energy Dip</div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: C.warning }}>1 – 2 PM</div>
              </div>
            </div>
          </Card>
        )}

        {/* Tab: Patterns */}
        {tab === "Patterns & Habits" && (
          <div>
            <Card style={{ marginBottom: 16 }}>
              <SectionLabel>Auto-Detected Habits</SectionLabel>
              {PROFILE.detectedHabits.map((h, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 8, animation: `fadeUp .4s ease ${i * 0.06}s both` }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLORS[h.status], flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, color: C.textSecondary }}>{h.habit}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: TREND_COLORS[h.trend], background: TREND_COLORS[h.trend] + "22", padding: "3px 10px", borderRadius: 10 }}>{h.trend}</span>
                </div>
              ))}
            </Card>
            <Card>
              <SectionLabel>Habit Improvement Over 4 Weeks</SectionLabel>
              {PROFILE.habitProgress.map((h, i) => <HabitTrend key={i} item={h} />)}
            </Card>
          </div>
        )}

        {/* Tab: Strengths */}
        {tab === "Strengths & Growth" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <SectionLabel>💪 Your Strengths</SectionLabel>
              {PROFILE.strengths.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: C.success + "11", border: `1px solid ${C.success}33`, borderRadius: 10, padding: "10px 14px", marginBottom: 8, animation: `fadeUp .4s ease ${i * 0.07}s both` }}>
                  <span style={{ color: C.success, fontSize: 16 }}>✓</span>
                  <span style={{ fontSize: 13, color: C.textSecondary }}>{s}</span>
                </div>
              ))}
            </Card>
            <Card>
              <SectionLabel>🌱 Growth Areas</SectionLabel>
              {PROFILE.growthAreas.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: C.warning + "11", border: `1px solid ${C.warning}33`, borderRadius: 10, padding: "10px 14px", marginBottom: 8, animation: `fadeUp .4s ease ${i * 0.07}s both` }}>
                  <span style={{ color: C.warning, fontSize: 16 }}>→</span>
                  <span style={{ fontSize: 13, color: C.textSecondary }}>{s}</span>
                </div>
              ))}
            </Card>
            <Card style={{ gridColumn: "1 / -1" }}>
              <SectionLabel>Recommended Routine — Based on Your Profile</SectionLabel>
              {[
                { time: "7:00 AM", action: "Wake up — avoid phone for first 30 mins",    icon: "☀️" },
                { time: "8:00 AM", action: "Deep study block — your peak focus window",   icon: "🧠" },
                { time: "11:00 AM", action: "Review & lighter work — energy starting to dip", icon: "📋" },
                { time: "1:00 PM", action: "Lunch + short walk — skip screens",           icon: "🚶" },
                { time: "2:00 PM", action: "Second study block with Pomodoro timer",      icon: "🍅" },
                { time: "9:00 PM", action: "Wind down — no social media, journal entry",  icon: "🌙" },
                { time: "10:30 PM", action: "Sleep — protect your recovery",              icon: "😴" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: i < 6 ? 12 : 0 }}>
                  <div style={{ width: 70, fontSize: 12, fontWeight: 600, color: C.accentSoft, flexShrink: 0 }}>{r.time}</div>
                  <div style={{ width: 1, height: 28, background: C.border, flexShrink: 0 }} />
                  <span style={{ fontSize: 16 }}>{r.icon}</span>
                  <span style={{ fontSize: 13, color: C.textSecondary }}>{r.action}</span>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* Tab: Category */}
        {tab === "Category Breakdown" && (
          <Card>
            <SectionLabel>Screen Time by Category — This Month</SectionLabel>
            <CategoryDonut data={PROFILE.categories} />
            <div style={{ height: 1, background: C.border, margin: "20px 0" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {PROFILE.categories.map((cat, i) => (
                <div key={i} style={{ background: C.surface, border: `1px solid ${cat.color}33`, borderRadius: 12, padding: "14px", textAlign: "center", animation: `popIn .4s ease ${i * 0.06}s both` }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{cat.icon}</div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, color: cat.color }}>{cat.pct}%</div>
                  <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{cat.name}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, background: C.accentGlow, border: `1px solid ${C.accent}33`, borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.7 }}>
                💡 <strong style={{ color: C.accentSoft }}>Insight:</strong> As a medical student, your 38% Education usage is solid — but Entertainment (27%) is pulling significant time. A 5% shift from Entertainment to Productivity could meaningfully change your weekly output.
              </p>
            </div>
          </Card>
        )}

      </div>
    </>
  );
}