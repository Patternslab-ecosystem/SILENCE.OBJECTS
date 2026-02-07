# DEPLOYMENT.md — SILENCE.OBJECTS Deployment Guide

## Infrastructure Overview

| Service | Purpose | Plan | Cost |
|---------|---------|------|------|
| **Vercel** | Apps deploy + edge + serverless | Pro | $20/mo |
| **Supabase** | Database + auth + storage | Free → Pro | $0-25/mo |
| **Hetzner** | n8n agent orchestration (CX22) | VPS | €5.80/mo |
| **Cloudflare** | DNS | Free | $0 |
| **Sentry** | Error tracking | Free | $0 |
| **Stripe** | Payments | Pay-as-you-go | 2.9% + $0.30 |

## 1. Vercel Setup

### Project Configuration

```
Vercel Dashboard → silence-objects → Settings → General

Root Directory: (leave empty — root of repo)
Framework Preset: Next.js
Build Command: pnpm --filter=portal build
Output Directory: apps/portal/.next
Install Command: pnpm install
Node.js Version: 18.x
```

### vercel.json (ROOT — single file, no duplicates)

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "installCommand": "pnpm install",
  "buildCommand": "pnpm --filter=portal build",
  "outputDirectory": "apps/portal/.next"
}
```

### Environment Variables (Vercel Dashboard)

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=https://silence-objects.vercel.app
```

### Domains

| Domain | App | Vercel Project |
|--------|-----|---------------|
| patternlens.app | Consumer PWA | patternlens |
| patternslab.app | B2B + dashboard | silence-objects |
| patternslab.work | Investor portal | patternslab-investor |

Cloudflare DNS: CNAME → `cname.vercel-dns.com` (DNS only, not proxied).

## 2. Supabase Setup

### Project

Single project, EU region. Shared across PatternLens, PatternsLab, and agents.

### Schema Initialization

Run `supabase/migrations/001_patternlens.sql` in SQL Editor. This creates:
- Core tables: profiles, objects, interpretations, patterns
- Safety tables: nuclear_events, language_violations
- Compliance tables: consent_logs, audit_logs, rate_limits
- Functions: handle_new_user, update_object_count, create_object_with_interpretation
- RLS policies on all tables
- Indexes

### Agent Tables

After core schema, run agent table creation from docs/AGENTS.md schema section.

### RLS Verification

```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
-- All should show rowsecurity = true
```

## 3. n8n Setup (Hetzner)

### VPS Order

Hetzner Cloud → CX22 (2 vCPU, 4GB RAM, 40GB SSD) → Location: Falkenstein (EU) → Ubuntu 24.04

### Installation

```bash
# SSH into VPS
ssh root@<ip>

# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Caddy (reverse proxy + auto HTTPS)
apt install -y caddy

# Run n8n
docker run -d \
  --name n8n \
  --restart unless-stopped \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=<strong-password> \
  -e GENERIC_TIMEZONE=Europe/Warsaw \
  n8nio/n8n

# Configure Caddy
cat > /etc/caddy/Caddyfile << EOF
n8n.patternslab.app {
    reverse_proxy localhost:5678
}
EOF
caddy reload
```

### n8n Environment Variables

Set in n8n credentials:
- Supabase URL + service role key
- Anthropic API key
- LinkedIn access token
- Resend API key (email)

## 4. Stripe Setup

### Products

| Product | Price ID | Amount |
|---------|----------|--------|
| PatternLens PRO (PLN) | — | 29 PLN/mo |
| PatternLens PRO (USD) | — | $12.99/mo |
| PatternLens PRO Annual (PLN) | — | 299 PLN/yr |
| PatternsLab Enterprise | — | Custom |

### Webhook

```
Stripe Dashboard → Developers → Webhooks
Endpoint: https://patternslab.app/api/stripe/webhook
Events: checkout.session.completed, customer.subscription.updated,
        customer.subscription.deleted, invoice.payment_failed
```

## 5. CI/CD (GitHub Actions)

### Workflows

| Workflow | Trigger | Actions |
|----------|---------|---------|
| `ci.yml` | Push to any branch | lint, type-check, test, language compliance scan |
| `deploy.yml` | Push to main | Vercel auto-deploy (connected) |
| `security.yml` | Daily + PR | Dependency audit, SAST scan |
| `publish.yml` | Tag v*.*.* | npm publish open modules |

## 6. Health Checks

After deployment, verify:

```bash
# Vercel app
curl https://silence-objects.vercel.app/api/health

# Supabase
curl https://xxxxx.supabase.co/rest/v1/ -H "apikey: <anon_key>"

# n8n
curl https://n8n.patternslab.app/healthz
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Vercel build fails "No Next.js detected" | Set Root Directory or verify vercel.json buildCommand |
| Supabase RLS blocks all queries | Check auth.uid() matches user_id in policies |
| n8n workflows not triggering | Check timezone, cron expressions, credential validity |
| Stripe webhook 400 | Verify webhook secret in env, check event types |
