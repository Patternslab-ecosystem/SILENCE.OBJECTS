# CLAUDE.md — SILENCE.OBJECTS Portal

## Project Overview

SILENCE.OBJECTS is a B2B SaaS Dashboard & Investor Portal for PatternLabs. It provides financial metrics tracking (ARR, MRR, DAU, Churn, LTV/CAC, Runway, NRR) with role-based views for investors, admins, and B2B consumers. Dark-themed professional UI deployed on Vercel.

## Tech Stack

- **Framework**: Next.js 14.2.18 (App Router) + React 18.3.1
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 3.4.1, dark theme (Zinc palette, `bg-zinc-950`/`text-zinc-100`)
- **Monorepo**: pnpm workspaces (`apps/*`, `packages/*`)
- **Deployment**: Vercel (nextjs framework preset)
- **Planned integrations**: Supabase (auth/db), Anthropic API

## Repository Structure

```
apps/portal/              # Next.js 14 dashboard application
  app/
    layout.tsx            # Root layout (dark theme, metadata)
    page.tsx              # Home/dashboard page
    globals.css           # Tailwind base imports
    api/
      kpi/route.ts        # KPI metrics endpoint (GET, mock data)
      linkedin/route.ts   # LinkedIn OAuth stub
    investor/
      dashboard/page.tsx  # Investor KPI dashboard (8 metrics + MRR trend chart)
  next.config.js          # transpilePackages: ["@repo/ui"]
  tailwind.config.js      # Content paths include ../../packages/ui/src
  tsconfig.json           # Path alias: @/* -> ./app/*

packages/ui/              # Shared design system (@repo/ui)
  src/
    index.ts              # Barrel export (re-exports components + layouts)
    components/
      Card.tsx            # Generic card container
      Badge.tsx           # 4 variants: default/success/warning/danger
      MetricCard.tsx      # KPI metric display card
      KpiGrid.tsx         # 2/3/4 column responsive grid
      Section.tsx         # Section wrapper with optional title
      DataTable.tsx       # Generic data table
    layouts/
      PageLayout.tsx      # Basic page + optional header
      DashboardLayout.tsx # Sidebar + main + optional toolbar
      InvestorLayout.tsx  # Header + main investor layout
      ConsumerLayout.tsx  # Centered max-width consumer layout
      B2BLayout.tsx       # Header + main B2B layout
```

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

### Component Patterns

- Functional components with TypeScript interfaces for props
- Named exports only (no default exports for components)
- Barrel exports via `index.ts` files in `components/` and `layouts/`
- File naming: PascalCase for components (`MetricCard.tsx`), kebab-case for config files

```typescript
// Standard component pattern
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
- Responsive breakpoints use `md:` prefix pattern
- No custom Tailwind theme extensions currently defined

### Routing

- Next.js 14 App Router with file-based routing
- API routes in `app/api/` directory (GET endpoints returning JSON)
- Server components by default (no `"use client"` directives yet)

### Data Flow

- Currently uses hardcoded mock data in components and API routes
- No client-side state management library (no Redux, Zustand, Context)
- Supabase integration planned but not implemented

## Environment Variables

Copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=         # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Supabase anonymous key
ANTHROPIC_API_KEY=                # Server-side Anthropic API key
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
- **UI** (`packages/ui/`): Inherits root config, peer dependency on React 18

## Key Constraints

- **Package manager**: pnpm only (no npm/yarn — `package-lock.json` is gitignored)
- **No testing framework**: No Jest, Vitest, or testing library configured yet
- **No CI/CD**: No GitHub Actions or pipeline configuration
- **No pre-commit hooks**: No Husky or lint-staged configured
- **Linting**: Only Next.js built-in lint (`next lint`), no custom ESLint or Prettier config
- **No database**: Supabase is planned but not wired up; all data is mocked

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
