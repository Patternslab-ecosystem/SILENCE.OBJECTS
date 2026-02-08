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

### CSS Grid — Golden Ratio (ϕ ≈ 0.618)

**Rule:** Layout desktopowy stosuje złoty podział. Jedyny dominujący blok w każdym pasie
zajmuje ~61.8% dostępnej szerokości lub wysokości sekcji, pozostałe widgety dzielą ~38.2%.

```css
/* ═══════════════════════════════════════════
   GOLDEN RATIO GRID SYSTEM
   ϕ = 0.618 | 1−ϕ = 0.382
   No "widget democracy" — always one dominant
   ═══════════════════════════════════════════ */

/* Base 12-col grid */
.portal-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
}

/* ── PASEK A: HERO ── */
/* W1 (KPI) = ϕ ≈ 61.8% | W2 (System) ≈ 23.6% | W3 (Safety) ≈ 14.6% */
.hero-strip {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1.618fr 0.618fr 0.382fr;
  gap: 24px;
}

/* ── PASEK B: 3-COLUMN ── */
/* Product ≈ ϕ ratio wider than Events */
/* grid-cols: 1.0fr 0.8fr 0.6fr ≈ normalized golden */
.three-col-golden {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1.0fr 0.8fr 0.6fr;
  gap: 24px;
}

/* ── PASEK C-F: FULL WIDTH STRIPS ── */
/* Inside each strip: dominant widget = ϕ, supporting = 1−ϕ */
.strip-golden-2 {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1.618fr 1fr;
  gap: 24px;
}
.strip-golden-3 {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1.618fr 0.618fr 0.382fr;
  gap: 24px;
}

/* ── VERTICAL GOLDEN RATIO (first fold) ── */
/* First 61.8% of viewport: Hero + top of Band B */
/* Bottom 38.2%: first scroll (Compliance + Architecture) */
/* Second scroll: Investor + Ops */
.hero-strip { min-height: calc(38.2vh - 24px); }
.three-col-golden { min-height: calc(23.6vh); }
/* Total above fold: ~61.8vh */

/* ── MOBILE: single column ── */
@media (max-width: 768px) {
  .portal-grid { gap: 16px; padding: 16px; }
  .hero-strip,
  .three-col-golden,
  .strip-golden-2,
  .strip-golden-3 {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
```

### Golden Ratio Application Per Band

| Band | Dominant Widget (≈ 61.8%) | Supporting (≈ 38.2%) | Grid |
|------|--------------------------|---------------------|------|
| **A: Hero** | W1 hero_kpi_overview | W2 system_status + W3 safety | 1.618fr 0.618fr 0.382fr |
| **B: Product** (col 1) | W5 module_activation | W4 app_status + W6 archetype | vertical stack, W5 = 61.8% height |
| **B: Agents** (col 2) | W7 agent_layers | W8 performance + W9 alerts | vertical stack, W7 = 61.8% height |
| **B: Events** (col 3) | W10 event_rate | W11 timeline + W12 crisis | vertical stack, W10 = 61.8% height |
| **C: Compliance** | W13 compliance_matrix | W14 crisis_feed + W15 language_guard | 1.618fr 0.618fr 0.382fr |
| **D: Architecture** | W16 layer_overview | W17 module_detail + W18 data_layer | 1.618fr 1fr |
| **E: Investor** | W19 kpi_timeline | W20 unit_economics + W21 targets | 1.618fr 0.618fr 0.382fr |
| **F: Ops** | W22 deployment_status | W23 orchestrator + W24 build_order | 1.618fr 1fr |

### Vertical Scroll Zones

