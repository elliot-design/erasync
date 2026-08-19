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
@keyframes scoreReveal{from{stroke-dasharray:0 999}to{stroke-dasharray:var(--dash) 999}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
`;

const FACTORS = [
  { id: "focus",    label: "Focus Time",        icon: "🧠", score: 85, weight: 30, color: C.accentSoft, desc: "4.2h of deep work today" },
  { id: "goals",    label: "Goal Completion",   icon: "🎯", score: 75, weight: 25, color: C.teal,       desc: "3 of 4 goals completed" },
  { id: "habits",   label: "Habit Consistency", icon: "✅", score: 80, weight: 20, color: C.success,    desc: "5 of 6 habits done" },
  { id: "social",   label: "Screen Control",    icon: "📱", score: 60, weight: 15, color: C.warning,    desc: "1.8h social — near limit" },
  { id: "pomodoro", label: "Pomodoro Sessions", icon: "🍅", score: 75, weight: 10, color: C.danger,     desc: "3 sessions completed" },
];

const WEEK_SCORES = [
  { day: "Mon", score: 61 },
  { day: "Tue", score: 74 },
  { day: "Wed", score: 58 },
  { day: "Thu", score: 82 },
  { day: "Fri", score: 69 },
  { day: "Sat", score: 71 },
  { day: "Sun", score: 72 },
];

const TIPS = [
  { tip: "Your screen control score is dragging you down — try capping Instagram at 45 mins tonight.", icon: "📱", impact: "+6 pts" },
  { tip: "Completing your 4th goal (study session) would push you past 80 today.", icon: "🎯", impact: "+5 pts" },
  { tip: "One more Pomodoro session before bed would boost your score.", icon: "🍅", impact: "+3 pts" },
];

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

function getScoreColor(score) {
  if (score >= 80) return C.success;
  if (score >= 65) return C.teal;
  if (score >= 50) return C.warning;
  return C.danger;
}

function getScoreLabel(score) {
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 50) return "Average";
  return "Needs Work";
}

function ScoreRing({ score }) {
  const r = 90, cx = 110, cy = 110;
  const circ = 2 * Math.PI * r;
  const dash = circ * (score / 100);
  const color = getScoreColor(score);

  return (
    <div style={{ position: "relative", width: 220, height: 220, margin: "0 auto" }}>
      <svg width="220" height="220" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth="10" />
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ - dash}`}
          style={{ transition: "stroke-dasharray 1.2s ease, stroke .4s ease" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 20, borderRadius: "50%", background: `radial-gradient(circle, ${color}11 0%, transparent 70%)` }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 48, fontWeight: 700, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>out of 100</div>
        <div style={{ fontSize: 13, fontWeight: 700, color, marginTop: 6 }}>{getScoreLabel(score)}</div>
      </div>
    </div>
  );
}

