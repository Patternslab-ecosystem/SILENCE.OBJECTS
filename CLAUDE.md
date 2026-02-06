# CLAUDE.md — SILENCE.OBJECTS Ecosystem

## Project Overview

SILENCE.OBJECTS is a B2B SaaS Dashboard & Investor Portal for PatternLabs. It provides financial metrics tracking (ARR, MRR, DAU, Churn, LTV/CAC, Runway, NRR) with role-based views for investors, admins, and B2B consumers. Dark-themed professional UI deployed on Vercel.

**Current state**: Foundation phase. Portal app is live with shared UI components, typed contracts, event bus, 12 agent scaffolds, CI/CD pipelines, and shared tooling. Build and lint pass. The DIPLO BIBLE v3 plans 15 packages and 3 apps — core infrastructure is in place, domain packages and additional apps are next.

**Build status**: PASSING — `pnpm build` and `pnpm lint` both succeed.

## Tech Stack

- **Framework**: Next.js 14.2.18 (App Router) + React 18.3.1
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 3.4.1, dark theme (Zinc palette, `bg-zinc-950`/`text-zinc-100`)
- **Monorepo**: pnpm 10.x workspaces (`apps/*`, `packages/*`, `tooling/*`, `agents/*`)
- **Build orchestration**: Turborepo (`turbo.json`)
- **Deployment**: Vercel (nextjs framework preset)
- **CI/CD**: GitHub Actions (ci, deploy, security, publish)
- **Planned integrations**: Supabase (auth/db), Anthropic API — neither wired up

## Repository Structure

