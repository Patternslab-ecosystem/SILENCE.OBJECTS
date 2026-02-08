// ─────────────────────────────────────────────────────────────
// SILENCE.OBJECTS — Portal Command Center Mock Data v5.1
// 24-widget dashboard — ALL MOCK, replace with Supabase later
// Source: PORTAL_DASHBOARD_SPEC.md + INVESTOR.md + AGENTS.md
// ─────────────────────────────────────────────────────────────

// ═══════ BAND A: HERO KPIs ═══════

export const HERO_KPI = {
  arr: 104000,
  mrr: 8667,
  dau: 342,
  churn: 2.1,
  ltv_cac: 4.2,
  conversion: 12.8,
  runway_months: 18,
  nrr: 108,
};

export const SYSTEM_STATUS = {
  api_status: "operational" as const,
  edge_status: "operational" as const,
  serverless_status: "operational" as const,
  supabase_status: "operational" as const,
  n8n_status: "operational" as const,
  avg_response_ms: 1240,
  success_rate: 99.2,
  active_modules: 9,
  total_modules: 15,
  last_deploy: "2 min ago",
  last_commit: "e6f45c3",
  ci_status: "green" as const,
};

export const SAFETY_COMPLIANCE = {
  p0_crisis: { status: "active" as const, label: "3-layer crisis detection", pass_rate: 100 },
  p1_vocabulary: { status: "active" as const, label: "Forbidden vocab scan", violations_24h: 0 },
  p2_framing: { status: "active" as const, label: "Archetype framing rules", warnings_24h: 0 },
  compliance_score: 98,
  nuclear_events_24h: 0,
  language_violations_24h: 0,
  consent_logs_24h: 42,
  last_scan: "2 min ago",
};

// ═══════ BAND B: PRODUCT | AGENTS | EVENTS ═══════

export const APP_STATUS = [
  { name: "PatternLens", domain: "patternlens.app", status: "operational" as const, dau: 342, mau: 1820, sessions: 47, version: "0.5.2", success_rate: 99.2 },
  { name: "PatternsLab", domain: "patternslab.app", status: "operational" as const, dau: 28, mau: 156, sessions: 4, version: "0.2.0", success_rate: 98.1 },
  { name: "Portal", domain: "patternslab.app/portal", status: "operational" as const, dau: 3, mau: 8, sessions: 1, version: "5.1", success_rate: 100 },
];

export const MODULE_STATUS = [
  { name: "contracts", status: "ready" as const, type: "open" as const, edge: true, pricing: "MIT" },
  { name: "events", status: "ready" as const, type: "open" as const, edge: true, pricing: "MIT" },
  { name: "core", status: "ready" as const, type: "open" as const, edge: true, pricing: "MIT" },
  { name: "archetypes", status: "ready" as const, type: "open" as const, edge: true, pricing: "MIT" },
  { name: "symbolic", status: "ready" as const, type: "open" as const, edge: true, pricing: "MIT" },
  { name: "language", status: "ready" as const, type: "open" as const, edge: true, pricing: "MIT" },
  { name: "validator", status: "ready" as const, type: "open" as const, edge: true, pricing: "MIT" },
  { name: "ui", status: "ready" as const, type: "open" as const, edge: false, pricing: "MIT" },
  { name: "voice", status: "ready" as const, type: "closed" as const, edge: false, pricing: "Pro" },
  { name: "ai", status: "ready" as const, type: "closed" as const, edge: false, pricing: "Pro" },
  { name: "predictive", status: "planned" as const, type: "closed" as const, edge: false, pricing: "Enterprise" },
  { name: "safety", status: "ready" as const, type: "closed" as const, edge: true, pricing: "Pro" },
  { name: "medical", status: "planned" as const, type: "closed" as const, edge: false, pricing: "Enterprise" },
  { name: "legal", status: "planned" as const, type: "closed" as const, edge: false, pricing: "Enterprise" },
  { name: "linkedin-agent", status: "planned" as const, type: "closed" as const, edge: false, pricing: "Enterprise" },
];

export const ARCHETYPE_DISTRIBUTION = [
  { name: "Creator", pct: 18.2, count: 62 },
  { name: "Explorer", pct: 14.5, count: 50 },
  { name: "Sage", pct: 12.8, count: 44 },
  { name: "Hero", pct: 10.1, count: 35 },
  { name: "Ruler", pct: 9.4, count: 32 },
  { name: "Caregiver", pct: 8.7, count: 30 },
  { name: "Rebel", pct: 7.3, count: 25 },
  { name: "Magician", pct: 5.8, count: 20 },
  { name: "Lover", pct: 4.6, count: 16 },
  { name: "Jester", pct: 3.8, count: 13 },
  { name: "Innocent", pct: 2.9, count: 10 },
  { name: "Orphan", pct: 1.9, count: 5 },
];

