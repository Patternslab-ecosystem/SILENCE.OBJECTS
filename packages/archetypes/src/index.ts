// @silence/archetypes — 12 Jungian Behavioral Pattern Classification
// Full implementation: data, ghost patterns, scoring, shift analysis

// ---------------------------------------------------------------------------
// 1. Core types
// ---------------------------------------------------------------------------

export const ARCHETYPES = [
  'Creator', 'Ruler', 'Caregiver', 'Explorer', 'Sage', 'Hero',
  'Rebel', 'Magician', 'Lover', 'Jester', 'Innocent', 'Orphan',
] as const;

export type ArchetypeName = (typeof ARCHETYPES)[number];

export interface ArchetypeData {
  name: ArchetypeName;
  title: string;
  dominant_pattern: string;
  typical_tension: string;
  shadow_pattern: string;
  growth_edge: string;
  keywords: [string, string, string, string, string];
  color: string;
  icon: string;
}

export interface ArchetypeProfile {
  name: ArchetypeName;
  dominant_pattern: string;
  typical_tension: string;
  shadow_pattern: string;
  growth_edge: string;
  score: number;
}

export interface GhostPattern {
  archetype: ArchetypeName;
  ghost_name: string;
  description: string;
  trigger: string;
  manifestation: string;
  structural_question: string;
}

export interface ShiftAnalysis {
  previous: ArchetypeProfile;
  current: ArchetypeProfile;
  direction: 'growth' | 'regression' | 'lateral';
  tension_change: string;
  shadow_risk: string;
  integration_opportunity: string;
}

// ---------------------------------------------------------------------------
// 2. ARCHETYPE_DATA — all 12 archetypes
// ---------------------------------------------------------------------------

