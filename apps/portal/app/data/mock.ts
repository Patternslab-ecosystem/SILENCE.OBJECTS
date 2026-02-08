// ─────────────────────────────────────────────────────────────
// SILENCE.OBJECTS — Portal Command Center Mock Data
// ─────────────────────────────────────────────────────────────

// Hero KPIs
export const SAFETY_STATUS = {
  tier1_safety: true,
  crisis_detection: true,
  forbidden_vocab_clean: true,
  compliance_score: 98,
  last_scan: "2 min ago",
};

export const SYSTEM_FLOW = {
  api_status: "healthy" as const,
  avg_response_ms: 1240,
  successful_flows_pct: 99.2,
  active_modules: 9,
  total_modules: 15,
  last_deploy: "configured",
};

export const MONETIZATION = {
  arr: 104000,
  mrr: 8667,
  mrr_trend: "+18%",
  paying_users: 89,
  conversion_rate: 12.8,
  free_users: 608,
};

// Health & Risk
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

// Agents & Structures
export const AGENT_CHAIN = [
  { step: "Input Validation", status: "ok" as const, latency_ms: 12 },
  { step: "Safety Middleware", status: "ok" as const, latency_ms: 45 },
  { step: "Claude API", status: "ok" as const, latency_ms: 1180 },
  { step: "Response Parse", status: "ok" as const, latency_ms: 8 },
  { step: "Storage", status: "ok" as const, latency_ms: 34 },
];

export const REPORTS_CONFIDENCE = [
  { name: "Context", avg_confidence: 0.87 },
  { name: "Tension", avg_confidence: 0.82 },
  { name: "Meaning", avg_confidence: 0.74 },
  { name: "Function", avg_confidence: 0.71 },
];

export const MODULE_STATUS = [
  { name: "contracts", status: "ready" as const, type: "open" as const },
  { name: "events", status: "ready" as const, type: "open" as const },
  { name: "core", status: "ready" as const, type: "open" as const },
  { name: "archetypes", status: "ready" as const, type: "open" as const },
  { name: "ui", status: "ready" as const, type: "open" as const },
  { name: "language", status: "ready" as const, type: "open" as const },
  { name: "validator", status: "ready" as const, type: "open" as const },
  { name: "voice", status: "ready" as const, type: "closed" as const },
  { name: "safety", status: "ready" as const, type: "closed" as const },
  { name: "symbolic", status: "planned" as const, type: "open" as const },
  { name: "ai", status: "planned" as const, type: "closed" as const },
  { name: "predictive", status: "planned" as const, type: "closed" as const },
  { name: "medical", status: "planned" as const, type: "closed" as const },
  { name: "legal", status: "planned" as const, type: "closed" as const },
  { name: "linkedin-agent", status: "planned" as const, type: "closed" as const },
];

// Business
export const PAYWALL_FUNNEL = [
  { step: "Paywall Shown", count: 1240, pct: 100 },
  { step: "CTA Clicked", count: 372, pct: 30 },
  { step: "Pro Page Viewed", count: 298, pct: 24 },
  { step: "Checkout Started", count: 89, pct: 7.2 },
  { step: "Checkout Completed", count: 62, pct: 5.0 },
];

export const REVENUE_PROJECTION = [
  { period: "M3", arr: 20000, users_paid: 50 },
  { period: "M6", arr: 120000, users_paid: 300 },
  { period: "M12", arr: 600000, users_paid: 1500 },
  { period: "M18", arr: 2500000, users_paid: 5000 },
];

// Ops
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
  last_deploy: { env: "production" as const, status: "success" as const, at: "configured" },
};

export const RECENT_EVENTS = [
  { time: "2 min ago", event: "PatternCreated", detail: "New object analyzed — Creator archetype", type: "info" as const },
  { time: "15 min ago", event: "ArchetypeShift", detail: "User #342: Explorer to Sage transition", type: "info" as const },
  { time: "1h ago", event: "CrisisDetected", detail: "Safety layer triggered — resources provided", type: "warn" as const },
  { time: "3h ago", event: "DeployCompleted", detail: "Portal v5.0 deployed to production", type: "success" as const },
  { time: "5h ago", event: "BuildPassed", detail: "All 3 apps built — Sentinel cleared", type: "success" as const },
];