export const AGENT_LAYERS = [
  {
    layer: 0, name: "Guardian", status: "active" as const,
    agents: ["Sentinel", "Content Guard", "Anomaly Detector"],
    cost: "$5.80/mo", tasks_day: 142,
  },
  {
    layer: 1, name: "Revenue Engine", status: "planned" as const,
    agents: ["Analytics Reporter", "Sales Autopilot", "Customer Success"],
    cost: "$92/mo (est)", tasks_day: 0,
  },
  {
    layer: 2, name: "Growth Army", status: "planned" as const,
    agents: ["LinkedIn Dominator", "Content Machine", "Social Swarm", "Growth Hacker", "Community Builder"],
    cost: "$100/mo (est)", tasks_day: 0,
  },
];

export const AGENT_PERFORMANCE = [
  { agent: "Sentinel", layer: 0, tasks: 142, kpi_impact: "P0 compliance", cost: "$2.40/mo", roi: "Safety-critical" },
  { agent: "Content Guard", layer: 0, tasks: 89, kpi_impact: "Vocabulary scan", cost: "$1.80/mo", roi: "Safety-critical" },
  { agent: "Anomaly Detector", layer: 0, tasks: 34, kpi_impact: "Anomaly alerts", cost: "$1.60/mo", roi: "Safety-critical" },
  { agent: "Analytics Reporter", layer: 1, tasks: 0, kpi_impact: "Revenue insights", cost: "$32/mo (est)", roi: "~10x" },
  { agent: "Sales Autopilot", layer: 1, tasks: 0, kpi_impact: "Lead conversion", cost: "$38/mo (est)", roi: "~15x" },
  { agent: "Customer Success", layer: 1, tasks: 0, kpi_impact: "Churn reduction", cost: "$22/mo (est)", roi: "~8x" },
];

export const AGENT_POLICY_ALERTS: Array<{ type: "info" | "warn" | "error"; agent: string; layer: number; severity: "low" | "medium" | "high"; message: string; time: string }> = [
  { type: "info", agent: "Sentinel", layer: 0, severity: "low", message: "Vocabulary scan completed — 0 violations", time: "2 min ago" },
  { type: "info", agent: "Content Guard", layer: 0, severity: "low", message: "Output scan cycle — all clean", time: "15 min ago" },
];

export const EVENTS_RATE = {
  events_per_min: 4.2,
  domain: {
    "object.created": 8, "object.analyzed": 30,
    "pattern.created": 22, "archetype.updated": 12,
    "prediction.generated": 4, "crisis.detected": 2,
    "risk.flag.raised": 3, "agent.run.completed": 8,
    "agent.run.failed": 0, "content.published": 2,
    "content.blocked": 1, "anomaly.detected": 1,
    "tenant.provisioned": 0, "subscription.changed": 1,
  },
  error_pct: 0.8,
  total_24h: 6048,
};

export const RECENT_EVENTS = [
  { time: "2 min ago", event: "pattern.created", detail: "New object analyzed — Creator archetype", type: "info" as const, module: "core", correlationId: "c-9f2a" },
  { time: "15 min ago", event: "archetype.updated", detail: "User #342: Explorer to Sage transition", type: "info" as const, module: "archetypes", correlationId: "c-8e1b" },
  { time: "1h ago", event: "crisis.detected", detail: "Safety layer triggered — resources provided", type: "warn" as const, module: "safety", correlationId: "c-7d0c" },
  { time: "3h ago", event: "agent.run.completed", detail: "Sentinel vocabulary scan — PASS", type: "success" as const, module: "safety", correlationId: "c-6c3d" },
  { time: "5h ago", event: "object.analyzed", detail: "Batch analysis — 12 objects processed", type: "info" as const, module: "core", correlationId: "c-5b2e" },
  { time: "8h ago", event: "content.blocked", detail: "Forbidden term detected in output", type: "warn" as const, module: "language", correlationId: "c-4a1f" },
  { time: "12h ago", event: "subscription.changed", detail: "User #128: Free → Pro upgrade", type: "success" as const, module: "ai", correlationId: "c-3900" },
  { time: "1d ago", event: "tenant.provisioned", detail: "New B2B tenant onboarded", type: "success" as const, module: "core", correlationId: "c-2811" },
];

export const EVENTS_CRISIS = {
  crisis_24h: 0,
  crisis_7d: 2,
  risk_high: 0,
  risk_medium: 1,
  risk_low: 1,
  avg_response_ms: 340,
};

// ═══════ BAND C: COMPLIANCE & SAFETY ═══════