```
SILENCE.OBJECTS/
├── apps/
│   └── portal/                     # Next.js 14 dashboard — primary app
│       ├── app/
│       │   ├── layout.tsx          # Root layout (dark theme, metadata)
│       │   ├── page.tsx            # Dashboard home (uses @silence/ui Card)
│       │   ├── error.tsx           # Error boundary (client component)
│       │   ├── loading.tsx         # Loading state
│       │   ├── not-found.tsx       # 404 page
│       │   ├── globals.css         # Tailwind base imports
│       │   ├── lib/
│       │   │   └── mock-data.ts    # Single source of truth for mock KPI data
│       │   ├── api/
│       │   │   ├── kpi/route.ts    # KPI metrics endpoint (uses mock-data)
│       │   │   └── linkedin/route.ts  # LinkedIn OAuth stub
│       │   └── investor/
│       │       └── dashboard/page.tsx # Investor KPI dashboard (uses @silence/ui)
│       ├── .eslintrc.json          # ESLint: next/core-web-vitals
│       ├── next.config.js          # transpilePackages: @silence/ui, @silence/contracts
│       ├── tailwind.config.js      # Content: ./app + ../../packages/ui/src
│       ├── postcss.config.js       # tailwindcss + autoprefixer
│       ├── tsconfig.json           # ES2017, Next.js plugin, @/* -> ./app/*
│       └── package.json            # next 14.2.18, @silence/ui, @silence/contracts
│
├── packages/
│   ├── contracts/                  # @silence/contracts — TYPES SOURCE OF TRUTH
│   │   ├── src/
│   │   │   ├── index.ts           # Barrel: kpi, api, portal exports
│   │   │   ├── kpi.ts             # KpiMetrics, KpiCard, MrrTrendPoint, MetricsTableRow
│   │   │   ├── api.ts             # ApiResponse<T>, PaginatedResponse<T>, ApiError
│   │   │   └── portal.ts          # PortalTab, UserRole, PortalConfig
│   │   ├── tsconfig.json          # Extends tooling/ts-config/library.json
│   │   └── package.json
│   │
│   ├── events/                     # @silence/events — typed event bus
│   │   ├── src/
│   │   │   ├── index.ts           # Exports: EventBus, event types
│   │   │   ├── types.ts           # SilenceEvent, EventHandler, EventMap
│   │   │   └── bus.ts             # EventBus class (typed pub/sub)
│   │   ├── tsconfig.json          # Extends tooling/ts-config/library.json
│   │   └── package.json           # Depends on @silence/contracts
│   │
│   └── ui/                         # @silence/ui — shared design system
│       ├── src/
│       │   ├── index.ts            # Barrel: layouts + components
│       │   ├── components/         # Card, Badge, MetricCard, KpiGrid, Section, DataTable
│       │   └── layouts/            # PageLayout, DashboardLayout, InvestorLayout, ConsumerLayout, B2BLayout
│       └── package.json            # Peer dep: react ^18.3.1
│
├── agents/                          # Agent army (12 agents)
│   ├── orchestrator/               # @silence/agent-orchestrator — meta-agent (IMPLEMENTED)
│   │   └── src/
│   │       ├── orchestrator.ts     # Agent lifecycle management
│   │       └── types.ts            # AgentConfig, AgentStatus
│   ├── sentinel/                   # @silence/agent-sentinel — CI/CD guard (IMPLEMENTED)
│   │   └── src/sentinel.ts         # Build, type, lint checking
│   ├── content-guard/              # Compliance firewall (stub)
│   ├── anomaly-detector/           # Platform safety monitor (stub)
│   ├── sales-autopilot/            # Lead → Deal pipeline (stub)
│   ├── customer-success/           # Retention + upsell (stub)
│   ├── analytics-reporter/         # KPI + investor reports (stub)
│   ├── linkedin-dominator/         # LinkedIn automation (stub)
│   ├── content-machine/            # SEO + blog + newsletter (stub)
│   ├── social-swarm/               # Twitter, Reddit, Quora, HN (stub)
│   ├── growth-hacker/              # Viral loops, ASO (stub)
│   └── community-builder/          # Discord bot (stub)
│
├── tooling/
│   ├── ts-config/                  # @silence/ts-config — shared TypeScript configs
│   │   ├── base.json              # ES2022, strict, bundler resolution
│   │   ├── nextjs.json            # Extends base, ES2017, Next.js plugin
│   │   └── library.json           # Extends base, declaration + sourcemap
│   ├── eslint-config/             # @silence/eslint-config — shared ESLint
│   │   ├── index.js               # next/core-web-vitals + TypeScript rules
│   │   └── library.js             # @typescript-eslint/recommended
│   └── generators/                 # Code generation templates (placeholder)
│
├── docs/                            # Project documentation (14 files)
│   ├── README.md                   # Documentation index
│   ├── DIPLO_BIBLE_v3.md          # Architecture bible reference
│   ├── ARCHITECTURE.md            # Monorepo structure overview
│   ├── MODULES.md                 # @silence/* package registry
│   ├── ARCHETYPES.md              # Archetype system
│   ├── API.md                     # REST API reference
│   ├── EVENTS.md                  # Event catalog
│   ├── AGENTS.md                  # Agent army documentation
│   ├── COMPLIANCE.md              # Compliance framework
│   ├── SAFETY.md                  # Safety monitoring
│   ├── INVESTOR.md                # Investor portal docs
│   ├── DEPLOYMENT.md              # Deployment & CI/CD
│   ├── CONTRIBUTING.md            # Contributing guidelines
│   └── CHANGELOG.md               # Version history
│
├── .github/workflows/
│   ├── ci.yml                      # Lint, type check, build on PR
│   ├── deploy.yml                  # Vercel deploy on main push
│   ├── security.yml                # Dependency audit (weekly + on PR)
│   └── publish.yml                 # npm publish on release
│
├── turbo.json                      # Turborepo: build, lint, dev, clean pipelines
├── package.json                    # Root workspace scripts
├── pnpm-workspace.yaml            # apps/*, packages/*, tooling/*, agents/*
├── tsconfig.json                   # Root TS config
├── vercel.json                     # Vercel deployment config
├── .env.example                    # Environment variable template
└── .gitignore                      # Standard ignores + git-fix-clean.sh
```

## Commands

All commands run from the repository root:

```bash
pnpm install              # Install all workspace dependencies
pnpm dev                  # Start dev server (port 3000)
pnpm build                # Build Next.js production bundle
pnpm lint                 # Run ESLint (next/core-web-vitals)
pnpm clean                # Remove .next, all node_modules
```

## Architecture & Conventions

### Monorepo

- **pnpm workspaces** with `workspace:*` protocol for internal deps
- **Turborepo** for build orchestration, caching, and dependency graph
- Workspace globs: `apps/*`, `packages/*`, `tooling/*`, `agents/*`
- Package namespace: `@silence/*` (e.g., `@silence/ui`, `@silence/contracts`)
- Agent namespace: `@silence/agent-*` (e.g., `@silence/agent-orchestrator`)

### Package Architecture

