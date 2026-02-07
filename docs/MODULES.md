# MODULES.md — SILENCE.OBJECTS Module Reference

> 16 modules. 8 open source (MIT). 8 closed (proprietary).

## Module Map

| Module | Type | Edge-safe | Events | Status |
|--------|------|-----------|--------|--------|
| @silence/contracts | Open | ✅ | — | ✅ v1.0 |
| @silence/events | Open | ✅ | — | ✅ v1.0 |
| @silence/core | Open | ❌ | PatternCreated, ObjectAnalyzed | 🔧 |
| @silence/archetypes | Open | ❌ | ArchetypeUpdated | 🔧 |
| @silence/symbolic | Open | ✅ | — | 📋 |
| @silence/language | Open | ✅ | — | 🔧 |
| @silence/validator | Open | ✅ | — | 🔧 |
| @silence/ui | Open | ✅ | — | ✅ v0.1 |
| @silence/safety | Closed | ❌ | RiskFlagRaised, CrisisDetected | ✅ v1.0 |
| @silence/ai | Closed | ❌ | — | 📋 |
| @silence/predictive | Closed | ❌ | PredictionGenerated | 📋 |
| @silence/voice | Closed | ❌ | — | 📋 |
| @silence/medical | Closed | ❌ | — | 📋 |
| @silence/legal | Closed | ❌ | — | 📋 |
| @silence/linkedin-agent | Closed | ❌ | AgentRunCompleted | 📋 |

---

## OPEN SOURCE MODULES

### @silence/contracts

**Purpose:** Single source of truth for all TypeScript types.

**Exports:**
- `SilenceObject`, `Pattern`, `AnalysisPhase`
- `DualLensResult`, `LensInterpretation`
- `ArchetypeName`, `ArchetypeScore`, `ArchetypeBlend`
- `TenantContext`, `ActorContext`
- `AgentTask`, `AgentResult`
- `CoreModule`, `AIProvider`, `VoiceProvider`, `AgentModule` (interfaces)

**Rule:** Change to contract = breaking change = semver major.

---

### @silence/events

**Purpose:** Typed event bus for all inter-module communication.

**Exports:**
- `SilenceEventType` (union of all event names)
- `SilenceEvent<T>` (event envelope)
- `eventBus` (singleton)
- `SilenceEventBus` (class for custom instances)

**Event Types:** object.created, object.analyzed, pattern.detected, archetype.updated, prediction.generated, crisis.detected, risk.flagged, agent.run.completed, agent.run.failed, tenant.provisioned, subscription.changed, content.published, content.blocked, anomaly.detected

**Usage:**
```typescript
import { eventBus } from '@silence/events';

// Subscribe
const unsub = eventBus.on('pattern.detected', (event) => {
  console.log(event.payload);
});

// Emit
await eventBus.emit('pattern.detected', { patternId: '...' }, '@silence/core');
```

**Migration path:** In-process EventEmitter (v1) → Upstash Redis Streams (v2)

---

### @silence/core

**Purpose:** Pattern detection engine. 4-phase protocol. Dual-lens system.

**Implements:** `CoreModule` from @silence/contracts

**Exports:**
- `analyzeObject(object, actor)` → `DualLensResult`
- `extractPatterns(object)` → `Pattern[]`
- `dualLens(object)` → `{ lensA, lensB }`

**Protocol:**
```
Phase 1: CONTEXT  → What is the object? What surrounds it?
Phase 2: TENSION  → What conflict or pressure exists?
Phase 3: MEANING  → What structural significance?
Phase 4: FUNCTION → What role does this pattern serve?
```

**Emits:** `object.analyzed`, `pattern.detected`

**Pricing:** FREE — unlimited, never gated.

---

### @silence/archetypes

**Purpose:** 12 Jungian archetypes mapped to behavioral pattern classification.

**Exports:**
- `mapArchetype(patterns)` → `ArchetypeScore`
- `scoreBlend(history)` → `ArchetypeBlend`
- `trackShift(blendHistory)` → shift analysis

**Archetypes:** Creator, Ruler, Caregiver, Explorer, Sage, Hero, Rebel, Magician, Lover, Jester, Innocent, Orphan

**Framing rule:** "Your patterns currently align with..." NEVER "You are..."

**Emits:** `archetype.updated`

**Pricing:** Basic = FREE. Detailed reports = PRO.

---

### @silence/symbolic

**Purpose:** Pattern Catalysts — symbolic prompts for analytical framing.

**Framing:** "Pattern catalyst" NEVER "tarot/oracle/divination"

**Pricing:** Basic = FREE. Advanced catalysts = PRO.

---

### @silence/language

**Purpose:** Forbidden vocabulary enforcement. Output middleware.

**Exports:**
- `sanitize(text)` → cleaned text
- `validate(text)` → validation result
- `getForbiddenTerms()` → string[]

**Requirement:** MUST work in Edge Runtime (no Node-only APIs).

---

### @silence/validator

**Purpose:** Contract validation. CI/CD language audit. Safety gates.

**Requirement:** MUST work in Edge Runtime. Build fails if forbidden vocabulary detected.

---

### @silence/ui

**Purpose:** Shared design system across all apps.

**Components:** MetricCard, KpiGrid, Card, Section, Badge, DataTable, ArchetypeCard, PatternTimeline, CrisisModal, EventFeed

**Layouts:** PageLayout, DashboardLayout, InvestorLayout, ConsumerLayout, B2BLayout

**Style:** Tailwind 4, shadcn-style, dark mode default, mobile-first.

---

## CLOSED MODULES

### @silence/safety

**Purpose:** Crisis detection 3-layer system. P0 compliance.

**Implements:** Middleware layer — all AI/medical/legal calls pass through safety.

**3 Layers:**
1. Hard keywords (PL/EN) → immediate block + CrisisModal
2. Soft keywords → Claude risk assessment
3. Risk score (high/medium/low) → block/banner/proceed

**Emits:** `risk.flagged`, `crisis.detected`

**Pricing:** Included in framework. Not separately licensed.

---

### @silence/ai

**Purpose:** Claude API integration. Dual-lens structural analysis.

**Implements:** `AIProvider` from @silence/contracts

**Abstraction:** `AgentRuntime` — swap providers (Claude, GPT fallback) without touching apps.

**Pricing:** Pay-per-use (per analysis call).

---

### @silence/predictive

**Purpose:** AI pattern forecasting.

**Capabilities:** Cycle detection, trajectory modeling, early warning, pattern collision prediction.

**Emits:** `prediction.generated`

**Pricing:** Pay-per-prediction.

---

### @silence/voice

**Purpose:** Voice input → Whisper transcription → text for @silence/core.

**Implements:** `VoiceProvider` from @silence/contracts

**Rule:** Voice = INPUT METHOD. NOT emotion/mood detection.

---

### @silence/medical

**Purpose:** Medical disclaimers. Institutional compliance. GDPR health data.

**Access:** Institutional license only.

---

### @silence/legal

**Purpose:** Legal disclaimers. Terms of service. Privacy compliance.

**Access:** Institutional license only.

---

### @silence/linkedin-agent

**Purpose:** LinkedIn AI agent for B2B communication.

**Implements:** `AgentModule` from @silence/contracts

**Emits:** `agent.run.completed`
