# PatternLens (SILENCE.OBJECTS) - Comprehensive Application Analysis

**Document Version:** 1.0
**Analysis Date:** 2026-01-26
**App Version:** 0.1.0 MVP

---

## 1. COLOR SCHEME & DESIGN SYSTEM

### Dark Theme "Soft Noir Mental Studio" v2.1

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-void` | `#0D0D0F` | Deepest background |
| `--bg-base` | `#0f1419` | Main page background |
| `--bg-surface` | `#161b22` | Card backgrounds |
| `--bg-elevated` | `#1a1f28` | Modal/elevated surfaces |
| `--bg-hover` | `#21262d` | Hover states |
| `--bg-active` | `#30363d` | Active/pressed states |

### Text Hierarchy

| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#f5f7fa` | Headlines, primary content |
| `--text-secondary` | `#8b949e` | Body text, descriptions |
| `--text-muted` | `#6e7681` | Labels, hints |
| `--text-disabled` | `#4a4845` | Disabled elements |

### Primary Accent (Blue)

| Token | Hex | Usage |
|-------|-----|-------|
| `--primary` | `#4a90e2` | Primary buttons, links, focus |
| `--primary-hover` | `#3a7bc8` | Hover state |
| `--primary-active` | `#2d6cb5` | Active/pressed |
| `--primary-muted` | `rgba(74, 144, 226, 0.15)` | Backgrounds, selection |

**Note:** Different from #6366F1 (Indigo) - actual primary is `#4a90e2` (Blue)

### Status Colors

| Status | Color | Muted |
|--------|-------|-------|
| Success | `#4ade80` | `rgba(74, 222, 128, 0.15)` |
| Warning | `#fbbf24` | `rgba(251, 191, 36, 0.15)` |
| Danger | `#f87171` | `rgba(248, 113, 113, 0.15)` |
| Info | `#60a5fa` | `rgba(96, 165, 250, 0.15)` |

### Glassmorphism / Effects

- **Scrollbar:** Custom 6px with rounded thumb
- **Selection:** Primary muted background
- **Focus ring:** `2px solid var(--primary)` with 2px offset
- **Shadows:** 4-tier system (sm, md, lg, xl) with black/opacity

---

## 2. LAYOUT STRUCTURE

### Shell Architecture

```
┌─────────────────────────────────────────────────┐
│ Header (56px) - Logo, User, Actions             │
├──────────┬──────────────────────────────────────┤
│ Sidebar  │ Main Content Area                    │
│ (240px)  │ max-width: 960px                     │
│          │ padding: 32px                        │
│          │                                      │
│ - Panel  │                                      │
│ - Archiwum│                                     │
│ - Ustawienia│                                   │
│ - Zasoby │                                      │
│          │                                      │
└──────────┴──────────────────────────────────────┘
```

### Mobile Navigation

- **Breakpoint:** `lg:hidden` (< 1024px)
- **Pattern:** Hamburger menu → slide-out panel from right
- **Menu panel width:** 256px (w-64)
- **Backdrop:** `bg-black/60`

### Navigation Items

| ID | Href | Label (PL) | Icon |
|----|------|------------|------|
| dashboard | /dashboard | Panel | Grid 4-square |
| archive | /archive | Archiwum | Box with lines |
| settings | /settings | Ustawienia | Gear/cog |
| emergency | /emergency | Zasoby kryzysowe | Phone |

### Voice FAB Position

- Not implemented as fixed FAB
- VoiceDump component inline in dashboard
- Recording button: `w-14 h-14` (56px) red rounded-full

---

## 3. BUTTON INVENTORY

### Primary CTAs

| Button | Location | Style | Min Height |
|--------|----------|-------|------------|
| Sign In | Homepage | Primary blue bg | 44px |
| Create Account | Homepage | Ghost/outline | 44px |
| Przejdź na PRO | Mobile nav | Outline primary | 48px (py-3) |

### Recording Controls