- **@silence/contracts** — Types source of truth. All shared interfaces live here. Import types from contracts, never define ad-hoc inline types for shared data.
- **@silence/events** — Typed event bus. Cross-module communication via `EventBus`. All events defined in `EventMap`.
- **@silence/ui** — Shared design system. Components used by portal pages. Never duplicate markup that exists as a component.
- **Agents** — Each agent is a workspace package with access to contracts and events.

### Component Patterns

- Functional components with TypeScript interfaces for props
- Named exports for shared UI components (no default exports in `packages/ui`)
- `export default function` required for Next.js page components (`page.tsx`)
- Barrel exports via `index.ts` files in `components/` and `layouts/`
- File naming: PascalCase for components (`MetricCard.tsx`), kebab-case for config files

```typescript
// Standard shared component pattern (from packages/ui/src/components/Card.tsx)
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  title?: string;
}

export function Card({ children, title }: CardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 md:p-6">
      {title && <h3 className="text-lg font-semibold text-zinc-100 mb-4">{title}</h3>}
      {children}
    </div>
  );
}
```

### Styling

- Tailwind CSS utility classes only (no CSS modules, no styled-components)
- Dark theme: `zinc-950` background, `zinc-900` for cards, `zinc-800` borders, `zinc-100` text
- Accent color: `emerald-400`/`emerald-500` for positive trends/growth indicators
- Muted text: `zinc-400` for descriptions, `zinc-500` for labels/secondary
- Responsive breakpoints use `md:` prefix pattern (mobile-first)
- Card pattern: `rounded-xl border border-zinc-800 bg-zinc-900 p-4 md:p-6`

### Routing

- Next.js 14 App Router with file-based routing
- API routes in `app/api/` directory (GET endpoints returning `NextResponse.json()`)
- Server components by default; `"use client"` only for `error.tsx`
- Error boundary (`error.tsx`), loading state (`loading.tsx`), and 404 (`not-found.tsx`) at app root
- Current routes:
  - `/` — Dashboard home (tab navigation, 4 KPI cards)
  - `/investor/dashboard` — Investor KPI view (8 metrics, MRR chart, metrics table)
  - `/api/kpi` — GET: returns mock KPI JSON (typed via `@silence/contracts`)
  - `/api/linkedin` — GET: returns LinkedIn integration stub

### Data Flow

- **All data is centralized in `app/lib/mock-data.ts`** — single source of truth for mock KPI values
- Mock data is typed via `@silence/contracts` interfaces (`KpiMetrics`, `KpiCard`, `MrrTrendPoint`, etc.)
- Both pages and API routes import from `@/lib/mock-data`
- No client-side state management yet (no Redux, Zustand, Context)
- No data fetching layer yet (no SWR, React Query)
- Supabase integration planned but not implemented

### Event System

- `@silence/events` provides a typed `EventBus` for cross-module communication
- All events defined in `EventMap` interface (kpi.updated, agent.started, agent.stopped, etc.)
- Agents communicate via events, orchestrated by the `Orchestrator` meta-agent
- Type-safe: `bus.emit("kpi.updated", payload)` is checked against `EventMap`

## Environment Variables

Copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=         # Supabase project URL (not wired up)
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Supabase anonymous key (not wired up)
ANTHROPIC_API_KEY=                # Server-side Anthropic API key (not wired up)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- `NEXT_PUBLIC_` prefix = exposed to browser
- Server-only keys (e.g., `ANTHROPIC_API_KEY`) must NOT have the prefix
- None of these variables are currently consumed by any code

## Deployment

Configured in `vercel.json` (root):

```json
{
  "framework": "nextjs",
  "installCommand": "pnpm install",
  "buildCommand": "pnpm --filter=portal build",
  "outputDirectory": "apps/portal/.next"
}
```

Domains: `patternslab.app` (portal), `patternslab.work` (investor portal)

### CI/CD Pipelines

- **ci.yml** — Runs on PRs and pushes to main: lint, type check (`tsc --noEmit`), build
- **deploy.yml** — Runs on push to main: builds and deploys to Vercel production
- **security.yml** — Weekly + on PR: `pnpm audit --audit-level=high`
- **publish.yml** — On release: publishes public packages to npm

## TypeScript Configuration

