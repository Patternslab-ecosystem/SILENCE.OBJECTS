# SILENCE.OBJECTS DEPLOYMENT GUIDE v3.0

## Vercel (apps)

silence-objects project. Edge: middleware. Serverless: API endpoints.
Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY, STRIPE_KEY, Claude/GPT keys.

## Supabase

Jeden projekt: PatternLens + PatternsLab + Agent Army. EU region. RLS na wszystkich tabelach.
Tables: domain (objects, patterns...), B2B (tenants, teams...), agents (agent_policies, agent_logs...), revenue (leads, deals, kpi_daily...), events.

## n8n (agents)

Hetzner CX22, self-hosted. Guardian/Revenue/Growth, 15-min cycle.

## Stripe

PL/UK/US/EU. Consumer PRO 29 PLN/m. B2B custom. Usage-based API.

## CI/CD

ci.yml: lint, test, P0 safety, compliance scan.
deploy.yml: Vercel main.
security.yml: SAST/DAST.
publish.yml: npm publish open modules.

## CHANGELOG (DEPLOYMENT.md)

- 2026-02-08 — Deployment pipeline pod DIPLO_BIBLE v3.
