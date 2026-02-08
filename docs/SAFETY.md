# SILENCE.OBJECTS SAFETY PROTOCOL

Moduł P0 — crisis detection, blocking, resources.

## 3-layer crisis detection

- Layer 1: Hard keywords (PL/EN) → immediate block + CrisisModal + CrisisDetected event.
- Layer 2: Soft keywords → Claude risk assessment.
- Layer 3: Risk engine (high/medium/low) → block/banner/proceed.

## Middleware

Każde wywołanie @silence/ai, medical, legal przechodzi przez @silence/safety wrapper.
High risk: response blokowany, CrisisModal z zasobami.

## Testowanie

- Hard keywords: 100% wykrycie, zero false negatives.
- Build fail jeśli testy P0 czerwone.

## CHANGELOG (SAFETY.md)

- 2026-02-08 — Middleware, 3-layer, testy pod DIPLO_BIBLE v3.
