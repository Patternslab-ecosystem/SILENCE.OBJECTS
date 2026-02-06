# CLAUDE.md — SILENCE.OBJECTS Portal

## Project Overview

SILENCE.OBJECTS is a B2B SaaS Dashboard & Investor Portal for PatternLabs. It provides financial metrics tracking (ARR, MRR, DAU, Churn, LTV/CAC, Runway, NRR) with role-based views for investors, admins, and B2B consumers. Dark-themed professional UI deployed on Vercel.

**Current state**: Early-stage scaffold. Only `apps/portal` and `packages/ui` exist. The DIPLO BIBLE v3 plans 15 packages, 3 apps, 12 agents, CI/CD, and shared tooling — almost none of which has been implemented yet. See [Audit](#audit-vs-diplo-bible-v3) below for full gap analysis.

## Tech Stack

- **Framework**: Next.js 14.2.18 (App Router) + React 18.3.1
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 3.4.1, dark theme (Zinc palette, `bg-zinc-950`/`text-zinc-100`)
- **Monorepo**: pnpm workspaces (`apps/*`, `packages/*`)
- **Build orchestration**: None (no Turborepo — planned but missing)
- **Deployment**: Vercel (nextjs framework preset)
- **Planned integrations**: Supabase (auth/db), Anthropic API — neither wired up

## Repository Structure (Actual)

```
SILENCE.OBJECTS/
├── apps/
│   └── portal/                 # Next.js 14 dashboard — ONLY app that exists
│       ├── app/
│       │   ├── layout.tsx      # Root layout (dark theme, metadata)
│       │   ├── page.tsx        # Home/dashboard page (hardcoded metrics)
│       │   ├── globals.css     # Tailwind base imports
│       │   ├── api/
│       │   │   ├── kpi/route.ts       # KPI metrics endpoint (GET, mock JSON)
│       │   │   └── linkedin/route.ts  # LinkedIn OAuth stub
│       │   └── investor/
│       │       └── dashboard/page.tsx # Investor KPI dashboard (8 metrics + chart)
│       ├── next.config.js      # transpilePackages: ["@repo/ui"]
│       ├── tailwind.config.js  # Content paths: ./app + ../../packages/ui/src
│       ├── postcss.config.js   # tailwindcss + autoprefixer
│       └── tsconfig.json       # Path alias: @/* -> ./app/*
│
├── packages/
│   └── ui/                     # Shared design system (@repo/ui) — ONLY package that exists
│       ├── package.json        # Peer dep: react ^18.3.1
│       └── src/
│           ├── index.ts        # Barrel re-export
│           ├── components/     # Card, Badge, MetricCard, KpiGrid, Section, DataTable
│           └── layouts/        # PageLayout, DashboardLayout, InvestorLayout, ConsumerLayout, B2BLayout
│
├── package.json                # Root workspace scripts
├── pnpm-workspace.yaml         # apps/* + packages/*
├── tsconfig.json               # Root TS: ES2022, strict, bundler resolution
├── vercel.json                 # Vercel: pnpm --filter=portal build
├── .env.example                # Supabase + Anthropic + App URL
├── .gitignore
├── README.md
└── git-fix-clean.sh            # Git remote fix script (should be in .gitignore)
```

**Missing from plan**: `agents/`, `docs/`, `tooling/`, `.github/workflows/`, `turbo.json`, and 14 of 15 planned packages.

## Commands

All commands run from the repository root:

```bash
pnpm install              # Install all workspace dependencies
pnpm dev                  # Start dev server (port 3000)
pnpm build                # Build Next.js production bundle
pnpm lint                 # Run Next.js built-in linter
pnpm clean                # Remove .next, all node_modules
```

## Architecture & Conventions

### Monorepo

- **pnpm workspaces** with `workspace:*` protocol for internal deps
- The portal app imports from `@repo/ui` — Next.js transpiles it via `transpilePackages`
- Tailwind content paths span both `apps/portal/app` and `packages/ui/src`
- **No Turborepo** — turbo.json is planned but does not exist; scripts use `pnpm --filter=portal`

### Component Patterns

- Functional components with TypeScript interfaces for props
- Named exports for shared UI components (no default exports in `packages/ui`)
- `export default function` required for Next.js page components (`page.tsx`)
- Barrel exports via `index.ts` files in `components/` and `layouts/`
- File naming: PascalCase for components (`MetricCard.tsx`), kebab-case for config files

```typescript
// Standard shared component pattern
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return <div className={`rounded-2xl bg-zinc-900 p-6 ${className ?? ""}`}>{children}</div>;
}
```

### Styling

- Tailwind CSS utility classes only (no CSS modules, no styled-components)
- Dark theme: `zinc-950` background, `zinc-900` for cards, `zinc-100` text
- Accent color: `emerald-400`/`emerald-500` for positive trends
- Responsive breakpoints use `md:` prefix pattern
- No custom Tailwind theme extensions currently defined

### Routing

- Next.js 14 App Router with file-based routing
- API routes in `app/api/` directory (GET endpoints returning JSON)
- Server components by default (no `"use client"` directives yet)

### Data Flow

- **All data is hardcoded** — mock values in components and API routes
- No client-side state management (no Redux, Zustand, Context)
- No data fetching layer (no SWR, React Query)
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

## Deployment

Configured in `vercel.json`:

```json
{
  "framework": "nextjs",
  "installCommand": "pnpm install",
  "buildCommand": "pnpm --filter=portal build",
  "outputDirectory": "apps/portal/.next"
}
```

Domains: `patternslab.app` (portal), `patternslab.work` (investor portal)

## TypeScript Configuration

- **Root** (`tsconfig.json`): ES2022 target, bundler module resolution, strict mode, noEmit
- **Portal** (`apps/portal/tsconfig.json`): ES2017 target, Next.js plugin, `@/*` path alias to `./app/*`
- **UI** (`packages/ui/`): No own tsconfig — relies on root config; peer dependency on React 18
- **No shared tsconfig base** — planned under `tooling/ts-config/` but does not exist

## Key Constraints

- **Package manager**: pnpm only (no npm/yarn — `package-lock.json` is gitignored)
- **No testing framework**: No Jest, Vitest, or testing library configured
- **No CI/CD**: No GitHub Actions or pipeline configuration
- **No pre-commit hooks**: No Husky or lint-staged configured
- **Linting**: Only Next.js built-in lint (`next lint`), no custom ESLint or Prettier config
- **No database**: Supabase is planned but not wired up; all data is mocked
- **No auth**: No authentication or role-based access control implemented

## Adding New Features

### New page

Create a directory under `apps/portal/app/` following Next.js App Router conventions:
```
apps/portal/app/my-feature/page.tsx
```

### New shared component

1. Create `packages/ui/src/components/MyComponent.tsx`
2. Export from `packages/ui/src/components/index.ts`
3. Import in portal via `import { MyComponent } from "@repo/ui"`

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

1. **`@repo/ui` is 100% dead code** — All 11 components/layouts in `packages/ui` are exported but never imported anywhere. Portal pages duplicate the exact same markup inline. Either refactor pages to use the components or delete the package.

2. **Package scope mismatch: `@repo/ui` vs `@silence/*`** — The plan uses `@silence/*` namespace for all packages. The existing package uses `@repo/ui`. This needs to be resolved before adding more packages.

3. **No CI/CD, no safety net** — Zero automated checks. No lint-on-push, no build verification, no type checking in CI. Any push to main goes live on Vercel unchecked.

4. **Hardcoded mock data with no abstraction layer** — KPI values (104,000 PLN, 8,667 PLN, etc.) are duplicated across `page.tsx`, `investor/dashboard/page.tsx`, and `/api/kpi/route.ts`. No shared data source, no types, no API consumption. When real data arrives, every file needs rewriting.

#### HIGH

5. **No Turborepo** — `turbo.json` is specified in the plan but missing. With only 1 app and 1 package this is tolerable. With the planned 15+ packages and 12 agents, raw pnpm filter commands will not scale.

6. **No shared TypeScript config** — Plan calls for `tooling/ts-config/`. Currently root and portal have independent tsconfigs with duplicated options. Adding packages will multiply the duplication.

7. **No `"use client"` boundaries** — All components are server components. The investor dashboard renders dynamic bar chart heights via inline styles. Any interactivity (filters, date ranges, real-time data) will require client component refactoring.

8. **LinkedIn API route exposes hardcoded org_id** — `apps/portal/app/api/linkedin/route.ts` returns `org_id: "82569452"`. Even as a stub, real identifiers should not be in source code.

#### MEDIUM

9. **`git-fix-clean.sh` committed to repo** — Local tooling script should be gitignored, not tracked.

10. **No error boundaries or loading states** — No `error.tsx`, `loading.tsx`, or `not-found.tsx` files in the App Router tree. Any runtime error shows the default Next.js error page.

11. **No `@silence/contracts` types package** — The plan designates this as "TYPES SOURCE OF TRUTH" but it doesn't exist. KPI data shapes are defined ad-hoc as inline TypeScript objects with no shared interfaces.

### Recommendations (Priority Order)

1. **Adopt `@repo/ui` components in portal pages** — or delete the package. Dead code is tech debt from day zero.
2. **Add basic CI** — Even a single GitHub Action running `pnpm build && pnpm lint` would prevent broken deploys.
3. **Create `packages/contracts`** — Define shared TypeScript interfaces for KPI data, API responses, and configuration before adding more packages.
4. **Decide on `@repo/*` vs `@silence/*` scope** — Pick one and rename before the monorepo grows.
5. **Add `turbo.json`** — Even minimal config (`{ "pipeline": { "build": {}, "lint": {} } }`) enables caching and parallel builds.
6. **Extract mock data into a single source** — One `mock-data.ts` file imported by both pages and API routes, typed with shared interfaces.
7. **Add `error.tsx` and `loading.tsx`** — Basic error boundaries for production resilience.
8. **Remove `git-fix-clean.sh`** from tracking, add to `.gitignore`.
