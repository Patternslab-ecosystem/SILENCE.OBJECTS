# SILENCE.OBJECTS API REFERENCE v3.0

Kontraktowo definiowane w @silence/contracts. Vercel Functions / Server Actions / tRPC. Supabase Auth.

## Auth

Authorization: Bearer <Supabase JWT>. Edge: TenantContext + ActorContext.

## Endpoints

### POST /api/objects/analyze
Body: { objectId, content }. Response: { patterns, archetypeBlend, eventsEmitted }.
Flow: edge auth → @silence/core.analyzeObject() → events.

### GET /api/archetypes/profile
Aktualny blend + timeline.

### POST /api/predictive/forecast
Pay-per-use. @silence/predictive.

### POST /api/voice/transcribe
Proxy do @silence/voice (Whisper) z safety + language.

## Rate limits

FREE: konserwatywne. PRO: wyższe + priorytet. B2B: per tenant. Upstash Redis.

## Errors

{ code, message, details, correlationId }. Crisis: CRISIS_BLOCKED.

## CHANGELOG (API.md)

- 2026-02-08 — Contracts-first API pod DIPLO_BIBLE v3.
