# SILENCE.OBJECTS COMPLIANCE MATRIX

## P0 — Safety (blocking)

3-layer crisis detection: hard keywords → soft keywords + Claude → risk engine.
P0 wymaga testów przed deployem. Sentinel blokuje łamiące PRy.

## P1 — Language

Wymuszone: Object, Pattern, Tension, Function, Lens A/B, Proposal, Pattern Catalyst, Archetype mapping.
Zakazane: therapy, diagnosis, advice, treatment, healing, wellness, spiritual, mystical, divine, horoscope, fortune, oracle, tarot.
Enforcement: @silence/language (runtime) + @silence/validator (CI/CD).

## P2 — Archetypes & framing

"your patterns currently align with..." NIGDY "you are X archetype".

## Matrix per moduł

| Module | P0 | P1 | P2 |
|---|---|---|---|
| contracts/events | N/A | N/A | N/A |
| core/archetypes/ai/predictive | Required | Required | Required |
| language/validator | Core | Core | Supports |
| safety/medical/legal | Core | Supports | N/A |
| ui/voice/linkedin-agent | Required | Required | Supports |

## CHANGELOG (COMPLIANCE.md)

- 2026-02-08 — Matrix P0/P1/P2 pod DIPLO_BIBLE v3.
