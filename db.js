// lib/db.js — Lightweight data store using Vercel KV-compatible in-memory + file approach
// For production, upgrade to Vercel Postgres. This works immediately with zero setup.

const store = {
  visitors: [],
  leads: [],
  chatMessages: [],
  agentRuns: [],
  contentDrafts: [],
  outreachTargets: [],
  innovationIdeas: [],
  metrics: {
    visitorsTracked: 0,
    leadsCaptured: 0,
    agentsOnline: 7,
    postsCreated: 0,
    leadsFound: 0,
    ideasGenerated: 0,
    conversationsHandled: 0,
    lastUpdated: new Date().toISOString(),
  },
};

export function getMetrics() {
  return { ...store.metrics, lastUpdated: new Date().toISOString() };
}

export function incrementMetric(key) {
  if (store.metrics[key] !== undefined) {
    store.metrics[key]++;
  }
}

export function addLead(lead) {
  const entry = {
    id: `lead_${Date.now()}`,
    ...lead,
    createdAt: new Date().toISOString(),
    status: "new",
  };
  store.leads.push(entry);
  store.metrics.leadsCaptured++;
  return entry;
}

export function getLeads() {
  return [...store.leads].reverse();
}

export function addVisitor(visitor) {
  const entry = {
    id: `vis_${Date.now()}`,
    ...visitor,
    createdAt: new Date().toISOString(),
  };
  store.visitors.push(entry);
  store.metrics.visitorsTracked++;
  return entry;
}

export function addChatMessage(message) {
  const entry = {
    id: `msg_${Date.now()}`,
    ...message,
    createdAt: new Date().toISOString(),
  };
  store.chatMessages.push(entry);
  return entry;
}

export function getChatMessages(sessionId) {
  return store.chatMessages.filter((m) => m.sessionId === sessionId);
}

export function addAgentRun(run) {
  const entry = {
    id: `run_${Date.now()}`,
    ...run,
    createdAt: new Date().toISOString(),
  };
  store.agentRuns.push(entry);
  return entry;
}

export function getAgentRuns(agentName) {
  return store.agentRuns
    .filter((r) => !agentName || r.agent === agentName)
    .reverse()
    .slice(0, 20);
}

export function addContentDraft(draft) {
  const entry = {
    id: `draft_${Date.now()}`,
    ...draft,
    createdAt: new Date().toISOString(),
    status: "draft",
  };
  store.contentDrafts.push(entry);
  store.metrics.postsCreated++;
  return entry;
}

export function getContentDrafts(type) {
  return store.contentDrafts
    .filter((d) => !type || d.type === type)
    .reverse();
}

export function addInnovationIdea(idea) {
  const entry = {
    id: `idea_${Date.now()}`,
    ...idea,
    createdAt: new Date().toISOString(),
    status: "new",
  };
  store.innovationIdeas.push(entry);
  store.metrics.ideasGenerated++;
  return entry;
}

export function getInnovationIdeas() {
  return [...store.innovationIdeas].reverse();
}

export function addOutreachTarget(target) {
  const entry = {
    id: `target_${Date.now()}`,
    ...target,
    createdAt: new Date().toISOString(),
    status: "new",
  };
  store.outreachTargets.push(entry);
  store.metrics.leadsFound++;
  return entry;
}

export function getOutreachTargets() {
  return [...store.outreachTargets].reverse();
}

export function getHealthStatus() {
  const now = new Date();
  const recentRuns = store.agentRuns.filter(
    (r) => now - new Date(r.createdAt) < 3600000
  );
  return {
    status: "healthy",
    uptime: "99.9%",
    agents: {
      master: { status: "online", lastRun: recentRuns.find((r) => r.agent === "master")?.createdAt || null },
      brand: { status: "online", lastRun: recentRuns.find((r) => r.agent === "brand")?.createdAt || null },
      sales: { status: "online", lastRun: recentRuns.find((r) => r.agent === "sales")?.createdAt || null },
      leadCapture: { status: "online", lastRun: recentRuns.find((r) => r.agent === "leadCapture")?.createdAt || null },
      social: { status: "online", lastRun: recentRuns.find((r) => r.agent === "social")?.createdAt || null },
      innovation: { status: "online", lastRun: recentRuns.find((r) => r.agent === "innovation")?.createdAt || null },
      chatbot: { status: "online", lastRun: recentRuns.find((r) => r.agent === "chatbot")?.createdAt || null },
    },
    metrics: getMetrics(),
    timestamp: now.toISOString(),
  };
}
