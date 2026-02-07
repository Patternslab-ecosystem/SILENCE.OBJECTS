# ARCHITECTURE.md — SILENCE.OBJECTS Technical Architecture

> Version: 3.0 | Composable, API-first, Event-driven

## 1. Design Principles

- **API-first:** Core as stable capabilities, apps as thin UI adapters
- **Composable:** Modules are independent with clean typed contracts
- **Event-driven:** All state changes emit typed events
- **Edge-first:** Auth, routing, rate limiting at edge; heavy processing serverless
- **Local-first:** Core detection free + offline; cloud upgrades paid

## 2. Request Flow

```
┌─────────────────────────────────────────────────────────┐
│  CLIENT                                                  │
│  PatternLens (PWA) / PatternsLab (B2B) / Portal          │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│  EDGE RUNTIME (Vercel Edge)                              │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────────┐  │
│  │ JWT Auth     │ │ Rate Limit   │ │ Feature Flags    │  │
│  │ (Supabase)   │ │ (@silence/   │ │ A/B Routing      │  │
│  │              │ │  safety)     │ │                  │  │
│  └─────────────┘ └──────────────┘ └──────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ TenantContext + ActorContext injection               │ │
│  │ @silence/language quick scan (edge-compatible)      │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│  THIN HANDLER (Vercel Serverless / tRPC / Server Action) │
│  - HTTP ↔ command mapping                                │
│  - Input validation via @silence/contracts schemas       │
│  - Route to domain module                                │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│  DOMAIN MODULE                                           │
│  @silence/core | @silence/archetypes | @silence/ai | ... │
│  - Business logic                                        │
│  - @silence/safety middleware wraps AI/medical/legal      │
│  - Emits typed events via @silence/events                │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│  EVENT BUS (@silence/events)                             │
│  In-process EventEmitter (v1) → Redis Streams (v2)       │
│                                                          │
│  ├── → Dashboard (WebSocket/SSE: live KPI)               │
│  ├── → Agent System (n8n: trigger workflows)             │
│  ├── → Analytics (Supabase: kpi_daily, agent_logs)       │
│  └── → Notifications (push/email)                        │
└──────────────────────────────────────────────────────────┘
```

## 3. Module Dependency Graph

```
@silence/contracts  ←── ALL modules depend on this
       │
       ├── @silence/events
       │
       ├── @silence/core ──────── @silence/archetypes
       │       │                         │
       │       ├── @silence/symbolic     │
       │       │                         │
       │       └── @silence/ai ──────────┘
       │               │
       │               ├── @silence/predictive
       │               │
       │               └── @silence/voice
       │
       ├── @silence/safety ←── MIDDLEWARE (wraps ai, medical, legal)
       │       │
       │       ├── @silence/medical
       │       └── @silence/legal
       │
       ├── @silence/language ←── edge-compatible guardrails
       ├── @silence/validator ←── edge-compatible contract check
       │
       └── @silence/ui ←── shared design system (all apps)
```

## 4. Data Layer

```
┌──────────────────────────────────────────────────┐
│  SUPABASE (single project, EU region)            │
│                                                  │
│  Domain Tables                                   │
│  ├── profiles (extends auth.users)               │
│  ├── objects (user inputs)                       │
│  ├── interpretations (AI analysis results)       │
│  ├── patterns (detected across objects)          │
│  └── archetypes (user archetype scores)          │
│                                                  │
│  B2B Tables (RLS: tenant_id)                     │
│  ├── tenants                                     │
│  ├── teams + team_members                        │
│  ├── institutional_objects                       │
│  └── audit_logs                                  │
│                                                  │
│  Agent Tables                                    │
│  ├── agent_policies (per-agent config)           │
│  ├── agent_logs (every action)                   │
│  ├── platform_limits (per-channel caps)          │
│  ├── anomaly_events                              │
│  └── content_queue (outbound pipeline)           │
│                                                  │
│  Revenue Tables                                  │
│  ├── leads (source, score, stage)                │
│  ├── deals (B2B pipeline)                        │
│  ├── kpi_daily / kpi_weekly                      │
│  └── subscriptions                               │
│                                                  │
│  Safety Tables                                   │
│  ├── nuclear_events (crisis log)                 │
│  ├── language_violations                         │
│  ├── consent_logs (GDPR)                         │
│  └── rate_limits                                 │
│                                                  │
│  RLS: auth.uid() = user_id on ALL tables         │
│  Multi-tenant: tenant_id + TenantContext          │
└──────────────────────────────────────────────────┘
```

## 5. Agent System Architecture

```
n8n Orchestrator (Hetzner VPS, self-hosted)
│
├── Layer 0: GUARDIAN (always active)
│   ├── Sentinel (GitHub Actions — code protection)
│   ├── Content Guard (Claude — compliance firewall)
│   └── Anomaly Detector (platform safety monitor)
│
├── Layer 1: REVENUE (after Layer 0 green)
│   ├── Analytics Reporter (KPI → Supabase → Dashboard)
│   ├── Sales Autopilot (leads → deals → revenue)
│   └── Customer Success (retention → upsell)
│
└── Layer 2: GROWTH (unlocked by metrics)
    ├── LinkedIn Dominator (3-phase rollout)
    ├── Content Machine (SEO + newsletter)
    ├── Social Swarm (Twitter → Quora → HN → Reddit)
    ├── Growth Hacker (viral loops, ASO)
    └── Community Builder (Discord, at ≥1000 users)
```

## 6. Edge vs Serverless Split

| Layer | Runtime | Responsibilities |
|-------|---------|-----------------|
| **Edge** | Vercel Edge Runtime | Auth JWT validation, TenantContext injection, feature flags, A/B routing, rate limiting, @silence/language quick scan, throttling |
| **Serverless** | Vercel Functions | AI analysis (Claude API), predictions, agent orchestration, heavy pattern processing, database writes |

**Rule:** @silence/language and @silence/validator MUST work in Edge Runtime (no Node-only APIs).

## 7. Runtime Modes

| Mode | Compute | LLM | Voice | Auth | Cost |
|------|---------|-----|-------|------|------|
| **LOCAL** | User hardware | Ollama | Whisper.cpp | None | $0 |
| **CLOUD** | Server | Claude API | Whisper API | Optional | Per-call |
| **HYBRID** | Local default, cloud on-demand | Ollama + Claude | Local + cloud | Optional | Cloud only |

Graceful degradation: No network → LOCAL. Claude down → Ollama. Whisper unavailable → text only. All AI down → capture works, analysis queued.

## 8. Security Architecture

- @silence/safety as middleware layer between world and AI/medical/legal modules
- All calls to AI, medical, legal pass through safety (rate limits, sanitization)
- Central policy engine (feature flags, permissions, limits) as separate package
- Closed modules: ZERO changes without OWNER review
- Critical modules (safety, medical, legal): separate test suite, senior review
