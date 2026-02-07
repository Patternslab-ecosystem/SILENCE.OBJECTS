# AGENTS.md — SILENCE.OBJECTS Agent Army v2.0

> Cardinal Rule: FRAMEWORK SECURITY > REVENUE > GROWTH

## 3-Layer Hierarchy

### LAYER 0: GUARDIAN (P0, always active)

| Agent | Function | Cost | Deploy |
|-------|----------|------|--------|
| **Sentinel** | PR review, deploy guard, closed module protection. GitHub Actions CI/CD + Claude PR review. Auto-fix: Sentry error → Claude → PR → review → merge (open modules only). CLOSED MODULES: ANY change requires human review. | $0 | Week 1 |
| **Content Guard** | Central compliance firewall. EVERY text that exits system passes through. Workflow: @silence/language scan → medical/legal claims scan (Claude) → platform policy → brand tone → risk classification (GREEN/YELLOW/RED). Layer 2 agents CANNOT publish without Content Guard approval. | ~$10-20/mo | Week 2 |
| **Anomaly Detector** | Runs every 5 min. Checks agent_logs per channel: API errors, rate limits, account warnings. Levels: L1 warning, L2 throttle 50%, L3 kill channel 48h, CRITICAL stop all Layer 2. Auto-recovery after 48h. | $0 | Week 1 |

### LAYER 1: REVENUE ENGINE (P1, after Layer 0 green)

| Agent | Function | Cost | Deploy |
|-------|----------|------|--------|
| **Analytics Reporter** | Daily (02:00 CET): pull DAU, signups, objects, patterns, revenue → kpi_daily. Weekly (Mon 08:00): Claude "Week in Review" → email. Monthly: full investor update → PDF. | ~$5/mo | Week 1 |
| **Sales Autopilot** | Lead capture → Supabase → Claude scoring 1-10. Email sequences: B2B institutional, warm, developer API. Demo automation: Calendly → prep → follow-up. | Calendly $8/mo | Week 2 |
| **Customer Success** | Onboarding: Day 1/3/7/14/30 emails. Churn prediction using @silence/predictive. Upsell triggers. NPS surveys. B2B: monthly usage reports, QBR. | $0 | Week 2 |

### LAYER 2: GROWTH ARMY (P2, unlocked by metrics)

**Unlock condition:** Layer 0 green 7 days + ≥10 paying users OR ≥2 B2B deals.

| Agent | Function | Phases | Cost |
|-------|----------|--------|------|
| **LinkedIn Dominator** | Phase 1: posts + replies only. Phase 2 (engagement >3%): soft outreach. Phase 3 (no bans, growth >5%/wk): full mode. | 3-phase, 5 weeks | Phase 1-2: $0, Phase 3: $75/mo |
| **Content Machine** | Phase 1: 1-2 articles/week + newsletter. Phase 2: 3 articles/week + programmatic SEO + lead magnets. | 2-phase | Ghost $9/mo |
| **Social Swarm** | Week 5: Twitter. Week 6: Quora. Week 7: HackerNews. Week 8+: Reddit (extreme caution). | Staggered | $0 |
| **Growth Hacker** | Viral archetype cards, referral tracking, programmatic SEO, Chrome extension, ASO. Unlock: ≥500 free + ≥50 paid. | — | ~$20/mo |
| **Community Builder** | Discord server. Bot: /my-archetype, /pattern-check. Moderation: Claude spam + crisis redirect. Unlock: ≥1000 users. | — | $5/mo |

## Orchestrator

n8n meta-agent, 15-min cycle. Reads: agent_policies, platform_limits, anomaly_events, kpi_daily.

**Global rules:**
- Sentry errors >5/hour → PAUSE all Layer 2
- Churn >5% → BOOST CS, PAUSE outbound
- Platform ban signal → KILL channel 48h
- Revenue growing >10% WoW → UNLOCK higher aggression

**Escalation to human:** Closed module breach, account suspended, revenue drop >30%, security incident, crisis trigger.

## Supabase Tables

```sql
-- Agent policies (per-agent config)
CREATE TABLE agent_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT UNIQUE NOT NULL,
  layer INTEGER NOT NULL CHECK (layer IN (0, 1, 2)),
  enabled BOOLEAN DEFAULT false,
  aggression_level INTEGER DEFAULT 1 CHECK (aggression_level BETWEEN 1 AND 5),
  config JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent logs (every action)
CREATE TABLE agent_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT NOT NULL,
  action TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  cost DECIMAL(10,4) DEFAULT 0,
  duration_ms INTEGER,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Platform limits
CREATE TABLE platform_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel TEXT UNIQUE NOT NULL,
  max_actions_per_hour INTEGER NOT NULL,
  max_actions_per_day INTEGER NOT NULL,
  cooldown_hours INTEGER DEFAULT 48,
  current_status TEXT DEFAULT 'active' CHECK (current_status IN ('active', 'throttled', 'killed'))
);

-- Anomaly events
CREATE TABLE anomaly_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT,
  channel TEXT,
  level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 4),
  details JSONB NOT NULL,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Cost Summary

| Category | Monthly |
|----------|---------|
| Infrastructure (Hetzner + Vercel) | $6-26 |
| AI (Claude API all agents) | $100-200 |
| Tools (Phase 3: Phantom Buster, Calendly, Ghost) | $92-112 |
| **TOTAL** | **$198-338** |
| Human equivalent | $22,000-34,000 |
| **ROI** | **65-100x** |

Human time: 2h/week (Mon/Wed/Fri 30min each) + 1h/month strategic.

## Deployment Roadmap

| Week | Agents |
|------|--------|
| 0 | Hetzner VPS + n8n + Supabase schema + Vercel fix |
| 1 | Sentinel + Anomaly Detector + Analytics Reporter |
| 2 | Content Guard + Sales Autopilot + Customer Success |
| 3-4 | LinkedIn Phase 1 + Content Phase 1 + Orchestrator |
| 5-6 | LinkedIn Phase 2 + Content Phase 2 + Social: Twitter/Quora |
| 7-8 | Social: HN/Reddit + Growth Hacker + ProductHunt |
| 8+ | LinkedIn Phase 3 + Community Builder (if ≥1K users) |
