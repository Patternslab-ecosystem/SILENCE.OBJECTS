# SILENCE.OBJECTS CONTRIBUTING GUIDE

Open core: kontrybucje do otwartych modułów i tooling.

## Dozwolone

packages/contracts, events, core, archetypes, symbolic, language, validator, ui. Apps. Tooling. Docs.

## Ograniczone (OWNER review)

voice, ai, predictive, safety, medical, legal, linkedin-agent.

## Zasady

- TypeScript strict, zero any.
- Brak nowych deps bez zgody.
- Implementuj @silence/contracts, emituj @silence/events.
- Mobile-first, dark mode, Tailwind-only.

## PR process

Przed: pnpm lint, pnpm test, pnpm typecheck, pnpm compliance.
W PR: opis zmian, update docs. P0 zmiany = senior review + testy.

## CHANGELOG (CONTRIBUTING.md)

- 2026-02-08 — Zasady kontrybucji pod DIPLO_BIBLE v3.
