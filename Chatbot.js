"use client";
import { useState, useRef, useEffect } from "react";

const QUICK_REPLIES = {
  books: "V Ramanan has published two editions of \"Nature Rituals: Emotional Recipes for Children\" — the world's first cookbook organized by a child's emotional state. It maps 15 core emotions like courage, anxiety, grief, and love to nature-based rituals. Published through American Publishers Inc. in 6×9 paperback format, perfect for parents with children ages 4-13. 🌿",
  emotions: "The books map 15 core emotions:\n\n🛡️ Courage · 😰 Anxiety · 😢 Grief · 😤 Anger · 💚 Kindness · 😔 Loneliness · 🌱 Self-Worth · 💪 Resilience · 🫂 Empathy · 😨 Fear · 🙏 Gratitude · 💚 Jealousy · ⏳ Patience · 😊 Honesty · ❤️ Love\n\nEach emotion is paired with nature-based rituals, earth breathing techniques, and seasonal activities.",
  contact: "You can reach V Ramanan at:\n\n📧 Email: Champvenk88@gmail.com\n💼 LinkedIn: linkedin.com/in/venkata-ramanan-22419247\n🌐 Website: vramanan.org\n\nOr use the contact form on this page!",
  author: "V Ramanan is a Toronto-based children's book author who writes at the intersection of nature, emotional wellness, and family connection. His journey started with a walk in Stan Wadlow Park with his son — a question his son asked that he couldn't answer with words. So he wrote him a book instead. 🌱",
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! 🌿 I'm V Ramanan's assistant. I can tell you about his books, his journey, or how nature-based emotional wellness can help your child. What would you like to know?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const msgEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text) {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setShowSuggestions(false);
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setLoading(true);

    // Track conversation
    fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ page: "/chat", source: "chatbot" }) }).catch(() => {});

    // Try quick match first
    const lower = msg.toLowerCase();
    let reply = null;

    if (lower.includes("book") || lower.includes("nature ritual")) reply = QUICK_REPLIES.books;
    else if (lower.includes("emotion") || lower.includes("feeling")) reply = QUICK_REPLIES.emotions;
    else if (lower.includes("contact") || lower.includes("reach") || lower.includes("email")) reply = QUICK_REPLIES.contact;
    else if (lower.includes("who") || lower.includes("author") || lower.includes("ramanan") || lower.includes("about")) reply = QUICK_REPLIES.author;

    if (!reply) {
      // Call server-side AI
      try {
        const apiMessages = [...messages.filter(m => m.role !== "bot").map(m => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.text,
        })), { role: "user", content: msg }];

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages, sessionId: `chat_${Date.now()}` }),
        });

        if (res.ok) {
          const data = await res.json();
          reply = data.reply;
        } else {
          reply = "I'm here! Please try again, or contact Champvenk88@gmail.com directly.";
        }
      } catch {
        reply = "A brief pause — please try again, or email Champvenk88@gmail.com directly.";
      }
    }

    setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    setLoading(false);
    inputRef.current?.focus();
  }

  return (
    <>
      <button
        onClick={() => { setOpen(!open); if (!open) setTimeout(() => inputRef.current?.focus(), 300); }}
        style={{
          position: "fixed", bottom: 28, right: 28, width: 60, height: 60,
          borderRadius: "50%", background: open ? "var(--earth)" : "var(--green-deep)",
          border: "none", color: "white", fontSize: 26, cursor: "pointer", zIndex: 999,
          boxShadow: "0 4px 20px rgba(45,80,22,.4)", transition: "all .3s",
          animation: open ? "none" : "pulseRing 2s infinite",
        }}
      >
        {open ? "✕" : "🌿"}
      </button>

      {open && (
        <div style={{
          position: "fixed", bottom: 100, right: 28, width: 380, maxHeight: 520,
          background: "white", borderRadius: 20, boxShadow: "0 16px 60px rgba(0,0,0,.15)",
          zIndex: 998, display: "flex", flexDirection: "column", overflow: "hidden",
          animation: "chatPop .3s ease",
        }}>
          {/* Header */}
          <div style={{
            background: "var(--green-deep)", padding: "18px 20px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,.15)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>🌿</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "white" }}>V Ramanan&apos;s Assistant</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)" }}>Ask me anything about the books</div>
            </div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#34D399", boxShadow: "0 0 6px rgba(52,211,153,.5)" }} />
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: 16, maxHeight: 340 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: 12, display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "80%", padding: "10px 14px", borderRadius: 14,
                  fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap",
                  ...(m.role === "user"
                    ? { background: "var(--green-deep)", color: "white", borderBottomRightRadius: 4 }
                    : { background: "var(--bg-cream)", color: "var(--text-body)", borderBottomLeftRadius: 4 }),
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex" }}>
                <div style={{ background: "var(--bg-cream)", padding: "12px 16px", borderRadius: 14, borderBottomLeftRadius: 4 }}>
                  <span className="chat-dot" /><span className="chat-dot" /><span className="chat-dot" />
                </div>
              </div>
            )}
            <div ref={msgEndRef} />
          </div>

          {/* Suggestions */}
          {showSuggestions && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "0 16px 12px" }}>
              {["About the books", "Emotions covered", "Contact author", "Who is V Ramanan?"].map((s) => (
                <button key={s} onClick={() => send(s)} style={{
                  padding: "6px 12px", borderRadius: 100, background: "var(--green-glow)",
                  border: "1px solid rgba(45,80,22,.1)", color: "var(--green-deep)",
                  fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)",
                  transition: "all .2s",
                }}>{s}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ display: "flex", gap: 8, padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              disabled={loading}
              placeholder="Ask me anything..."
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)",
                fontSize: 13, fontFamily: "var(--font-body)", outline: "none", background: "var(--bg-cream)",
              }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              style={{
                width: 36, height: 36, borderRadius: 10, background: "var(--green-deep)",
                border: "none", color: "white", cursor: "pointer", fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: input.trim() && !loading ? 1 : 0.4,
              }}
            >➤</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulseRing{0%{box-shadow:0 0 0 0 rgba(45,80,22,.4)}70%{box-shadow:0 0 0 12px rgba(45,80,22,0)}100%{box-shadow:0 0 0 0 rgba(45,80,22,0)}}
        @keyframes chatPop{from{opacity:0;transform:scale(.8) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes dotBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}
        .chat-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--green-deep);margin:0 3px}
        .chat-dot:nth-child(1){animation:dotBounce 1.2s infinite 0s}
        .chat-dot:nth-child(2){animation:dotBounce 1.2s infinite .15s}
        .chat-dot:nth-child(3){animation:dotBounce 1.2s infinite .3s}
        @media(max-width:768px){
          .chat-window-override{width:calc(100vw - 32px)!important;right:16px!important;bottom:90px!important}
        }
      `}</style>
    </>
  );
}