export const ARCHETYPE_DATA: Record<ArchetypeName, ArchetypeData> = {
  Creator: {
    name: 'Creator',
    title: 'The Creator',
    dominant_pattern: 'Drive to create something of enduring value',
    typical_tension: 'Perfectionism vs. completion — the endless revision loop',
    shadow_pattern: 'Obsessive creation that consumes relationships and health',
    growth_edge: 'Learning to release work into the world before it feels ready',
    keywords: ['creation', 'vision', 'originality', 'craft', 'innovation'],
    color: '#8B5CF6',
    icon: '🎨',
  },
  Ruler: {
    name: 'Ruler',
    title: 'The Ruler',
    dominant_pattern: 'Need for control, order, and systemic power',
    typical_tension: 'Authority vs. authoritarianism — the thin line of leadership',
    shadow_pattern: 'Tyrannical control that suppresses dissent and authentic expression',
    growth_edge: 'Delegating power and trusting others to lead in their domain',
    keywords: ['control', 'leadership', 'order', 'authority', 'structure'],
    color: '#F59E0B',
    icon: '👑',
  },
  Caregiver: {
    name: 'Caregiver',
    title: 'The Caregiver',
    dominant_pattern: 'Compulsion to protect, nurture, and serve others',
    typical_tension: 'Selflessness vs. self-erasure — giving until empty',
    shadow_pattern: 'Martyrdom and passive-aggressive resentment from unmet needs',
    growth_edge: 'Setting boundaries without guilt and receiving care from others',
    keywords: ['nurture', 'protection', 'service', 'empathy', 'sacrifice'],
    color: '#10B981',
    icon: '🤲',
  },
  Explorer: {
    name: 'Explorer',
    title: 'The Explorer',
    dominant_pattern: 'Restless search for freedom, authenticity, and new frontiers',
    typical_tension: 'Freedom vs. rootlessness — adventure that avoids settling',
    shadow_pattern: 'Chronic restlessness that mistakes movement for progress',
    growth_edge: 'Finding depth in one place instead of breadth across many',
    keywords: ['freedom', 'discovery', 'adventure', 'autonomy', 'wandering'],
    color: '#3B82F6',
    icon: '🧭',
  },
  Sage: {
    name: 'Sage',
    title: 'The Sage',
    dominant_pattern: 'Pursuit of truth, knowledge, and understanding',
    typical_tension: 'Knowledge vs. paralysis — analysis that prevents action',
    shadow_pattern: 'Intellectual arrogance that dismisses embodied and emotional wisdom',
    growth_edge: 'Applying wisdom through action rather than accumulating it as armor',
    keywords: ['wisdom', 'truth', 'knowledge', 'analysis', 'understanding'],
    color: '#6366F1',
    icon: '📚',
  },
  Hero: {
    name: 'Hero',
    title: 'The Hero',
    dominant_pattern: 'Drive to prove worth through courageous action',
    typical_tension: 'Courage vs. recklessness — bravery that ignores cost',
    shadow_pattern: 'Compulsive proving that masks deep insecurity about self-worth',
    growth_edge: 'Accepting vulnerability as strength and resting without guilt',
    keywords: ['courage', 'strength', 'mastery', 'determination', 'achievement'],
    color: '#EF4444',
    icon: '⚔️',
  },
  Rebel: {
    name: 'Rebel',
    title: 'The Rebel',
    dominant_pattern: 'Urge to break rules, disrupt systems, provoke change',
    typical_tension: 'Revolution vs. destruction — tearing down without building up',
    shadow_pattern: 'Nihilistic destruction that opposes everything including its own values',
    growth_edge: 'Channeling disruption into construction and standing for something',
    keywords: ['disruption', 'revolution', 'defiance', 'liberation', 'provocation'],
    color: '#F97316',
    icon: '🔥',
  },
  Magician: {
    name: 'Magician',
    title: 'The Magician',
    dominant_pattern: 'Desire to understand and transform fundamental reality',
    typical_tension: 'Transformation vs. manipulation — power used on vs. for others',
    shadow_pattern: 'Using deep insight to control and manipulate rather than liberate',
    growth_edge: 'Sharing transformative knowledge openly instead of hoarding it',
    keywords: ['transformation', 'vision', 'catalysis', 'alchemy', 'insight'],
    color: '#A855F7',
    icon: '✨',
  },
  Lover: {
    name: 'Lover',
    title: 'The Lover',
    dominant_pattern: 'Pursuit of connection, intimacy, and sensory experience',
    typical_tension: 'Intimacy vs. engulfment — closeness that erases boundaries',
    shadow_pattern: 'Obsessive attachment and identity dissolution through merging',
    growth_edge: 'Maintaining selfhood while deeply connecting with others',
    keywords: ['passion', 'connection', 'intimacy', 'devotion', 'sensuality'],
    color: '#EC4899',
    icon: '💜',
  },
  Jester: {
    name: 'Jester',
    title: 'The Jester',
    dominant_pattern: 'Living in the moment through joy, humor, and lightness',
    typical_tension: 'Lightness vs. avoidance — humor that deflects from depth',
    shadow_pattern: 'Compulsive frivolity that refuses to engage with serious matters',
    growth_edge: 'Allowing grief and seriousness without losing the capacity for joy',
    keywords: ['humor', 'joy', 'playfulness', 'spontaneity', 'irreverence'],
    color: '#FBBF24',
    icon: '🎭',
  },
  Innocent: {
    name: 'Innocent',
    title: 'The Innocent',
    dominant_pattern: 'Faith that life can be simple, good, and harmonious',
    typical_tension: 'Optimism vs. naivety — trust that ignores real danger',
    shadow_pattern: 'Willful blindness to complexity that enables harm through inaction',
    growth_edge: 'Integrating shadow awareness while preserving genuine hope',
    keywords: ['trust', 'optimism', 'simplicity', 'faith', 'purity'],
    color: '#67E8F9',
    icon: '🌱',
  },
  Orphan: {
    name: 'Orphan',
    title: 'The Orphan',
    dominant_pattern: 'Wound of abandonment driving search for belonging',
    typical_tension: 'Belonging vs. dependency — seeking safety that limits growth',
    shadow_pattern: 'Chronic victimhood that weaponizes vulnerability to control others',
    growth_edge: 'Building self-reliance while remaining open to genuine community',
    keywords: ['belonging', 'resilience', 'solidarity', 'survival', 'abandonment'],
    color: '#78716C',
    icon: '🏚️',
  },
};

