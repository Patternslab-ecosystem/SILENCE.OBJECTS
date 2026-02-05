# PatternLens Ecosystem

Production monorepo: PatternLens (consumer PWA + mobile) + patternsLab (B2B/institutions) + portal (investor/admin).

## Structure

- `apps/patternlens` → Consumer PWA + Capacitor (iOS/Android)
- `apps/patternslab` → B2B platform (workspace, experiments, compliance)
- `apps/portal` → Investor & admin dashboard (default: investor view)
- `apps/investor` → Public deck (patternslab.work)
- `apps/docs` → Framework docs
- `packages/ui` → Design system v4.0 (Tailwind 4 + shadcn + CVA)
- `packages/db` → Supabase + Drizzle schema
- `packages/ai` → Claude/Ollama/Whisper adapters
- `packages/contracts` → Zod validators + TS types
- `packages/config` → Shared config (ESLint, TS, feature flags)

## Commands

```bash
pnpm install
pnpm dev              # Start all apps
pnpm build            # Build all apps
pnpm lint             # Lint all packages
pnpm test             # Run tests
# ═══════════════════════════════════════════════════════════════════════════════
# PATTERNLENS ECOSYSTEM — ROOT + PACKAGES/UI + APPS/PATTERNLENS
# ═══════════════════════════════════════════════════════════════════════════════

cd ~ && rm -rf patternlens-ecosystem && mkdir -p patternlens-ecosystem && cd patternlens-ecosystem

mkdir -p packages/ui/components packages/ui/lib packages/ui/logos
mkdir -p apps/patternlens/app/(tabs) apps/patternlens/public
mkdir -p .github/workflows

# ═══════════════════════════════════════════════════════════════════════════════
# ROOT
# ═══════════════════════════════════════════════════════════════════════════════

cat > package.json << 'EOF'
{
  "name": "patternlens-ecosystem",
  "private": true,
  "packageManager": "pnpm@9.15.0",
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "test": "vitest",
    "clean": "turbo clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "^2.3.0",
    "typescript": "^5.7.0",
    "vitest": "^2.1.0"
  }
}