```
┌──────────────────────────────────────────────────┐
│  VIEWPORT (100vh)                                │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │ 61.8% — FIRST FOLD (no scroll)          │    │
│  │                                          │    │
│  │ Pasek A: Hero (W1 golden-wide + W2 + W3)│    │  ← "Co się dzieje?"
│  │ ≈ 38.2% of fold                         │    │
│  │                                          │    │
│  │ Pasek B top: Product / Agents / Events   │    │  ← "Jak działa produkt?"
│  │ ≈ 23.6% of fold (golden sub-division)   │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │ 38.2% — FIRST SCROLL                    │    │
│  │                                          │    │
│  │ Pasek B bottom + Pasek C: Compliance     │    │  ← "Czy jest bezpiecznie?"
│  │ Pasek D: Architecture & Modules          │    │  ← "Jak to zbudowane?"
│  └──────────────────────────────────────────┘    │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │ SECOND SCROLL (utility)                  │    │
│  │                                          │    │
│  │ Pasek E: Investor & Business             │    │  ← "Czy biznes rośnie?"
│  │ Pasek F: Ops & Deployment (compact)      │    │  ← "Czy infra jest OK?"
│  └──────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

## 2. WIDGET CATALOG (24 widgets)

### Format: ID | Type | Business Question | Data Source | Metrics | Interactions

---

### HERO / GLOBAL (Pasek A)

#### W1: hero_kpi_overview
- **Type:** KPI grid (numbers)
- **Question:** "Jaki jest aktualny stan biznesu?"
- **Source:** kpi_daily, kpi_weekly (Supabase) | Mock: INVESTOR.md
- **PRIMARY ROW (4 C-level KPIs — scan in 3 seconds):**
  - ARR: 104,000 PLN
  - MRR: 8,667 PLN
  - Runway: 18 months
  - NRR: 108%
- **SECONDARY ROW (hover/expand — less critical):**
  - DAU: 342 | Churn: 2.1% | LTV/CAC: 4.2x | Conversion: 12.8%
- **Interactions:** Time filter (1mo/1q/1y), drill-down → W19 business_kpi_timeline
- **Tailwind primary:** grid grid-cols-4 gap-3, each: bg-[#111113] border border-[#222228] rounded-xl p-4
- **Tailwind secondary:** grid grid-cols-4 gap-2, smaller: text-sm text-[#888893], collapsed by default (click "Show more")
- **Label font:** font-mono text-[10px] uppercase tracking-[0.15em] text-[#888893]
- **Value font:** font-mono text-2xl font-bold text-[#e8e8ec]

#### W2: hero_system_status
- **Type:** Compact status (max 3 badges)
- **Question:** "Czy framework działa?"
- **Source:** /api/health endpoint
- **BADGES (max 3):** Edge ● | Serverless ● | Database ●
- **Subtitle:** Latest deploy: {commit hash} · CI: {green/red}
- **Link:** "View infra details →" scrolls to W22 ops_deployment_status
- **Mock:** All operational (green dots)
- **Badges:** operational=bg-[#3d9970]/10 text-[#3d9970], degraded=bg-[#d4a843]/10 text-[#d4a843], down=bg-[#cc4444]/10 text-[#cc4444]

#### W3: hero_safety_compliance_status
- **Type:** Compact status (max 3 badges)
- **Question:** "Czy P0/P1/P2 są spełnione?"
- **BADGES (max 3):** P0 Safety ● | P1 Language ● | P2 Framing ●
- **Subtitle:** nuclear_events 24h: {count} · violations 24h: {count}
- **Link:** "View compliance details →" scrolls to W13 in Pasek C
- **Source:** nuclear_events, language_violations (Supabase)
- **Mock:** P0: PASS (green), P1: PASS (green), P2: PASS (green), 0 events, 0 violations
- **P0 badge:** bg-[#cc4444]/10 text-[#cc4444] border border-[#cc4444]/30 (when FAIL)
- **P1 badge:** bg-[#d4a843]/10 text-[#d4a843] (when WARN)
- **P2 badge:** bg-yellow-500/10 text-yellow-400 (when WARN)
- **All PASS:** bg-[#3d9970]/10 text-[#3d9970]

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
- **Metrics:** module name, type (Open/Closed), edge-safe, status (✅/🔧/📋), pricing
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
- **14 event types:** object.created, object.analyzed, pattern.created, archetype.updated, prediction.generated, crisis.detected, risk.flag.raised, agent.run.completed, agent.run.failed, content.published, content.blocked, anomaly.detected, tenant.provisioned, subscription.changed
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
- **Grid:** 15 modules × 3 P-levels (from COMPLIANCE.md matrix)
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
- **Question:** "Jak rosną kPI w czasie vs targety?"
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
- **Phase 0 FUNDAMENT:** contracts ✅, events ✅, core 🔧, safety ✅, Vercel fix 🔧, Sentinel 📋
- **Phase 1 REVENUE:** archetypes 🔧, validator/language 🔧, Analytics Reporter 📋, Sales Autopilot 📋, CS 📋
- **Phase 2 APPS:** portal 🔧, PatternLens integration 📋, PatternsLab integration 📋, LinkedIn P1 📋, Content P1 📋
- **Phase 3 SCALE:** ai 📋, predictive 📋, voice 📋, full Growth Army 📋, npm publish 📋, App Store 📋
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
| FAIL / P0 / DOWN | #cc4444 red | Always with ⚠️ icon |
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

### Spacing (Golden Ratio Informed)

- Desktop grid: 12 columns, 24px gutter, max-width 1440px
- Mobile: 1 column, 16px gutter
- Card padding: dominant widgets p-5 (20px), supporting widgets p-4 (16px), Ops band p-3 (12px)
- Section gaps: gap-6 (24px)
- Band separator: 48px vertical gap between bands (≈ 24px × ϕ rounded)
- Vertical within bands: dominant widget gets ≈ 61.8% of available height, supporting splits remainder

### Icons (symbols, not illustrations)

| Track | Icon |
|-------|------|
| Product | □ (screen/app) |
| Agents | ⚙ (gear/robot) |
| Events | ◉ (pulse/bell) |
| Compliance | ◈ (shield/check) |
| Safety | ⚠ (triangle) |
| Investor | ↗ (rising chart) |
| Ops | ⊞ (server/key) |

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

| ✅ Use | ❌ Never |
|--------|---------|
| Object | entry, journal |
| Pattern | trait, personality |
| Archetype | personality type |
| Agent | bot |
| Structural hypothesis | diagnosis, advice |

---

## 4. TYPES CONTRACT (types/portal.ts)

All mock data MUST use these types. When Supabase/API is wired, same shapes.

```typescript
// types/portal.ts — Portal dashboard data contracts

