# SILENCE.OBJECTS

> Modular framework for structural analysis of behavioral patterns.
> NOT a chatbot. NOT a wellness app. NOT therapy. A FRAMEWORK.

[![License: MIT](https://img.shields.io/badge/Core-MIT-green.svg)]()
[![License: Proprietary](https://img.shields.io/badge/Closed_Modules-Proprietary-red.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)]()

## What is SILENCE.OBJECTS?

A composable, API-first, event-driven framework that provides structural analysis of behavioral patterns as systems.

**Model:** Open Core (like Redis, Elastic, Supabase)
- Open source core → community adoption → enterprise upsell
- Closed modules → B2B licensing + pay-per-use
- API-first: core as stable capabilities, apps as thin UI adapters

## Quick Start

```bash
git clone https://github.com/Patternslab-ecosystem/SILENCE.OBJECTS.git
cd SILENCE.OBJECTS
pnpm install
pnpm dev          # runs apps/portal (dashboard)
pnpm build        # builds all packages + apps
```

**Requirements:** Node.js 18+, pnpm, Supabase project (EU region), Vercel account.

## Architecture (summary)

```
Client (PatternLens / PatternsLab / Portal)
  │
  ▼
Edge Runtime ── auth, rate limit, feature flags, language scan
  │
  ▼
Thin Handler ── HTTP ↔ command mapping, input validation (@silence/contracts)
  │
  ▼
Domain Module ── @silence/core, @silence/archetypes, @silence/ai ...
  │              wrapped by @silence/safety middleware
  ▼
Event Bus ── @silence/events → Dashboard, Agents, Analytics, Notifications
```

Full details: [ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Monorepo Structure

```
SILENCE.OBJECTS/
├── packages/
│   ├── contracts/       # @silence/contracts — types source of truth
│   ├── events/          # @silence/events — typed event bus
│   ├── core/            # @silence/core — pattern detection engine
│   ├── archetypes/      # @silence/archetypes — Jungian classification
│   ├── symbolic/        # @silence/symbolic — pattern catalysts
│   ├── language/        # @silence/language — vocabulary guardrails (edge-safe)
│   ├── validator/       # @silence/validator — contract enforcement (edge-safe)
│   ├── ui/              # @silence/ui — design system
│   ├── safety/          # @silence/safety — crisis detection [CLOSED]
│   ├── ai/              # @silence/ai — Claude integration [CLOSED]
│   ├── predictive/      # @silence/predictive — forecasting [CLOSED]
│   ├── voice/           # @silence/voice — voice input [CLOSED]
│   ├── medical/         # @silence/medical — institutional [CLOSED]
│   ├── legal/           # @silence/legal — compliance [CLOSED]
│   └── linkedin-agent/  # @silence/linkedin-agent [CLOSED]
├── apps/
│   ├── portal/          # Dashboard + investor view + agent control
│   ├── patternlens/     # Consumer PWA
│   └── patternslab/     # B2B institutional
├── agents/              # AI agent army (n8n orchestrated)
├── docs/                # Documentation (this set)
├── tooling/             # ESLint, TSConfig, generators
├── supabase/            # Database schema + migrations
└── .github/workflows/   # CI/CD pipelines
```

## Applications

| App | Domain | Purpose |
|-----|--------|---------|
| **PatternLens** | patternlens.app | Consumer PWA — behavioral pattern analysis |
| **PatternsLab** | patternslab.app | B2B institutional — multi-tenant, audit trails |
| **Portal** | patternslab.app/portal | Dashboard — KPI, investor view, agent control |

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15+, React 19, TypeScript strict, Tailwind 4, Zustand, TanStack Query |
| Backend | Vercel Edge + Serverless, tRPC / Server Actions |
| Data | Supabase Postgres (EU), Drizzle ORM, Upstash Redis |
| AI | Claude Sonnet 4 (primary), GPT-4o (fallback), Whisper |
| Agents | n8n (Hetzner CX22), 3-layer hierarchy |
| Infra | Vercel, GitHub Actions, Sentry, Cloudflare DNS |
| Payments | Stripe (PL/UK/US/EU) |

## Framework Contract

All implementations MUST comply:

1. **Object ≠ User** — an object is a recorded behavioral event, never a representation of the person
2. **Interpretation ≠ Truth** — all output is structural hypothesis, never fact
3. **No Advice** — the system never tells the user what to do
4. **No Diagnosis** — the system never classifies medically or psychologically
5. **Language is Structural** — engineering-grade vocabulary only (see COMPLIANCE.md)
6. **User Retains Control** — the system presents structure, the user decides meaning

## Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Data flow, module diagram, edge/serverless split |
| [MODULES.md](docs/MODULES.md) | Per-module API, exports, contracts, events, pricing |
| [ARCHETYPES.md](docs/ARCHETYPES.md) | 12 Jungian archetypes, scoring, framing rules |
| [EVENTS.md](docs/EVENTS.md) | Event catalog, schemas, subscription patterns |
| [AGENTS.md](docs/AGENTS.md) | Agent army hierarchy, workflows, policies |
| [COMPLIANCE.md](docs/COMPLIANCE.md) | Compliance matrix, forbidden vocabulary |
| [SAFETY.md](docs/SAFETY.md) | Crisis detection, 3-layer system |
| [API.md](docs/API.md) | Endpoints, schemas, auth, rate limits |
| [INVESTOR.md](docs/INVESTOR.md) | KPI, market data, projections |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Vercel + Supabase + n8n setup |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | How to contribute to open modules |
| [CHANGELOG.md](docs/CHANGELOG.md) | Version history |

## Disclaimer

```
This tool analyzes behavioral patterns for productivity and system debugging.
It does not provide therapy, diagnosis, or crisis support.
```

## Links

| Resource | URL |
|----------|-----|
| GitHub | https://github.com/Patternslab-ecosystem/SILENCE.OBJECTS |
| PatternLens | https://patternlens.app |
| PatternsLab | https://patternslab.app |
| Investor Portal | https://patternslab.work |

## License

- Open modules: MIT
- Closed modules: Proprietary — contact for licensing
- Framework docs: CC BY-SA 4.0

---

**SILENCE.OBJECTS** © 2025-2026 | Built by PatternLabs

---
*CHANGELOG (README.md) — 2026-02-08: Enriched quickstart, added stack table, framework contract section, aligned with DIPLO BIBLE v3.0. (topic: docs-v3-baseline)*
