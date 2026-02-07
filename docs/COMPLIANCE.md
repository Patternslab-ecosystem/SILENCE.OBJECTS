# COMPLIANCE.md — SILENCE.OBJECTS Compliance Matrix

> Zero tolerance. Automated enforcement. Build fails on violation.

## Priority Levels

| Priority | Description | Consequence |
|----------|-------------|-------------|
| **P0** | Safety-critical. Must pass before ANY deploy. | Build blocked, deploy halted |
| **P1** | Compliance-critical. Must pass before release. | PR blocked, warning issued |
| **P2** | Quality. Should pass, can be deferred. | Warning in CI, manual review |

## P0: Safety Compliance

| Rule | Enforcement | Module |
|------|-------------|--------|
| Crisis detection active on all user inputs | Integration test | @silence/safety |
| CrisisModal renders on CRITICAL/HIGH detection | Component test | @silence/safety |
| Emergency resources display correctly (PL/EN) | Snapshot test | @silence/safety |
| Crisis events logged to nuclear_events table | E2E test | @silence/safety |
| No forbidden vocabulary in system output | CI grep + lint | @silence/language |
| Mandatory disclaimer displayed in all apps | Visual test | All apps |
| RLS enabled on ALL Supabase tables | Schema validation | Database |
| Closed modules: zero changes without OWNER | GitHub CODEOWNERS | CI |

## P1: Language Compliance

### Forbidden Vocabulary

These terms MUST NOT appear in any system output, UI copy, AI prompt, or documentation:

| Forbidden Term | Replacement |
|----------------|-------------|
| mental health | *(remove — not in scope)* |
| therapy / therapeutic | structural analysis |
| emotional support | *(remove — not in scope)* |
| wellbeing / well-being | system state |
| healing | stabilization |
| diagnosis | classification |
| disorder | pattern signature |
| anxiety | activation pattern |
| depression | suppression pattern |
| trauma | high-impact event |
| coping | response mechanism |
| self-care | system maintenance |
| mindfulness | *(remove — not in scope)* |
| meditation | *(remove — not in scope)* |
| journal / journaling | object capture / recording |
| feelings | signals |
| emotions | responses |
| safe space | *(remove — not in scope)* |
| empowerment | *(remove — not in scope)* |
| resilience | system durability |
| vulnerability | exposure state |
| inner child | *(remove — not in scope)* |
| toxic | system fault / destructive loop |

### Allowed Vocabulary

| Category | Terms |
|----------|-------|
| Pattern mechanics | pattern, loop, cycle, trigger, response, cost, drift |
| System state | stabilization, degradation, oscillation, convergence |
| Analysis | structure, function, tension, context, mechanism |
| Faults | system fault, pattern fault, loop break, dead loop |
| Objects | object, record, capture, snapshot |
| Classification | label, category, type, cluster, signature |
| Symbolic | archetype, symbol, catalyst, probe, lens |
| Temporal | frequency, interval, recurrence, decay, persistence |

### CI Enforcement

```bash
#!/bin/bash
# scripts/check-language.sh — runs in CI pipeline
FORBIDDEN=("mental health" "therapy" "therapeutic" ...)
# grep across packages/ apps/ — build fails on match
# Excludes: 01-LANGUAGE.md, nuclear-copy.ts, crisis-keywords.ts
```

### AI Prompt Compliance

All AI system prompts MUST include:

```
You are a structural pattern interpreter.
Use only engineering-grade vocabulary.
Never use clinical, therapeutic, or wellness language.
```

## P2: Archetype Framing

| ✅ Correct | ❌ Forbidden |
|-----------|-------------|
| "Patterns align with Creator" | "You are a Creator" |
| "Behavioral pattern classification" | "Personality type" |
| "Pattern catalyst" | "Tarot/oracle/divination" |
| "Structural analysis" | "Emotional analysis" |
| "Voice input" | "Emotion detection" |

## App Store Classification

**Category:** Productivity / Developer Tools

**NOT:** Health, Wellness, Mental Health, Self-Help, Medical

## Mandatory Disclaimer (verbatim, all apps)

```
This tool analyzes behavioral patterns for productivity and system debugging.
It does not provide therapy, diagnosis, or crisis support.
```
