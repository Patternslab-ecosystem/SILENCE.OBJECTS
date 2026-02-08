# SILENCE.OBJECTS ARCHITEKTURA v3.0

Architektura opiera się na edge runtime, cienkich handlerach serverless oraz modularnych domain modules komunikujących się przez typed event bus.

## Request flow (runtime)

1. Client (PatternLens / PatternsLab / Portal) wysyła żądanie do edge runtime na Vercel.
2. Edge layer: walidacja tokena (Supabase Auth JWT), TenantContext + ActorContext, feature flags, rate limiting, szybki skan językowy (`@silence/language`).
3. Thin handler (Serverless Function / Server Action / tRPC): mapuje HTTP na komendę, walidacja schemas z `@silence/contracts`, delegacja do domain module.
4. Domain module (`@silence/core`, `@silence/archetypes`, `@silence/ai`, itd.): logika, `@silence/safety` middleware, emituje typed events.
5. Event bus (`@silence/events`): dystrybuuje do dashboardu (SSE/WebSocket), agentów (n8n), Supabase (persist), notyfikacji.

## Edge vs serverless

- Edge (Vercel Edge Runtime): auth, context, feature flags, A/B routing, throttling, language pre-scan.
- Serverless (Vercel Functions): analizy AI, predykcje, orchestration agentów, cięższe operacje.

## Data layer

- Supabase Postgres (EU) z pełnym RLS i tenant_id.
- Drizzle ORM: objects, patterns, archetypes, user_profiles, subscriptions, tenants, teams, team_members, institutional_objects, audit_logs, agent_policies, agent_logs, platform_limits, anomaly_events, content_queue, leads, deals, kpi_daily, kpi_weekly, events.
- Redis (Upstash): cache, rate limit, docelowy event queue (Streams).

## Modules as capabilities

Każdy moduł implementuje interfejs z `@silence/contracts`, nie zna UI, komunikacja przez eventy i jawne API.

Przykład: client → edge (auth, context, language scan) → handler `/api/objects/analyze` → `@silence/core.analyzeObject()` → zapis Supabase → emit `ObjectAnalyzed`, `PatternCreated` → dashboard/agents reagują.

## Agent system integration

Agent Army v2.0 na n8n (Hetzner), subskrybuje eventy z `events` tabeli lub `@silence/events` (Webhook/SSE). Guardian layer (P0) może zatrzymać Layer 1+2.

## Runtime modes

- Cloud mode: pełna integracja Vercel + Supabase + n8n + Stripe.
- Local mode: open core z mockowanymi danymi, te same kontrakty API.

## CHANGELOG (ARCHITECTURE.md)

- 2026-02-08 — Ujednolicenie pod DIPLO_BIBLE v3.