- **Shared base** (`tooling/ts-config/base.json`): ES2022, strict, bundler resolution
- **Next.js preset** (`tooling/ts-config/nextjs.json`): ES2017, Next.js plugin
- **Library preset** (`tooling/ts-config/library.json`): declaration + sourcemap output
- **Portal** (`apps/portal/tsconfig.json`): ES2017, Next.js plugin, `@/*` path alias
- **Packages** (`packages/*/tsconfig.json`): Extend `library.json`

## Key Constraints

- **Package manager**: pnpm only (no npm/yarn — `package-lock.json` is gitignored)
- **No testing framework**: No Jest, Vitest, or testing library configured
- **No pre-commit hooks**: No Husky or lint-staged configured
- **No Prettier**: No code formatter configured
- **No database**: Supabase is planned but not wired up; all data is mocked
- **No auth**: No authentication or role-based access control implemented

## Adding New Features

### New page

Create a directory under `apps/portal/app/` following Next.js App Router conventions:
```
apps/portal/app/my-feature/page.tsx
```
Use `export default function` for the page component. Import UI components from `@silence/ui`.

### New shared component

1. Create `packages/ui/src/components/MyComponent.tsx` (named export, TypeScript interface for props)
2. Export from `packages/ui/src/components/index.ts`
3. Import in portal via `import { MyComponent } from "@silence/ui"`

### New layout

1. Create `packages/ui/src/layouts/MyLayout.tsx`
2. Export from `packages/ui/src/layouts/index.ts`

### New shared type

1. Add to appropriate file in `packages/contracts/src/` (kpi.ts, api.ts, portal.ts, or create new)
2. Export from `packages/contracts/src/index.ts`
3. Import via `import type { MyType } from "@silence/contracts"`

### New event

1. Add to `EventMap` in `packages/events/src/types.ts`
2. Emit via `bus.emit("my.event", payload, "source")`

### New agent

1. Create `agents/my-agent/` with `package.json`, `src/index.ts`, `tsconfig.json`
2. Name: `@silence/agent-my-agent`, depend on `@silence/contracts` + `@silence/events`
3. Register with orchestrator via `orchestrator.register({ id, name, enabled })`

### New API route

Create `apps/portal/app/api/my-endpoint/route.ts`:
```typescript
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ data: "value" });
}
```

---

## Audit vs DIPLO BIBLE v3

Audit date: 2026-02-06. Comparison of planned architecture (DIPLO BIBLE v3) against actual repository state.

### Implementation Status

| Category | Planned | Exists | Coverage |
|---|---|---|---|
| **packages/** | 15 | 3 (`contracts`, `events`, `ui`) | **20%** |
| **apps/** | 3 (`portal`, `patternlens`, `patternslab`) | 1 (`portal`) | **33%** |
| **agents/** | 12 | 12 (2 implemented, 10 stubs) | **100% scaffolded** |
| **docs/** | 15 files | 14 files | **93%** |
| **tooling/** | 3 dirs | 3 dirs (`ts-config`, `eslint-config`, `generators`) | **100%** |
| **.github/workflows/** | 4 | 4 (`ci`, `deploy`, `security`, `publish`) | **100%** |
| **turbo.json** | Yes | Yes | **100%** |

### Remaining Gaps

#### Packages (12 not yet created)
- `core`, `archetypes`, `symbolic`, `language`, `validator` — open modules
- `voice`, `ai`, `predictive`, `safety`, `medical`, `legal`, `linkedin-agent` — closed modules

#### Apps (2 not yet created)
- `patternlens` — Consumer PWA
- `patternslab` — B2B institutional

#### Infrastructure
- **No database** — Supabase planned but not wired
- **No auth** — No authentication/RBAC
- **No testing** — No test framework configured
- **No pre-commit hooks** — No Husky/lint-staged
- **Agent implementations** — 10 of 12 agents are stubs with TODO markers
- **No `"use client"` boundaries** — Only `error.tsx` is a client component; interactivity will require more

### Next Steps (Priority Order)

1. **Wire Supabase** — Connect auth and database to replace mock data
2. **Add test framework** — Vitest for packages, Playwright for portal E2E
3. **Implement agent logic** — Start with `analytics-reporter` (closest to existing KPI data)
4. **Create `@silence/core`** — Core business logic shared across packages
5. **Build `patternlens` app** — Consumer PWA
6. **Add pre-commit hooks** — Husky + lint-staged for quality gates
7. **Implement remaining packages** — Domain-specific modules per DIPLO BIBLE
