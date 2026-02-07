# EVENTS.md — SILENCE.OBJECTS Event Catalog

> Typed event bus. All state changes emit events.
> In-process v1 (EventEmitter) → Redis Streams v2.

## Event Envelope

Every event wraps in a standard envelope:

```typescript
interface SilenceEvent<T> {
  id: string;              // Unique event ID
  type: SilenceEventType;  // Event type discriminator
  payload: T;              // Typed payload
  timestamp: string;       // ISO 8601
  source: string;          // Module that emitted (e.g., "@silence/core")
  tenantId?: string;       // B2B tenant isolation
  userId?: string;         // User who triggered
}
```

## Event Catalog

### Domain Events

| Event | Source | Payload | Subscribers |
|-------|--------|---------|-------------|
| `object.created` | @silence/core | `{ objectId, userId, captureMethod }` | Analytics, Dashboard |
| `object.analyzed` | @silence/core | `{ objectId, lensResult, processingMs }` | Dashboard, Predictive |
| `pattern.detected` | @silence/core | `{ patternId, objectId, type, confidence }` | Archetypes, Analytics |
| `archetype.updated` | @silence/archetypes | `{ userId, blend, previousBlend }` | Dashboard, Predictive |
| `prediction.generated` | @silence/predictive | `{ userId, predictionType, confidence }` | Dashboard, Notifications |

### Safety Events

| Event | Source | Payload | Subscribers |
|-------|--------|---------|-------------|
| `crisis.detected` | @silence/safety | `{ level, category, userId, blocked }` | Dashboard, Audit, Notifications |
| `risk.flagged` | @silence/safety | `{ riskLevel, source, details }` | Dashboard, Agent Orchestrator |

### Agent Events

| Event | Source | Payload | Subscribers |
|-------|--------|---------|-------------|
| `agent.run.completed` | agents/* | `{ agentId, taskType, success, cost, durationMs }` | Dashboard, Analytics |
| `agent.run.failed` | agents/* | `{ agentId, taskType, error, retryable }` | Dashboard, Anomaly Detector |
| `content.published` | agents/content-* | `{ platform, contentId, type }` | Analytics, Dashboard |
| `content.blocked` | agents/content-guard | `{ reason, contentId, agentId }` | Dashboard, Audit |
| `anomaly.detected` | agents/anomaly-detector | `{ level, channel, details }` | Orchestrator, Dashboard |

### Platform Events

| Event | Source | Payload | Subscribers |
|-------|--------|---------|-------------|
| `tenant.provisioned` | apps/patternslab | `{ tenantId, plan, seats }` | Dashboard, Billing |
| `subscription.changed` | Stripe webhook | `{ userId, oldPlan, newPlan }` | Dashboard, CS Agent |

## Subscription Patterns

### Direct Subscription

```typescript
import { eventBus } from '@silence/events';

// Single event type
const unsub = eventBus.on('pattern.detected', async (event) => {
  await saveToAnalytics(event.payload);
});

// All events (for logging/audit)
const unsubAll = eventBus.onAll(async (event) => {
  await persistEvent(event);
});

// Cleanup
unsub();
unsubAll();
```

### Dashboard (WebSocket/SSE)

```typescript
// Server: forward events to connected clients
eventBus.onAll((event) => {
  if (event.type.startsWith('agent.')) {
    broadcastToAdminClients(event);
  }
});
```

### Agent System (n8n)

```
n8n webhook receives events via HTTP POST:
  crisis.detected → trigger escalation workflow
  anomaly.detected → trigger throttle workflow
  agent.run.failed → trigger retry/alert workflow
```

## Persistence

All events are persisted to Supabase `events` table for replay and audit:

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  payload JSONB NOT NULL,
  source TEXT NOT NULL,
  tenant_id UUID,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_type ON events(type, created_at DESC);
CREATE INDEX idx_events_tenant ON events(tenant_id, created_at DESC);
```

## Migration Path

| Phase | Transport | Latency | Reliability |
|-------|-----------|---------|-------------|
| v1 (now) | In-process EventEmitter | ~0ms | Process-bound |
| v2 | Upstash Redis Streams | ~5ms | Cross-process, durable |
| v3 (if needed) | AWS SQS / Kafka | ~20ms | Multi-region, guaranteed |
