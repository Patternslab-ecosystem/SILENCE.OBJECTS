# CHANGELOG

All notable changes to the SILENCE.OBJECTS framework.

## [3.0.0] — 2026-02-06

### Added
- **@silence/contracts** — single source of truth for all TypeScript types
- **@silence/events** — typed event bus (in-process v1, Redis Streams migration path)
- **Agent Army v2.0** — 3-layer hierarchical agent system (Guardian → Revenue → Growth)
- **Orchestrator** — n8n meta-agent with 15-min cycle, Supabase policies
- **DIPLO BIBLE v3.0** — complete ecosystem specification
- **Build order** — contracts → events → core → safety (foundation first)
- **Edge/serverless split** — auth + language at edge, AI + processing serverless
- **TenantContext + ActorContext** — mandatory per call to core modules
- **Golden patterns** — tooling/generators for new modules and endpoints
- **Content Guard** — centralized compliance firewall for all outbound content
- **Anomaly Detector** — platform safety monitor with auto-throttle
- Comprehensive documentation: ARCHITECTURE, MODULES, ARCHETYPES, EVENTS, AGENTS, COMPLIANCE, SAFETY, API, INVESTOR, DEPLOYMENT, CONTRIBUTING

### Changed
- Monorepo structure: added `agents/`, `tooling/`, `reference/`, `supabase/`
- @silence/language and @silence/validator now edge-compatible (no Node-only APIs)
- @silence/safety upgraded to middleware layer wrapping all AI/medical/legal calls
- @silence/ai now uses AgentRuntime abstraction (swap providers without touching apps)
- Dashboard (apps/portal) now includes Agent Army tab
- Build order changed: contracts + events BEFORE domain modules
- Agent system: from 9 flat agents to 3-layer hierarchy with unlock conditions
- Vercel config: single root vercel.json, no duplicates in apps

### Architecture
- API-first, composable SaaS pattern
- Event-driven inter-module communication
- Multi-tenant isolation via RLS + tenant_id
- Edge computing for auth, rate limiting, language scan
- Closed modules: zero changes without OWNER review

## [2.0.0] — 2026-02-05

### Added
- DIPLO BIBLE v2.0 — master prompt document
- 13 modules defined (6 open, 7 closed)
- PatternLens (consumer) and PatternsLab (institutional) app specs
- Dashboard with KPI tabs
- Market research: AI mental health $1.82B → $7.83B
- Competitor analysis: Spring Health, Headspace, Calm, Wysa, Woebot
- Agent Army v1.0 — 9 autonomous agents concept
- Revenue targets: Month 3→18 projections

## [1.0.0] — 2026-01-31

### Added
- Initial monorepo setup (apps/portal + packages/ui)
- Portal dashboard with investor KPI cards
- @repo/ui package with components and layouts
- Vercel deployment configuration
- Supabase integration skeleton
- PatternLens v4.1 safety module (crisis detection, CrisisModal)
- Production database schema (Supabase)

### Framework
- SILENCE.OBJECTS v4.1 → v5.0 evolution
- Safety profile system (FULL / MINIMAL_ADULT_TOOL / ENTERPRISE)
- 4-phase analysis protocol
- Dual-lens system (Lens A / Lens B)
- Forbidden vocabulary enforcement
- 12 Jungian archetypes behavioral classification
