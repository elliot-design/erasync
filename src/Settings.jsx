import { useState } from "react";
import { useSettings } from "./SettingsContext";

const C = {
  bg: "#0A0B1A", surface: "#0F1128", card: "#141630", border: "#1E2245",
  accent: "#7C5CFC", accentSoft: "#9B7FFF", accentGlow: "rgba(124,92,252,0.18)",
  teal: "#38BDF8", tealGlow: "rgba(56,189,248,0.12)",
  success: "#34D399", warning: "#FBBF24", danger: "#F87171",
  textPrimary: "#E8EAFF", textSecondary: "#8892B8", textMuted: "#4A5280",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes popIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
`;

const TABS = [
  { id: "profile",       label: "Profile",        icon: "👤" },
  { id: "goals",         label: "Goals",          icon: "🎯" },
  { id: "pomodoro",      label: "Pomodoro",       icon: "⏱️" },
  { id: "notifications", label: "Notifications",  icon: "🔔" },
  { id: "appearance",    label: "Appearance",     icon: "🎨" },
  { id: "dashboard",     label: "Dashboard",      icon: "⚡" },
  { id: "ai",            label: "AI Settings",    icon: "🧠" },
  { id: "winddown",      label: "Wind Down",      icon: "🌙" },
  { id: "categories",    label: "App Categories", icon: "📱" },
  { id: "privacy",       label: "Privacy",        icon: "🔐" },
  { id: "about",         label: "About",          icon: "ℹ️" },
];

const ACCENT_COLORS = [
  { name: "Purple", value: "#7C5CFC" },
  { name: "Teal",   value: "#38BDF8" },
  { name: "Green",  value: "#34D399" },
  { name: "Pink",   value: "#F472B6" },
  { name: "Orange", value: "#FB923C" },
  { name: "Red",    value: "#F87171" },
];

const APP_LIST = [
  { app: "Instagram",  icon: "📸", defaultCat: "Social"         },
  { app: "YouTube",    icon: "▶️", defaultCat: "Entertainment"  },
  { app: "WhatsApp",   icon: "💬", defaultCat: "Communication"  },
  { app: "Twitter/X",  icon: "🐦", defaultCat: "Social"         },
  { app: "Chrome",     icon: "🌐", defaultCat: "Productivity"   },
  { app: "PUBG",       icon: "🎮", defaultCat: "Gaming"         },
];

const CATEGORY_OPTIONS = ["Social","Entertainment","Education","Productivity","Communication","Gaming","Finance","Health","Other"];

const PERMISSIONS = [
  { name: "Usage Access",        purpose: "Track app usage duration",        status: "Active"   },
  { name: "Notifications",       purpose: "Send smart alerts and reminders", status: "Active"   },
  { name: "Background Activity", purpose: "Monitor passive usage patterns",  status: "Active"   },
  { name: "Storage",             purpose: "Save your data locally",          status: "Active"   },
  { name: "Network Access",      purpose: "AI insights and cloud sync",      status: "Inactive" },
];

// ── UI helpers ────────────────────────────────────────────────────────────────

function Card({ children, style }) {
  return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, marginBottom: 16, ...style }}>{children}</div>;
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.textMuted, textTransform: "uppercase", marginBottom: 14 }}>{children}</div>;
}

function Toggle({ value, onChange, color }) {
  const col = color || C.accent;
  return (
    <div onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 12, background: value ? col : C.border, cursor: "pointer", position: "relative", transition: "background .2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,.3)" }} />
    </div>
  );
}

function Row({ label, desc, children, danger }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: danger ? C.danger : C.textPrimary }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>{desc}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function SliderRow({ label, desc, value, onChange, min, max, step, unit }) {
  return (
    <div style={{ padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: C.textPrimary }}>{label}</div>
          {desc && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{desc}</div>}
        </div>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 700, color: C.accentSoft }}>{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: C.accent, cursor: "pointer" }} />
    </div>
  );
}

function SaveBar({ onSave, saved }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 20 }}>
      <button onClick={onSave} style={{ padding: "12px 32px", borderRadius: 12, background: `linear-gradient(135deg,${C.accent},${C.teal})`, border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
        Save Changes
      </button>
      {saved && <span style={{ fontSize: 13, color: C.success, fontWeight: 600, animation: "popIn .3s ease" }}>✓ Saved!</span>}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Settings() {
  const { settings, updateSettings, saveSettings, saved } = useSettings();
  const [tab, setTab] = useState("profile");

  const s = settings;
  const u = updateSettings;
  const save = () => saveSettings();

  const sel = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 12px", fontSize: 13, color: C.textPrimary, outline: "none", fontFamily: "inherit", cursor: "pointer" };
  const inp = { width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 14, color: C.textPrimary, outline: "none", fontFamily: "inherit" };

  return (
    <>
      <style>{css}</style>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: C.accentSoft, textTransform: "uppercase", marginBottom: 6 }}>Preferences</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Settings ⚙️</h1>
          <p style={{ fontSize: 14, color: C.textSecondary }}>Customize every part of EraSync to fit your lifestyle.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20 }}>

          {/* Settings sidebar tabs */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 8, height: "fit-content", position: "sticky", top: 20 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                border: "none", fontFamily: "inherit", textAlign: "left",
                background: tab === t.id ? C.accentGlow : "transparent",
                color: tab === t.id ? C.accentSoft : C.textSecondary,
                fontWeight: tab === t.id ? 600 : 400, fontSize: 13,
                marginBottom: 2, transition: "all .15s",
              }}>
                <span>{t.icon}</span><span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div key={tab} style={{ animation: "fadeUp .3s ease" }}>

            {/* ── PROFILE ── */}
            {tab === "profile" && (
              <div>
                {/* Hero banner */}
                <div style={{ background: "linear-gradient(135deg,#1a0e3a,#0d1535)", border: `1px solid ${C.accent}44`, borderRadius: 16, padding: 24, marginBottom: 16, display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg,${C.accent},${C.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, border: `3px solid ${C.accentSoft}`, flexShrink: 0 }}>
                    {s.avatarEmoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: C.textPrimary }}>{s.name || "Your Name"}</div>
                    <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 2 }}>{s.occupation}</div>
                    <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
                      {[
                        { label: "Level",  value: "4 — Disciplined", color: C.accentSoft },
                        { label: "XP",     value: "875",             color: C.warning    },
                        { label: "Streak", value: "14 days 🔥",      color: C.success    },
                        { label: "Active", value: "47 days",         color: C.teal       },
                      ].map((x, i) => (
                        <div key={i}>
                          <div style={{ fontSize: 10, color: C.textMuted }}>{x.label}</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: x.color }}>{x.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Avatar picker */}
                <Card>
                  <SectionLabel>Avatar</SectionLabel>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {["😊","🧠","🚀","⚡","🔥","🎯","💪","🌙","🏆","📚","🦁","🐺","🦊","🐉","⭐","🌟","💎","🎓","🩺","🧬"].map(e => (
                      <button key={e} onClick={() => u({ avatarEmoji: e })} style={{ width: 42, height: 42, borderRadius: 10, fontSize: 20, cursor: "pointer", border: `2px solid ${s.avatarEmoji === e ? C.accent : C.border}`, background: s.avatarEmoji === e ? C.accentGlow : C.surface, transition: "all .15s" }}>{e}</button>
                    ))}
                  </div>
                </Card>

                {/* Personal info */}
                <Card>
                  <SectionLabel>Personal Info</SectionLabel>
                  {[
                    { label: "Display Name", key: "name",       placeholder: "Your name"            },
                    { label: "Occupation",   key: "occupation", placeholder: "e.g. Medical Student" },
                  ].map((f, i) => (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>{f.label}</div>
                      <input value={s[f.key]} onChange={e => u({ [f.key]: e.target.value })} placeholder={f.placeholder} style={inp} />
                    </div>
                  ))}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Age Range</div>
                    <select value={s.ageRange} onChange={e => u({ ageRange: e.target.value })} style={{ ...sel, width: "100%" }}>
                      {["Under 18","18–24","25–34","35–44","45+"].map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Motivation Statement</div>
                    <textarea value={s.bio} onChange={e => u({ bio: e.target.value })} placeholder="Write something that keeps you going…" rows={3}
                      style={{ ...inp, resize: "vertical", lineHeight: 1.6 }} />
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Shown on your profile — keeps you grounded.</div>
                  </div>
                </Card>

                {/* User type */}
                <Card>
                  <SectionLabel>User Type</SectionLabel>
                  <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 14 }}>EraSync adapts its language and priorities to who you are.</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    {[
                      { label: "Student",      desc: "Study, exams, focus",       icon: "🎓" },
                      { label: "Professional", desc: "Work, meetings, output",     icon: "💼" },
                      { label: "General",      desc: "Balance & digital wellness", icon: "🌿" },
                    ].map(t => (
                      <button key={t.label} onClick={() => u({ userType: t.label })} style={{ padding: "14px 10px", borderRadius: 12, cursor: "pointer", fontFamily: "inherit", textAlign: "center", border: `1px solid ${s.userType === t.label ? C.accent : C.border}`, background: s.userType === t.label ? C.accentGlow : C.surface }}>
                        <div style={{ fontSize: 24, marginBottom: 6 }}>{t.icon}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: s.userType === t.label ? C.accentSoft : C.textPrimary }}>{t.label}</div>
                        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 3 }}>{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Primary goals */}
                <Card>
                  <SectionLabel>Why are you using EraSync?</SectionLabel>
                  <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>Select all that apply — personalizes your dashboard and AI insights.</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {["Reduce screen time","Study more effectively","Build better habits","Track productivity","Improve sleep","Cut social media","Exercise consistently","Journal daily","Stay focused","Prepare for exams","Work-life balance","Mental clarity"].map(g => {
                      const sel2 = s.primaryGoals?.includes(g);
                      return (
                        <button key={g} onClick={() => u({ primaryGoals: sel2 ? s.primaryGoals.filter(x => x !== g) : [...(s.primaryGoals || []), g] })} style={{ padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: sel2 ? 600 : 400, border: `1px solid ${sel2 ? C.accent : C.border}`, background: sel2 ? C.accentGlow : "transparent", color: sel2 ? C.accentSoft : C.textSecondary, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}>
                          {sel2 ? "✓ " : ""}{g}
                        </button>
                      );
                    })}
                  </div>
                </Card>

                {/* Daily schedule */}
                <Card>
                  <SectionLabel>Daily Schedule</SectionLabel>
                  <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 14 }}>Helps EraSync understand your routine for smarter insights.</p>
                  {[
                    { label: "Wake Up Time",     key: "wakeTime"   },
                    { label: "Study/Work Start", key: "studyStart" },
                    { label: "Study/Work End",   key: "studyEnd"   },
                    { label: "Sleep Time",       key: "sleepTime"  },
                  ].map((f, i) => (
                    <Row key={i} label={f.label}>
                      <input type="time" value={s[f.key]} onChange={e => u({ [f.key]: e.target.value })} style={{ ...sel, colorScheme: "dark" }} />
                    </Row>
                  ))}
                </Card>

                {/* Experience level */}
                <Card>
                  <SectionLabel>Productivity Experience</SectionLabel>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    {[
                      { label: "Beginner",     desc: "Just getting started",    icon: "🌱" },
                      { label: "Intermediate", desc: "I know the basics",       icon: "⚡" },
                      { label: "Advanced",     desc: "I use systems regularly", icon: "🔥" },
                    ].map(l => (
                      <button key={l.label} onClick={() => u({ expLevel: l.label })} style={{ padding: "12px 10px", borderRadius: 12, cursor: "pointer", fontFamily: "inherit", textAlign: "center", border: `1px solid ${s.expLevel === l.label ? C.teal : C.border}`, background: s.expLevel === l.label ? C.tealGlow : C.surface }}>
                        <div style={{ fontSize: 22, marginBottom: 6 }}>{l.icon}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: s.expLevel === l.label ? C.teal : C.textPrimary }}>{l.label}</div>
                        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 3 }}>{l.desc}</div>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Health context */}
                <Card>
                  <SectionLabel>Health Context (Optional)</SectionLabel>
                  <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 14 }}>Stored locally only. Helps EraSync give more considerate insights.</p>
                  <Row label="Currently in exam period" desc="EraSync will prioritize study reminders"><Toggle value={s.inExamPeriod} onChange={v => u({ inExamPeriod: v })} color={C.warning} /></Row>
                  <Row label="Managing high stress" desc="AI will suggest recovery and balance"><Toggle value={s.highStress} onChange={v => u({ highStress: v })} color={C.danger} /></Row>
                  <Row label="Track sleep quality" desc="Include sleep in productivity score"><Toggle value={s.trackSleep} onChange={v => u({ trackSleep: v })} /></Row>
                </Card>

                {/* Regional */}
                <Card>
                  <SectionLabel>Regional</SectionLabel>
                  <Row label="Timezone" desc="Used for accurate daily tracking">
                    <select value={s.timezone} onChange={e => u({ timezone: e.target.value })} style={sel}>
                      {["Africa/Lagos","Europe/London","America/New_York","Asia/Dubai","Asia/Karachi"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </Row>
                  <Row label="Week Starts On" desc="Affects weekly reports and charts">
                    <select value={s.weekStart} onChange={e => u({ weekStart: e.target.value })} style={sel}>
                      {["Monday","Sunday","Saturday"].map(d => <option key={d}>{d}</option>)}
                    </select>
                  </Row>
                </Card>

                <SaveBar onSave={save} saved={saved} />
              </div>
            )}

            {/* ── GOALS ── */}
            {tab === "goals" && (
              <div>
                <Card>
                  <SectionLabel>Daily Targets</SectionLabel>
                  <SliderRow label="Study Goal" desc="Target daily focus/study hours" value={s.studyGoal} onChange={v => u({ studyGoal: v })} min={1} max={12} step={0.5} unit="h" />
                  <SliderRow label="Social Media Limit" desc="Max daily social media usage" value={s.socialLimit} onChange={v => u({ socialLimit: v })} min={0} max={8} step={0.5} unit="h" />
                  <SliderRow label="Sleep Goal" desc="Target hours of sleep per night" value={s.sleepGoal} onChange={v => u({ sleepGoal: v })} min={4} max={10} step={0.5} unit="h" />
                  <SliderRow label="Exercise Goal" desc="Target daily exercise time" value={s.exerciseGoal} onChange={v => u({ exerciseGoal: v })} min={0} max={3} step={0.25} unit="h" />
                  <SliderRow label="Daily Pomodoro Goal" desc="Target focus sessions per day" value={s.pomodoroDaily} onChange={v => u({ pomodoroDaily: v })} min={1} max={12} step={1} unit=" sessions" />
                </Card>
                <Card>
                  <SectionLabel>Productivity Score Weights</SectionLabel>
                  <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 16 }}>Adjust how much each factor contributes to your daily score.</p>
                  {[
                    { label: "Focus Time",        key: "focus",    color: C.accentSoft },
                    { label: "Goal Completion",   key: "goals",    color: C.teal       },
                    { label: "Habit Consistency", key: "habits",   color: C.success    },
                    { label: "Screen Control",    key: "social",   color: C.warning    },
                    { label: "Pomodoro Sessions", key: "pomodoro", color: C.danger     },
                  ].map((f, i) => {
                    const w = s.scoreWeights?.[f.key] || [30,25,20,15,10][i];
                    return (
                      <div key={f.key} style={{ marginBottom: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.textSecondary, marginBottom: 6 }}>
                          <span>{f.label}</span>
                          <span style={{ fontWeight: 700, color: f.color }}>{w}%</span>
                        </div>
                        <input type="range" min={5} max={50} step={5} value={w}
                          onChange={e => u({ scoreWeights: { ...(s.scoreWeights || {}), [f.key]: parseInt(e.target.value) } })}
                          style={{ width: "100%", accentColor: f.color, cursor: "pointer" }} />
                      </div>
                    );
                  })}
                </Card>
                <SaveBar onSave={save} saved={saved} />
              </div>
            )}

            {/* ── POMODORO ── */}
            {tab === "pomodoro" && (
              <div>
                <Card>
                  <SectionLabel>Timer Durations</SectionLabel>
                  <SliderRow label="Focus Session" value={s.focusDur} onChange={v => u({ focusDur: v })} min={5} max={90} step={5} unit=" mins" />
                  <SliderRow label="Short Break" value={s.shortBreak} onChange={v => u({ shortBreak: v })} min={1} max={15} step={1} unit=" mins" />
                  <SliderRow label="Long Break" value={s.longBreak} onChange={v => u({ longBreak: v })} min={5} max={40} step={5} unit=" mins" />
                  <SliderRow label="Sessions Before Long Break" value={s.longBreakInterval} onChange={v => u({ longBreakInterval: v })} min={2} max={8} step={1} unit=" sessions" />
                </Card>
                <Card>
                  <SectionLabel>Behavior</SectionLabel>
                  <Row label="Auto-start Breaks" desc="Automatically start break when focus ends"><Toggle value={s.autoStartBreak} onChange={v => u({ autoStartBreak: v })} /></Row>
                  <Row label="Auto-start Focus" desc="Automatically start next focus after break"><Toggle value={s.autoStartFocus} onChange={v => u({ autoStartFocus: v })} /></Row>
                  <Row label="Ticking Sound" desc="Play ticking sound during focus sessions"><Toggle value={s.tickSound} onChange={v => u({ tickSound: v })} /></Row>
                  <Row label="Bell Sound" desc="Ring bell when session completes"><Toggle value={s.bellSound} onChange={v => u({ bellSound: v })} /></Row>
                </Card>
                <SaveBar onSave={save} saved={saved} />
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {tab === "notifications" && (
              <div>
                <Card>
                  <SectionLabel>General</SectionLabel>
                  <Row label="Push Notifications" desc="Master switch for all notifications"><Toggle value={s.pushEnabled} onChange={v => u({ pushEnabled: v })} /></Row>
                  <Row label="Smart Alerts" desc="Context-aware usage warnings"><Toggle value={s.smartAlerts} onChange={v => u({ smartAlerts: v })} /></Row>
                  <Row label="Achievement Alerts" desc="Notify when you unlock badges or level up"><Toggle value={s.achievementAlert} onChange={v => u({ achievementAlert: v })} /></Row>
                  <Row label="Streak Alerts" desc="Warn me if my streak is at risk"><Toggle value={s.streakAlert} onChange={v => u({ streakAlert: v })} /></Row>
                </Card>
                <Card>
                  <SectionLabel>Reminders</SectionLabel>
                  <Row label="Goal Reminders" desc="Nudge me about incomplete goals"><Toggle value={s.goalReminders} onChange={v => u({ goalReminders: v })} /></Row>
                  <Row label="Daily Mood Check-in" desc="Evening prompt to log mood"><Toggle value={s.moodReminder} onChange={v => u({ moodReminder: v })} /></Row>
                  <Row label="Focus Session Reminder" desc="Remind me to start studying"><Toggle value={s.focusStart} onChange={v => u({ focusStart: v })} /></Row>
                  <Row label="Social Media Warning" desc="Alert when approaching daily limit"><Toggle value={s.socialWarning} onChange={v => u({ socialWarning: v })} /></Row>
                  <Row label="Weekly Report" desc="Summary every Sunday evening"><Toggle value={s.weeklyReport} onChange={v => u({ weeklyReport: v })} /></Row>
                </Card>
                <Card>
                  <SectionLabel>Quiet Hours</SectionLabel>
                  <Row label="Enable Quiet Hours" desc="Silence notifications during set times"><Toggle value={s.quietHours} onChange={v => u({ quietHours: v })} /></Row>
                  <Row label="Quiet From"><input type="time" value={s.quietStart} onChange={e => u({ quietStart: e.target.value })} style={{ ...sel, colorScheme: "dark" }} /></Row>
                  <Row label="Quiet Until"><input type="time" value={s.quietEnd} onChange={e => u({ quietEnd: e.target.value })} style={{ ...sel, colorScheme: "dark" }} /></Row>
                </Card>
                <SaveBar onSave={save} saved={saved} />
              </div>
            )}

            {/* ── APPEARANCE ── */}
            {tab === "appearance" && (
              <div>
                <Card>
                  <SectionLabel>Accent Color</SectionLabel>
                  <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 14 }}>Changes the highlight color across the entire app instantly.</p>
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    {ACCENT_COLORS.map(col => (
                      <button key={col.value} onClick={() => u({ accentColor: col.value })} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, background: "transparent", border: "none", cursor: "pointer" }}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: col.value, border: `3px solid ${s.accentColor === col.value ? "#fff" : "transparent"}`, boxShadow: s.accentColor === col.value ? `0 0 14px ${col.value}` : "none", transition: "all .2s" }} />
                        <span style={{ fontSize: 11, color: s.accentColor === col.value ? C.textPrimary : C.textMuted }}>{col.name}</span>
                      </button>
                    ))}
                  </div>
                </Card>
                <Card>
                  <SectionLabel>Layout & Display</SectionLabel>
                  <Row label="Font Size" desc="Adjust text size across the app">
                    <select value={s.fontSize} onChange={e => u({ fontSize: e.target.value })} style={sel}>
                      {["Small","Medium","Large"].map(x => <option key={x}>{x}</option>)}
                    </select>
                  </Row>
                  <Row label="Animations" desc="Enable smooth transitions and effects"><Toggle value={s.animationsOn} onChange={v => u({ animationsOn: v })} /></Row>
                  <Row label="Compact View" desc="Denser layout — show more on screen"><Toggle value={s.compactView} onChange={v => u({ compactView: v })} /></Row>
                </Card>
                <SaveBar onSave={save} saved={saved} />
              </div>
            )}

            {/* ── DASHBOARD ── */}
            {tab === "dashboard" && (
              <div>
                <Card>
                  <SectionLabel>Visible Widgets</SectionLabel>
                  <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 16 }}>Choose which cards appear on your dashboard.</p>
                  {[
                    { key: "focusTime",    label: "Focus Time Card",       desc: "Today's deep work hours"      },
                    { key: "productivity", label: "Productivity Card",     desc: "Your daily productivity %"   },
                    { key: "socialMedia",  label: "Social Media Card",     desc: "Social media usage today"    },
                    { key: "aiInsight",    label: "AI Smart Insight",      desc: "Personalized AI analysis"    },
                    { key: "weekChart",    label: "Weekly Focus Chart",    desc: "7-day bar chart"             },
                    { key: "appUsage",     label: "App Usage Breakdown",   desc: "Today's top apps"            },
                    { key: "goals",        label: "Goals Widget",          desc: "Daily goal progress"         },
                    { key: "mood",         label: "Mood Check-in",         desc: "Mood logging widget"         },
                    { key: "challenge",    label: "Active Challenge",      desc: "Current challenge banner"    },
                    { key: "streak",       label: "Streak Badge",          desc: "Streak counter in sidebar"   },
                  ].map(w => (
                    <Row key={w.key} label={w.label} desc={w.desc}>
                      <Toggle value={s.widgets?.[w.key] !== false} onChange={v => u({ widgets: { ...(s.widgets || {}), [w.key]: v } })} />
                    </Row>
                  ))}
                </Card>
                <SaveBar onSave={save} saved={saved} />
              </div>
            )}

            {/* ── AI ── */}
            {tab === "ai" && (
              <div>
                <Card>
                  <SectionLabel>AI Insight Tone</SectionLabel>
                  <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 14 }}>How should EraSync communicate with you?</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    {[
                      { label: "Motivational", desc: "Encouraging and positive", icon: "🚀" },
                      { label: "Balanced",     desc: "Honest with a warm tone",  icon: "⚖️" },
                      { label: "Direct",       desc: "Straight facts, no fluff", icon: "🎯" },
                    ].map(t => (
                      <button key={t.label} onClick={() => u({ aiTone: t.label })} style={{ padding: "14px 12px", borderRadius: 12, cursor: "pointer", fontFamily: "inherit", textAlign: "center", border: `1px solid ${s.aiTone === t.label ? C.accent : C.border}`, background: s.aiTone === t.label ? C.accentGlow : C.surface }}>
                        <div style={{ fontSize: 22, marginBottom: 6 }}>{t.icon}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: s.aiTone === t.label ? C.accentSoft : C.textPrimary }}>{t.label}</div>
                        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </Card>
                <Card>
                  <SectionLabel>AI Features</SectionLabel>
                  <Row label="Use Context from Past Behavior" desc="Let AI reference your history for better insights"><Toggle value={s.aiContext} onChange={v => u({ aiContext: v })} /></Row>
                  <Row label="Predictive Analytics" desc="AI predicts your likely behavior patterns"><Toggle value={s.aiPredictions} onChange={v => u({ aiPredictions: v })} /></Row>
                  <Row label="AI Coach Mode" desc="Conversational AI you can ask questions directly"><Toggle value={s.aiCoach} onChange={v => u({ aiCoach: v })} /></Row>
                  <Row label="Insight Frequency" desc="How often AI generates new insights">
                    <select value={s.insightFreq} onChange={e => u({ insightFreq: e.target.value })} style={sel}>
                      {["Every session","Daily","Weekly"].map(f => <option key={f}>{f}</option>)}
                    </select>
                  </Row>
                </Card>
                <SaveBar onSave={save} saved={saved} />
              </div>
            )}

            {/* ── WIND DOWN ── */}
            {tab === "winddown" && (
              <div>
                <Card>
                  <SectionLabel>Wind Down Mode</SectionLabel>
                  <Row label="Enable Wind Down" desc="Activate a nighttime digital routine"><Toggle value={s.windDownOn} onChange={v => u({ windDownOn: v })} /></Row>
                  <Row label="Wind Down Time" desc="When your evening routine begins">
                    <input type="time" value={s.windDownTime} onChange={e => u({ windDownTime: e.target.value })} style={{ ...sel, colorScheme: "dark" }} />
                  </Row>
                  <Row label="Night Mode" desc="Reduce interface brightness at night"><Toggle value={s.nightMode} onChange={v => u({ nightMode: v })} /></Row>
                </Card>
                <Card>
                  <SectionLabel>Restrict During Wind Down</SectionLabel>
                  {[
                    { key: "instagram", label: "Instagram", icon: "📸" },
                    { key: "youtube",   label: "YouTube",   icon: "▶️" },
                    { key: "twitter",   label: "Twitter/X", icon: "🐦" },
                    { key: "gaming",    label: "Gaming",    icon: "🎮" },
                  ].map(a => (
                    <Row key={a.key} label={`${a.icon} ${a.label}`}>
                      <Toggle value={s.windDownApps?.[a.key] !== false} onChange={v => u({ windDownApps: { ...(s.windDownApps || {}), [a.key]: v } })} color={C.teal} />
                    </Row>
                  ))}
                </Card>
                <Card>
                  <SectionLabel>Recommended Routine</SectionLabel>
                  {[
                    { time: s.windDownTime || "21:30", action: "Wind Down begins — restrict distracting apps" },
                    { time: "21:45", action: "Journal entry — reflect on your day"           },
                    { time: "22:00", action: "Light reading — no screens if possible"         },
                    { time: "22:30", action: "Prepare for tomorrow — review goals"            },
                    { time: s.sleepTime || "23:00", action: "Sleep — protect your recovery"  },
                  ].map((r, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: i < 4 ? 12 : 0 }}>
                      <div style={{ width: 60, fontSize: 12, fontWeight: 600, color: C.teal, flexShrink: 0 }}>{r.time}</div>
                      <div style={{ width: 1, height: 24, background: C.border }} />
                      <span style={{ fontSize: 13, color: C.textSecondary }}>{r.action}</span>
                    </div>
                  ))}
                </Card>
                <SaveBar onSave={save} saved={saved} />
              </div>
            )}

            {/* ── CATEGORIES ── */}
            {tab === "categories" && (
              <div>
                <Card>
                  <SectionLabel>App Category Overrides</SectionLabel>
                  <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 16 }}>Override any automatic categorization that's wrong.</p>
                  {APP_LIST.map((a, i) => (
                    <Row key={i} label={`${a.icon} ${a.app}`} desc={`Default: ${a.defaultCat}`}>
                      <select value={s.appCategories?.[a.app] || a.defaultCat} onChange={e => u({ appCategories: { ...(s.appCategories || {}), [a.app]: e.target.value } })} style={sel}>
                        {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </Row>
                  ))}
                </Card>
                <SaveBar onSave={save} saved={saved} />
              </div>
            )}

            {/* ── PRIVACY ── */}
            {tab === "privacy" && (
              <div>
                <Card>
                  <SectionLabel>Permissions</SectionLabel>
                  {PERMISSIONS.map((p, i) => (
                    <Row key={i} label={p.name} desc={p.purpose}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: p.status === "Active" ? C.success : C.textMuted, background: (p.status === "Active" ? C.success : C.textMuted) + "22", padding: "3px 10px", borderRadius: 10 }}>{p.status}</span>
                    </Row>
                  ))}
                </Card>
                <Card>
                  <SectionLabel>Data Storage</SectionLabel>
                  <Row label="Where your data lives" desc="All data is stored locally on your device"><span style={{ fontSize: 12, color: C.teal }}>Local only</span></Row>
                  <Row label="Cloud sync" desc="Not yet active — coming in a future update"><span style={{ fontSize: 12, color: C.textMuted }}>Off</span></Row>
                  <Row label="Third-party sharing" desc="EraSync never sells or shares your data"><span style={{ fontSize: 12, color: C.success }}>Never</span></Row>
                </Card>
                <Card>
                  <SectionLabel>Data Management</SectionLabel>
                  <Row label="Export my data" desc="Download everything as JSON">
                    <button onClick={() => { const blob = new Blob([JSON.stringify(s, null, 2)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "erasync_data.json"; a.click(); }} style={{ padding: "7px 16px", borderRadius: 8, background: "transparent", border: `1px solid ${C.border}`, color: C.textSecondary, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Export</button>
                  </Row>
                  <Row label="Delete all data" desc="Permanently remove everything" danger>
                    <button onClick={() => { if (confirm("Delete all EraSync data? This cannot be undone.")) { localStorage.removeItem("erasync_settings"); window.location.reload(); } }} style={{ padding: "7px 16px", borderRadius: 8, background: "transparent", border: `1px solid ${C.danger}44`, color: C.danger, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
                  </Row>
                </Card>
              </div>
            )}

            {/* ── ABOUT ── */}
            {tab === "about" && (
              <div>
                <Card>
                  <SectionLabel>App Info</SectionLabel>
                  <Row label="App Name"><span style={{ fontSize: 13, color: C.accentSoft, fontWeight: 600 }}>EraSync</span></Row>
                  <Row label="Version"><span style={{ fontSize: 13, color: C.textMuted }}>v1.0.0</span></Row>
                  <Row label="Built With"><span style={{ fontSize: 13, color: C.textMuted }}>React + Vite</span></Row>
                  <Row label="Developer"><span style={{ fontSize: 13, color: C.accentSoft, fontWeight: 600 }}>Yusuf × Claude 🤝</span></Row>
                  <Row label="Started"><span style={{ fontSize: 13, color: C.textMuted }}>August 2026</span></Row>
                </Card>
                <Card>
                  <SectionLabel>Roadmap</SectionLabel>
                  {[
                    { item: "Android app via Capacitor",      status: "Planned",     color: C.warning    },
                    { item: "Real screen time tracking",      status: "Planned",     color: C.warning    },
                    { item: "Cloud sync & backup",            status: "Planned",     color: C.warning    },
                    { item: "AI Coach (with API key)",        status: "Ready",       color: C.success    },
                    { item: "Community & challenges",         status: "Coming Soon", color: C.teal       },
                    { item: "Vercel deployment",              status: "Next",        color: C.accentSoft },
                  ].map((r, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 5 ? `1px solid ${C.border}` : "none" }}>
                      <span style={{ fontSize: 13, color: C.textSecondary }}>{r.item}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: r.color, background: r.color + "22", padding: "3px 10px", borderRadius: 10 }}>{r.status}</span>
                    </div>
                  ))}
                </Card>
                <div style={{ background: C.accentGlow, border: `1px solid ${C.accent}33`, borderRadius: 14, padding: "18px 20px" }}>
                  <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.7 }}>
                    🚀 <strong style={{ color: C.accentSoft }}>EraSync</strong> is a living project built collaboratively by Yusuf and Claude. Every feature was designed around real goals, real habits, and real student life. More coming soon.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}