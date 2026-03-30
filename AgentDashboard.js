"use client";
import { useState, useEffect } from "react";

export default function AgentDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch("/api/metrics");
        if (res.ok) {
          const data = await res.json();
          setMetrics(data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      }
    }
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const m = metrics || {
    visitorsTracked: "—",
    leadsCaptured: "—",
    agentsOnline: 7,
    postsCreated: "—",
    leadsFound: "—",
    ideasGenerated: "—",
    conversationsHandled: "—",
  };

  const agents = [
    { id: "MASTER", icon: "👁️", name: "Command & Monitor", desc: "Oversees all agents, monitors website health, tracks engagement, manages lead pipeline.", stat1: { label: "Visitors", value: m.visitorsTracked }, stat2: { label: "Leads", value: m.leadsCaptured }, wide: true },
    { id: "BRAND", icon: "📣", name: "Brand & PR Agent", desc: "Creates social media content, press releases, author bios, and brand messaging.", stat1: { label: "Posts created", value: m.postsCreated }, stat2: { label: "Status", value: "Active" } },
    { id: "SALES", icon: "🎯", name: "Sales & Marketing", desc: "Identifies leads, qualifies prospects, creates outreach campaigns.", stat1: { label: "Leads found", value: m.leadsFound }, stat2: { label: "Status", value: "Active" } },
    { id: "LEADS", icon: "📧", name: "Lead Capture Agent", desc: "Captures every inquiry and contact form submission. Responds within 60 seconds.", stat1: { label: "Captured", value: m.leadsCaptured }, stat2: { label: "Response", value: "<60s" } },
    { id: "SOCIAL", icon: "📱", name: "Social Media Agent", desc: "Manages Instagram, LinkedIn, YouTube, and X/Twitter content strategy.", stat1: { label: "Platforms", value: "4" }, stat2: { label: "Status", value: "Active" } },
    { id: "INNOVATE", icon: "💡", name: "Innovation Agent", desc: "Scans trends, suggests partnerships, identifies audiences, proposes campaigns.", stat1: { label: "Ideas", value: m.ideasGenerated }, stat2: { label: "Status", value: "Active" } },
    { id: "CHAT", icon: "💬", name: "Visitor Chatbot", desc: "The green 🌿 button. Answers visitor questions about books, author, and wellness — 24/7.", stat1: { label: "Conversations", value: m.conversationsHandled }, stat2: { label: "Status", value: "Active" } },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 48 }}>
      {agents.map((a) => (
        <div key={a.id} style={{
          background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)",
          borderRadius: "var(--radius)", padding: 28, transition: "all .3s",
          ...(a.wide ? { gridColumn: "1 / -1" } : {}),
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 10, background: a.id === "MASTER" ? "rgba(196,154,43,.15)" : "rgba(196,154,43,.1)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: a.id === "MASTER" ? 24 : 20,
              }}>{a.icon}</div>
              <div>
                <div style={{ fontSize: 10, color: "var(--gold)", fontWeight: 600, letterSpacing: 1 }}>{a.id}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-light)" }}>{a.name}</div>
              </div>
            </div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#34D399", boxShadow: "0 0 6px rgba(52,211,153,.5)" }} />
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.45)", lineHeight: 1.6 }}>{a.desc}</div>
          <div style={{ display: "flex", gap: 16, marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,.06)" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)" }}>
              <strong style={{ color: "var(--gold)", fontWeight: 700, fontSize: 16, display: "block", marginBottom: 2 }}>{a.stat1.value}</strong>
              {a.stat1.label}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)" }}>
              <strong style={{ color: "var(--gold)", fontWeight: 700, fontSize: 16, display: "block", marginBottom: 2 }}>{a.stat2.value}</strong>
              {a.stat2.label}
            </div>
            {a.wide && (
              <>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)" }}>
                  <strong style={{ color: "var(--gold)", fontWeight: 700, fontSize: 16, display: "block", marginBottom: 2 }}>{m.agentsOnline}</strong>
                  Agents online
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)" }}>
                  <strong style={{ color: "var(--gold)", fontWeight: 700, fontSize: 16, display: "block", marginBottom: 2 }}>99.9%</strong>
                  Uptime
                </div>
              </>
            )}
          </div>
        </div>
      ))}
      {error && (
        <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 16, fontSize: 12, color: "rgba(255,255,255,.3)" }}>
          Metrics loading... Agent system initializing.
        </div>
      )}
    </div>
  );
}