// W1: Hero KPIs
export interface PortalKpi {
  arr: number;          // PLN, from kpi_daily
  mrr: number;          // PLN
  runway: number;       // months
  nrr: number;          // %, net revenue retention
  dau: number;          // daily active users
  churn: number;        // %, monthly
  ltvCac: number;       // ratio
  conversion: number;   // %, free→paid
  updatedAt: string;    // ISO 8601
}

// W2: System Status
export interface PortalSystemStatus {
  edge: 'operational' | 'degraded' | 'down';
  serverless: 'operational' | 'degraded' | 'down';
  database: 'operational' | 'degraded' | 'down';
  latestCommit: string;
  ciStatus: 'green' | 'red' | 'pending';
  appVersion: string;
  safetyCoreVersion: string;
  portalContractVersion: string;  // tracks UI↔backend compat
}

// W3: Safety/Compliance Summary
export interface PortalSafetySummary {
  p0Status: 'PASS' | 'FAIL';
  p1Status: 'PASS' | 'WARN' | 'FAIL';
  p2Status: 'PASS' | 'WARN' | 'FAIL';
  nuclearEvents24h: number;
  languageViolations24h: number;
}

// W5: Module Activation
export interface PortalModule {
  name: string;         // e.g. "@silence/core"
  type: 'open' | 'closed';
  edgeSafe: boolean;
  status: 'ready' | 'building' | 'planned';
  events: string[];     // dot.notation event names
  pricing: string;      // "MIT" | "pay-per-use" | "per-seat" | etc.
}

// W7: Agent Layer
export interface PortalAgentLayer {
  layer: 0 | 1 | 2;
  name: 'Guardian' | 'Revenue' | 'Growth';
  status: 'ACTIVE' | 'PAUSED' | 'LOCKED';
  agents: { id: string; name: string; enabled: boolean; tasksToday: number }[];
  unlockCondition?: string;
  unlockMet: boolean;
}

// W8: Agent Performance
export interface PortalAgentPerformance {
  agentId: string;
  layer: 0 | 1 | 2;
  tasksTotal: number;
  successRate: number;  // 0-1
  costMonth: number;    // USD
  estimatedRoi: number; // multiplier
}

// W10: Event Rate
export interface PortalEventRate {
  eventsPerMin: number;
  byDomain: Record<'pattern' | 'archetype' | 'safety' | 'agent' | 'platform', number>;
  errorPercent: number;
}

// W13: Compliance Matrix Row
export interface PortalComplianceRow {
  module: string;
  p0Safety: 'Required' | 'Core' | 'N/A' | 'Optional' | 'Enforcer';
  p1Language: 'Required' | 'Core' | 'N/A' | 'Supports';
  p2Framing: 'Required' | 'N/A' | 'Supports';
  currentStatus: 'PASS' | 'WARN' | 'FAIL';
}

// W22: Ops Status
export interface PortalOpsService {
  name: string;         // "Vercel Portal" | "Supabase" | "n8n" | "Stripe" | etc.
  status: 'operational' | 'degraded' | 'down';
  lastDeploy?: string;  // ISO 8601
  url?: string;
}

