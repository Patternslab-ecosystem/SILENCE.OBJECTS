# CONTRIBUTING.md — Contributing to SILENCE.OBJECTS

## What's Open for Contribution

| Module | Contributions Welcome |
|--------|-----------------------|
| @silence/contracts | ✅ Type definitions, schema proposals |
| @silence/events | ✅ Event types, handlers |
| @silence/core | ✅ Pattern detection algorithms |
| @silence/archetypes | ✅ Archetype definitions, scoring |
| @silence/symbolic | ✅ Community symbols, catalysts |
| @silence/language | ✅ Vocabulary rules, locale support |
| @silence/validator | ✅ Validation rules, CI tools |
| @silence/ui | ✅ Components, layouts, themes |
| @silence/safety | ❌ CLOSED — owner review only |
| @silence/ai | ❌ CLOSED |
| @silence/predictive | ❌ CLOSED |
| @silence/voice | ❌ CLOSED |
| @silence/medical | ❌ CLOSED |
| @silence/legal | ❌ CLOSED |

## Setup

```bash
git clone https://github.com/Patternslab-ecosystem/SILENCE.OBJECTS.git
cd SILENCE.OBJECTS
pnpm install
pnpm dev
```

## Code Contract

1. TypeScript strict — zero `any` / `unknown` / implicit any
2. Explicit types on all props and return values
3. No `!` (non-null assertion) unless absolutely necessary
4. Zero new packages without maintainer approval
5. Imports: relative paths, aliases only from tsconfig paths
6. Mobile-first, dark mode default
7. Tailwind only — zero inline styles
8. Modules implement interfaces from @silence/contracts
9. Emit typed events from @silence/events
10. Edge-compatible: @silence/language and @silence/validator must have no Node-only APIs

## Language Compliance

**Your PR will be automatically rejected if it contains forbidden vocabulary.**

Run before committing:

```bash
./scripts/check-language.sh
```

See [COMPLIANCE.md](COMPLIANCE.md) for the full forbidden/allowed vocabulary list.

## PR Process

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make changes following the code contract
4. Run language check: `./scripts/check-language.sh`
5. Run type check: `pnpm type-check` (when available)
6. Commit with conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
7. Push and create PR against `main`
8. Wait for CI + maintainer review

## Conventional Commits

```
feat: add new archetype scoring algorithm
fix: correct CrisisModal keyboard handling
docs: update ARCHETYPES.md with Orphan growth edge
refactor: extract event handler into separate module
test: add unit tests for crisis keyword detection
chore: update dependencies
```

## Architecture Rules

- **Apps are thin shells.** Business logic goes in `packages/*`, not `apps/*`.
- **Contracts first.** If you're adding a new type, add it to @silence/contracts.
- **Events for state changes.** If something important happens, emit an event.
- **Safety wraps everything.** AI/medical/legal calls go through @silence/safety.