| Button | Size | Style |
|--------|------|-------|
| Start Recording (Mic) | 56x56px | `bg-red-600 hover:bg-red-500` rounded-full |
| Stop Recording | 56x56px | `bg-slate-800 border-2 border-red-500` rounded-full |
| Pause/Resume | 40x40px | `bg-slate-700 hover:bg-slate-600` rounded-full |

### Lens Selection

| Button | State | Style |
|--------|-------|-------|
| Select Lens | Default | `bg-slate-700 hover:bg-slate-600` |
| Selected | Active | `bg-blue-500/20 text-blue-400` |

### Design System Button Tokens

```typescript
button.primary  // Blue bg, white text
button.secondary // Transparent, border
button.ghost    // No border, hover bg
button.danger   // Transparent, red text/border
button.icon     // 40x40 square, icon only
```

---

## 4. PRICING STRUCTURE

### ✓ PRICING UNIFIED (v3.0)

| Source | PRO Price (PL) |
|--------|----------------|
| `src/app/page.tsx` | 29 PLN/month |
| `src/constants/app.ts` | 29 PLN |
| `src/constants/pricing.ts` | 29 PLN/month |

**STATUS:** All pricing unified to 29 PLN | £6.99 | $7.99 across codebase.

### Tier Comparison

| Feature | FREE | PRO |
|---------|------|-----|
| Objects per week | 7 | Unlimited |
| Time Capsules | 1 | Unlimited |
| Dual Lens interpretations | ✓ | ✓ |
| Archive visible | Last 7 | Full |
| Ghost Patterns | ✗ | ✓ |
| JSON Export | ✗ | ✓ |

### Regional Pricing (from pricing.ts) — v3.0 UNIFIED

| Region | Price | Currency | Stripe ID |
|--------|-------|----------|-----------|
| PL | 29 | PLN | price_pl_monthly |
| UK | £6.99 | GBP | price_uk_monthly |
| US | $7.99 | USD | price_us_monthly |

---

## 5. REGIONAL SETTINGS

### Language

- **Primary:** Polish (PL)
- **UI Labels:** Panel, Archiwum, Ustawienia, Zasoby kryzysowe
- **Homepage:** English (Sign In, Create Account)

### Data Infrastructure

- **Database:** Supabase (PostgreSQL)
- **Region:** EU (assumed from GDPR focus)
- **Auth:** Supabase Auth with Magic Link OTP

### Crisis Resources by Region

| Region | Primary Helpline | Secondary | Emergency |
|--------|------------------|-----------|-----------|
| PL | 116 123 (Telefon Zaufania) | 800 70 2222 | 112 |
| UK | 116 123 (Samaritans) | 85258 (Shout) | 999 |
| US | 988 (Suicide & Crisis) | 741741 (Crisis Text) | 911 |

---

## 6. FUNCTIONAL ANALYSIS

### 6.1 Voice Input System

**Components:**
- `VoiceDump.tsx` - Main recording UI
- `useMediaRecorder.ts` - Recording hook
- `useTranscription.ts` - Transcription hook

**Features:**
| Feature | Status | Notes |
|---------|--------|-------|
| Start/Stop Recording | ✓ Implemented | Red button 56px |
| Pause/Resume | ✓ Implemented | Gray button 40px |
| Duration Timer | ✓ Implemented | mm:ss format |
| Max Duration | ✓ Implemented | 120s default (configurable) |
| Waveform Animation | ❌ Missing | No AudioVisualizer integrated |
| Error Handling | ✓ Implemented | Error text display |

**Testing Required:**
1. Microphone permission flow
2. Recording quality on mobile devices
3. Max duration auto-stop
4. Transcription API response time

### 6.2 Pattern Analysis (Dual Lens)

**Components:**
- `DualLensDisplay.tsx` - Interpretation display
- `/api/interpret/route.ts` - AI processing

**Features:**
| Feature | Status | Notes |
|---------|--------|-------|
| Lens A (External) | ✓ Implemented | Systemic pressures |
| Lens B (Internal) | ✓ Implemented | Adaptive mechanisms |
| Confidence Score | ✓ Implemented | 0-100% display |
| Expand/Collapse | ✓ Implemented | Show more/less |
| Lens Selection | ✓ Implemented | Select button per lens |
| Skeleton Loading | ✓ Implemented | Animated placeholders |