function WeekChart({ data }) {
  const max = Math.max(...data.map(d => d.score));
  const today = data[data.length - 1];

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
      {data.map((d, i) => {
        const isToday = i === data.length - 1;
        const h = Math.round((d.score / max) * 76);
        const color = getScoreColor(d.score);
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: isToday ? color : C.textMuted }}>{d.score}</span>
            <div style={{
              width: "100%", height: h, borderRadius: "4px 4px 0 0",
              background: isToday ? `linear-gradient(180deg,${color},${color}88)` : C.border,
              boxShadow: isToday ? `0 0 10px ${color}44` : "none",
              transition: "height .8s ease",
            }} />
            <span style={{ fontSize: 10, color: isToday ? color : C.textMuted }}>{d.day}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function ProductivityScore() {
  const [weights, setWeights] = useState(FACTORS.reduce((acc, f) => ({ ...acc, [f.id]: f.weight }), {}));
  const [showWeights, setShowWeights] = useState(false);

  // Recalculate score based on weights
  const totalWeight = Object.values(weights).reduce((s, w) => s + w, 0);
  const todayScore = Math.round(
    FACTORS.reduce((sum, f) => sum + (f.score * (weights[f.id] / totalWeight)), 0)
  );

  const weekAvg = Math.round(WEEK_SCORES.reduce((s, d) => s + d.score, 0) / WEEK_SCORES.length);
  const bestDay = WEEK_SCORES.reduce((best, d) => d.score > best.score ? d : best);
  const trend = todayScore - WEEK_SCORES[WEEK_SCORES.length - 2].score;

  return (
    <>
      <style>{css}</style>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28, animation: "fadeUp .4s ease" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: C.accentSoft, textTransform: "uppercase", marginBottom: 6 }}>Today's Performance</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Productivity Score 📈</h1>
          <p style={{ fontSize: 14, color: C.textSecondary }}>A transparent, personalised measure of your day.</p>
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20, marginBottom: 20 }}>

          {/* Score ring */}
          <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <SectionLabel>Today's Score</SectionLabel>
            <ScoreRing score={todayScore} />
            <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
              {[
                { label: "Week Avg", value: weekAvg, color: C.teal },
                { label: "Best Day", value: bestDay.score, color: C.success },
                { label: "Trend",    value: (trend >= 0 ? "+" : "") + trend, color: trend >= 0 ? C.success : C.danger },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Factor breakdown */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <SectionLabel>Score Breakdown</SectionLabel>
              <button onClick={() => setShowWeights(w => !w)} style={{
                fontSize: 12, color: C.accentSoft, background: "transparent",
                border: `1px solid ${C.accent}44`, borderRadius: 8, padding: "4px 10px",
                cursor: "pointer", fontFamily: "inherit",
              }}>{showWeights ? "Done" : "Adjust Weights ⚙️"}</button>
            </div>

            {FACTORS.map((f, i) => {
              const w = weights[f.id];
              const contribution = Math.round(f.score * (w / totalWeight));
              return (
                <div key={f.id} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 16 }}>{f.icon}</span>
                    <span style={{ flex: 1, fontSize: 13, color: C.textSecondary }}>{f.label}</span>
                    <span style={{ fontSize: 12, color: C.textMuted }}>{w}% weight</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: f.color }}>{f.score}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: C.border, overflow: "hidden", marginBottom: 4 }}>
                    <div style={{ height: "100%", width: f.score + "%", borderRadius: 3, background: `linear-gradient(90deg,${f.color},${f.color}88)`, transition: "width .8s ease" }} />
                  </div>
                  {showWeights ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                      <span style={{ fontSize: 11, color: C.textMuted, width: 60 }}>Weight: {w}%</span>
                      <input
                        type="range" min={5} max={50} step={5} value={w}
                        onChange={e => setWeights(prev => ({ ...prev, [f.id]: parseInt(e.target.value) }))}
                        style={{ flex: 1, accentColor: f.color, cursor: "pointer" }}
                      />
                    </div>
                  ) : (
                    <div style={{ fontSize: 11, color: C.textMuted }}>{f.desc} · contributes <strong style={{ color: f.color }}>{contribution} pts</strong></div>
                  )}
                </div>
              );
            })}
          </Card>
        </div>

        {/* Week trend */}
        <Card style={{ marginBottom: 20 }}>
          <SectionLabel>This Week's Score Trend</SectionLabel>
          <WeekChart data={WEEK_SCORES} />
          <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
            {[
              { label: "Weekly Average", value: weekAvg, color: C.teal },
              { label: "Best Day",       value: `${bestDay.day} — ${bestDay.score}`, color: C.success },
              { label: "Lowest Day",     value: `${WEEK_SCORES.reduce((b, d) => d.score < b.score ? d : b).day} — ${WEEK_SCORES.reduce((b, d) => d.score < b.score ? d : b).score}`, color: C.warning },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Tips to improve */}
        <Card style={{ marginBottom: 20 }}>
          <SectionLabel>How to Boost Your Score Today</SectionLabel>
          {TIPS.map((t, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 14,
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 12, padding: "14px 16px",
              marginBottom: i < TIPS.length - 1 ? 10 : 0,
              animation: `fadeUp .4s ease ${i * 0.08}s both`,
            }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{t.icon}</span>
              <p style={{ flex: 1, fontSize: 13, color: C.textSecondary, lineHeight: 1.6 }}>{t.tip}</p>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.success, background: C.success + "22", padding: "4px 10px", borderRadius: 10, flexShrink: 0, whiteSpace: "nowrap" }}>{t.impact}</span>
            </div>
          ))}
        </Card>

        {/* Score scale legend */}
        <Card>
          <SectionLabel>Score Scale</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {[
              { range: "80–100", label: "Excellent",  color: C.success, desc: "You're killing it today" },
              { range: "65–79",  label: "Good",       color: C.teal,    desc: "Solid productive day" },
              { range: "50–64",  label: "Average",    color: C.warning, desc: "Room to improve" },
              { range: "0–49",   label: "Needs Work", color: C.danger,  desc: "Let's get back on track" },
            ].map((s, i) => (
              <div key={i} style={{ background: C.surface, border: `1px solid ${s.color}33`, borderRadius: 12, padding: "14px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.range}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{s.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: "12px 16px", background: C.accentGlow, border: `1px solid ${C.accent}33`, borderRadius: 10 }}>
            <p style={{ fontSize: 12, color: C.textSecondary, lineHeight: 1.6 }}>
              ⚠️ <strong style={{ color: C.accentSoft }}>Note:</strong> This score is based on your own goals and habits — not an objective measure of your worth or intelligence. Use it as a compass, not a verdict.
            </p>
          </div>
        </Card>

      </div>
    </>
  );
}