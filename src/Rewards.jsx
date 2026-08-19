import { useState } from "react";

const C = {
  bg: "#0A0B1A", surface: "#0F1128", card: "#141630", border: "#1E2245",
  accent: "#7C5CFC", accentSoft: "#9B7FFF", accentGlow: "rgba(124,92,252,0.18)",
  teal: "#38BDF8", tealGlow: "rgba(56,189,248,0.12)",
  success: "#34D399", warning: "#FBBF24", danger: "#F87171",
  gold: "#F59E0B", silver: "#94A3B8", bronze: "#CD7C2F",
  textPrimary: "#E8EAFF", textSecondary: "#8892B8", textMuted: "#4A5280",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes popIn{from{opacity:0;transform:scale(.88)}to{opacity:1;transform:scale(1)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes glow{0%,100%{box-shadow:0 0 8px rgba(124,92,252,.3)}50%{box-shadow:0 0 20px rgba(124,92,252,.6)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
`;

const LEVELS = [
  { level: 1,  title: "Beginner",       xpRequired: 0,    color: C.silver  },
  { level: 2,  title: "Focused",        xpRequired: 200,  color: C.teal    },
  { level: 3,  title: "Consistent",     xpRequired: 500,  color: C.success },
  { level: 4,  title: "Disciplined",    xpRequired: 1000, color: C.accentSoft },
  { level: 5,  title: "Flow State",     xpRequired: 2000, color: C.warning },
  { level: 6,  title: "Deep Worker",    xpRequired: 3500, color: C.gold    },
  { level: 7,  title: "Elite",          xpRequired: 5500, color: "#F472B6" },
  { level: 8,  title: "Legendary",      xpRequired: 8000, color: "#EF4444" },
];

const BADGES = [
  // Unlocked
  { id: 1,  name: "First Step",       desc: "Complete your first habit",          icon: "👣", color: C.teal,       unlocked: true,  xp: 50,   rarity: "Common"    },
  { id: 2,  name: "Early Bird",       desc: "Log in before 7 AM",                icon: "🌅", color: C.warning,    unlocked: true,  xp: 75,   rarity: "Common"    },
  { id: 3,  name: "Week Warrior",     desc: "Complete all habits for 7 days",    icon: "⚔️", color: C.accentSoft, unlocked: true,  xp: 200,  rarity: "Rare"      },
  { id: 4,  name: "Pomodoro Pro",     desc: "Complete 10 focus sessions",        icon: "🍅", color: C.danger,     unlocked: true,  xp: 150,  rarity: "Common"    },
  { id: 5,  name: "Journal Keeper",   desc: "Write 7 journal entries",           icon: "📖", color: C.success,    unlocked: true,  xp: 100,  rarity: "Common"    },
  { id: 6,  name: "Study Marathon",   desc: "Complete the 7-day study challenge",icon: "🧠", color: C.gold,       unlocked: true,  xp: 300,  rarity: "Epic"      },
  // Locked
  { id: 7,  name: "Deep Worker",      desc: "Complete 20 deep focus sessions",   icon: "🔒", color: C.textMuted,  unlocked: false, xp: 400,  rarity: "Rare"      },
  { id: 8,  name: "Digital Warrior",  desc: "Stay below screen-time limit 7 days",icon:"🔒", color: C.textMuted,  unlocked: false, xp: 350,  rarity: "Rare"      },
  { id: 9,  name: "Mood Master",      desc: "Log mood for 14 consecutive days",  icon: "🔒", color: C.textMuted,  unlocked: false, xp: 250,  rarity: "Uncommon"  },
  { id: 10, name: "Night Owl Slayer", desc: "Sleep before 10 PM for 5 days",    icon: "🔒", color: C.textMuted,  unlocked: false, xp: 300,  rarity: "Rare"      },
  { id: 11, name: "Centurion",        desc: "Reach a 100-day streak",            icon: "🔒", color: C.textMuted,  unlocked: false, xp: 1000, rarity: "Legendary" },
  { id: 12, name: "Elite Scholar",    desc: "Study 4+ hours for 30 days",       icon: "🔒", color: C.textMuted,  unlocked: false, xp: 800,  rarity: "Epic"      },
];

const RARITY_COLORS = {
  Common: C.textSecondary, Uncommon: C.success, Rare: C.teal, Epic: C.accentSoft, Legendary: C.gold,
};

const XP_ACTIONS = [
  { action: "Complete a habit",          xp: "+20 XP",  icon: "✅" },
  { action: "Finish a focus session",    xp: "+30 XP",  icon: "🍅" },
  { action: "Write a journal entry",     xp: "+25 XP",  icon: "✍️" },
  { action: "Hit daily goal",            xp: "+50 XP",  icon: "🎯" },
  { action: "7-day streak",             xp: "+100 XP", icon: "🔥" },
  { action: "Complete a challenge",      xp: "+200 XP", icon: "🏆" },
];

const CURRENT_XP = 875;

function getCurrentLevel() {
  let current = LEVELS[0];
  for (const l of LEVELS) {
    if (CURRENT_XP >= l.xpRequired) current = l;
  }
  return current;
}

function getNextLevel() {
  const idx = LEVELS.findIndex(l => l.level === getCurrentLevel().level);
  return LEVELS[idx + 1] || null;
}

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

function LevelCard() {
  const current = getCurrentLevel();
  const next = getNextLevel();
  const xpIntoLevel = CURRENT_XP - current.xpRequired;
  const xpNeeded = next ? next.xpRequired - current.xpRequired : 1;
  const pct = Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100));

  return (
    <div style={{
      background: `linear-gradient(135deg, #1a0e3a, #0d1535)`,
      border: `1px solid ${current.color}44`,
      borderRadius: 16, padding: 28, marginBottom: 16,
      animation: "fadeUp .4s ease",
      boxShadow: `0 0 32px ${current.color}11`,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: current.color, textTransform: "uppercase", marginBottom: 6 }}>Level {current.level}</div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 30, fontWeight: 700, color: C.textPrimary }}>{current.title}</div>
          <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>{CURRENT_XP.toLocaleString()} XP total</div>
        </div>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: `linear-gradient(135deg, ${current.color}33, ${current.color}11)`,
          border: `3px solid ${current.color}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 32, animation: "float 3s ease infinite",
          boxShadow: `0 0 20px ${current.color}33`,
        }}>
          {current.level <= 2 ? "🌱" : current.level <= 4 ? "⚡" : current.level <= 6 ? "🔥" : "👑"}
        </div>
      </div>

      {next && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.textSecondary, marginBottom: 8 }}>
            <span>Progress to <strong style={{ color: next.color }}>Level {next.level} — {next.title}</strong></span>
            <span style={{ color: current.color, fontWeight: 600 }}>{pct}%</span>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: C.border, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: pct + "%", borderRadius: 4,
              background: `linear-gradient(90deg, ${current.color}, ${next.color})`,
              transition: "width .8s ease",
            }} />
          </div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 8 }}>
            {(next.xpRequired - CURRENT_XP).toLocaleString()} XP to next level
          </div>
        </>
      )}
    </div>
  );
}

function BadgeGrid({ filter }) {
  const filtered = filter === "all" ? BADGES : filter === "unlocked" ? BADGES.filter(b => b.unlocked) : BADGES.filter(b => !b.unlocked);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
      {filtered.map((b, i) => (
        <div key={b.id} style={{
          background: b.unlocked ? C.surface : C.bg,
          border: `1px solid ${b.unlocked ? b.color + "55" : C.border}`,
          borderRadius: 14, padding: "16px 14px", textAlign: "center",
          animation: `popIn .4s ease ${i * 0.05}s both`,
          opacity: b.unlocked ? 1 : 0.5,
          transition: "all .2s",
          boxShadow: b.unlocked ? `0 0 12px ${b.color}22` : "none",
        }}>
          <div style={{ fontSize: 28, marginBottom: 8, animation: b.unlocked ? "float 3s ease infinite" : "none" }}>{b.icon}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: b.unlocked ? C.textPrimary : C.textMuted, marginBottom: 4 }}>{b.name}</div>
          <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 8, lineHeight: 1.4 }}>{b.unlocked ? b.desc : "???"}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: RARITY_COLORS[b.rarity], background: RARITY_COLORS[b.rarity] + "22", padding: "2px 8px", borderRadius: 10 }}>{b.rarity}</span>
            {b.unlocked && <span style={{ fontSize: 10, fontWeight: 600, color: C.gold, background: C.gold + "22", padding: "2px 8px", borderRadius: 10 }}>+{b.xp} XP</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function LevelRoadmap() {
  const current = getCurrentLevel();
  return (
    <div>
      {LEVELS.map((l, i) => {
        const done = CURRENT_XP >= l.xpRequired;
        const isCurrent = l.level === current.level;
        return (
          <div key={l.level} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
              background: done ? `linear-gradient(135deg,${l.color},${l.color}88)` : C.border,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: done ? "#fff" : C.textMuted,
              boxShadow: isCurrent ? `0 0 12px ${l.color}66` : "none",
              border: isCurrent ? `2px solid ${l.color}` : "2px solid transparent",
            }}>{l.level}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, fontWeight: isCurrent ? 700 : 500, color: done ? l.color : C.textMuted }}>{l.title}</span>
                <span style={{ fontSize: 12, color: C.textMuted }}>{l.xpRequired.toLocaleString()} XP</span>
              </div>
              {isCurrent && <div style={{ fontSize: 11, color: C.accentSoft, marginTop: 2 }}>← You are here</div>}
            </div>
            {done && !isCurrent && <span style={{ fontSize: 16 }}>✅</span>}
          </div>
        );
      })}
    </div>
  );
}

const TABS = ["Overview", "Badges", "Level Roadmap", "How to Earn XP"];

export default function Rewards() {
  const [tab, setTab] = useState("Overview");
  const [badgeFilter, setBadgeFilter] = useState("all");
  const unlockedCount = BADGES.filter(b => b.unlocked).length;
  const totalXpFromBadges = BADGES.filter(b => b.unlocked).reduce((s, b) => s + b.xp, 0);

  return (
    <>
      <style>{css}</style>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28, animation: "fadeUp .4s ease" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: C.accentSoft, textTransform: "uppercase", marginBottom: 6 }}>Your Progress</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Rewards & XP 🏆</h1>
          <p style={{ fontSize: 14, color: C.textSecondary }}>Every good habit earns you XP. Level up your life.</p>
        </div>

        {/* Level Card */}
        <LevelCard />

        {/* Quick Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
          {[
            { label: "Total XP",       value: CURRENT_XP.toLocaleString(), color: C.accentSoft, icon: "⭐" },
            { label: "Badges Earned",  value: `${unlockedCount}/${BADGES.length}`, color: C.gold,       icon: "🎖️" },
            { label: "Current Level",  value: getCurrentLevel().level,      color: C.teal,       icon: "🏅" },
            { label: "XP from Badges", value: totalXpFromBadges,            color: C.success,    icon: "✨" },
          ].map((s, i) => (
            <Card key={i} style={{ padding: 18, textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
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

        {/* Tab Content */}
        {tab === "Overview" && (
          <div>
            <Card style={{ marginBottom: 16 }}>
              <SectionLabel>Recently Unlocked</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {BADGES.filter(b => b.unlocked).slice(0, 3).map((b, i) => (
                  <div key={b.id} style={{
                    background: C.surface, border: `1px solid ${b.color}44`, borderRadius: 14,
                    padding: "16px 14px", textAlign: "center", animation: `popIn .4s ease ${i * 0.08}s both`,
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 6, animation: "float 3s ease infinite" }}>{b.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>{b.name}</div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.gold, background: C.gold + "22", padding: "2px 8px", borderRadius: 10 }}>+{b.xp} XP</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <SectionLabel>Next Badges to Unlock</SectionLabel>
              {BADGES.filter(b => !b.unlocked).slice(0, 3).map((b, i) => (
                <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: i < 2 ? 16 : 0 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🔒</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.textSecondary }}>{b.name}</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{b.desc}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.accentSoft }}>{b.xp} XP</div>
                    <div style={{ fontSize: 10, color: RARITY_COLORS[b.rarity], marginTop: 2 }}>{b.rarity}</div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {tab === "Badges" && (
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <SectionLabel>All Badges ({unlockedCount}/{BADGES.length})</SectionLabel>
              <div style={{ display: "flex", gap: 6 }}>
                {["all", "unlocked", "locked"].map(f => (
                  <button key={f} onClick={() => setBadgeFilter(f)} style={{
                    padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: badgeFilter === f ? 600 : 400,
                    background: badgeFilter === f ? C.accentGlow : "transparent",
                    border: `1px solid ${badgeFilter === f ? C.accent + "66" : C.border}`,
                    color: badgeFilter === f ? C.accentSoft : C.textMuted,
                    cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize",
                  }}>{f}</button>
                ))}
              </div>
            </div>
            <BadgeGrid filter={badgeFilter} />
          </Card>
        )}

        {tab === "Level Roadmap" && (
          <Card>
            <SectionLabel>Level Roadmap</SectionLabel>
            <LevelRoadmap />
          </Card>
        )}

        {tab === "How to Earn XP" && (
          <Card>
            <SectionLabel>How to Earn XP</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {XP_ACTIONS.map((a, i) => (
                <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, animation: `fadeUp .4s ease ${i * 0.06}s both` }}>
                  <span style={{ fontSize: 22 }}>{a.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: C.textSecondary }}>{a.action}</div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.gold, background: C.gold + "22", padding: "4px 10px", borderRadius: 10 }}>{a.xp}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, background: C.accentGlow, border: `1px solid ${C.accent}33`, borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.7 }}>
                💡 <strong style={{ color: C.accentSoft }}>Tip:</strong> Streaks multiply your XP — a 7-day streak gives a 2× bonus on all habits completed that week.
              </p>
            </div>
          </Card>
        )}

      </div>
    </>
  );
}