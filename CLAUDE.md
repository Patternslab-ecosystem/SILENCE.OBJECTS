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
- **Planned integrations**: Supabase (auth/db), Anthropic API, Stripe (payments), n8n (workflow automation) — none wired up in code

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
│   │   ├── next-env.d.ts           # Auto-generated Next.js type declarations
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

**Missing env vars for planned integrations** (not in `.env.example` yet):
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` — for Stripe payment integration
- `N8N_WEBHOOK_URL` / `N8N_API_KEY` — for n8n workflow automation
- `LINKEDIN_CLIENT_ID` / `LINKEDIN_CLIENT_SECRET` — for LinkedIn OAuth (currently just a stub)

## Deployment

### Vercel Configuration

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

### Vercel "No Next.js detected" — Troubleshooting

This error occurs because the monorepo root has no `next.config.js` — it's in `apps/portal/`. Vercel auto-detection looks at the root directory and fails to find Next.js.

**Fixes (pick one):**

1. **Set Root Directory in Vercel Project Settings** to `apps/portal` — but then `pnpm install` at the workspace root won't resolve `@repo/ui`. You'd need to set Install Command to `cd ../.. && pnpm install` or use `vercel.json` overrides. Not recommended for monorepos.

2. **Keep root directory as `.` (repo root) and ensure `vercel.json` is correct** — the current `vercel.json` has `"framework": "nextjs"` which should override auto-detection. Verify these Vercel project settings:
   - Root Directory: `.` (blank/default = repo root)
   - Framework Preset: Next.js (or "Other" if using custom build)
   - Build Command: Override with `pnpm --filter=portal build`
   - Output Directory: Override with `apps/portal/.next`
   - Install Command: Override with `pnpm install`

3. **The actual blocker is the TypeScript error** — even with correct Vercel config, `pnpm --filter=portal build` fails at the type-check step. Fix `apps/portal/app/page.tsx:23` first. Vercel may report "No Next.js detected" when the build fails before producing output.

**Stray file**: `apps/vercel.json` is a duplicate of root `vercel.json` placed outside any app directory. It has no effect but should be deleted to avoid confusion.

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
- **No payment integration**: Stripe planned but not implemented
- **No workflow automation**: n8n planned but not integrated

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

## Operational Issues & Integration Audit

Audit date: 2026-02-06. Assessment of all known operational issues and planned integrations.

### 1. Vercel Build Fails — "No Next.js detected"

**Status**: BLOCKING PRODUCTION

**Root causes (multiple, compounding):**

| # | Cause | Severity | Fix |
|---|-------|----------|-----|
| 1 | TypeScript error in `page.tsx:23` — `tab.active` property missing on union members | CRITICAL | Add `active?: boolean` to all TABS entries or remove `as const` |
| 2 | No `next.config.js` at repo root — Vercel auto-detection fails in monorepo | HIGH | Ensure Vercel project settings explicitly set framework to Next.js with custom build/install/output commands |
| 3 | Stray `apps/vercel.json` may confuse Vercel's config resolution | LOW | Delete `apps/vercel.json` |

**Exact TypeScript error:**
```
./app/page.tsx:23:28
Type error: Property 'active' does not exist on type
  '{ readonly id: "investor"; ... readonly active: true; } |
   { readonly id: "patternlens"; ... }'
  Property 'active' does not exist on type
  '{ readonly id: "patternlens"; readonly label: "PatternLens"; readonly href: "#"; }'
```

**Fix for `page.tsx:23`** — change `tab.active` to `"active" in tab && tab.active`, or add `active: false` to all non-active tab entries, or remove `as const` and type the array explicitly.

### 2. Supabase RLS Blocks All Queries

**Status**: NOT YET RELEVANT — Supabase is not wired up in code

**Current state in codebase:**
- `.env.example` lists `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` but both are empty
- No Supabase client library installed (`@supabase/supabase-js` not in any `package.json`)
- No Supabase client initialization code anywhere
- No database queries, no auth calls, no RLS policy references

**When wiring up Supabase, watch for:**
- RLS policies must allow `auth.uid()` to match the `user_id` column in every table — a blanket `USING (auth.uid() = user_id)` policy is the most common pattern
- The anon key only works for operations allowed by RLS policies — if all policies require `auth.uid()` and the user isn't authenticated, all queries return empty results
- For server-side API routes, use the service role key (never expose it to the client) to bypass RLS when needed
- Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.example` when implementing server-side data access

### 3. n8n Workflows Not Triggering

**Status**: NOT YET RELEVANT — no n8n integration in codebase

**Current state**: Zero references to n8n anywhere in the code. No webhook endpoints designed for n8n consumption. No env vars for n8n.

**When integrating n8n:**
- Ensure webhook URLs are in env vars, not hardcoded
- Cron expressions in n8n use the server's timezone — verify it matches expectations (UTC vs local)
- Credential validity: n8n stores credentials encrypted; if they expire (e.g., OAuth tokens), workflows silently fail
- Add health-check/ping endpoint that n8n can call to verify connectivity
- Add `N8N_WEBHOOK_URL` and `N8N_API_KEY` to `.env.example`

### 4. Stripe Webhook Returns 400

**Status**: NOT YET RELEVANT — no Stripe integration in codebase