// W24: Build Order Phase
export interface PortalBuildPhase {
  phase: 0 | 1 | 2 | 3;
  name: string;
  tasks: { name: string; status: 'done' | 'building' | 'planned' }[];
  completionPercent: number;
}
```

## 5. WIDGET → DATA SOURCE MAPPING

| Widget | API Endpoint (TODO) | Supabase Table/View | Event Source | Doc Reference |
|--------|--------------------|--------------------|-------------|---------------|
| W1 hero_kpi | GET /api/kpi/daily | kpi_daily, kpi_weekly | — | INVESTOR.md §KPI |
| W2 system_status | GET /api/health | — | — | DEPLOYMENT.md §Health |
| W3 safety_compliance | GET /api/compliance/summary | nuclear_events, language_violations | crisis.detected | SAFETY.md §Testing, COMPLIANCE.md §P0 |
| W4 app_status | GET /api/health (per app) | — | — | README.md §Apps |
| W5 module_activation | Static (MODULES.md) | — | — | MODULES.md §Module Map |
| W6 archetype_overview | GET /api/archetypes/distribution | archetypes | archetype.updated | ARCHETYPES.md §Scoring |
| W7 agent_layers | GET /api/agents/status | agent_policies | — | AGENTS.md §3-Layer |
| W8 agent_performance | GET /api/agents/performance | agent_logs, kpi_daily | agent.run.completed | AGENTS.md §Cost Summary |
| W9 agent_alerts | GET /api/agents/alerts | anomaly_events, platform_limits | anomaly.detected | AGENTS.md §Orchestrator |
| W10 event_rate | GET /api/events/rate | events | * (all) | EVENTS.md §Catalog |
| W11 event_timeline | GET /api/events/feed | events | * (all) | EVENTS.md §Persistence |
| W12 crisis_detected | GET /api/safety/crises | nuclear_events | crisis.detected | SAFETY.md §3-Layer |
| W13 compliance_matrix | GET /api/compliance/matrix | language_violations | — | COMPLIANCE.md §Matrix |
| W14 crisis_feed | GET /api/safety/feed | nuclear_events | crisis.detected, risk.flag.raised | SAFETY.md §CrisisModal |
| W15 language_guard | GET /api/compliance/language | language_violations | — | COMPLIANCE.md §P1 |
| W16 arch_layers | GET /api/health (extended) | — | — | ARCHITECTURE.md §Request Flow |
| W17 module_detail | Static (MODULES.md) | — | — | MODULES.md §Details |
| W18 data_layer | GET /api/ops/data | events (count), kpi_daily | — | ARCHITECTURE.md §Data Layer |
| W19 kpi_timeline | GET /api/kpi/timeline | kpi_daily, kpi_weekly | — | INVESTOR.md §Revenue Targets |
| W20 unit_economics | Static (INVESTOR.md) | — | — | INVESTOR.md §Unit Economics |
| W21 revenue_targets | GET /api/kpi/targets | kpi_daily | — | INVESTOR.md §Revenue Targets |
| W22 ops_status | GET /api/ops/health | — | — | DEPLOYMENT.md §Health Checks |
| W23 orchestrator_rules | GET /api/agents/rules | agent_policies | — | AGENTS.md §Orchestrator |
| W24 build_progress | Static (CHANGELOG.md) | — | — | CHANGELOG.md §3.0.0 |

## 6. VISUAL WEIGHT HIERARCHY

Not all bands are equal. Apply visual hierarchy:

| Band | Weight | Visual treatment |
|------|--------|-----------------|
| **A: Hero** | HIGHEST | Full width, prominent, larger cards, bg-[#111113] |
| **B: Product/Agents/Events** | HIGH | 3-column, full-size cards, standard bg |
| **C: Compliance/Safety** | HIGH | Full width, accent-red borders when FAIL |
| **D: Architecture/Modules** | MEDIUM | Slightly muted, smaller text, bg-[#0c0c0e] |
| **E: Investor/Business** | MEDIUM | Standard |
| **F: Ops/Deployment** | LOW | Compact cards, text-sm, reduced padding (p-3 not p-5), text-[#888893] default |

Band F (Ops) should feel like "utility drawer" — always accessible but not fighting for attention with Product/Agents.

## 7. DOCS BINDING (TODO comments in code)

Every widget component MUST have a header comment binding it to docs:

```tsx
/**
 * W13: compliance_matrix_status
 * Business Q: "Czy P0/P1/P2 są zgodne w runtime?"
 * Data source: GET /api/compliance/matrix (TODO) | Supabase: language_violations
 * Doc refs: COMPLIANCE.md §Compliance Matrix, SAFETY.md §Testing Requirements
 * Events: crisis.detected (trigger refresh)
 * Contract: PortalComplianceRow from types/portal.ts
 */
```

This ensures when docs change, devs know which widgets need updating.

### Grain Overlay (global, same as PatternLens)

```css
body::before {
  content: ''; position: fixed; inset: 0; opacity: 0.025;
  pointer-events: none; z-index: 9999;
  background-image: url("data:image/svg+xml,..."); /* film grain SVG */
}
```

## CHANGELOG (PORTAL_SPEC.md)

- 2026-02-08 v5.1.1 — Golden ratio grid, types contract, widget-data source mapping, visual weight hierarchy, docs binding
- 2026-02-08 v5.1 — Full 24-widget implementation
- 2026-02-08 v5.0 — Initial spec
