# SILENCE.OBJECTS MODULES CATALOG v3.0

Jedyne źródło prawdy dla modułów w `packages/*`, zgodne z DIPLO_BIBLE v3.0.

## Tabela modułów

| Package | Type | Events (emit) | Pricing |
|---|---|---|---|
| @silence/contracts | open | Brak (pure types) | MIT |
| @silence/events | open | Wszystkie domain events | MIT |
| @silence/core | open | PatternCreated, ObjectAnalyzed | MIT |
| @silence/archetypes | open | ArchetypeUpdated | MIT |
| @silence/symbolic | open | — | MIT |
| @silence/language | open | — | MIT |
| @silence/validator | open | ValidationFailed, ComplianceBreach | MIT |
| @silence/ui | open | — | MIT |
| @silence/voice | closed | ObjectTranscribed | per-usage |
| @silence/ai | closed | AgentRunCompleted, RiskFlagRaised | per-usage |
| @silence/predictive | closed | PredictionGenerated | per-prediction |
| @silence/safety | closed | CrisisDetected, RiskFlagRaised | platform fee |
| @silence/medical | closed | ComplianceLog | enterprise |
| @silence/legal | closed | ComplianceLog | enterprise |
| @silence/linkedin-agent | closed | AgentRunCompleted | per-tenant |

### @silence/contracts
Centralne źródło typów: User, Object, Pattern, Archetype, Tension, AgentTask, AgentResult, TenantContext, ActorContext. Zmiana kontraktu = breaking change = semver major.

### @silence/events
Typed event bus. EventEmitter in-process → migration path Upstash Redis Streams. EventEnvelope<P> = { id, type, occurredAt, payload, tenantId?, actorId? }. emit(), subscribe().

### @silence/core
Silnik pattern detection. 4-phase: Context → Tension → Meaning → Function. Dual-lens. API: analyzeObject(), extractPatterns(), dualLens().

### @silence/archetypes
12 archetypów Jungowskich. API: mapArchetype(), scoreBlend(), trackShift(). Framing: "Your patterns currently align with..." NIGDY "You are..."

### @silence/symbolic
Pattern Catalysts. Symboliczne prompty zero mystycyzm. API: getCatalystDeck(), drawCatalyst().

### @silence/language
Guardrails językowe, edge-compatible. API: sanitize(), validate(), getForbiddenTerms().

### @silence/validator
Contract validator + compliance audit CI/CD. API: validateContracts(), scanForbiddenVocabulary().

### @silence/ui
Design system. Tailwind 4, shadcn-style, dark mode default, mobile-first. Layouts: PageLayout, DashboardLayout, InvestorLayout, ConsumerLayout, B2BLayout. Widgets: MetricCard, KpiGrid, Card, Section, Badge, DataTable, ArchetypeCard, PatternTimeline, CrisisModal, EventFeed.

### @silence/voice (closed)
Voice input → Whisper transkrypcja → tekst. ZERO detekcji emocji. API: transcribe().

### @silence/ai (closed)
Claude Sonnet 4 (primary) + GPT-4o (fallback). Dual-lens structural analysis. API: runAnalysis(), runBatch(). Każde wywołanie przez @silence/safety.

### @silence/predictive (closed)
Cykl detection, trajectory modeling, early warning, pattern collision. API: predictTrajectory(), detectCycles().

### @silence/safety (closed)
3-layer crisis detection, middleware P0. API: checkText(), wrapProvider(). Musi mieć testy przed każdym deployem.

### @silence/medical / @silence/legal (closed)
Disclaimery, polityki, compliance health data. Enterprise only.

### @silence/linkedin-agent (closed)
LinkedIn AI agent. Content + auto-reply. API: runLinkedInCampaign().

## CHANGELOG (MODULES.md)

- 2026-02-08 — Pełny katalog 16 modułów pod DIPLO_BIBLE v3.
