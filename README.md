# SILENCE.OBJECTS

> Modular framework for structural analysis of behavioral patterns.

[![License: MIT](https://img.shields.io/badge/Core-MIT-green.svg)]()
[![License: Proprietary](https://img.shields.io/badge/Closed_Modules-Proprietary-red.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)]()

## What is SILENCE.OBJECTS?

A composable, API-first, event-driven framework that provides structural analysis of behavioral patterns as systems. It is **not** a chatbot, not a wellness app, not therapy. It is a framework with modules you can deploy, license, extend, and compose.

**Model:** Open Core (like Redis, Elastic, Supabase)
- Open source core → community adoption → enterprise upsell
- Closed modules → B2B licensing + pay-per-use

## Quick Start

```bash
# Clone
git clone https://github.com/Patternslab-ecosystem/SILENCE.OBJECTS.git
cd SILENCE.OBJECTS

# Install
pnpm install

# Dev (Portal Dashboard)
pnpm dev

# Build
pnpm build
```

## Architecture

```
Client (PatternLens / PatternsLab / Portal)
  │
  ▼
Edge Runtime ── auth, rate limit, feature flags, language scan
  │
  ▼
Thin Handler ── HTTP ↔ command mapping, input validation
  │
  ▼
Domain Module ── @silence/core, @silence/archetypes, @silence/ai ...
  │
  ▼
Event Bus ── @silence/events → Dashboard, Agents, Analytics
```

## Monorepo Structure

```
SILENCE.OBJECTS/
├── packages/
│   ├── contracts/       # @silence/contracts — types source of truth
│   ├── events/          # @silence/events — typed event bus
│   ├── core/            # @silence/core — pattern detection engine
│   ├── archetypes/      # @silence/archetypes — Jungian classification
│   ├── symbolic/        # @silence/symbolic — pattern catalysts
│   ├── language/        # @silence/language — vocabulary guardrails
│   ├── validator/       # @silence/validator — contract enforcement
│   ├── ui/              # @silence/ui — design system
│   ├── safety/          # @silence/safety — crisis detection [CLOSED]
│   ├── ai/              # @silence/ai — Claude integration [CLOSED]
│   ├── predictive/      # @silence/predictive — forecasting [CLOSED]
│   ├── voice/           # @silence/voice — voice input [CLOSED]
│   ├── medical/         # @silence/medical — institutional [CLOSED]
│   ├── legal/           # @silence/legal — compliance [CLOSED]
│   └── linkedin-agent/  # @silence/linkedin-agent [CLOSED]
├── apps/
│   ├── portal/          # Dashboard + investor view
│   ├── patternlens/     # Consumer PWA
│   └── patternslab/     # B2B institutional
├── agents/              # AI agent army (n8n orchestrated)
├── docs/                # Documentation
├── scripts/             # CI/CD, language checks
└── supabase/            # Database schema + migrations
```

## Applications

| App | Domain | Purpose |
|-----|--------|---------|
| **PatternLens** | patternlens.app | Consumer PWA — behavioral pattern analysis |
| **PatternsLab** | patternslab.app | B2B institutional — multi-tenant, audit trails |
| **Portal** | patternslab.app/portal | Dashboard — KPI, investor view, agent control |

## Stack

- **Frontend:** Next.js 15+, React 19, TypeScript strict, Tailwind 4
- **Backend:** Vercel Edge + Serverless, tRPC / Server Actions
- **Data:** Supabase Postgres (EU), Drizzle ORM, Upstash Redis
- **AI:** Claude Sonnet 4, Whisper, AgentRuntime abstraction
- **Infra:** Vercel, GitHub Actions, n8n (Hetzner), Sentry

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

## Framework Contract

All implementations MUST comply with these invariants:

1. **Object ≠ User** — an object is a recorded behavioral event, never a representation of the person
2. **Interpretation ≠ Truth** — all output is structural hypothesis, never fact
3. **No Advice** — the system never tells the user what to do
4. **No Diagnosis** — the system never classifies medically or psychologically
5. **Language is Structural** — engineering-grade vocabulary only (see [01-LANGUAGE.md](docs/framework/01-LANGUAGE.md))
6. **User Retains Control** — the system presents structure, the user decides meaning

## Disclaimer

```
This tool analyzes behavioral patterns for productivity and system debugging.
It does not provide therapy, diagnosis, or crisis support.
```

## Links

- **GitHub:** https://github.com/Patternslab-ecosystem/SILENCE.OBJECTS
- **Vercel:** https://vercel.com/silence-objects/silence-objects
- **PatternLens:** https://patternlens.app
- **PatternsLab:** https://patternslab.app
- **Investor:** https://patternslab.work

## License

- Open modules: MIT
- Closed modules: Proprietary — contact for licensing
- Framework docs: CC BY-SA 4.0

---

**SILENCE.OBJECTS** © 2025-2026 | Built by PatternLabs