// ---------------------------------------------------------------------------
// 3. GHOST_PATTERNS — shadow dynamics for each archetype
// ---------------------------------------------------------------------------

export const GHOST_PATTERNS: GhostPattern[] = [
  {
    archetype: 'Creator',
    ghost_name: 'The Perfectionist Ghost',
    description: 'Invisible standard that nothing is ever finished',
    trigger: 'Approaching completion of meaningful work or receiving external validation',
    manifestation: 'Endless revision cycles, sudden dissatisfaction with near-complete work, starting new projects to avoid finishing current ones',
    structural_question: 'What would it mean if this work were truly done — and it were enough?',
  },
  {
    archetype: 'Ruler',
    ghost_name: 'The Control Ghost',
    description: 'Hidden belief that letting go equals losing everything',
    trigger: 'Situations requiring delegation, trust, or accepting outcomes outside personal control',
    manifestation: 'Micromanagement, inability to rest, covert surveillance of others, rewriting work that was delegated',
    structural_question: 'What falls apart if you stop holding it together — and is that belief actually true?',
  },
  {
    archetype: 'Caregiver',
    ghost_name: 'The Martyr Ghost',
    description: 'Compulsive self-sacrifice that breeds resentment',
    trigger: 'Being asked to receive help, or noticing own needs while others still have unmet ones',
    manifestation: 'Passive-aggressive exhaustion, keeping invisible ledgers of sacrifice, guilt when resting, collapse followed by bitter outbursts',
    structural_question: 'If you stopped sacrificing, who would you be — and would you still be loved?',
  },
  {
    archetype: 'Explorer',
    ghost_name: 'The Escape Ghost',
    description: 'Using freedom as avoidance of depth and commitment',
    trigger: 'Deepening relationships, long-term projects, or any situation that requires staying put',
    manifestation: 'Sudden urge to travel or change direction when things get serious, romanticizing the next horizon, mistaking restlessness for intuition',
    structural_question: 'What are you moving toward — or are you only moving away?',
  },
  {
    archetype: 'Sage',
    ghost_name: 'The Detachment Ghost',
    description: 'Intellectualizing emotions to avoid feeling them',
    trigger: 'Emotional confrontation, vulnerability, or situations where knowledge cannot provide safety',
    manifestation: 'Analyzing feelings instead of experiencing them, retreating into abstraction during conflict, dismissing emotional reasoning as inferior',
    structural_question: 'What do you know in your body that your mind refuses to acknowledge?',
  },
  {
    archetype: 'Hero',
    ghost_name: 'The Invincibility Ghost',
    description: 'Refusal to show weakness or accept help',
    trigger: 'Failure, exhaustion, or situations where competence alone is insufficient',
    manifestation: 'Pushing through injury and burnout, interpreting rest as laziness, escalating challenges to prove resilience, isolation disguised as independence',
    structural_question: 'What would happen if you let someone see you struggle — and they stayed?',
  },
  {
    archetype: 'Rebel',
    ghost_name: 'The Saboteur Ghost',
    description: 'Destroying what works to avoid success',
    trigger: 'Approaching success, stability, or acceptance by the mainstream',
    manifestation: 'Burning bridges at the point of breakthrough, provoking conflict in stable relationships, equating comfort with selling out',
    structural_question: 'Are you fighting the system — or are you afraid of what happens if you win?',
  },
  {
    archetype: 'Magician',
    ghost_name: 'The Manipulation Ghost',
    description: 'Using insight as power over others',
    trigger: 'Possessing knowledge others lack, or feeling unrecognized for transformative contributions',
    manifestation: 'Withholding key information for strategic advantage, engineering outcomes through hidden influence, framing manipulation as mentorship',
    structural_question: 'Are you transforming others — or arranging them to validate your vision?',
  },
  {
    archetype: 'Lover',
    ghost_name: 'The Codependency Ghost',
    description: 'Losing self entirely in connection with others',
    trigger: 'New intimate connections, fear of abandonment, or perceived emotional distance from partner',
    manifestation: 'Absorbing partner identity and preferences, inability to hold opinions that risk disconnection, emotional collapse when alone',
    structural_question: 'Who are you when no one is watching — and can you bear that person?',
  },
  {
    archetype: 'Jester',
    ghost_name: 'The Deflection Ghost',
    description: 'Using humor to mask genuine pain',
    trigger: 'Serious emotional conversations, grief, or moments requiring sincere vulnerability',
    manifestation: 'Cracking jokes during emotional moments, redirecting serious topics with wit, performing lightness while privately suffering',
    structural_question: 'What would happen if you stopped being funny for a moment — and just let it hurt?',
  },
  {
    archetype: 'Innocent',
    ghost_name: 'The Denial Ghost',
    description: 'Toxic positivity that refuses to see shadow',
    trigger: 'Encountering injustice, cruelty, or complexity that challenges a benevolent worldview',
    manifestation: 'Reframing harm as lessons, dismissing anger as negativity, enabling abuse through forced forgiveness, spiritual bypassing',
    structural_question: 'What truth are you calling negativity — because seeing it would require you to act?',
  },
  {
    archetype: 'Orphan',
    ghost_name: 'The Victim Ghost',
    description: 'Learned helplessness that resists empowerment',
    trigger: 'Opportunities for self-determination, or being challenged to take responsibility',
    manifestation: 'Reflexive attribution of outcomes to external forces, rejecting help while complaining about its absence, testing relationships to confirm abandonment',
    structural_question: 'If no one is coming to save you — what power have you been refusing to claim?',
  },
];

