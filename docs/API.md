# API.md — SILENCE.OBJECTS API Reference

> API-first architecture. Typed contracts via @silence/contracts.

## Authentication

All API calls use Supabase Auth JWT tokens.

```
Authorization: Bearer <supabase_jwt_token>
```

Anonymous access allowed for: health check, public module info.

## Base URLs

| Environment | URL |
|-------------|-----|
| Production (PatternLens) | `https://patternlens.app/api` |
| Production (PatternsLab) | `https://patternslab.app/api` |
| Development | `http://localhost:3000/api` |

## Endpoints

### Health Check

```
GET /api/health
```

Response: `{ "status": "ok", "version": "1.0.0", "timestamp": "..." }`

### Objects

#### Create Object

```
POST /api/objects
Content-Type: application/json
Authorization: Bearer <token>

{
  "input_text": "string (50-5000 chars)",
  "input_method": "text" | "voice",
  "selected_lens": "A" | "B"
}
```

Response:
```json
{
  "success": true,
  "object": {
    "id": "uuid",
    "user_id": "uuid",
    "input_text": "...",
    "processing_status": "processing",
    "created_at": "ISO 8601"
  },
  "crisis_detection": {
    "level": "NONE",
    "category": null,
    "requires_intervention": false
  }
}
```

**Safety:** Input passes through @silence/safety before processing. If crisis detected (CRITICAL/HIGH), object creation is blocked and crisis response returned.

#### List Objects

```
GET /api/objects?limit=20&offset=0
Authorization: Bearer <token>
```

#### Get Object

```
GET /api/objects/:id
Authorization: Bearer <token>
```

### Interpretations

#### Analyze Object

```
POST /api/interpret
Content-Type: application/json
Authorization: Bearer <token>

{
  "object_id": "uuid",
  "lens": "A" | "B"
}
```

Response:
```json
{
  "success": true,
  "interpretation": {
    "phase_1_context": { "situation": "...", "triggers": [...], "environment": "..." },
    "phase_2_tension": { "primary_tension": "...", "secondary_tensions": [...], "intensity": "medium" },
    "phase_3_meaning": { "interpretation": "...", "themes": [...], "significance": "..." },
    "phase_4_function": { "behavioral_patterns": [...], "adaptive_mechanisms": [...] }
  },
  "confidence_score": 0.85,
  "risk_level": "none",
  "processing_time_ms": 1200
}
```

### Voice Transcription

```
POST /api/transcribe
Content-Type: multipart/form-data
Authorization: Bearer <token>

file: <audio_blob>
```

Response: `{ "success": true, "text": "transcribed text", "language": "pl" }`

### Archetypes

#### Get User Archetype Blend

```
GET /api/archetypes/blend
Authorization: Bearer <token>
```

#### Get Archetype History

```
GET /api/archetypes/history?period=30d
Authorization: Bearer <token>
```

### KPI (Dashboard / Portal)

```
GET /api/kpi/daily
GET /api/kpi/weekly
GET /api/kpi/investor
Authorization: Bearer <admin_token>
```

## Rate Limits

| Tier | Limit | Window |
|------|-------|--------|
| FREE | 10 analyses/day | 24h rolling |
| PRO | 100 analyses/day | 24h rolling |
| Enterprise | Custom | Custom |
| API (developer) | 1000 calls/day | 24h rolling |

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1706140800
```

## Error Responses

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 3600 seconds.",
    "retry_after": 3600
  }
}
```

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input |
| `UNAUTHORIZED` | 401 | Missing/invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `CRISIS_DETECTED` | 200 | Input blocked by safety (not an error) |
| `INTERNAL_ERROR` | 500 | Server error |

## Multi-Tenant (B2B)

PatternsLab endpoints require TenantContext:

```
X-Tenant-Id: <tenant_uuid>
```

All data scoped by tenant_id via RLS.
