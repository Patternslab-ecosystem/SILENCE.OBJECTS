# SAFETY.md — SILENCE.OBJECTS Safety Protocol

> P0 compliance. Must pass all tests before ANY deploy.
> Module: @silence/safety

## 3-Layer Crisis Detection

### Layer 1: Hard Keywords (Immediate Block)

Direct matches against curated keyword lists in Polish and English.

**Action:** Immediate block + CrisisModal + log to nuclear_events.

**Categories:** SUICIDE, SELF_HARM, VIOLENCE

**Examples (PL):** "chcę się zabić", "zabijię się", "nie chcę żyć", "ciąć się", "ranić się"

**Examples (EN):** "i want to kill myself", "going to kill myself", "cut myself", "self-harm"

### Layer 2: Soft Keywords (Claude Assessment)

Contextual concern indicators that require AI risk assessment.

**Action:** Send to Claude for risk scoring → proceed based on score.

**Categories:** PANIC, EATING_DISORDER, SUBSTANCE, ABUSE

**Examples (PL):** "atak paniki", "nie jadam", "głodzę się", "bije mnie", "boję się wrócić do domu"

**Examples (EN):** "panic attack", "not eating", "starving myself", "hitting me", "afraid to go home"

### Layer 3: Risk Score Classification

| Score | Level | Action |
|-------|-------|--------|
| 80-100 | CRITICAL | Block input + CrisisModal + resources + log |
| 60-79 | HIGH | Block input + resources banner + log |
| 40-59 | MEDIUM | Soft warning banner + continue + log |
| 20-39 | LOW | Continue + log |
| 0-19 | NONE | Continue |

## CrisisModal

Triggered on CRITICAL or HIGH detection. Displays:

1. Localized message: "Are you okay?" (PL/EN)
2. Explanation that this tool does not replace professional help
3. "Show support contacts" button
4. Emergency resources for user's locale
5. "I understand, continue" dismiss option
6. Disclaimer text

**Accessibility:** role="dialog", aria-modal, keyboard dismissible (Escape), focus trap.

## Emergency Resources

### Poland
| Resource | Phone | Available |
|----------|-------|-----------|
| Telefon Zaufania | 116 123 | 24/7 |
| Centrum Wsparcia | 800 70 2222 | 24/7 |
| Numer alarmowy | 112 | 24/7 |
| SMS dla niesłyszących | 8148 | 24/7 |

### International
| Resource | Phone | Available |
|----------|-------|-----------|
| US Suicide Prevention | 988 | 24/7 |
| Crisis Text Line | Text HOME to 741741 | 24/7 |
| UK Samaritans | 116 123 | 24/7 |
| Emergency | 911 / 112 | 24/7 |

## Safety Profiles

| Profile | Crisis Detection | Content Blocking | Hotline UX | Disclaimer |
|---------|-----------------|-------------------|------------|------------|
| `FULL` | Yes (3-layer) | Yes | Yes | Yes |
| `MINIMAL_ADULT_TOOL` | No | No | No | Yes (mandatory) |
| `ENTERPRISE` | Configurable | Configurable | No | Yes |

Each application declares its safety profile. Framework requires ONLY the disclaimer.

## Object Validation

Before any analysis, inputs pass through validation:

1. **XSS protection:** Strip script tags, javascript:, event handlers
2. **URL stripping:** Remove URLs (configurable)
3. **HTML stripping:** Remove HTML tags
4. **Length validation:** min 50, max 5000 characters
5. **Word count validation:** min 10 words
6. **Language compliance:** Check for forbidden therapeutic terms

## Database Schema

```sql
CREATE TABLE nuclear_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'CRISIS_DETECTED', 'INTERVENTION_SHOWN',
    'RESOURCE_CLICKED', 'ESCALATION'
  )),
  crisis_level TEXT NOT NULL,
  crisis_category TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Testing Requirements

| Test | Type | Frequency |
|------|------|-----------|
| All hard keywords detected correctly (PL) | Unit | Every build |
| All hard keywords detected correctly (EN) | Unit | Every build |
| Soft keywords trigger appropriate level | Unit | Every build |
| CrisisModal renders on CRITICAL | Component | Every build |
| Resources display correctly per locale | Snapshot | Every build |
| Object validation blocks XSS | Unit | Every build |
| nuclear_events logging works | Integration | Pre-deploy |
| Full crisis flow E2E | E2E | Weekly |

**Rule:** Safety tests MUST pass before ANY deployment. No exceptions.