// ---------------------------------------------------------------------------
// 4. Internal helpers
// ---------------------------------------------------------------------------

/**
 * Normalize a single input token for comparison: lowercase, trimmed.
 */
function normalize(s: string): string {
  return s.trim().toLowerCase();
}

/**
 * Score a single archetype against a set of pattern tokens.
 * Returns 0-1 where 1 means every keyword matched.
 */
function scoreArchetype(archetype: ArchetypeData, tokens: string[]): number {
  if (tokens.length === 0) return 0;

  let hits = 0;
  const normalizedTokens = tokens.map(normalize);

  // Check keyword matches
  for (const keyword of archetype.keywords) {
    const kw = normalize(keyword);
    for (const token of normalizedTokens) {
      if (token.includes(kw) || kw.includes(token)) {
        hits++;
        break; // count each keyword at most once
      }
    }
  }

  // Check dominant_pattern, typical_tension, shadow_pattern, growth_edge
  const textFields = [
    archetype.dominant_pattern,
    archetype.typical_tension,
    archetype.shadow_pattern,
    archetype.growth_edge,
    archetype.title,
  ];

  const fieldText = textFields.map(normalize).join(' ');
  let fieldHits = 0;
  for (const token of normalizedTokens) {
    if (token.length >= 3 && fieldText.includes(token)) {
      fieldHits++;
    }
  }

  // Weighted score: keyword matches are primary (0.7 weight), field matches secondary (0.3 weight)
  const keywordScore = archetype.keywords.length > 0 ? hits / archetype.keywords.length : 0;
  const fieldScore = normalizedTokens.length > 0 ? Math.min(fieldHits / normalizedTokens.length, 1) : 0;

  return keywordScore * 0.7 + fieldScore * 0.3;
}

/**
 * Build an ArchetypeProfile from ArchetypeData with a given score.
 */
