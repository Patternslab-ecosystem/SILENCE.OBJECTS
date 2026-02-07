# ARCHETYPES.md — SILENCE.OBJECTS Archetype System

> 12 Jungian archetypes as behavioral pattern classification.
> FRAMING: "Your patterns currently align with..." NEVER "You are..."

## Core Principle

Archetypes are **classification labels** for behavioral patterns. They are NOT personality types, NOT identity descriptors, NOT diagnostic categories.

| What they ARE | What they are NOT |
|---------------|-------------------|
| Classification labels for patterns | Personality types |
| Naming layer for behaviors | Identity descriptors |
| Cognitive reframing tools | Diagnostic categories |
| System probes | Therapy tools |

## The 12 Archetypes

### 1. CREATOR
| Attribute | Value |
|-----------|-------|
| **Dominant Pattern** | Generation, innovation, building from nothing |
| **Typical Tension** | Perfectionism vs. completion; vision vs. execution |
| **Shadow Pattern** | Creative paralysis, over-ideation without delivery |
| **Growth Edge** | Shipping imperfect work, iterating after release |

### 2. RULER
| Attribute | Value |
|-----------|-------|
| **Dominant Pattern** | Control, structure, order-building |
| **Typical Tension** | Control vs. delegation; stability vs. rigidity |
| **Shadow Pattern** | Micromanagement, authoritarian loops |
| **Growth Edge** | Empowering others, distributed control systems |

### 3. CAREGIVER
| Attribute | Value |
|-----------|-------|
| **Dominant Pattern** | Support, maintenance, resource allocation to others |
| **Typical Tension** | Others' needs vs. system depletion |
| **Shadow Pattern** | Self-neglect, martyr loop, resentment accumulation |
| **Growth Edge** | Boundary setting, sustainable resource allocation |

### 4. EXPLORER
| Attribute | Value |
|-----------|-------|
| **Dominant Pattern** | Novelty-seeking, boundary-testing, expansion |
| **Typical Tension** | Freedom vs. commitment; depth vs. breadth |
| **Shadow Pattern** | Chronic restlessness, inability to commit |
| **Growth Edge** | Depth exploration, sustained focus in chosen domains |

### 5. SAGE
| Attribute | Value |
|-----------|-------|
| **Dominant Pattern** | Analysis, knowledge acquisition, pattern recognition |
| **Typical Tension** | Understanding vs. action; knowledge vs. application |
| **Shadow Pattern** | Analysis paralysis, ivory tower isolation |
| **Growth Edge** | Translating insight into actionable output |

### 6. HERO
| Attribute | Value |
|-----------|-------|
| **Dominant Pattern** | Challenge-seeking, obstacle-overcoming, proving |
| **Typical Tension** | Achievement vs. burnout; strength vs. vulnerability |
| **Shadow Pattern** | Compulsive overwork, refusal to rest or ask for help |
| **Growth Edge** | Strategic rest, accepting limits as system constraints |

### 7. REBEL
| Attribute | Value |
|-----------|-------|
| **Dominant Pattern** | Rule-breaking, disruption, challenging status quo |
| **Typical Tension** | Independence vs. isolation; disruption vs. destruction |
| **Shadow Pattern** | Contrarianism without constructive alternative |
| **Growth Edge** | Building new systems, not just destroying old ones |

### 8. MAGICIAN
| Attribute | Value |
|-----------|-------|
| **Dominant Pattern** | Transformation, synthesis, connecting disparate systems |
| **Typical Tension** | Vision vs. manipulation; integration vs. overwhelm |
| **Shadow Pattern** | Manipulation loops, reality distortion |
| **Growth Edge** | Grounded transformation, transparent process |

### 9. LOVER
| Attribute | Value |
|-----------|-------|
| **Dominant Pattern** | Connection, intensity, deep engagement |
| **Typical Tension** | Intimacy vs. loss; passion vs. obsession |
| **Shadow Pattern** | Codependency, identity fusion, loss aversion |
| **Growth Edge** | Maintaining connection without system identity loss |

### 10. JESTER
| Attribute | Value |
|-----------|-------|
| **Dominant Pattern** | Lightness, reframing, tension-release |
| **Typical Tension** | Joy vs. avoidance; humor vs. deflection |
| **Shadow Pattern** | Using humor to avoid depth, chronic deflection |
| **Growth Edge** | Depth alongside lightness, serious play |

### 11. INNOCENT
| Attribute | Value |
|-----------|-------|
| **Dominant Pattern** | Trust, optimism, simplification |
| **Typical Tension** | Trust vs. naivety; simplicity vs. denial |
| **Shadow Pattern** | Denial of complexity, blind trust in systems |
| **Growth Edge** | Informed optimism, trust with verification |

### 12. ORPHAN
| Attribute | Value |
|-----------|-------|
| **Dominant Pattern** | Survival, adaptation, self-reliance |
| **Typical Tension** | Independence vs. isolation; survival vs. thriving |
| **Shadow Pattern** | Victimhood loop, learned helplessness |
| **Growth Edge** | Selective trust, building support networks |

## Scoring System

Each object analysis produces archetype alignment scores (0.0–1.0):

```typescript
interface ArchetypeScore {
  archetype: ArchetypeName;    // e.g., 'Creator'
  score: number;               // 0.0 - 1.0
  dominantPattern: string;
  typicalTension: string;
  shadowPattern: string;
  growthEdge: string;
}
```

### Blend Detection

Users rarely map to a single archetype. The system detects blends:

```typescript
interface ArchetypeBlend {
  primary: ArchetypeScore;     // Highest scoring
  secondary?: ArchetypeScore;  // Second highest (if > 0.3)
  tertiary?: ArchetypeScore;   // Third (if > 0.2)
  timestamp: string;           // When this blend was calculated
}
```

### Shift Tracking

Over time, archetype blends shift. The system tracks:

- **Drift:** Gradual movement from one archetype toward another
- **Oscillation:** Alternating between two archetypes
- **Convergence:** Multiple archetypes consolidating into one
- **Divergence:** Single dominant archetype splitting into blend

## Framing Rules (MANDATORY)

| ✅ CORRECT | ❌ FORBIDDEN |
|-----------|-------------|
| "Your patterns currently align with Creator" | "You are a Creator" |
| "Creator-adjacent behavioral patterns detected" | "Your personality type is Creator" |
| "Behavioral pattern classification: Creator blend" | "You have Creator personality" |
| "Shift from Explorer toward Sage patterns observed" | "You've changed from Explorer to Sage" |
| "Pattern catalyst: Ruler archetype probe" | "Your archetype reading says Ruler" |

## API

```typescript
// @silence/archetypes exports
mapArchetype(patterns: Pattern[]): ArchetypeScore
scoreBlend(history: ArchetypeScore[]): ArchetypeBlend
trackShift(blendHistory: ArchetypeBlend[]): ShiftAnalysis
```

**Event emitted:** `archetype.updated` (via @silence/events)