**PRO Paywall:**
- Ghost Patterns locked behind PRO
- Full archive locked behind PRO
- JSON Export locked behind PRO

### 6.3 Archive

**Routes:**
- `/archive` - List view
- `/archive/[id]` - Detail view

**Empty State:** Needs verification

### 6.4 Crisis Detection System

**Three-Layer Architecture:**

| Layer | Trigger | Action |
|-------|---------|--------|
| 1. Hard Keywords | suicide, kill myself, etc. | INSTANT BLOCK + CrisisModal |
| 2. Soft Keywords | hopeless, worthless, etc. | Claude Assessment |
| 3. Risk Scoring | Score ≥ 0.7 | BLOCK |
| | Score 0.5-0.7 | WARN + SafetyBanner |
| | Score < 0.5 | PROCEED |

**Components:**
- `CrisisModal.tsx` - Full-screen crisis intervention
- `EmergencyBanner.tsx` - Warning banner
- `useCrisisDetection.ts` - Detection hook

### 6.5 GDPR Compliance

**Routes:**
- `/api/user/export` - Data export (JSON)
- `/api/user/account` - DELETE account
- `/privacy` - Privacy policy
- `/terms` - Terms of service

**Consent Requirements (4 checkboxes):**
1. "I understand this is a construction tool, not therapy"
2. "I have read the safety guidelines"
3. "I consent to data processing as described"
4. "I am 18 years or older"

---

## 7. RESPONSIVE BREAKPOINTS

### Tailwind Configuration

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop (sidebar shows) |
| `xl` | 1280px | Large desktop |
| `2xl` | 1536px | Extra large |

### Key Breakpoints in Use

| Component | Mobile | Desktop |
|-----------|--------|---------|
| Sidebar | Hidden | `lg:block` w-60 |
| Mobile Nav | Visible | `lg:hidden` |
| CTA Stack | `flex-col` | `sm:flex-row` |
| Hero Text | `text-4xl` | `md:text-5xl` |

### Recommended Testing Viewports

| Device | Width | Height |
|--------|-------|--------|
| iPhone SE | 320px | 568px |
| iPhone 12/13 | 390px | 844px |
| iPad | 768px | 1024px |
| Desktop | 1200px | 800px |
| Large Desktop | 1440px | 900px |

---

## 8. ACCESSIBILITY COMPLIANCE

### Touch Targets

| Element | Size | WCAG Requirement |
|---------|------|------------------|
| Primary Buttons | 44px+ height | ✓ Meets |
| Recording FAB | 56px | ✓ Exceeds |
| Nav Items | ~44px (py-2.5) | ✓ Meets |
| Icon Buttons | 40x40px | ⚠️ Close to minimum |

### Color Contrast

| Combination | Ratio | WCAG AA |
|-------------|-------|---------|
| Primary text on bg-base | ~15:1 | ✓ Pass |
| Secondary text on bg-base | ~7:1 | ✓ Pass |
| Muted text on bg-base | ~4.5:1 | ✓ Pass (AA) |
| Primary accent on bg-base | ~6:1 | ✓ Pass |

### Focus Indicators