function toProfile(data: ArchetypeData, score: number): ArchetypeProfile {
  return {
    name: data.name,
    dominant_pattern: data.dominant_pattern,
    typical_tension: data.typical_tension,
    shadow_pattern: data.shadow_pattern,
    growth_edge: data.growth_edge,
    score,
  };
}

// ---------------------------------------------------------------------------
// 5. Exported functions
// ---------------------------------------------------------------------------

/**
 * Match an array of pattern keywords/phrases to archetypes and return
 * the highest-scoring archetype as a profile.  Returns null when no
 * archetype scores above zero.
 */
export function mapArchetype(patterns: string[]): ArchetypeProfile | null {
  if (!patterns || patterns.length === 0) return null;

  let bestData: ArchetypeData | null = null;
  let bestScore = 0;

  for (const name of ARCHETYPES) {
    const data = ARCHETYPE_DATA[name];
    const score = scoreArchetype(data, patterns);
    if (score > bestScore) {
      bestScore = score;
      bestData = data;
    }
  }

  if (!bestData || bestScore === 0) return null;
  return toProfile(bestData, Math.round(bestScore * 1000) / 1000);
}

/**
 * Score all 12 archetypes against the given pattern tokens.
 * Returns a record mapping each archetype name to a 0-1 score.
 */
export function scoreBlend(patterns: string[]): Record<ArchetypeName, number> {
  const result = {} as Record<ArchetypeName, number>;

  for (const name of ARCHETYPES) {
    const data = ARCHETYPE_DATA[name];
    const raw = scoreArchetype(data, patterns);
    result[name] = Math.round(raw * 1000) / 1000;
  }

  return result;
}

/**
 * Analyze the transition between two archetype profiles.
 * Determines direction (growth, regression, lateral) and provides
 * integration guidance.
 */
export function trackShift(
  previous: ArchetypeProfile,
  current: ArchetypeProfile,
): ShiftAnalysis {
  // Determine direction based on score trajectory and archetype relationship
  let direction: ShiftAnalysis['direction'];

  if (current.score > previous.score + 0.1) {
    direction = 'growth';
  } else if (current.score < previous.score - 0.1) {
    direction = 'regression';
  } else {
    direction = 'lateral';
  }

  // When archetype has changed, analyze the tension between old and new
  const tensionChange =
    previous.name === current.name
      ? `Deepening within ${current.name}: tension remains "${current.typical_tension}"`
      : `Shifting from ${previous.name} tension ("${previous.typical_tension}") to ${current.name} tension ("${current.typical_tension}")`;

  // Shadow risk: the previous archetype's shadow may persist during transition
  const shadowRisk =
    previous.name === current.name
      ? `Entrenchment risk: "${current.shadow_pattern}"`
      : `Carry-over shadow from ${previous.name} ("${previous.shadow_pattern}") may distort the ${current.name} pattern`;

  // Integration opportunity: combining the growth edges
  const integrationOpportunity =
    previous.name === current.name
      ? `Deepen the growth edge: "${current.growth_edge}"`
      : `Integrate ${previous.name} growth edge ("${previous.growth_edge}") with ${current.name} growth edge ("${current.growth_edge}")`;

  return {
    previous,
    current,
    direction,
    tension_change: tensionChange,
    shadow_risk: shadowRisk,
    integration_opportunity: integrationOpportunity,
  };
}

/**
 * Look up the ghost pattern for a given archetype.
 * Throws if the archetype name is invalid.
 */
export function getGhostPattern(archetype: ArchetypeName): GhostPattern {
  const pattern = GHOST_PATTERNS.find((gp) => gp.archetype === archetype);
  if (!pattern) {
    throw new Error(`No ghost pattern found for archetype: ${archetype}`);
  }
  return pattern;
}

/**
 * Return all 12 archetype data objects as an array.
 */
export function getAllArchetypes(): ArchetypeData[] {
  return ARCHETYPES.map((name) => ARCHETYPE_DATA[name]);
}