export const COMPLIANCE_MATRIX = [
  { module: "contracts", p0: "ok" as const, p1: "ok" as const, p2: "ok" as const },
  { module: "events", p0: "ok" as const, p1: "ok" as const, p2: "ok" as const },
  { module: "core", p0: "ok" as const, p1: "ok" as const, p2: "ok" as const },
  { module: "archetypes", p0: "ok" as const, p1: "ok" as const, p2: "ok" as const },
  { module: "symbolic", p0: "ok" as const, p1: "ok" as const, p2: "ok" as const },
  { module: "language", p0: "ok" as const, p1: "ok" as const, p2: "ok" as const },
  { module: "validator", p0: "ok" as const, p1: "ok" as const, p2: "ok" as const },
  { module: "ui", p0: "ok" as const, p1: "ok" as const, p2: "ok" as const },
  { module: "voice", p0: "ok" as const, p1: "ok" as const, p2: "n/a" as const },
  { module: "ai", p0: "ok" as const, p1: "ok" as const, p2: "ok" as const },
  { module: "predictive", p0: "n/a" as const, p1: "n/a" as const, p2: "n/a" as const },
  { module: "safety", p0: "ok" as const, p1: "ok" as const, p2: "ok" as const },
  { module: "medical", p0: "n/a" as const, p1: "n/a" as const, p2: "n/a" as const },
  { module: "legal", p0: "n/a" as const, p1: "n/a" as const, p2: "n/a" as const },
  { module: "linkedin-agent", p0: "n/a" as const, p1: "n/a" as const, p2: "n/a" as const },
];

export const SAFETY_CRISIS_FEED = [
  { time: "3d ago", layer: 1, action: "block" as const, locale: "PL", detail: "Hard keyword detected — crisis resources shown" },
  { time: "5d ago", layer: 2, action: "banner" as const, locale: "EN", detail: "Soft keyword flagged — informational banner" },
];

export const LANGUAGE_GUARD = {
  blocked_per_1k: 0.3,
  false_positives: 0,
  edge_runtime: "active" as const,
  modules_scanned: ["ai", "linkedin-agent", "content-machine"],
};

// ═══════ BAND D: ARCHITECTURE & MODULES ═══════

export const ARCHITECTURE_LAYERS = [
  { name: "Edge (Vercel)", latency_ms: 12, status: "operational" as const },
  { name: "Thin Handler (API routes)", latency_ms: 45, status: "operational" as const },
  { name: "Domain Modules", latency_ms: 120, status: "operational" as const },
  { name: "Event Bus", latency_ms: 8, status: "operational" as const },
  { name: "Supabase", latency_ms: 35, status: "operational" as const },
];

export const MODULE_DETAIL = [
  { name: "contracts", level: "foundation", version: "1.0.0", events: ["object.created"], deps: [] },
  { name: "events", level: "foundation", version: "1.0.0", events: ["*"], deps: ["contracts"] },
  { name: "core", level: "foundation", version: "1.0.0", events: ["object.analyzed", "pattern.created"], deps: ["contracts", "events"] },
  { name: "archetypes", level: "domain", version: "0.8.0", events: ["archetype.updated"], deps: ["contracts", "core"] },
  { name: "symbolic", level: "domain", version: "0.6.0", events: ["pattern.created"], deps: ["contracts", "core"] },
  { name: "language", level: "foundation", version: "1.0.0", events: ["content.blocked"], deps: ["contracts"] },
  { name: "validator", level: "foundation", version: "1.0.0", events: [], deps: ["contracts"] },
  { name: "ui", level: "domain", version: "0.5.0", events: [], deps: ["contracts"] },
  { name: "voice", level: "closed", version: "0.3.0", events: ["object.analyzed"], deps: ["contracts", "core", "ai"] },
  { name: "ai", level: "closed", version: "0.5.0", events: ["prediction.generated"], deps: ["contracts", "core"] },
  { name: "safety", level: "closed", version: "1.0.0", events: ["crisis.detected", "risk.flag.raised"], deps: ["contracts", "language"] },
];

export const DATA_LAYER = {
  tenant_count: 1,
  events_per_day: 6048,
  kpi_freshness_lag: "< 5 min",
  rls_violations: 0,
  tables: ["tenants", "objects", "patterns", "archetypes", "events", "kpi_daily", "kpi_weekly", "nuclear_events", "language_violations", "agent_policies", "agent_logs"],
};

// ═══════ BAND E: INVESTOR & BUSINESS ═══════

export const REVENUE_PROJECTION = [
  { period: "M3", arr: 20000, users_paid: 50 },
  { period: "M6", arr: 120000, users_paid: 300 },
  { period: "M12", arr: 600000, users_paid: 1500 },
  { period: "M18", arr: 2500000, users_paid: 5000 },
];