```css
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### ARIA Labels

| Component | Status |
|-----------|--------|
| Recording buttons | ✓ aria-label |
| Nav menu button | ✓ aria-label="Menu" |
| Close button | ✓ aria-label="Zamknij" |
| Skeleton loading | ✓ aria-label |

---

## 9. TECHNICAL STACK

### Core Framework

| Technology | Version | Notes |
|------------|---------|-------|
| Next.js | 16.1.3 | App Router |
| React | 19.2.3 | Latest with Server Components |
| TypeScript | ^5 | Strict mode |
| Tailwind CSS | ^4 | JIT, dark mode class |

### Backend Services

| Service | Package | Version |
|---------|---------|---------|
| Supabase JS | @supabase/supabase-js | ^2.90.1 |
| Supabase SSR | @supabase/ssr | ^0.8.0 |
| Supabase Auth | @supabase/auth-helpers-nextjs | ^0.15.0 (deprecated) |
| Stripe | stripe | ^20.2.0 |
| Stripe JS | @stripe/stripe-js | ^8.6.1 |

### AI Integration

| Service | Package | Model |
|---------|---------|-------|
| Anthropic SDK | @anthropic-ai/sdk | ^0.71.2 |
| Claude Model | - | claude-3-5-sonnet-20241022 |
| Whisper (planned) | - | whisper-1 |

### UI Libraries

| Package | Version | Usage |
|---------|---------|-------|
| lucide-react | ^0.562.0 | Icons |

---

## 10. COMPONENT STATUS & TESTING RECOMMENDATIONS

### Production Ready ✓

| Component | File | Status |
|-----------|------|--------|
| Homepage | `app/page.tsx` | ✓ Ready |
| Login/Signup | `app/(auth)/*` | ✓ Ready (test auth flow) |
| Dashboard Shell | `components/layout/*` | ✓ Ready |
| DualLensDisplay | `components/DualLensDisplay.tsx` | ✓ Ready |
| CrisisModal | `components/CrisisModal.tsx` | ✓ Ready |
| MobileNav | `components/layout/MobileNav.tsx` | ✓ Ready |

### Needs Testing ⚠️

| Component | File | Issue |
|-----------|------|-------|
| VoiceDump | `components/VoiceDump.tsx` | Test microphone permissions |
| useMediaRecorder | `hooks/useMediaRecorder.ts` | Test on mobile browsers |
| useTranscription | `hooks/useTranscription.ts` | Test API integration |
| Stripe Checkout | `api/stripe/*` | Test payment flow |

### Missing/Incomplete ❌

| Feature | Notes |
|---------|-------|
| AudioVisualizer | Component exists but not integrated |
| useOfflineQueue | Hook added but not integrated |
| Waveform Animation | Not visible in VoiceDump |
| PRO Paywall UI | Needs PaywallModal integration |

---

## 11. DEPLOYMENT VERIFICATION CHECKLIST

### Pre-Deploy

- [ ] Environment variables set (Supabase, Anthropic, Stripe)
- [ ] Stripe webhook URL configured
- [ ] Supabase RLS policies active
- [ ] Database migrations applied
- [ ] Language validator passes (`node validate-strings.js ./src`)

### Post-Deploy Testing

- [ ] Homepage loads correctly
- [ ] Auth flow (signup → email → login)
- [ ] Dashboard access (authenticated only)
- [ ] Voice recording (Chrome, Safari, Firefox)
- [ ] Crisis keyword detection triggers modal
- [ ] Stripe checkout flow
- [ ] Data export works
- [ ] Account deletion works
- [ ] Mobile navigation functions
- [ ] All routes return 200 (not 404/500)

### Performance Metrics

| Metric | Target | Tool |
|--------|--------|------|
| LCP | < 2.5s | Lighthouse |
| FID | < 100ms | Lighthouse |
| CLS | < 0.1 | Lighthouse |
| Interpretation Flow | < 15s | Manual |
| Crisis Detection | < 500ms | Manual |

---

## 12. KNOWN ISSUES & RECOMMENDATIONS

### Critical

1. ~~**Pricing Discrepancy:** Unify 29 PLN vs 49 PLN across codebase~~ ✓ FIXED
2. **Deprecated Package:** `@supabase/auth-helpers-nextjs` - migrate to `@supabase/ssr`

### Important

1. **AudioVisualizer:** Not integrated into VoiceDump - add waveform feedback
2. **Offline Support:** useOfflineQueue exists but needs integration
3. **Error Boundaries:** Add React error boundaries for graceful failures

### Nice to Have

1. **i18n:** Full Polish translation (some English remains)
2. **PWA:** Add service worker for offline support
3. **Analytics:** Add Vercel Analytics or similar

---

**Document generated by Claude Code Analysis**
**Last updated:** 2026-01-26
