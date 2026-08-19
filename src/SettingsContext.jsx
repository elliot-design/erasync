import { createContext, useContext, useState, useEffect } from "react";

const DEFAULT_SETTINGS = {
  // Profile
  name: "Yusuf",
  occupation: "Medical Student",
  ageRange: "18–24",
  avatarEmoji: "🧠",
  bio: "I'm building the life I want, one day at a time.",
  userType: "Student",
  primaryGoals: ["Study more effectively", "Build better habits", "Cut social media"],
  wakeTime: "06:30",
  studyStart: "08:00",
  studyEnd: "17:00",
  sleepTime: "23:00",
  expLevel: "Intermediate",
  inExamPeriod: false,
  highStress: false,
  trackSleep: true,
  timezone: "Africa/Lagos",
  weekStart: "Monday",

  // Goals
  studyGoal: 4,
  socialLimit: 2,
  sleepGoal: 7,
  exerciseGoal: 0.5,
  pomodoroDaily: 4,

  // Pomodoro
  focusDur: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  autoStartBreak: true,
  autoStartFocus: false,
  tickSound: false,
  bellSound: true,

  // Notifications
  pushEnabled: true,
  smartAlerts: true,
  goalReminders: true,
  moodReminder: true,
  weeklyReport: true,
  streakAlert: true,
  focusStart: false,
  socialWarning: true,
  achievementAlert: true,
  quietHours: true,
  quietStart: "22:00",
  quietEnd: "07:00",

  // Appearance
  accentColor: "#7C5CFC",
  accentSoft: "#9B7FFF",
  fontSize: "Medium",
  animationsOn: true,
  compactView: false,

  // Dashboard widgets
  widgets: {
    focusTime: true, productivity: true, socialMedia: true,
    aiInsight: true, weekChart: true, appUsage: true,
    goals: true, mood: true, challenge: true, streak: true,
  },

  // AI
  aiTone: "Balanced",
  aiContext: true,
  aiPredictions: true,
  aiCoach: true,
  insightFreq: "Daily",

  // Wind Down
  windDownOn: true,
  windDownTime: "21:30",
  windDownApps: { instagram: true, youtube: true, twitter: true, gaming: false },
  nightMode: true,

  // App Categories
  appCategories: {
    Instagram: "Social", YouTube: "Entertainment", WhatsApp: "Communication",
    "Twitter/X": "Social", Chrome: "Productivity", PUBG: "Gaming",
  },

  // Score weights
  scoreWeights: { focus: 30, goals: 25, habits: 20, social: 15, pomodoro: 10 },
};

function accentSoftFromColor(hex) {
  // Lighten the accent color slightly for soft variant
  const map = {
    "#7C5CFC": "#9B7FFF",
    "#38BDF8": "#7DD3FC",
    "#34D399": "#6EE7B7",
    "#F472B6": "#F9A8D4",
    "#FB923C": "#FDBA74",
    "#F87171": "#FCA5A5",
  };
  return map[hex] || hex;
}

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem("erasync_settings");
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [saved, setSaved] = useState(false);

  function updateSettings(updates) {
    setSettings(prev => ({ ...prev, ...updates }));
  }

  function saveSettings(updates) {
    const next = updates ? { ...settings, ...updates } : settings;
    // Auto-derive accentSoft from accentColor
    if (next.accentColor) next.accentSoft = accentSoftFromColor(next.accentColor);
    setSettings(next);
    try { localStorage.setItem("erasync_settings", JSON.stringify(next)); } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function resetSettings() {
    setSettings(DEFAULT_SETTINGS);
    try { localStorage.removeItem("erasync_settings"); } catch {}
  }

  // Apply accent color as CSS variable globally
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", settings.accentColor);
    document.documentElement.style.setProperty("--accent-soft", settings.accentSoft || accentSoftFromColor(settings.accentColor));
    document.body.style.fontSize = settings.fontSize === "Small" ? "13px" : settings.fontSize === "Large" ? "17px" : "15px";
  }, [settings.accentColor, settings.fontSize]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, saveSettings, resetSettings, saved }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}