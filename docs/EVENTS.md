# SILENCE.OBJECTS EVENT CATALOG v3.0

Typed event system oparty o @silence/contracts i @silence/events.

## Event envelope

type EventEnvelope<P> = { id: string; type: string; occurredAt: string; payload: P; tenantId?: string; actorId?: string }

## Domeny eventów

- Domain: ObjectAnalyzed, PatternCreated, ArchetypeUpdated, PredictionGenerated
- Safety: CrisisDetected, RiskFlagRaised
- Agent: AgentRunCompleted, AnomalyDetected
- Platform: TenantProvisioned, SubscriptionChanged

## Subscription patterns

- Portal: SSE/WebSocket → EventFeed, KpiGrid, CrisisModal
- Agent Army (n8n): triggery na kpi_daily, RiskFlagRaised, CrisisDetected
- Supabase: każdy event → tabela events z indeksami

## Versioning

Zmiana event schema = breaking change w @silence/contracts + semver major.

## CHANGELOG (EVENTS.md)

- 2026-02-08 — Katalog eventów, envelope, subscription patterns pod DIPLO_BIBLE v3.
