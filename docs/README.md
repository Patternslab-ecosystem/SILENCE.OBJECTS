# SILENCE.OBJECTS — Open Core Behavioral Pattern Framework

SILENCE.OBJECTS to **modularny** framework do strukturalnej analizy wzorców behawioralnych, zbudowany jako open core API-first system dla developerów, produktów konsumenckich i instytucjonalnych.

Framework NIE jest aplikacją, chatbotem ani narzędziem wellness — to zestaw stabilnych capabilities, na których siedzą aplikacje PatternLens (consumer), PatternsLab (B2B) oraz Portal (dashboard + investor + agent control).

## Core założenia

- Open core (MIT) + zamknięte moduły licencjonowane per tenant / per użycie.
- Architektura: composable, API-first, event-driven, z edge runtime na Vercel i Supabase jako wspólnym data layer.
- Terminologia wymuszona: Object, Pattern, Tension, Function, Lens A/B, Proposal/Hypothesis, Pattern Catalyst, Archetype mapping, structural analysis.
- Twarde ograniczenia językowe: zakaz słów typu „therapy", „diagnosis", „advice", „healing", „spiritual" w całym ekosystemie.

## Monorepo overview

Repozytorium jest pnpm/turbo monorepo z modularnym podziałem:

- `packages/*` — framework modules (`@silence/contracts`, `@silence/events`, `@silence/core`, `@silence/archetypes`, `@silence/symbolic`, `@silence/language`, `@silence/validator`, `@silence/ui`, moduły zamknięte).
- `apps/portal` — control tower: Module Explorer, KPI, financials, open source, LinkedIn, Agent Army.
- `apps/patternlens` — consumer PWA, PatternLens.
- `apps/patternslab` — B2B institutional PatternsLab.
- `agents/*` — Agent Army v2.0 (Guardian, Revenue, Growth) na n8n.
- `docs/*` — dokumentacja produktowa i techniczna.

## Quickstart

```bash
pnpm i
pnpm dev
```

Minimalny stack developerski: Node.js LTS, pnpm, dostęp do Supabase projektu (EU region) i Vercel.

## Kluczowe moduły

- `@silence/contracts` — jedno źródło prawdy dla typów, API schemas, event types.
- `@silence/events` — typed event bus dla całego ekosystemu.
- `@silence/core` — silnik pattern detection (Context → Tension → Meaning → Function).
- `@silence/archetypes` — 12 archetypów, scoring, blends, shifts.
- `@silence/safety` — 3-warstwowy system kryzysowy, P0.

Szczegóły wszystkich modułów: `docs/MODULES.md`.

## Aplikacje na frameworku

- PatternLens (apps/patternlens) — darmowy lokalny core + PRO z chmurą i predykcjami.
- PatternsLab (apps/patternslab) — multi-tenant B2B SaaS z pełnym zestawem modułów.
- Portal (apps/portal) — dashboard dla modułów, KPI, inwestorów i Agent Army.

## Dokumentacja

- ARCHITECTURE: `docs/ARCHITECTURE.md`
- MODULES: `docs/MODULES.md`
- API: `docs/API.md`
- SAFETY: `docs/SAFETY.md`
- COMPLIANCE: `docs/COMPLIANCE.md`
- EVENTS: `docs/EVENTS.md`
- AGENTS: `docs/AGENTS.md`
- INVESTOR: `docs/INVESTOR.md`
- DEPLOYMENT: `docs/DEPLOYMENT.md`
- CONTRIBUTING: `docs/CONTRIBUTING.md`

## CHANGELOG (README.md)

- 2026-02-08 — Ujednolicenie README pod DIPLO_BIBLE v3, quickstart, moduły, linki.
