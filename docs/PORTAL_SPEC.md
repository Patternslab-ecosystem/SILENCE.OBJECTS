# PORTAL DASHBOARD SPEC — SILENCE.OBJECTS Control Tower
# ═══════════════════════════════════════════════════════
# Companion doc for MEGA NUCLEAR v5 M2D
# This file goes to: docs/PORTAL_SPEC.md
# Implementation target: apps/portal/app/page.tsx
# ═══════════════════════════════════════════════════════

## 1. GLOBAL LAYOUT

### Desktop (3 columns, F-pattern)

First viewport (no scroll):

```
┌──────────────────────────────────────────────────────────────────────┐
│  PASEK A: HERO KPIs & SYSTEM STATUS (full width)                    │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────────┐ │
│  │ hero_kpi_overview │ │ hero_system_     │ │ hero_safety_         │ │
│  │ ARR/MRR/runway/  │ │ status           │ │ compliance_status    │ │
│  │ DAU/churn/NRR    │ │ Build/Deploy/    │ │ P0/P1/P2 alerts      │ │
│  │                  │ │ Edge/Serverless  │ │ nuclear_events 24h   │ │
│  └──────────────────┘ └──────────────────┘ └──────────────────────┘ │
├──────────────────────────────────────────────────────────────────────┤
│  PASEK B: PRODUCT / AGENTS / EVENTS (3 columns)                     │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────────┐ │
│  │ Col 1: PRODUCT   │ │ Col 2: AGENTS    │ │ Col 3: EVENTS        │ │
│  │ App status cards │ │ Layer 0/1/2      │ │ Event rate + feed    │ │
│  │ Module activation│ │ Agent performance│ │ Crisis alerts        │ │
│  │ Archetype dist.  │ │ Policy alerts    │ │ Anomalies            │ │
│  └──────────────────┘ └──────────────────┘ └──────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

Below fold (scroll):

```
PASEK C: Compliance & Safety ──── compliance_matrix + safety_crisis_feed + language_guard
PASEK D: Architecture & Modules ─ layer_overview + module_detail + data_layer_kpi
PASEK E: Investor & Business ──── kpi_timeline + unit_economics + revenue_targets
PASEK F: Ops & Deployment ─────── deployment_status + orchestrator_rules + build_order
```

### Mobile (1 column, Z-pattern vertical)

1. Hero KPIs (sticky, horizontal scroll cards)
2. Product & Apps
3. Agents & Events
4. Compliance & Safety
5. Architecture & Modules
6. Investor & Ops

### CSS Grid

```css
/* Desktop */
.portal-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px; }
.hero-strip { grid-column: 1 / -1; display: grid; grid-template-columns: 5fr 4fr 3fr; gap: 24px; }
.three-col { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.full-strip { grid-column: 1 / -1; }

/* Mobile */
@media (max-width: 768px) {
  .portal-grid, .hero-strip, .three-col { grid-template-columns: 1fr; gap: 16px; }
}
```

## 2. WIDGET CATALOG (24 widgets)

### Format: ID | Type | Business Question | Data Source | Metrics | Interactions

---

### HERO / GLOBAL (Pasek A)

#### W1: hero_kpi_overview
- **Type:** KPI grid (numbers)
- **Question:** "Jaki jest aktualny stan biznesu?"
- **Source:** kpi_daily, kpi_weekly (Supabase) | Mock: INVESTOR.md
- **Metrics:** ARR, MRR, DAU, churn %, LTV/CAC, conversion free→paid %, runway (months), NRR %
- **Mock values:** ARR 104k PLN, MRR 8,667, DAU 342, churn 2.1%, LTV/CAC 4.2x, conversion 12.8%, runway 18mo, NRR 108%
- **Interactions:** Time filter (1mo/1q/1y), drill-down → W19 business_kpi_timeline
- **Tailwind:** grid grid-cols-4 gap-3, each: bg-[#111113] border border-[#222228] rounded-xl p-4
- **Label font:** font-mono text-[10px] uppercase tracking-[0.15em] text-[#888893]
- **Value font:** font-mono text-2xl font-bold text-[#e8e8ec]

#### W2: hero_system_status
- **Type:** Status summary (badges + list)
- **Question:** "Czy framework i kluczowe systemy działają?"
- **Source:** /api/health endpoint, CI status, Sentry
- **Metrics:** Edge status, Serverless status, Supabase ping, n8n status, latest deploy commit, CI green/red
- **Mock values:** All "operational", commit: latest, CI: green
- **Interactions:** Click → W22 ops_deployment_status
- **Badges:** operational=bg-[#3d9970]/10 text-[#3d9970], degraded=bg-[#d4a843]/10 text-[#d4a843], down=bg-[#cc4444]/10 text-[#cc4444]

#### W3: hero_safety_compliance_status
- **Type:** Status + alert list
- **Question:** "Czy P0/P1/P2 są spełnione i czy są krytyczne naruszenia?"
- **Source:** nuclear_events, language_violations (Supabase)
- **Metrics:** P0 test pass rate, active P0/P1/P2 alerts, language_violations 24h, nuclear_events 24h, consent_logs 24h
- **Mock values:** P0: 100% pass, P1: 0 violations, P2: 0 warnings
- **Interactions:** Filter by P-level, drill-down → W13 + W14
- **P0 badge:** bg-[#cc4444]/10 text-[#cc4444] border border-[#cc4444]/30
- **P1 badge:** bg-[#d4a843]/10 text-[#d4a843]
- **P2 badge:** bg-yellow-500/10 text-yellow-400

---

### PRODUCT TRACK (Pasek B, Column 1)

#### W4: product_app_status
- **Type:** 3 app cards (row)
- **Question:** "Czy kluczowe aplikacje są dostępne i jakie mają KPI?"
- **Source:** Health endpoints per app
- **Metrics per app:** status (UP/DEGRADED/DOWN), DAU/MAU, active sessions, client version, request success %
- **Apps:** PatternLens (patternlens.app), PatternsLab (patternslab.app), Portal (this)
- **Mock:** All UP, PatternLens DAU 342, PatternsLab DAU 28, Portal DAU 3
- **Interactions:** Filter env (prod/stage), drill-down → W19

#### W5: product_module_activation
- **Type:** Table + status checks
- **Question:** "Które moduły frameworka są aktywne?"
- **Source:** Module registry (static from MODULES.md)
- **Metrics:** module name, type (Open/Closed), edge-safe, status, pricing
- **Modules:** 15 total (8 open + 7 closed)
- **Interactions:** Filter by type (open/closed), drill-down → W17
- **Open badge:** bg-[#3d9970]/10 text-[#3d9970] font-mono text-[10px] "O"
- **Closed badge:** bg-[#d4a843]/10 text-[#d4a843] font-mono text-[10px] "C"

#### W6: product_archetype_overview
- **Type:** Heatmap + numbers
- **Question:** "Jak rozkładają się archetypy w populacji?"
- **Source:** archetypes table (Supabase)
- **Metrics:** % per archetype (12), blend count, significant shifts in period
- **12 archetypes:** Creator, Ruler, Caregiver, Explorer, Sage, Hero, Rebel, Magician, Lover, Jester, Innocent, Orphan
- **Interactions:** Time filter, drill-down per archetype

---

### AGENTS TRACK (Pasek B, Column 2)

#### W7: agents_layer_status
- **Type:** 3 layer cards (Guardian/Revenue/Growth)
- **Question:** "Które warstwy agentów są aktywne?"
- **Source:** agent_policies (Supabase)
- **Metrics per layer:** status (ACTIVE/PAUSED/LOCKED), agent count, tasks/day, unlock/pause conditions met
- **Layer 0 Guardian:** Sentinel + Content Guard + Anomaly Detector (P0, always active)
- **Layer 1 Revenue:** Analytics Reporter + Sales Autopilot + Customer Success
- **Layer 2 Growth:** LinkedIn + Content Machine + Social Swarm + Growth Hacker + Community Builder
- **Interactions:** Click layer → filter W8 + W9
- **Active:** animate-pulse green dot, PAUSED: amber, LOCKED: gray

#### W8: agents_performance
- **Type:** Table + KPI
- **Question:** "Czy agenci są rentowni i dostarczają ROI?"
- **Source:** agent_logs, kpi_daily (Supabase)
- **Metrics per agent:** layer, tasks, KPI impact (revenue/leads/churn), cost/month, est. ROI
- **Summary:** Total $198-338/mo vs $22-34K human equivalent = 65-100x ROI
- **Interactions:** Filter by layer + agent, drill-down → agent_logs timeline

#### W9: agents_policy_alerts
- **Type:** Alert list
- **Question:** "Czy któryś agent łamie polityki?"
- **Source:** anomaly_events, platform_limits (Supabase)
- **Metrics:** alert type (safety/compliance/limit), agent, layer, severity, timestamp
- **Interactions:** Filter by severity + layer, link → W3

---

### EVENTS TRACK (Pasek B, Column 3)

#### W10: events_rate_overview
- **Type:** Numbers + mini sparkline
- **Question:** "Jak intensywnie system generuje eventy?"
- **Source:** events table (Supabase)
- **Metrics:** events/min, breakdown by domain (Pattern/Archetype/Safety/Agent/Platform), % error events
- **14 event types:** object.created, object.analyzed, pattern.detected, archetype.updated, prediction.generated, crisis.detected, risk.flagged, agent.run.completed, agent.run.failed, content.published, content.blocked, anomaly.detected, tenant.provisioned, subscription.changed
- **Interactions:** Filter by domain, drill-down → W11

#### W11: events_timeline
- **Type:** Timeline (scrollable list)
- **Question:** "Jakie kluczowe eventy zachodziły w czasie?"
- **Source:** events table (Supabase)
- **Metrics:** event type, timestamp, source module, tenant, correlationId
- **Interactions:** Filter by event type + tenant, drill-down → event detail (payload)

#### W12: events_crisis_detected
- **Type:** P0 alert list
- **Question:** "Czy ostatnio wystąpiły zdarzenia kryzysowe?"
- **Source:** nuclear_events (Supabase)
- **Metrics:** CrisisDetected count 24h/7d, risk score distribution (high/medium/low), response time
- **Interactions:** Filter by risk level, drill-down → W14

---

### COMPLIANCE & SAFETY TRACK (Pasek C)

#### W13: compliance_matrix_status
- **Type:** Status grid
- **Question:** "Czy P0/P1/P2 są zgodne w runtime?"
- **Source:** language_violations, compliance scan results
- **Metrics:** status per P-level (OK/WARN/FAIL), violations per 1k outputs, last full scan
- **Grid:** 15 modules x 3 P-levels (from COMPLIANCE.md matrix)
- **Interactions:** Drill-down → compliance_scan_report (TODO)

#### W14: safety_crisis_feed
- **Type:** Feed list
- **Question:** "Jakie ostatnie krytyczne przypadki safety obsłużył system?"
- **Source:** nuclear_events (Supabase)
- **Metrics:** Layer 1-3 entries, actions taken (block/modal/allow+banner), locale (PL/EN)
- **Interactions:** Filter by layer + language, drill-down → case detail (metadata only, no sensitive content)

#### W15: language_guard_status
- **Type:** Numbers + badge
- **Question:** "Czy @silence/language prawidłowo blokuje forbidden vocabulary?"
- **Source:** language_violations (Supabase)
- **Metrics:** blocked outputs per 1k, false positives, edge runtime status
- **Interactions:** Filter by module (ai, linkedin-agent, content-machine), link → W9

---

### ARCHITECTURE & MODULES TRACK (Pasek D)

#### W16: architecture_layer_overview
- **Type:** Status diagram + numbers
- **Question:** "Czy kluczowe warstwy architektury są zdrowe?"
- **Source:** Health endpoints, monitoring
- **Metrics:** Edge latency, serverless error rate, Supabase latency, Redis health, AI provider uptime
- **Layers:** Edge → Thin Handler → Domain Module → Event Bus (from ARCHITECTURE.md flow)
- **Interactions:** Filter by env (prod/stage/local), drill-down → W22

#### W17: architecture_module_detail
- **Type:** Table
- **Question:** "Jakie są szczegóły modułów?"
- **Source:** MODULES.md (static)
- **Metrics:** module name, dependency level (foundation/domain/closed), last version, emitted events, required contracts
- **Interactions:** Filter by type (open/closed, foundation/domain), link → MODULES.md

#### W18: data_layer_kpi
- **Type:** Numbers + table
- **Question:** "Czy warstwa danych działa poprawnie?"
- **Source:** Supabase admin API
- **Metrics:** tenant count, events/day, kpi_daily freshness (lag), RLS violation count
- **Interactions:** Filter by env + tenant, drill-down → W11

---

### BUSINESS & INVESTOR TRACK (Pasek E)

#### W19: business_kpi_timeline
- **Type:** Line chart (timeline)
- **Question:** "Jak rosną KPI w czasie vs targety?"
- **Source:** kpi_daily, kpi_weekly (Supabase)
- **Metrics:** ARR, MRR, DAU, paid users, B2B clients, churn, NRR
- **Target overlay:** Month 3 (20k PLN), Month 6 (120k), Month 12 (600k), Month 18 (2.5M)
- **Interactions:** Filter by metric + app (PatternLens/PatternsLab/APIs)

#### W20: business_unit_economics
- **Type:** Table + numbers
- **Question:** "Czy unit economics się spinają?"
- **Source:** INVESTOR.md (static/mock)
- **Metrics per tier:** price, hosting cost, AI compute, storage, margin %, LTV, CAC
- **FREE:** ~$0 total, $0 revenue | **PRO:** ~$1-3/mo cost, ~$7/mo revenue, 70-85% margin
- **Interactions:** Filter by segment (consumer/institutional/API)

#### W21: business_revenue_targets
- **Type:** Milestone table
- **Question:** "Czy jesteśmy na ścieżce do targetów M3/M6/M12/M18?"
- **Source:** kpi_daily vs INVESTOR.md targets
- **Metrics:** target vs actual: free users, paid, B2B clients, ARR
- **Milestones:** M3: 500/50/0/20k | M6: 5k/300/2/120k | M12: 25k/1.5k/5/600k | M18: 100k/5k/20/2.5M
- **Interactions:** Filter by period, link → W19

---

### OPS & DEPLOYMENT TRACK (Pasek F)

#### W22: ops_deployment_status
- **Type:** Status board
- **Question:** "Czy Vercel, Supabase, n8n, Stripe i GitHub Actions są OK?"
- **Source:** Health checks, CI status
- **Metrics:** Last deploy per app, ci.yml/deploy.yml/security.yml status, n8n status, Stripe health
- **Services:** Vercel (portal + patternlens + patternslab), Supabase, Hetzner/n8n, Stripe, Cloudflare, Sentry
- **Interactions:** Filter by app, drill-down → external logs

#### W23: ops_agent_orchestrator_rules
- **Type:** Rules list + status
- **Question:** "Które reguły Orchestratora są aktywne?"
- **Source:** agent_policies (Supabase)
- **Rules:**
  - IF Sentry errors > 5/hour → PAUSE Layer 2
  - IF churn > 5% → BOOST CS, PAUSE outbound
  - IF platform ban signal → KILL channel 48h
  - IF revenue growing > 10% WoW → UNLOCK higher aggression
- **Metrics:** rule name, last triggered, trigger count 7d
- **Interactions:** Filter by type (safety/revenue/growth), link → W7

#### W24: ops_build_order_progress
- **Type:** Progress bar (step list)
- **Question:** "Na jakim etapie build-order jesteśmy (Phase 0-3)?"
- **Source:** CHANGELOG.md, manual status
- **Phase 0 FUNDAMENT:** contracts done, events done, core wip, safety done, Vercel fix wip, Sentinel planned
- **Phase 1 REVENUE:** archetypes wip, validator/language wip, Analytics Reporter planned, Sales Autopilot planned, CS planned
- **Phase 2 APPS:** portal wip, PatternLens integration planned, PatternsLab integration planned, LinkedIn P1 planned, Content P1 planned
- **Phase 3 SCALE:** ai planned, predictive planned, voice planned, full Growth Army planned, npm publish planned, App Store planned
- **Interactions:** Filter by phase (0-3)

---

### OUT-OF-DASHBOARD (archived/tracked elsewhere)

- W25: docs_overview — README already lists all 13 docs
- W26: community_marketing — tracked via W8 agents_performance + W19 business_kpi

---

## 3. DESIGN RULES

### Colors (SILENCE DARK tokens)

```
Background:     #08080a (--bg-void)
Surface:        #111113 (--bg-surface)
Elevated:       #1a1a1e (--bg-elevated)
Border dim:     #222228 (--border-dim)
Border focus:   #333340 (--border-focus)
Text primary:   #e8e8ec (--text-primary)
Text muted:     #888893 (--text-muted)
Text ghost:     #55555e (--text-ghost)
Accent teal:    #21808d (--accent-teal)
Accent amber:   #d4a843 (--accent-amber)
Success green:  #3d9970 (--accent-green)
Fail red:       #cc4444 (--accent-red)
```

### Status colors (hard rules)

| Status | Color | Usage |
|--------|-------|-------|
| SUCCESS / OK / operational | #3d9970 green | Max 10% surface |
| WARN / DEGRADED / P1 | #d4a843 amber | |
| FAIL / P0 / DOWN | #cc4444 red | Always with warning icon |
| DISABLED / ARCHIVE | #55555e gray | |
| P2 | yellow-400 | |

### Typography

| Element | Font | Size | Weight | Style |
|---------|------|------|--------|-------|
| Dashboard title (H1) | JetBrains Mono | text-xl | 600 | Left-aligned |
| Section headers (H2) | JetBrains Mono | text-sm | 500 | uppercase tracking-[0.15em] |
| Widget titles (H3) | Outfit | text-base | 500 | With business question subtitle |
| KPI values | JetBrains Mono | text-2xl | 700 | tabular-nums |
| Labels | JetBrains Mono | text-[10px] | 400 | uppercase tracking-[0.15em] |
| Body text | Outfit | text-sm | 400 | |

### Widget Card

```tsx
<div className="bg-[#111113] border border-[#222228] rounded-xl p-5
  hover:shadow-lg hover:shadow-[#21808d]/5 transition-all duration-300">
  {/* Header */}
  <h3 className="font-[Outfit] text-base font-medium text-[#e8e8ec]">{title}</h3>
  <p className="font-mono text-[10px] text-[#888893] mt-0.5">{businessQuestion}</p>
  {/* Body */}
  <div className="mt-4">{children}</div>
  {/* Footer (optional) */}
  <div className="mt-3 pt-3 border-t border-[#222228] flex gap-2">{filters}</div>
</div>
```

### Spacing

- Desktop grid: 12 columns, 24px gutter
- Mobile: 1 column, 16px gutter
- Card padding: p-5 (20px)
- Section gaps: gap-6 (24px)

### Icons (symbols, not illustrations)

| Track | Icon |
|-------|------|
| Product | screen/app |
| Agents | gear/robot |
| Events | pulse/bell |
| Compliance | shield/check |
| Safety | triangle |
| Investor | rising chart |
| Ops | server/key |

### Interactions

| Control | Scope | Options |
|---------|-------|---------|
| Time filter | Global | 24h, 7d, 30d, all |
| Env filter | Global | prod, stage, local |
| Module type | Local (W5, W17) | open, closed |
| Agent layer | Local (W7, W8, W9) | Guardian, Revenue, Growth |
| Event type | Local (W10, W11) | pattern, safety, agent, platform |
| P-level | Local (W3, W13) | P0, P1, P2 |

**Drill-down:** Side panel or modal, NEVER full-page navigation.
**Animations:** Subtle hover + micro-transition on KPI value changes. No decorative animations.

### Naming (COMPLIANCE enforced)

| Use | Never |
|-----|-------|
| Object | entry, journal |
| Pattern | trait, personality |
| Archetype | personality type |
| Agent | bot |
| Structural hypothesis | diagnosis, advice |

---

## 4. IMPLEMENTATION NOTES

### Data Source Priority

1. **Mock data first** — all widgets render with hardcoded mock values from INVESTOR.md + AGENTS.md
2. **Supabase wiring** — when tables exist, replace mock with real queries
3. **SSE/WebSocket** — for live event feed (W10, W11, W12) when event bus is active

### Missing API Endpoints (TODO)

These endpoints need creation for full dashboard functionality:
- `GET /api/kpi/daily` — aggregated daily metrics
- `GET /api/kpi/weekly` — aggregated weekly
- `GET /api/events/feed` — paginated event log
- `GET /api/agents/status` — all agent layers + policies
- `GET /api/agents/logs` — paginated agent activity
- `GET /api/ops/health` — aggregated CI + infra status
- `GET /api/compliance/scan` — latest compliance results

### Component Mapping

| Widget | Component file | Key dependency |
|--------|---------------|----------------|
| W1 hero_kpi_overview | HeroKpiGrid.tsx | @silence/ui MetricCard |
| W2 hero_system_status | SystemStatus.tsx | /api/health fetch |
| W3 hero_safety_compliance | SafetyComplianceStatus.tsx | nuclear_events query |
| W4 product_app_status | AppStatusCards.tsx | Health endpoints |
| W5 product_module_activation | ModuleTable.tsx | Static MODULES.md data |
| W7 agents_layer_status | AgentLayers.tsx | agent_policies query |
| W10 events_rate_overview | EventRate.tsx | events table aggregation |
| W19 business_kpi_timeline | KpiTimeline.tsx | Recharts line chart |
| W22 ops_deployment_status | OpsStatus.tsx | CI + health aggregation |
| W24 ops_build_order | BuildProgress.tsx | Static CHANGELOG data |

### Grain Overlay (global, same as PatternLens)

```css
body::before {
  content: ''; position: fixed; inset: 0; opacity: 0.025;
  pointer-events: none; z-index: 9999;
  background-image: url("data:image/svg+xml,..."); /* film grain SVG */
}
```

## CHANGELOG (PORTAL_SPEC.md)

- 2026-02-08 v5.1 — Full 24-widget implementation, detailed spec from PORTAL_DASHBOARD_SPEC.md
- 2026-02-08 v5.0 — Initial spec, 24 widgets, F-pattern layout
