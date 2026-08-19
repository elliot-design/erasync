import { useState } from "react";
import { SettingsProvider, useSettings } from "./SettingsContext";
import Today from "./Today";
import Goals from "./Goals";
import Dashboard from "./Dashboard";
import HabitTracker from "./HabitTracker";
import Journal from "./Journal";
import WhatIf from "./WhatIf";
import Analytics from "./Analytics";
import Pomodoro from "./Pomodoro";
import Rewards from "./Rewards";
import Challenges from "./Challenges";
import ProductivityScore from "./ProductivityScore";
import Settings from "./Settings";

const NAV_GROUPS = [
  {
    group: "Main",
    items: [
      { id: "today",     label: "Today",       icon: "🌅" },
      { id: "dashboard", label: "Dashboard",   icon: "⚡" },
      { id: "score",     label: "Score",       icon: "📈" },
      { id: "profile",   label: "My Profile",  icon: "🧩" },
    ],
  },
  {
    group: "Tools",
    items: [
      { id: "goals",     label: "Goals",       icon: "🎯" },
      { id: "habits",    label: "Habits",      icon: "✅" },
      { id: "journal",   label: "Journal",     icon: "✍️" },
      { id: "pomodoro",  label: "Pomodoro",    icon: "⏱️" },
      { id: "simulator", label: "What If",     icon: "🔮" },
    ],
  },
  {
    group: "Insights",
    items: [
      { id: "analytics",  label: "Analytics",   icon: "📊" },
      { id: "rewards",    label: "Rewards",     icon: "🏆" },
      { id: "challenges", label: "Challenges",  icon: "🎖️" },
      { id: "challenges", label: "Challenges",  icon: "⚡" },
    ],
  },
  {
    group: "Account",
    items: [
      { id: "settings",  label: "Settings",    icon: "⚙️" },
    ],
  },
];

function renderPage(page) {
  switch (page) {
    case "today":      return <Today />;
    case "goals":      return <Goals />;
    case "dashboard":  return <Dashboard />;
    case "habits":    return <HabitTracker />;
    case "journal":   return <Journal />;
    case "simulator": return <WhatIf />;
    case "analytics": return <Analytics />;
    case "pomodoro":  return <Pomodoro />;
    case "rewards":    return <Rewards />;
    case "challenges": return <Challenges />;
    case "challenges": return <Challenges />;
    case "score":     return <ProductivityScore />;
    case "profile":   return <DigitalLifeProfile />;
    case "settings":  return <Settings />;
    default:          return <Dashboard />;
  }
}

function AppShell() {
  const { settings } = useSettings();
  const [activePage, setActivePage] = useState("today");
  const [collapsed, setCollapsed] = useState(false);

  const C = {
    bg: "#0A0B1A", surface: "#0F1128", card: "#141630", border: "#1E2245",
    accent: settings.accentColor,
    accentSoft: settings.accentSoft || "#9B7FFF",
    accentGlow: `${settings.accentColor}22`,
    teal: "#38BDF8",
    textPrimary: "#E8EAFF", textSecondary: "#8892B8", textMuted: "#4A5280",
  };

  const SIDEBAR_W = collapsed ? 68 : 220;
  const animDuration = settings.animationsOn ? ".25s" : "0s";

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:${C.bg};color:${C.textPrimary};font-family:'Inter',sans-serif;min-height:100vh}
    @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-track{background:${C.surface}}
    ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
  `;

  return (
    <>
      <style>{css}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>

        {/* Sidebar */}
        <aside style={{
          width: SIDEBAR_W, flexShrink: 0,
          background: C.surface, borderRight: `1px solid ${C.border}`,
          display: "flex", flexDirection: "column",
          position: "fixed", top: 0, left: 0, bottom: 0,
          zIndex: 100, transition: `width ${animDuration} ease`, overflow: "hidden",
        }}>

          {/* Logo */}
          <div style={{ padding: collapsed ? "20px 0" : "20px 20px", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", borderBottom: `1px solid ${C.border}`, height: 64, flexShrink: 0 }}>
            {!collapsed && (
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, background: `linear-gradient(135deg,${C.accentSoft},${C.teal})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", whiteSpace: "nowrap" }}>
                EraSync
              </span>
            )}
            <button onClick={() => setCollapsed(c => !c)} style={{
              background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8,
              width: 28, height: 28, cursor: "pointer", color: C.textMuted, fontSize: 12,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>{collapsed ? "→" : "←"}</button>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
            {NAV_GROUPS.map(group => (
              <div key={group.group} style={{ marginBottom: 4 }}>
                {!collapsed && (
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: C.textMuted, textTransform: "uppercase", padding: "8px 20px 4px" }}>
                    {group.group}
                  </div>
                )}
                {group.items.map(item => {
                  const active = activePage === item.id;
                  return (
                    <button key={item.id} onClick={() => setActivePage(item.id)} title={collapsed ? item.label : ""} style={{
                      display: "flex", alignItems: "center",
                      gap: collapsed ? 0 : 12,
                      justifyContent: collapsed ? "center" : "flex-start",
                      width: "100%", padding: collapsed ? "10px 0" : "10px 20px",
                      border: "none", cursor: "pointer", fontFamily: "inherit",
                      background: active ? `${C.accentSoft}18` : "transparent",
                      borderRight: active ? `3px solid ${C.accentSoft}` : "3px solid transparent",
                      transition: `all ${animDuration}`,
                    }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                      {!collapsed && (
                        <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? C.accentSoft : C.textSecondary, whiteSpace: "nowrap", animation: `slideIn ${animDuration} ease` }}>
                          {item.label}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* User footer */}
          <div style={{ padding: collapsed ? "16px 0" : "16px 20px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10, justifyContent: collapsed ? "center" : "flex-start", flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${C.accent},${C.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
              {settings.avatarEmoji}
            </div>
            {!collapsed && (
              <div style={{ animation: `slideIn ${animDuration} ease`, overflow: "hidden" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, whiteSpace: "nowrap" }}>{settings.name}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>
                  {settings.widgets?.streak !== false ? "🔥 14-day streak" : settings.userType}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main */}
        <main style={{ marginLeft: SIDEBAR_W, flex: 1, minHeight: "100vh", transition: `margin-left ${animDuration} ease`, background: C.bg }}>
          <div key={activePage} style={{ animation: settings.animationsOn ? "fadeUp .35s ease" : "none" }}>
            {renderPage(activePage)}
          </div>
        </main>

      </div>
    </>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppShell />
    </SettingsProvider>
  );
}