**Current state**: No Stripe library installed, no webhook handler, no payment-related code.

**When integrating Stripe:**
- Install `stripe` package and add `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` to env
- Create webhook handler at `apps/portal/app/api/stripe/webhook/route.ts`
- Webhook secret must match exactly between Stripe Dashboard and env — a mismatch causes signature verification failure (HTTP 400)
- Use `stripe.webhooks.constructEvent(body, signature, secret)` to verify — pass the raw body, not parsed JSON
- In Next.js App Router, disable body parsing for the webhook route:
  ```typescript
  export const runtime = 'nodejs';
  // Read raw body with request.text() not request.json()
  ```
- Register only the event types you handle (`checkout.session.completed`, `invoice.paid`, etc.) — unhandled events should return 200 to avoid retries

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

1. **Build is broken** — `pnpm build` fails with TypeScript error in `apps/portal/app/page.tsx:23`. The `TABS` array uses `as const` with heterogeneous object shapes; only the first element has `active: true`. Accessing `tab.active` fails because the property doesn't exist on all union members. This blocks Vercel production deploys and may cause the misleading "No Next.js detected" error.

2. **`@repo/ui` is 100% dead code** — All 11 components/layouts in `packages/ui` are exported but never imported anywhere. Portal pages duplicate equivalent markup inline. Either refactor pages to use the components or delete the package.

3. **Package scope mismatch: `@repo/ui` vs `@silence/*`** — The plan uses `@silence/*` namespace for all packages. The existing package uses `@repo/ui`. This needs to be resolved before adding more packages.

4. **No CI/CD, no safety net** — Zero automated checks. No lint-on-push, no build verification, no type checking in CI. Any push to main goes live on Vercel unchecked.

5. **Hardcoded mock data with no abstraction layer** — KPI values (104,000 PLN, 8,667 PLN, etc.) are duplicated across 3 files. No shared data source, no types, no API consumption. When real data arrives, every file needs rewriting.

#### HIGH

6. **ESLint not configured** — No `.eslintrc.*` file exists. Running `pnpm lint` triggers an interactive setup prompt. Must create `.eslintrc.json` with `next/core-web-vitals` before lint can run non-interactively.

7. **No Turborepo** — `turbo.json` is missing. Tolerable with 1 app + 1 package. Won't scale to the planned 15+ packages and 12 agents.

8. **No shared TypeScript config** — Root and portal have independent tsconfigs with conflicting targets (ES2022 vs ES2017). Adding packages multiplies the duplication.

9. **No `"use client"` boundaries** — All components are server components. The investor dashboard renders bar chart heights via inline styles. Any interactivity will require client component refactoring.

10. **LinkedIn API route exposes hardcoded org_id** — `apps/portal/app/api/linkedin/route.ts` returns `org_id: "82569452"`. Real identifiers should not be in source code; use env vars.

11. **No external integrations wired up** — Supabase, Stripe, n8n, and LinkedIn OAuth are all planned but have zero implementation. The `.env.example` only covers Supabase and Anthropic; Stripe and n8n env vars are not documented.

#### MEDIUM

12. **Stray `apps/vercel.json`** — Duplicate Vercel config outside any app directory. Should be deleted.

13. **`git-fix-clean.sh` committed to repo** — Termux-specific shebang (`#!/data/data/com.termux/files/usr/bin/bash`). Should be gitignored.

14. **No error boundaries or loading states** — No `error.tsx`, `loading.tsx`, or `not-found.tsx` in the App Router tree.

15. **No `@silence/contracts` types package** — The plan designates this as "TYPES SOURCE OF TRUTH" but it doesn't exist. KPI data shapes are ad-hoc inline objects.

### Recommendations (Priority Order)

1. **Fix the build** — Resolve the TypeScript error in `page.tsx:23` so `pnpm build` succeeds. Nothing else matters until the build works. This will also fix the Vercel "No Next.js detected" issue if it's caused by build failure.
2. **Verify Vercel project settings** — Ensure Root Directory is `.`, Framework is Next.js, and build/install/output commands match `vercel.json`. Delete `apps/vercel.json`.
3. **Configure ESLint** — Add `.eslintrc.json` with `next/core-web-vitals` so `pnpm lint` runs non-interactively.
4. **Adopt `@repo/ui` components in portal pages** — or delete the package. Dead code is tech debt from day zero.
5. **Add basic CI** — A GitHub Action running `pnpm install && pnpm build && pnpm lint` prevents broken deploys.
6. **Create `packages/contracts`** — Define shared TypeScript interfaces for KPI data, API responses, and configuration.
7. **Update `.env.example`** — Add placeholders for `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `N8N_WEBHOOK_URL`, `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY`.
8. **Decide on `@repo/*` vs `@silence/*` scope** — Pick one and rename before the monorepo grows.
9. **Add `turbo.json`** — Even minimal config enables caching and parallel builds.
10. **Extract mock data** — One `mock-data.ts` file imported by all pages and API routes, typed with shared interfaces.
11. **Add `error.tsx` and `loading.tsx`** — Basic error boundaries for production resilience.
12. **Move `org_id` to env** — Remove hardcoded LinkedIn org ID from source code.
13. **Remove stray files** — Delete `apps/vercel.json`, add `git-fix-clean.sh` to `.gitignore`.
