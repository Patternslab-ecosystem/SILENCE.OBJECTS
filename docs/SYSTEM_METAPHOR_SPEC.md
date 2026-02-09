# SYSTEM_METAPHOR_SPEC — System Metaphor Vocabulary

> SILENCE.OBJECTS v5.3 — Structural behavioral pattern analysis framework

## Overview

System Metaphors are compliance-safe computational metaphors used to describe
emergent behavioral states detected across a user's object history. They replace
forbidden clinical/psychological language with structural engineering terminology.

These metaphors are detected by `@silence/core` via `detectSystemMetaphor()` and
serve as a bridge between raw pattern data and user-facing insight.

## The 4 System Metaphors

### 1. Overload Protocol

**Trigger**: High-frequency object creation (>5 objects in 48h) combined with
3+ distinct pattern categories and rising tension count.

**Description**: The system is processing more inputs than its normal throughput.
Multiple pattern categories are simultaneously active, creating analytical density.

**User-facing label**: "Overload Protocol detected — high-density pattern activity"

**Severity**: LOW — informational only, no safety trigger.

### 2. Buffer Overflow

**Trigger**: Repeated pattern categories across 3+ consecutive objects with
identical or near-identical tension pairs. The same structural loop is recurring
without resolution or shift.

**Description**: A structural loop is detected — the same pattern configuration
keeps recurring without evolution. The analytical buffer is full of repeated signals.

**User-facing label**: "Buffer Overflow — recurring pattern loop detected"

**Severity**: MEDIUM — may suggest stagnation. Prompt archetype shift analysis.

### 3. Deadlock Loop

**Trigger**: Two opposing tension pairs dominate across 5+ objects within a
14-day window, with no new pattern categories emerging.

**Description**: Two forces are in persistent opposition with no resolution vector.
Neither side is yielding, creating analytical paralysis.

**User-facing label**: "Deadlock Loop — persistent opposing tensions"

**Severity**: MEDIUM — structural observation only.

### 4. Kernel Panic

**Trigger**: Crisis keywords detected (from `@silence/safety` hard keyword list)
combined with LOSS + CONFLICT pattern dominance and confidence > 0.7.

**Description**: Critical structural collapse signal. The pattern configuration
combined with crisis-level language signals a state requiring immediate resource display.

**User-facing label**: "System alert — resources available"

**Severity**: CRITICAL — triggers `@silence/safety` Layer 2 (passive resource display).
Emits `RiskFlagRaised` event via `@silence/events`.

**IMPORTANT**: Kernel Panic does NOT block the user, does NOT provide advice,
does NOT diagnose. It ONLY displays crisis resources passively (ADR §2.3).

## Implementation

**File**: `packages/core/src/index.ts` (exported as `detectSystemMetaphor`)

```typescript
interface MetaphorDetection {
  type: 'overload_protocol' | 'buffer_overflow' | 'deadlock_loop' | 'kernel_panic';
  label: string;
  severity: 'LOW' | 'MEDIUM' | 'CRITICAL';
  description: string;
  detectedAt: string;
}

function detectSystemMetaphor(
  objects: Array<{ patterns: string[]; tensions: string[]; timestamp: string }>,
  windowDays?: number,
): MetaphorDetection | null;
```

**Parameters**:
- `objects`: Array of recent analysis results (patterns + tensions + timestamp)
- `windowDays`: Lookback window in days (default: 14)

**Returns**: The highest-severity metaphor detected, or `null` if none apply.

## Compliance Notes

- All 4 metaphors use computational/engineering language only
- No forbidden vocabulary (no "crisis", "breakdown", "anxiety" in user-facing labels)
- Kernel Panic triggers safety resource display but NEVER blocks or advises
- Metaphor names are internal — user-facing labels use neutral structural language
- The word "panic" in "kernel_panic" is an internal engineering term (like Linux kernel panic), NOT a psychological term

## Event Integration

When `kernel_panic` is detected, the system emits:
```typescript
eventBus.emit('RiskFlagRaised', {
  level: 'CRITICAL',
  source: 'system_metaphor',
  metaphor: 'kernel_panic',
  timestamp: new Date().toISOString(),
});
```

This event is consumed by `@silence/safety` to display crisis resources passively.

---

*DIPLO BIBLE v3.0 compliant — no forbidden vocabulary in user-facing output*