export const UNIT_ECONOMICS = [
  { tier: "FREE", price: 0, hosting: 0, ai_compute: 0, storage: 0, margin_pct: 0, ltv: 0, cac: 0 },
  { tier: "PRO", price: 9.99, hosting: 0.50, ai_compute: 1.20, storage: 0.30, margin_pct: 80, ltv: 120, cac: 28 },
  { tier: "ENTERPRISE", price: 49, hosting: 2, ai_compute: 8, storage: 2, margin_pct: 75, ltv: 980, cac: 180 },
];

export const REVENUE_TARGETS = [
  { period: "M3", target_free: 500, target_paid: 50, target_b2b: 0, target_arr: 20000, actual_free: 342, actual_paid: 0, actual_b2b: 0, actual_arr: 0 },
  { period: "M6", target_free: 5000, target_paid: 300, target_b2b: 2, target_arr: 120000, actual_free: null, actual_paid: null, actual_b2b: null, actual_arr: null },
  { period: "M12", target_free: 25000, target_paid: 1500, target_b2b: 5, target_arr: 600000, actual_free: null, actual_paid: null, actual_b2b: null, actual_arr: null },
  { period: "M18", target_free: 100000, target_paid: 5000, target_b2b: 20, target_arr: 2500000, actual_free: null, actual_paid: null, actual_b2b: null, actual_arr: null },
];

// ═══════ BAND F: OPS & DEPLOYMENT ═══════

export const OPS_SERVICES = [
  { name: "Vercel (Portal)", status: "operational" as const, last_deploy: "2 min ago" },
  { name: "Vercel (PatternLens)", status: "operational" as const, last_deploy: "2 min ago" },
  { name: "Vercel (PatternsLab)", status: "operational" as const, last_deploy: "2 min ago" },
  { name: "Supabase", status: "operational" as const, last_deploy: "active" },
  { name: "Hetzner / n8n", status: "operational" as const, last_deploy: "configured" },
  { name: "Stripe", status: "operational" as const, last_deploy: "configured" },
  { name: "Cloudflare", status: "operational" as const, last_deploy: "active" },
  { name: "Sentry", status: "operational" as const, last_deploy: "configured" },
];

export const ORCHESTRATOR_RULES = [
  { rule: "IF Sentry errors > 5/hr → PAUSE Layer 2", last_triggered: "never", triggers_7d: 0, type: "safety" as const },
  { rule: "IF churn > 5% → BOOST CS, PAUSE outbound", last_triggered: "never", triggers_7d: 0, type: "revenue" as const },
  { rule: "IF platform ban signal → KILL channel 48h", last_triggered: "never", triggers_7d: 0, type: "safety" as const },
  { rule: "IF revenue growing > 10% WoW → UNLOCK higher aggression", last_triggered: "never", triggers_7d: 0, type: "growth" as const },
];

export const BUILD_ORDER = [
  {
    phase: "Phase 0: Foundation", progress: 85,
    items: [
      { name: "contracts", status: "done" as const },
      { name: "events", status: "done" as const },
      { name: "core", status: "wip" as const },
      { name: "safety", status: "done" as const },
      { name: "Vercel fix", status: "wip" as const },
      { name: "Sentinel", status: "planned" as const },
    ],
  },
  {
    phase: "Phase 1: Revenue", progress: 20,
    items: [
      { name: "archetypes", status: "wip" as const },
      { name: "validator/language", status: "wip" as const },
      { name: "Analytics Reporter", status: "planned" as const },
      { name: "Sales Autopilot", status: "planned" as const },
      { name: "Customer Success", status: "planned" as const },
    ],
  },
  {
    phase: "Phase 2: Apps Integration", progress: 5,
    items: [
      { name: "portal", status: "wip" as const },
      { name: "PatternLens integration", status: "planned" as const },
      { name: "PatternsLab integration", status: "planned" as const },
      { name: "LinkedIn P1", status: "planned" as const },
      { name: "Content P1", status: "planned" as const },
    ],
  },
  {
    phase: "Phase 3: Scale", progress: 0,
    items: [
      { name: "ai", status: "planned" as const },
      { name: "predictive", status: "planned" as const },
      { name: "voice", status: "planned" as const },
      { name: "full Growth Army", status: "planned" as const },
      { name: "npm publish", status: "planned" as const },
      { name: "App Store", status: "planned" as const },
    ],
  },
];

export const CI_CD_STATUS = {
  sentinel_vocabulary: { status: "pass" as const, last_run: "configured" },
  sentinel_build: { status: "pass" as const, last_run: "configured" },
  sentinel_contracts: { status: "pass" as const, last_run: "configured" },
  last_deploy: { env: "production" as const, status: "success" as const, at: "2 min ago" },
};
