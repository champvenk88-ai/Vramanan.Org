"use client";
import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null); // null | "sending" | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });

        // Also track this as a visitor action
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: "/contact", source: "contact_form" }),
        }).catch(() => {});
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Connection issue. Please email Champvenk88@gmail.com directly.");
    }
  }

  if (status === "success") {
    return (
      <div style={{
        background: "var(--green-glow)", border: "1px solid rgba(45,80,22,.15)",
        borderRadius: "var(--radius)", padding: 40, textAlign: "center",
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--green-deep)", marginBottom: 8 }}>
          Message Received!
        </h3>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7 }}>
          Thank you for reaching out. V Ramanan will get back to you within 24 hours.
        </p>
        <button
          onClick={() => setStatus(null)}
          style={{
            marginTop: 20, padding: "10px 24px", borderRadius: 100,
            background: "var(--green-deep)", color: "white", border: "none",
            fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)",
          }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Your name"
        required
        style={inputStyle}
      />
      <input
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="Your email"
        required
        style={inputStyle}
      />
      <textarea
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        placeholder="Your message..."
        required
        style={{ ...inputStyle, minHeight: 140, resize: "vertical" }}
      />

      {status === "error" && (
        <div style={{ fontSize: 13, color: "#dc2626", padding: "8px 12px", background: "rgba(220,38,38,.05)", borderRadius: 8 }}>
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        style={{
          alignSelf: "flex-start", padding: "16px 36px", borderRadius: 100,
          fontSize: 15, fontWeight: 600, color: "white", border: "none",
          cursor: status === "sending" ? "wait" : "pointer",
          background: "var(--green-deep)", fontFamily: "var(--font-body)",
          opacity: status === "sending" ? 0.6 : 1,
          transition: "all .3s",
        }}
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

const inputStyle = {
  width: "100%", padding: "16px 20px", background: "var(--bg-cream)",
  border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
  color: "var(--text-dark)", fontSize: 15, fontFamily: "var(--font-body)",
  outline: "none", transition: "all .25s",
};
