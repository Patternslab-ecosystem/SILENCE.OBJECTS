# CLAUDE.md — SILENCE.OBJECTS Portal

## Project Overview

SILENCE.OBJECTS is a B2B SaaS Dashboard & Investor Portal for PatternLabs. It provides financial metrics tracking (ARR, MRR, DAU, Churn, LTV/CAC, Runway, NRR) with role-based views for investors, admins, and B2B consumers. Dark-themed professional UI deployed on Vercel.

**Current state**: Early-stage scaffold. Only `apps/portal` and `packages/ui` exist. The DIPLO BIBLE v3 plans 15 packages, 3 apps, 12 agents, CI/CD, and shared tooling — almost none of which has been implemented yet. See [Audit](#audit-vs-diplo-bible-v3) below for full gap analysis.

**Build status**: BROKEN — TypeScript error in `apps/portal/app/page.tsx:23`. The `TABS` array uses `as const` and only one element has `active: true`, so `tab.active` fails type narrowing. Must be fixed before deploy.

## Tech Stack

- **Framework**: Next.js 14.2.18 (App Router) + React 18.3.1
- **Language**: TypeScript 5.9.3 (strict mode)
- **Styling**: Tailwind CSS 3.4.1, dark theme (Zinc palette, `bg-zinc-950`/`text-zinc-100`)
- **Monorepo**: pnpm 10.x workspaces (`apps/*`, `packages/*`)
- **Build orchestration**: None (no Turborepo — planned but missing)
- **Deployment**: Vercel (nextjs framework preset)
- **Planned integrations**: Supabase (auth/db), Anthropic API — neither wired up

## Repository Structure (Actual)

```
SILENCE.OBJECTS/
├── apps/
│   ├── portal/                     # Next.js 14 dashboard — ONLY app that exists
│   │   ├── app/
│   │   │   ├── layout.tsx          # Root layout (dark theme, metadata)
│   │   │   ├── page.tsx            # Home/dashboard page (hardcoded metrics, HAS TYPE ERROR)
│   │   │   ├── globals.css         # Tailwind base imports (@tailwind base/components/utilities)
│   │   │   ├── api/
│   │   │   │   ├── kpi/route.ts    # KPI metrics endpoint (GET, mock JSON)
│   │   │   │   └── linkedin/route.ts  # LinkedIn OAuth stub (hardcoded org_id)
│   │   │   └── investor/
│   │   │       └── dashboard/page.tsx # Investor KPI dashboard (8 metrics + bar chart + table)
│   │   ├── .gitignore              # .next, node_modules, .env.local
│   │   ├── next.config.js          # transpilePackages: ["@repo/ui"]
│   │   ├── tailwind.config.js      # Content: ./app + ../../packages/ui/src
│   │   ├── postcss.config.js       # tailwindcss + autoprefixer
│   │   ├── tsconfig.json           # ES2017, Next.js plugin, @/* -> ./app/*
│   │   └── package.json            # next 14.2.18, react ^18.3.1, @repo/ui workspace:*
│   └── vercel.json                 # STRAY FILE — duplicate of root vercel.json, should be removed
│
├── packages/
│   └── ui/                         # Shared design system (@repo/ui) — ONLY package that exists
│       ├── package.json            # Peer dep: react ^18.3.1, NO own tsconfig
│       └── src/
│           ├── index.ts            # Barrel: re-exports ./layouts + ./components
│           ├── components/
│           │   ├── index.ts        # Exports: Card, Badge, MetricCard, KpiGrid, Section, DataTable
│           │   ├── Card.tsx        # Generic card wrapper with optional title
│           │   ├── Badge.tsx       # Status badge (default/success/warning/danger variants)
│           │   ├── MetricCard.tsx   # KPI metric display (label, value, trend, target)
│           │   ├── KpiGrid.tsx     # Responsive grid container (2/3/4 column modes)
│           │   ├── Section.tsx     # Section wrapper with optional title
│           │   └── DataTable.tsx   # Generic table (columns + rows config)
│           └── layouts/
│               ├── index.ts        # Exports: PageLayout, DashboardLayout, InvestorLayout, ConsumerLayout, B2BLayout
│               ├── PageLayout.tsx   # Base page: header slot + main content
│               ├── DashboardLayout.tsx  # Sidebar + toolbar + main (desktop sidebar, mobile bottom nav)
│               ├── InvestorLayout.tsx   # Fixed header "PatternLabs — Investor Portal" + main
│               ├── ConsumerLayout.tsx   # Centered max-w-2xl content
│               └── B2BLayout.tsx        # Header slot + main content
│
├── package.json                    # Root workspace: dev/build/lint/clean scripts via pnpm --filter=portal
├── pnpm-workspace.yaml            # apps/* + packages/*
├── pnpm-lock.yaml                 # Lockfile
├── tsconfig.json                   # Root: ES2022, strict, bundler resolution, noEmit
├── vercel.json                     # Vercel: pnpm --filter=portal build, outputDirectory: apps/portal/.next
├── .env.example                    # SUPABASE_URL, SUPABASE_ANON_KEY, ANTHROPIC_API_KEY, APP_URL
├── .gitignore                      # node_modules, .next, .vercel, .env*, package-lock.json
├── README.md                       # Brief project overview
└── git-fix-clean.sh                # Git remote fix script (should be gitignored)
```

**Missing from plan**: `agents/`, `docs/`, `tooling/`, `.github/workflows/`, `turbo.json`, and 14 of 15 planned packages.

## Commands

All commands run from the repository root:

```bash
pnpm install              # Install all workspace dependencies
pnpm dev                  # Start dev server (port 3000)
pnpm build                # Build Next.js production bundle (CURRENTLY BROKEN — see Build Status)
pnpm lint                 # Run Next.js linter (CURRENTLY UNCONFIGURED — needs .eslintrc)
pnpm clean                # Remove .next, all node_modules
```

**Known issues with commands:**
- `pnpm build` fails with TypeScript error in `page.tsx:23` — `tab.active` property doesn't exist on all members of the `TABS` union type
- `pnpm lint` triggers interactive ESLint setup prompt — no `.eslintrc.*` file exists, so `next lint` asks for configuration on first run

## Architecture & Conventions

### Monorepo

- **pnpm workspaces** with `workspace:*` protocol for internal deps
- The portal app declares `@repo/ui` as dependency — Next.js transpiles it via `transpilePackages`
- Tailwind content paths span both `apps/portal/app` and `packages/ui/src`
- **No Turborepo** — turbo.json is planned but does not exist; scripts use `pnpm --filter=portal`

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
- No custom Tailwind theme extensions currently defined

### Routing

- Next.js 14 App Router with file-based routing
- API routes in `app/api/` directory (GET endpoints returning `NextResponse.json()`)
- Server components by default (no `"use client"` directives anywhere)
- Current routes:
  - `/` — Dashboard home (tab navigation, 4 KPI cards)
  - `/investor/dashboard` — Investor KPI view (8 metrics, MRR chart, metrics table)
  - `/api/kpi` — GET: returns mock KPI JSON
  - `/api/linkedin` — GET: returns LinkedIn integration stub

### Data Flow

- **All data is hardcoded** — mock values duplicated in `page.tsx`, `investor/dashboard/page.tsx`, and `/api/kpi/route.ts`
- No client-side state management (no Redux, Zustand, Context)
- No data fetching layer (no SWR, React Query)
- API routes exist but are never consumed by any page
- Supabase integration planned but not implemented

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

**Note**: There is a duplicate `apps/vercel.json` with identical content — this is a stray file and should be removed.

## TypeScript Configuration

- **Root** (`tsconfig.json`): ES2022 target, bundler module resolution, strict mode, noEmit
- **Portal** (`apps/portal/tsconfig.json`): ES2017 target, Next.js plugin, `@/*` path alias to `./app/*`
- **UI** (`packages/ui/`): No own tsconfig — relies on root config; peer dependency on React 18
- **No shared tsconfig base** — planned under `tooling/ts-config/` but does not exist

Key differences between root and portal configs:
- Root: `ES2022` target, `ESNext` module
- Portal: `ES2017` target, `esnext` module, Next.js plugin, path aliases

## Key Constraints

- **Package manager**: pnpm only (no npm/yarn — `package-lock.json` is gitignored)
- **No testing framework**: No Jest, Vitest, or testing library configured
- **No CI/CD**: No GitHub Actions or pipeline configuration
- **No pre-commit hooks**: No Husky or lint-staged configured
- **No ESLint config**: No `.eslintrc.*` file — `next lint` prompts for interactive setup
- **No Prettier**: No code formatter configured
- **No database**: Supabase is planned but not wired up; all data is mocked
- **No auth**: No authentication or role-based access control implemented
- **No error handling**: No `error.tsx`, `loading.tsx`, or `not-found.tsx` in App Router tree

## Adding New Features

### New page

Create a directory under `apps/portal/app/` following Next.js App Router conventions:
```
apps/portal/app/my-feature/page.tsx
```
Use `export default function` for the page component. Server component by default.

### New shared component

1. Create `packages/ui/src/components/MyComponent.tsx` (named export, TypeScript interface for props)
2. Export from `packages/ui/src/components/index.ts`
3. Import in portal via `import { MyComponent } from "@repo/ui"`

**Important**: Currently no portal page actually imports from `@repo/ui`. When adding components, verify they are actually consumed.

### New layout

1. Create `packages/ui/src/layouts/MyLayout.tsx`
2. Export from `packages/ui/src/layouts/index.ts`

### New API route

Create `apps/portal/app/api/my-endpoint/route.ts` exporting named HTTP method handlers:
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
| **packages/** | 15 (`contracts`, `events`, `core`, `archetypes`, `symbolic`, `language`, `validator`, `ui`, `voice`, `ai`, `predictive`, `safety`, `medical`, `legal`, `linkedin-agent`) | 1 (`ui`) | **7%** |
| **apps/** | 3 (`portal`, `patternlens`, `patternslab`) | 1 (`portal`) | **33%** |
| **agents/** | 12 (orchestrator, sentinel, content-guard, anomaly-detector, sales-autopilot, customer-success, analytics-reporter, linkedin-dominator, content-machine, social-swarm, growth-hacker, community-builder) | 0 | **0%** |
| **docs/** | 15 files | 0 (root README only) | **0%** |
| **tooling/** | 3 dirs (eslint-config, ts-config, generators) | 0 | **0%** |
| **.github/workflows/** | 4 (ci, deploy, security, publish) | 0 | **0%** |
| **turbo.json** | Yes | No | **0%** |

### Red Flags

#### CRITICAL

1. **Build is broken** — `pnpm build` fails with TypeScript error in `apps/portal/app/page.tsx:23`. The `TABS` array uses `as const` with heterogeneous object shapes; only the first element has `active: true`. Accessing `tab.active` fails because the property doesn't exist on all union members. This blocks production deploys.

2. **`@repo/ui` is 100% dead code** — All 11 components/layouts in `packages/ui` are exported but never imported anywhere. Portal pages duplicate equivalent markup inline. Either refactor pages to use the components or delete the package.

3. **Package scope mismatch: `@repo/ui` vs `@silence/*`** — The plan uses `@silence/*` namespace for all packages. The existing package uses `@repo/ui`. This needs to be resolved before adding more packages.

4. **No CI/CD, no safety net** — Zero automated checks. No lint-on-push, no build verification, no type checking in CI. Any push to main goes live on Vercel unchecked.

5. **Hardcoded mock data with no abstraction layer** — KPI values (104,000 PLN, 8,667 PLN, etc.) are duplicated across `page.tsx`, `investor/dashboard/page.tsx`, and `/api/kpi/route.ts`. No shared data source, no types, no API consumption. When real data arrives, every file needs rewriting.

#### HIGH

6. **ESLint not configured** — No `.eslintrc.*` file exists. Running `pnpm lint` (`next lint`) triggers an interactive setup prompt. Must create an ESLint config before lint can run non-interactively.

7. **No Turborepo** — `turbo.json` is specified in the plan but missing. With only 1 app and 1 package this is tolerable. With the planned 15+ packages and 12 agents, raw pnpm filter commands will not scale.

8. **No shared TypeScript config** — Plan calls for `tooling/ts-config/`. Currently root and portal have independent tsconfigs with duplicated and conflicting options (ES2022 vs ES2017). Adding packages will multiply the duplication.

9. **No `"use client"` boundaries** — All components are server components. The investor dashboard renders dynamic bar chart heights via inline styles. Any interactivity (filters, date ranges, real-time data) will require client component refactoring.

10. **LinkedIn API route exposes hardcoded org_id** — `apps/portal/app/api/linkedin/route.ts` returns `org_id: "82569452"`. Even as a stub, real identifiers should not be in source code.

#### MEDIUM

11. **Stray `apps/vercel.json`** — Duplicate Vercel config at `apps/vercel.json` (outside any app directory). Should be removed; the root `vercel.json` is the correct one.

12. **`git-fix-clean.sh` committed to repo** — Local tooling script with Termux-specific shebang (`#!/data/data/com.termux/files/usr/bin/bash`). Should be gitignored, not tracked.

13. **No error boundaries or loading states** — No `error.tsx`, `loading.tsx`, or `not-found.tsx` files in the App Router tree. Any runtime error shows the default Next.js error page.

14. **No `@silence/contracts` types package** — The plan designates this as "TYPES SOURCE OF TRUTH" but it doesn't exist. KPI data shapes are defined ad-hoc as inline TypeScript objects with no shared interfaces.

### Recommendations (Priority Order)

1. **Fix the build** — Resolve the TypeScript error in `page.tsx:23` so `pnpm build` succeeds. Nothing else matters until the build works.
2. **Configure ESLint** — Add `.eslintrc.json` with `next/core-web-vitals` so `pnpm lint` runs non-interactively.
3. **Adopt `@repo/ui` components in portal pages** — or delete the package. Dead code is tech debt from day zero.
4. **Add basic CI** — Even a single GitHub Action running `pnpm build && pnpm lint` would prevent broken deploys.
5. **Create `packages/contracts`** — Define shared TypeScript interfaces for KPI data, API responses, and configuration before adding more packages.
6. **Decide on `@repo/*` vs `@silence/*` scope** — Pick one and rename before the monorepo grows.
7. **Add `turbo.json`** — Even minimal config enables caching and parallel builds.
8. **Extract mock data into a single source** — One `mock-data.ts` file imported by both pages and API routes, typed with shared interfaces.
9. **Add `error.tsx` and `loading.tsx`** — Basic error boundaries for production resilience.
10. **Remove stray files** — Delete `apps/vercel.json`, remove `git-fix-clean.sh` from tracking, add to `.gitignore`.
