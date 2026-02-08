# SILENCE.OBJECTS EVENT CATALOG v3.0

Typed event system oparty o @silence/contracts i @silence/events.

## Event envelope

type EventEnvelope<P> = { id: string; type: string; occurredAt: string; payload: P; tenantId?: string; actorId?: string; correlationId?: string }

## Domeny eventów

- Domain: object.analyzed, pattern.created, archetype.updated, prediction.generated
- Safety: crisis.detected, risk.flag.raised
- Agent: agent.run.completed, anomaly.detected
- Platform: tenant.provisioned, subscription.changed

## Subscription patterns

- Portal: SSE/WebSocket → EventFeed, KpiGrid, CrisisModal
- Agent Army (n8n): triggery na kpi_daily, risk.flag.raised, crisis.detected
- Supabase: każdy event → tabela events z indeksami

## Versioning

Zmiana event schema = breaking change w @silence/contracts + semver major.

## CHANGELOG (EVENTS.md)

- 2026-02-08 — Katalog eventów, envelope, subscription patterns pod DIPLO_BIBLE v3.
