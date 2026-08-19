import { useState, useRef, useEffect } from "react";
import { useSettings } from "./SettingsContext";

const C = {
  bg: "#0A0B1A", surface: "#0F1128", card: "#141630", border: "#1E2245",
  accent: "#7C5CFC", accentSoft: "#9B7FFF", accentGlow: "rgba(124,92,252,0.18)",
  teal: "#38BDF8", success: "#34D399", warning: "#FBBF24", danger: "#F87171",
  textPrimary: "#E8EAFF", textSecondary: "#8892B8", textMuted: "#4A5280",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes popIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
`;

const SUGGESTED_PROMPTS = [
  "Why was I so unproductive today?",
  "Create a study routine based on my schedule",
  "Which habits should I prioritize this week?",
  "What if I reduce YouTube by 1 hour daily?",
  "How can I improve my productivity score?",
  "Analyze my biggest time wasters",
  "Give me a plan for exam season",
  "How do I build a better morning routine?",
];

const QUICK_ACTIONS = [
  { label: "Analyze my week",      prompt: "Give me a detailed analysis of my performance this week based on my data.",         icon: "📊" },
  { label: "Study plan",           prompt: "Create a personalized study plan for me based on my goals and schedule.",           icon: "📚" },
  { label: "Productivity tips",    prompt: "Give me 3 specific, actionable tips to improve my productivity score today.",       icon: "⚡" },
  { label: "Habit audit",          prompt: "Audit my current habits and tell me what to keep, improve, or drop.",              icon: "🎯" },
  { label: "Screen time advice",   prompt: "Analyze my screen time patterns and give me a specific reduction strategy.",       icon: "📱" },
  { label: "Motivation boost",     prompt: "I need motivation. Remind me why I'm doing this and what I'm building toward.",    icon: "🔥" },
];

function Spinner() {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "4px 0" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.accentSoft, animation: `pulse 1.2s ease ${i * 0.2}s infinite` }} />
      ))}
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 16, animation: "fadeUp .3s ease" }}>
      {!isUser && (
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${C.accent},${C.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginRight: 10, alignSelf: "flex-end" }}>
          🧠
        </div>
      )}
      <div style={{
        maxWidth: "72%", padding: "12px 16px", borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        background: isUser ? `linear-gradient(135deg,${C.accent},${C.teal})` : C.card,
        border: isUser ? "none" : `1px solid ${C.border}`,
        color: isUser ? "#fff" : C.textSecondary,
        fontSize: 14, lineHeight: 1.75,
        boxShadow: isUser ? `0 4px 16px ${C.accent}33` : "none",
      }}>
        {msg.content.split("\n").map((line, i) => (
          <span key={i}>{line}{i < msg.content.split("\n").length - 1 && <br />}</span>
        ))}
        {msg.timestamp && (
          <div style={{ fontSize: 10, color: isUser ? "rgba(255,255,255,.5)" : C.textMuted, marginTop: 6, textAlign: isUser ? "right" : "left" }}>
            {msg.timestamp}
          </div>
        )}
      </div>
      {isUser && (
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${C.accent},${C.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginLeft: 10, alignSelf: "flex-end" }}>
          Y
        </div>
      )}
    </div>
  );
}

export default function AICoach() {
  const { settings } = useSettings();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const name = settings?.name || "Yusuf";
  const occupation = settings?.occupation || "Medical Student";

  const SYSTEM_PROMPT = `You are EraSync AI Coach — an intelligent, personalized productivity and digital wellness coach embedded inside the EraSync app.

USER PROFILE:
- Name: ${name}
- Occupation: ${occupation}
- User type: ${settings?.userType || "Student"}
- Experience level: ${settings?.expLevel || "Intermediate"}
- Primary goals: ${(settings?.primaryGoals || []).join(", ")}
- In exam period: ${settings?.inExamPeriod ? "YES — be extra supportive and study-focused" : "No"}
- High stress: ${settings?.highStress ? "YES — suggest recovery and balance" : "No"}
- AI tone preference: ${settings?.aiTone || "Balanced"}

DAILY SCHEDULE:
- Wake time: ${settings?.wakeTime || "6:30 AM"}
- Study/work: ${settings?.studyStart || "8:00 AM"} – ${settings?.studyEnd || "5:00 PM"}
- Sleep time: ${settings?.sleepTime || "11:00 PM"}

GOALS & TARGETS:
- Study goal: ${settings?.studyGoal || 4}h/day
- Social media limit: ${settings?.socialLimit || 2}h/day
- Sleep goal: ${settings?.sleepGoal || 7}h/night
- Daily Pomodoro goal: ${settings?.pomodoroDaily || 4} sessions

TODAY'S DATA (approximate):
- Focus time: 4.2h
- Social media: 1.8h
- Productivity score: 72/100
- Mood: Focused
- Active streak: 14 days
- Pomodoro sessions: 3
- Goals completed: 3/6
- Active challenges: 7-Day Study Marathon (Day 5), Social Media Detox (Day 2)

YOUR ROLE:
- Be a sharp, specific, personalized coach — not a generic productivity bot
- Reference the user's actual data, goals and schedule in your responses
- Give actionable advice tailored to a ${occupation}
- Keep responses concise but substantive — no unnecessary padding
- Match tone to preference: ${settings?.aiTone || "Balanced"} (Motivational = encouraging, Balanced = honest + warm, Direct = straight facts)
- When asked about data, analyze it specifically
- When asked for plans, make them realistic and time-specific
- Never give generic advice that ignores the user's context`;

  useEffect(() => {
    // Welcome message
    const hour = new Date().getHours();
    const timeGreet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    setMessages([{
      role: "assistant",
      content: `${timeGreet}, ${name}! 👋\n\nI'm your EraSync AI Coach. I know your goals, your schedule, your streak, and your data — so I can give you real, specific advice instead of generic tips.\n\nYou're on a 14-day streak 🔥 and your productivity score today is 72. You've got 3 goals left to complete.\n\nWhat would you like to work on?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text) {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setShowSuggestions(false);

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { role: "user", content: msg, timestamp };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "I couldn't generate a response. Please try again.";
      setMessages([...newMessages, { role: "assistant", content: reply, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    } catch {
      setMessages([...newMessages, {
        role: "assistant",
        content: `Here's what I'd say based on your data:\n\nYou're on Day 5 of your Study Marathon with a 14-day streak — that's real momentum. Your 72 productivity score is solid but you have 3 goals left today. The highest-impact thing right now is finishing your remaining Pomodoro session before 9 PM.\n\n(Note: AI responses require an Anthropic API key to be configured.)`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function clearChat() {
    setMessages([{
      role: "assistant",
      content: `Chat cleared. What's on your mind, ${name}?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
    setShowSuggestions(true);
  }

  return (
    <>
      <style>{css}</style>
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: C.bg }}>

        {/* Header */}
        <div style={{ padding: "20px 28px 16px", borderBottom: `1px solid ${C.border}`, background: C.surface, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${C.accent},${C.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: `0 0 16px ${C.accent}44` }}>
                🧠
              </div>
              <div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: C.textPrimary }}>EraSync AI Coach</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.textMuted }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.success, display: "inline-block", animation: "pulse 2s infinite" }} />
                  Online · Knows your data
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ padding: "6px 12px", borderRadius: 20, background: settings?.inExamPeriod ? C.warning + "22" : C.accentGlow, border: `1px solid ${settings?.inExamPeriod ? C.warning + "44" : C.accent + "33"}`, fontSize: 12, fontWeight: 600, color: settings?.inExamPeriod ? C.warning : C.accentSoft }}>
                {settings?.inExamPeriod ? "📚 Exam mode" : `🔥 ${name} · 14-day streak`}
              </div>
              <button onClick={clearChat} style={{ padding: "6px 14px", borderRadius: 20, background: "transparent", border: `1px solid ${C.border}`, fontSize: 12, color: C.textMuted, cursor: "pointer", fontFamily: "inherit" }}>
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>

          {/* Quick actions */}
          {showSuggestions && messages.length <= 1 && (
            <div style={{ marginBottom: 24, animation: "fadeUp .4s ease" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.textMuted, textTransform: "uppercase", marginBottom: 12 }}>Quick Actions</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {QUICK_ACTIONS.map((a, i) => (
                  <button key={i} onClick={() => sendMessage(a.prompt)} style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
                    borderRadius: 10, background: C.surface, border: `1px solid ${C.border}`,
                    cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                    transition: "all .2s", animation: `popIn .3s ease ${i * 0.05}s both`,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent + "66"; e.currentTarget.style.background = C.card; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface; }}>
                    <span style={{ fontSize: 16 }}>{a.icon}</span>
                    <span style={{ fontSize: 12, color: C.textSecondary, fontWeight: 500 }}>{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => <Message key={i} msg={msg} />)}

          {/* Loading */}
          {loading && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${C.accent},${C.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🧠</div>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "16px 16px 16px 4px", padding: "12px 16px" }}>
                <Spinner />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggested prompts */}
        {!showSuggestions && messages.length > 1 && (
          <div style={{ padding: "0 28px 8px", flexShrink: 0 }}>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
              {SUGGESTED_PROMPTS.slice(0, 5).map((p, i) => (
                <button key={i} onClick={() => sendMessage(p)} style={{
                  padding: "6px 14px", borderRadius: 20, background: "transparent",
                  border: `1px solid ${C.border}`, color: C.textMuted, fontSize: 12,
                  cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                  transition: "all .2s", flexShrink: 0,
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.accentSoft; e.currentTarget.style.color = C.accentSoft; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div style={{ padding: "12px 28px 24px", borderTop: `1px solid ${C.border}`, background: C.surface, flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "4px 4px 4px 16px", display: "flex", alignItems: "flex-end", gap: 8, transition: "border-color .2s" }}
              onFocus={e => e.currentTarget.style.borderColor = C.accentSoft}
              onBlur={e => e.currentTarget.style.borderColor = C.border}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={`Ask me anything, ${name}… (Enter to send, Shift+Enter for new line)`}
                rows={1}
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  fontSize: 14, color: C.textPrimary, fontFamily: "inherit", resize: "none",
                  lineHeight: 1.6, padding: "8px 0", maxHeight: 120, overflowY: "auto",
                }}
                onInput={e => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
              />
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: input.trim() && !loading ? `linear-gradient(135deg,${C.accent},${C.teal})` : C.border,
                border: "none", cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                transition: "background .2s", marginBottom: 2,
              }}>→</button>
            </div>
          </div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 8, textAlign: "center" }}>
            EraSync AI · Powered by Claude · Responses use your real goals and settings
          </div>
        </div>

      </div>
    </>
  );
}