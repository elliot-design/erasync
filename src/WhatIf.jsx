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
@keyframes popIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
@keyframes countUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
`;

const SCENARIOS = [
  { id: "youtube",   label: "Reduce YouTube",    icon: "▶️",  current: 1.4, unit: "hrs/day",  prodGainPer30min: 8,  dataPerHour: 1.5,  batteryPerHour: 4  },
  { id: "instagram", label: "Reduce Instagram",  icon: "📸",  current: 1.1, unit: "hrs/day",  prodGainPer30min: 6,  dataPerHour: 0.8,  batteryPerHour: 3  },
  { id: "twitter",   label: "Reduce Twitter/X",  icon: "🐦",  current: 0.5, unit: "hrs/day",  prodGainPer30min: 5,  dataPerHour: 0.5,  batteryPerHour: 2  },
  { id: "gaming",    label: "Reduce Gaming",     icon: "🎮",  current: 0.8, unit: "hrs/day",  prodGainPer30min: 7,  dataPerHour: 2.0,  batteryPerHour: 8  },
  { id: "study",     label: "Add Study Time",    icon: "📚",  current: 4.2, unit: "hrs/day",  prodGainPer30min: 12, dataPerHour: 0.1,  batteryPerHour: 2  },
  { id: "sleep",     label: "Sleep Earlier",     icon: "🌙",  current: 6.5, unit: "hrs/night", prodGainPer30min: 10, dataPerHour: 0,    batteryPerHour: 0  },
  { id: "exercise",  label: "Add Exercise",      icon: "🏃",  current: 0.3, unit: "hrs/day",  prodGainPer30min: 9,  dataPerHour: 0.05, batteryPerHour: 1  },
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

function StatResult({ label, value, sub, color, delay }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 20px", animation: `popIn .4s ease ${delay}s both` }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.textMuted, textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, color, lineHeight: 1, animation: `countUp .5s ease ${delay + 0.1}s both` }}>{value}</div>
      <div style={{ fontSize: 12, color: C.textMuted, marginTop: 6 }}>{sub}</div>
    </div>
  );
}

function InsightBubble({ scenario, reduction, results }) {
  const name = scenario.label.toLowerCase();
  const isAdding = scenario.id === "study" || scenario.id === "exercise" || scenario.id === "sleep";

  const lines = isAdding ? [
    `Adding ${reduction}h more ${name} daily gives you an extra ${results.yearlyHours} hours of growth per year.`,
    `Your productivity score could climb by up to ${results.monthlyProdGain}% over the next month.`,
    `As a medical student, this kind of consistent investment compounds massively during exam season.`,
  ] : [
    `Cutting ${reduction}h of ${name} daily frees up ${results.yearlyHours} hours per year — that's ${Math.round(results.yearlyHours / 4)} full study sessions.`,
    `Your productivity score could improve by up to ${results.monthlyProdGain}% within a month of this change.`,
    `You'd also save ${results.monthlyData}GB of mobile data and extend your battery life noticeably each day.`,
  ];

  return (
    <div style={{ background: `linear-gradient(135deg, ${C.accentGlow}, ${C.tealGlow})`, border: `1px solid ${C.accent}33`, borderRadius: 14, padding: "20px 22px", animation: "fadeUp .5s ease .3s both" }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: C.accentSoft, textTransform: "uppercase", marginBottom: 12 }}>🔮 EraSync Prediction</div>
      {lines.map((l, i) => (
        <p key={i} style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.75, marginBottom: i < lines.length - 1 ? 8 : 0 }}>{l}</p>
      ))}
    </div>
  );
}

function MiniBar({ label, before, after, max, color }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.textSecondary, marginBottom: 6 }}>
        <span>{label}</span>
        <span style={{ color }}>{before}h → <strong>{after}h</strong></span>
      </div>
      <div style={{ position: "relative", height: 8, borderRadius: 4, background: C.border, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(before / max) * 100}%`, borderRadius: 4, background: C.border + "99" }} />
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(after / max) * 100}%`, borderRadius: 4, background: `linear-gradient(90deg, ${color}, ${color}99)`, transition: "width .8s ease" }} />
      </div>
    </div>
  );
}

