// ─────────────────────────────────────────────────────────────
// SILENCE.OBJECTS — Portal Command Center Mock Data v5.0
// 24-widget dashboard — ALL MOCK, replace with Supabase later
// ─────────────────────────────────────────────────────────────

// ═══════ BAND A: HERO KPIs ═══════

export const HERO_KPI = {
  arr: 104000,
  mrr: 8667,
  dau: 342,
  churn: 2.1,
  ltv_cac: 4.2,
  runway_months: 18,
};

export const SYSTEM_STATUS = {
  api_status: "operational" as const,
  avg_response_ms: 1240,
  success_rate: 99.2,
  active_modules: 9,
  total_modules: 15,
  last_deploy: "2 min ago",
  last_commit: "f40aebc",
  ci_status: "green" as const,
};

export const SAFETY_COMPLIANCE = {
  p0_crisis: { status: "active" as const, label: "3-layer crisis detection" },
  p1_vocabulary: { status: "active" as const, label: "Forbidden vocab scan" },
  p2_framing: { status: "active" as const, label: "Archetype framing rules" },
  compliance_score: 98,
  last_scan: "2 min ago",
};

// ═══════ BAND B: PRODUCT | AGENTS | EVENTS ═══════

export const MODULE_STATUS = [
  { name: "contracts", status: "ready" as const, type: "open" as const },
  { name: "events", status: "ready" as const, type: "open" as const },
  { name: "core", status: "ready" as const, type: "open" as const },
  { name: "archetypes", status: "ready" as const, type: "open" as const },
  { name: "symbolic", status: "ready" as const, type: "open" as const },
  { name: "language", status: "ready" as const, type: "open" as const },
  { name: "validator", status: "ready" as const, type: "open" as const },
  { name: "ui", status: "ready" as const, type: "open" as const },
  { name: "voice", status: "ready" as const, type: "closed" as const },
  { name: "ai", status: "ready" as const, type: "closed" as const },
  { name: "predictive", status: "planned" as const, type: "closed" as const },
  { name: "safety", status: "ready" as const, type: "closed" as const },
  { name: "medical", status: "planned" as const, type: "closed" as const },
  { name: "legal", status: "planned" as const, type: "closed" as const },
  { name: "linkedin-agent", status: "planned" as const, type: "closed" as const },
];

export const AGENT_LAYERS = [
  {
    layer: 0, name: "Guardian", status: "active" as const,
    agents: ["Sentinel", "Content Guard", "Anomaly Detector"],
    cost: "$5.80/mo",
  },
  {
    layer: 1, name: "Revenue Engine", status: "planned" as const,
    agents: ["Analytics Reporter", "Sales Autopilot", "Customer Success"],
    cost: "$92/mo (est)",
  },
  {
    layer: 2, name: "Growth Army", status: "planned" as const,
    agents: ["LinkedIn Dominator", "Content Machine", "Social Swarm", "Growth Hacker"],
    cost: "$100/mo (est)",
  },
];

export const EVENTS_RATE = {
  events_per_min: 4.2,
  domain: { "object.analyzed": 38, "pattern.created": 34, "archetype.updated": 12, "crisis.detected": 2 },
  total_24h: 6048,
};

export const RECENT_EVENTS = [
  { time: "2 min ago", event: "pattern.created", detail: "New object analyzed — Creator archetype", type: "info" as const },
  { time: "15 min ago", event: "archetype.updated", detail: "User #342: Explorer to Sage transition", type: "info" as const },
  { time: "1h ago", event: "crisis.detected", detail: "Safety layer triggered — resources provided", type: "warn" as const },
  { time: "3h ago", event: "agent.run.completed", detail: "Sentinel vocabulary scan — PASS", type: "success" as const },
  { time: "5h ago", event: "object.analyzed", detail: "Batch analysis — 12 objects processed", type: "info" as const },
];

// ═══════ BAND C: COMPLIANCE & SAFETY ═══════

export const SAFETY_LAYERS = [
  { name: "Hard Keywords (PL/EN)", status: "ok" as const, last_test: "2 min ago" },
  { name: "Soft Keywords Risk Assessment", status: "ok" as const, last_test: "5 min ago" },
  { name: "Risk Score Block/Banner/Proceed", status: "ok" as const, last_test: "2 min ago" },
];

export const CRISIS_DATA = {
  incidents_24h: 0,
  incidents_7d: 2,
  forbidden_violations_24h: 0,
  copy_compliance_score: 98,
};

// ═══════ BAND E: INVESTOR & BUSINESS ═══════

export const REVENUE_PROJECTION = [
  { period: "M3", arr: 20000, users_paid: 50 },
  { period: "M6", arr: 120000, users_paid: 300 },
  { period: "M12", arr: 600000, users_paid: 1500 },
  { period: "M18", arr: 2500000, users_paid: 5000 },
];

export const PAYWALL_FUNNEL = [
  { step: "Paywall Shown", count: 1240, pct: 100 },
  { step: "CTA Clicked", count: 372, pct: 30 },
  { step: "Pro Page Viewed", count: 298, pct: 24 },
  { step: "Checkout Started", count: 89, pct: 7.2 },
  { step: "Checkout Completed", count: 62, pct: 5.0 },
];

// ═══════ BAND F: OPS & DEPLOYMENT ═══════

export const PHASE_PROGRESS = [
  { name: "Phase 0: Foundation", progress: 85, status: "active" as const },
  { name: "Phase 1: Revenue", progress: 20, status: "active" as const },
  { name: "Phase 2: Apps Integration", progress: 5, status: "planned" as const },
  { name: "Phase 3: Scale", progress: 0, status: "planned" as const },
];

export const CI_CD_STATUS = {
  sentinel_vocabulary: { status: "pass" as const, last_run: "configured" },
  sentinel_build: { status: "pass" as const, last_run: "configured" },
  sentinel_contracts: { status: "pass" as const, last_run: "configured" },
  last_deploy: { env: "production" as const, status: "success" as const, at: "2 min ago" },
};