export default function WhatIf() {
  const [selected, setSelected] = useState(null);
  const [reduction, setReduction] = useState(0.5);
  const [simulated, setSimulated] = useState(false);

  const scenario = SCENARIOS.find(s => s.id === selected);

  function calculate() {
    if (!scenario) return null;
    const dailyHours = reduction;
    const weeklyHours = +(dailyHours * 7).toFixed(1);
    const monthlyHours = +(dailyHours * 30).toFixed(1);
    const yearlyHours = +(dailyHours * 365).toFixed(0);
    const monthlyProdGain = Math.min(30, Math.round((reduction / 0.5) * scenario.prodGainPer30min));
    const monthlyData = +(dailyHours * scenario.dataPerHour * 30).toFixed(1);
    const dailyBattery = +(dailyHours * scenario.batteryPerHour).toFixed(0);
    return { dailyHours, weeklyHours, monthlyHours, yearlyHours, monthlyProdGain, monthlyData, dailyBattery };
  }

  const results = simulated && scenario ? calculate() : null;
  const isAdding = scenario?.id === "study" || scenario?.id === "exercise" || scenario?.id === "sleep";
  const maxSlider = scenario ? Math.min(scenario.current, 3) : 3;

  return (
    <>
      <style>{css}</style>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28, animation: "fadeUp .4s ease" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: C.accentSoft, textTransform: "uppercase", marginBottom: 6 }}>Scenario Planning</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>What If Simulator 🔮</h1>
          <p style={{ fontSize: 14, color: C.textSecondary }}>See the real impact of small daily changes over time.</p>
        </div>

        {/* Step 1 — Pick scenario */}
        <Card style={{ marginBottom: 16 }}>
          <SectionLabel>Step 1 — Choose a scenario</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {SCENARIOS.map(s => {
              const active = selected === s.id;
              return (
                <button key={s.id} onClick={() => { setSelected(s.id); setSimulated(false); setReduction(0.5); }} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 12,
                  border: `1px solid ${active ? C.accent : C.border}`,
                  background: active ? C.accentGlow : C.surface,
                  cursor: "pointer", fontFamily: "inherit", transition: "all .2s", textAlign: "left",
                }}>
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: active ? C.accentSoft : C.textPrimary }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Currently {s.current}{s.unit.includes("night") ? "" : "h"} {s.unit}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Step 2 — Set amount */}
        {selected && (
          <Card style={{ marginBottom: 16 }}>
            <SectionLabel>Step 2 — {isAdding ? "How much to add?" : "How much to cut?"}</SectionLabel>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <input
                type="range" min={0.25} max={maxSlider} step={0.25} value={reduction}
                onChange={e => { setReduction(parseFloat(e.target.value)); setSimulated(false); }}
                style={{ flex: 1, accentColor: C.accent, height: 4, cursor: "pointer" }}
              />
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700, color: C.accentSoft, minWidth: 60, textAlign: "right" }}>
                {reduction}h
              </div>
            </div>

            {/* Before/After preview */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px", marginBottom: 20 }}>
              <MiniBar
                label={scenario.label}
                before={scenario.current}
                after={isAdding ? +(scenario.current + reduction).toFixed(2) : Math.max(0, +(scenario.current - reduction).toFixed(2))}
                max={Math.max(scenario.current + 1, 6)}
                color={isAdding ? C.success : C.teal}
              />
              <p style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>
                {isAdding
                  ? `${scenario.current}h → ${+(scenario.current + reduction).toFixed(2)}h per day`
                  : `${scenario.current}h → ${Math.max(0, +(scenario.current - reduction).toFixed(2))}h per day`}
              </p>
            </div>

            <button
              onClick={() => setSimulated(true)}
              style={{
                width: "100%", padding: "14px", borderRadius: 12, fontSize: 15, fontWeight: 700,
                background: `linear-gradient(135deg, ${C.accent}, ${C.teal})`,
                color: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit",
                letterSpacing: 0.5,
              }}
            >
              🔮 Run Simulation
            </button>
          </Card>
        )}

        {/* Step 3 — Results */}
        {results && (
          <div style={{ animation: "fadeUp .5s ease" }}>
            <Card style={{ marginBottom: 16 }}>
              <SectionLabel>Step 3 — Your Projected Impact</SectionLabel>

              {/* Time saved grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                <StatResult label="Per Day"   value={results.dailyHours + "h"}   sub="reclaimed daily"    color={C.accentSoft} delay={0}    />
                <StatResult label="Per Week"  value={results.weeklyHours + "h"}  sub="per week"           color={C.teal}       delay={0.07} />
                <StatResult label="Per Month" value={results.monthlyHours + "h"} sub="per month"          color={C.success}    delay={0.14} />
                <StatResult label="Per Year"  value={results.yearlyHours + "h"}  sub="hours per year 🤯"  color={C.warning}    delay={0.21} />
              </div>

              {/* Other impacts */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                <StatResult label="Productivity Boost" value={"+" + results.monthlyProdGain + "%"}  sub="est. monthly gain"   color={C.accentSoft} delay={0.28} />
                {scenario.dataPerHour > 0 && <StatResult label="Data Saved"   value={results.monthlyData + "GB"} sub="per month"           color={C.teal}       delay={0.35} />}
                {scenario.batteryPerHour > 0 && <StatResult label="Battery Saved" value={results.dailyBattery + "%"} sub="per day"         color={C.success}    delay={0.42} />}
              </div>

              {/* Insight */}
              <InsightBubble scenario={scenario} reduction={reduction} results={results} />
            </Card>

            {/* Yearly visual */}
            <Card>
              <SectionLabel>What {results.yearlyHours} hours looks like in a year</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[
                  { label: "Study sessions",    value: Math.round(results.yearlyHours / 4),  sub: "4-hour sessions",     icon: "📚" },
                  { label: "Textbook chapters",  value: Math.round(results.yearlyHours * 3),  sub: "chapters read",       icon: "📖" },
                  { label: "Practice questions", value: Math.round(results.yearlyHours * 40), sub: "MCQs answered",       icon: "🧠" },
                ].map((item, i) => (
                  <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px", textAlign: "center", animation: `popIn .4s ease ${i * 0.08}s both` }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 26, fontWeight: 700, color: C.accentSoft }}>{item.value.toLocaleString()}</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Empty state */}
        {!selected && (
          <div style={{ textAlign: "center", padding: "48px 0", color: C.textMuted, animation: "fadeUp .4s ease" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔮</div>
            <p style={{ fontSize: 15, color: C.textSecondary }}>Pick a scenario above to see your projected impact.</p>
          </div>
        )}

      </div>
    </>
  );
}