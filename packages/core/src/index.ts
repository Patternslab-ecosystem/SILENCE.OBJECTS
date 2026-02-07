// ===========================================
// @silence/core — Pattern Detection Engine
// ===========================================
// 4-phase protocol: Context -> Tension -> Meaning -> Function
//
// Pure TypeScript, zero external dependencies, edge-runtime compatible.
// Local text analysis using keyword matching, regex, and heuristics.

// ============================================
// TYPES
// ============================================

/** Analysis phases in the 4-phase protocol */
export type Phase = 'context' | 'tension' | 'meaning' | 'function';

/** Result of pattern detection across all phases */
export interface PatternResult {
  patterns: string[];
  tensions: string[];
  phase: Phase;
  confidence: number;
}

/** A single lens interpretation */
export interface LensView {
  title: string;
  interpretation: string;
  confidence: number;
}

/** Dual-lens analysis: structural vs relational reading */
export interface DualLens {
  lens_a: LensView;
  lens_b: LensView;
}

/** Complete analysis result for an input text */
export interface AnalysisResult {
  object: string;
  patterns: PatternResult;
  lenses: DualLens;
  archetype_hint: string | null;
  timestamp: string;
}

// ============================================
// PATTERN DICTIONARIES
// ============================================

/** Category name to keywords mapping */
const PATTERN_DICTIONARY: Map<string, string[]> = new Map([
  ['CONTROL', [
    'control', 'order', 'structure', 'manage', 'organize', 'plan',
    'schedule', 'discipline', 'routine', 'rigid', 'strict', 'regulate',
    'systematic', 'authority', 'command', 'dominate', 'supervise',
    'rule', 'restrict', 'contain', 'suppress', 'constrain', 'limit',
    'predictable', 'certainty', 'stable', 'secure',
  ]],
  ['CONNECTION', [
    'connect', 'belong', 'relate', 'share', 'together', 'bond',
    'close', 'intimate', 'love', 'care', 'trust', 'attach',
    'relationship', 'community', 'family', 'friend', 'partner',
    'compassion', 'empathy', 'warmth', 'affection', 'support',
    'loyalty', 'devote', 'nurture', 'embrace', 'depend',
  ]],
  ['ACHIEVEMENT', [
    'achieve', 'succeed', 'goal', 'ambition', 'drive', 'win',
    'compete', 'master', 'accomplish', 'perform', 'excel', 'strive',
    'prove', 'recognition', 'status', 'career', 'promote', 'advance',
    'productive', 'efficient', 'results', 'outcome', 'deliver',
    'effort', 'determination', 'persistence', 'excellence', 'best',
  ]],
  ['FREEDOM', [
    'free', 'escape', 'explore', 'discover', 'adventure', 'independence',
    'break away', 'liberate', 'autonomy', 'spontaneous', 'wander',
    'roam', 'travel', 'open', 'unbounded', 'choice', 'possibility',
    'horizon', 'new', 'unknown', 'curious', 'venture', 'release',
    'untethered', 'unconfined', 'wild', 'limitless',
  ]],
  ['IDENTITY', [
    'who am i', 'identity', 'self', 'authentic', 'true self', 'purpose',
    'meaning', 'define', 'sense of self', 'persona', 'mask', 'role',
    'become', 'core', 'essence', 'genuine', 'real me', 'pretend',
    'facade', 'lost myself', 'find myself', 'know myself', 'soul',
    'inner', 'voice', 'calling', 'destiny', 'values',
  ]],
  ['CONFLICT', [
    'struggle', 'fight', 'oppose', 'resist', 'tension', 'clash',
    'disagree', 'torn', 'conflict', 'battle', 'war', 'confront',
    'argue', 'hostile', 'anger', 'rage', 'frustrate', 'resent',
    'bitter', 'antagonize', 'compete', 'rival', 'contradiction',
    'dilemma', 'torn between', 'caught between', 'ambivalent',
  ]],
  ['GROWTH', [
    'grow', 'learn', 'change', 'evolve', 'develop', 'transform',
    'progress', 'improve', 'mature', 'expand', 'adapt', 'overcome',
    'heal', 'recover', 'renew', 'rebuild', 'emerge', 'breakthrough',
    'insight', 'awareness', 'wisdom', 'understand', 'realize',
    'integrate', 'flourish', 'thrive', 'blossom', 'potential',
  ]],
  ['LOSS', [
    'lose', 'lost', 'miss', 'gone', 'empty', 'grief', 'mourn',
    'absence', 'void', 'hollow', 'missing', 'abandoned', 'alone',
    'lonely', 'isolate', 'separate', 'detach', 'withdraw', 'fade',
    'disappear', 'vanish', 'death', 'end', 'farewell', 'goodbye',
    'regret', 'nostalgia', 'memory', 'past',
  ]],
]);

// ============================================
// TENSION PAIRS (opposing pattern categories)
// ============================================

/** Pairs of categories that create psychological tension when co-present */
const TENSION_PAIRS: [string, string][] = [
  ['CONTROL', 'FREEDOM'],
  ['CONNECTION', 'FREEDOM'],
  ['ACHIEVEMENT', 'CONNECTION'],
  ['CONTROL', 'GROWTH'],
  ['IDENTITY', 'CONNECTION'],
  ['LOSS', 'GROWTH'],
  ['CONFLICT', 'CONNECTION'],
  ['ACHIEVEMENT', 'LOSS'],
  ['CONTROL', 'CONFLICT'],
  ['IDENTITY', 'LOSS'],
  ['FREEDOM', 'LOSS'],
  ['ACHIEVEMENT', 'FREEDOM'],
];

// ============================================
// ARCHETYPE MAPPING
// ============================================

/** Maps dominant pattern combinations to Jungian archetype hints */
const ARCHETYPE_MAP: Array<{
  required: string[];
  optional: string[];
  archetype: string;
  description: string;
}> = [
  {
    required: ['CONTROL', 'ACHIEVEMENT'],
    optional: ['CONFLICT'],
    archetype: 'Ruler',
    description: 'Seeks order through authority and systematic control',
  },
  {
    required: ['FREEDOM', 'GROWTH'],
    optional: ['IDENTITY'],
    archetype: 'Explorer',
    description: 'Driven by discovery, autonomy, and self-expansion',
  },
  {
    required: ['CONNECTION', 'LOSS'],
    optional: ['IDENTITY'],
    archetype: 'Orphan',
    description: 'Navigates through resilience, belonging-seeking, and solidarity',
  },
  {
    required: ['ACHIEVEMENT', 'CONFLICT'],
    optional: ['GROWTH'],
    archetype: 'Hero',
    description: 'Confronts challenges through courage, mastery, and perseverance',
  },
  {
    required: ['CONNECTION', 'GROWTH'],
    optional: ['IDENTITY'],
    archetype: 'Caregiver',
    description: 'Moves through nurturing, protection, and empathic service',
  },
  {
    required: ['IDENTITY', 'GROWTH'],
    optional: ['FREEDOM'],
    archetype: 'Sage',
    description: 'Pursues understanding, self-knowledge, and pattern recognition',
  },
  {
    required: ['CONFLICT', 'FREEDOM'],
    optional: ['IDENTITY'],
    archetype: 'Rebel',
    description: 'Disrupts, resists, and challenges established structures',
  },
  {
    required: ['GROWTH', 'IDENTITY'],
    optional: ['CONNECTION'],
    archetype: 'Magician',
    description: 'Transforms reality through vision and catalytic integration',
  },
  {
    required: ['CONNECTION', 'IDENTITY'],
    optional: ['LOSS'],
    archetype: 'Lover',
    description: 'Seeks deep connection, beauty, and passionate engagement',
  },
  {
    required: ['GROWTH'],
    optional: ['FREEDOM', 'IDENTITY'],
    archetype: 'Creator',
    description: 'Expresses through making, building, and artistic transformation',
  },
  {
    required: ['FREEDOM', 'CONNECTION'],
    optional: ['CONFLICT'],
    archetype: 'Jester',
    description: 'Uses humor, play, and reframing to navigate tension',
  },
  {
    required: ['CONNECTION'],
    optional: ['LOSS', 'IDENTITY'],
    archetype: 'Innocent',
    description: 'Moves through trust, optimism, and simplicity-seeking',
  },
];

// ============================================
// STRUCTURAL DESCRIPTIONS
// ============================================

/** Human-readable descriptions for each pattern category */
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  CONTROL: 'A need for order, predictability, and structural management',
  CONNECTION: 'A drive toward belonging, intimacy, and relational bonding',
  ACHIEVEMENT: 'Orientation toward goals, mastery, and external validation',
  FREEDOM: 'A pull toward autonomy, exploration, and unbounded possibility',
  IDENTITY: 'Questioning or seeking a coherent sense of self and purpose',
  CONFLICT: 'Internal or external opposition, resistance, and unresolved friction',
  GROWTH: 'Movement toward change, learning, transformation, and healing',
  LOSS: 'Experience of absence, grief, emptiness, or detachment',
};

/** Relational descriptions for each pattern category */
const RELATIONAL_DESCRIPTIONS: Record<string, string> = {
  CONTROL: 'May reflect anxiety about unpredictability in relationships or self',
  CONNECTION: 'Indicates longing for or investment in relational closeness',
  ACHIEVEMENT: 'Could mask a need for external approval or fear of inadequacy',
  FREEDOM: 'May signal feeling constrained by obligations or expectations',
  IDENTITY: 'Suggests a relational mirror is needed — self-definition through others',
  CONFLICT: 'Points to unprocessed relational rupture or internal ambivalence',
  GROWTH: 'Indicates readiness to move beyond current relational or personal limits',
  LOSS: 'Signals unresolved attachment, grief, or fear of abandonment',
};

/** Tension descriptions for known opposing pairs */
const TENSION_DESCRIPTIONS: Record<string, string> = {
  'CONTROL vs FREEDOM': 'The desire for structure clashes with the need for autonomy — a core human paradox',
  'CONNECTION vs FREEDOM': 'Closeness to others threatens independence; distance threatens belonging',
  'ACHIEVEMENT vs CONNECTION': 'Pursuit of goals may come at the cost of relational depth',
  'CONTROL vs GROWTH': 'Holding onto structure resists the chaos that transformation requires',
  'IDENTITY vs CONNECTION': 'Defining the self may conflict with merging into relational bonds',
  'LOSS vs GROWTH': 'Grief and absence become the ground from which new meaning can emerge',
  'CONFLICT vs CONNECTION': 'Opposition and friction erode the very bonds being sought',
  'ACHIEVEMENT vs LOSS': 'Striving for success while processing what has been lost or left behind',
  'CONTROL vs CONFLICT': 'The need for order meets forces that resist containment',
  'IDENTITY vs LOSS': 'Loss of something central threatens the coherence of self',
  'FREEDOM vs LOSS': 'The desire to escape confronts the weight of what has been left behind',
  'ACHIEVEMENT vs FREEDOM': 'Structured ambition pulls against the desire for open exploration',
};

// ============================================
// HELPER FUNCTIONS (not exported)
// ============================================

/**
 * Simple word tokenizer. Lowercases input, strips punctuation,
 * and splits on whitespace. Preserves multi-word phrases for
 * bigram/trigram matching.
 */
function tokenize(text: string): string[] {
  const normalized = text.toLowerCase().replace(/[^\w\s'-]/g, ' ');
  return normalized.split(/\s+/).filter((t) => t.length > 0);
}

/**
 * Build n-gram strings from tokens for phrase matching.
 * Returns unigrams, bigrams, and trigrams.
 */
function buildNgrams(tokens: string[]): string[] {
  const ngrams: string[] = [...tokens];
  for (let i = 0; i < tokens.length - 1; i++) {
    ngrams.push(tokens[i] + ' ' + tokens[i + 1]);
  }
  for (let i = 0; i < tokens.length - 2; i++) {
    ngrams.push(tokens[i] + ' ' + tokens[i + 1] + ' ' + tokens[i + 2]);
  }
  return ngrams;
}

/**
 * Count pattern matches per category. For each category in the dictionary,
 * counts how many of its keywords appear in the token set (including n-grams).
 * Returns a Map of category -> match count.
 */
function matchPatterns(
  tokens: string[],
  dictionary: Map<string, string[]>,
): Map<string, number> {
  const ngrams = buildNgrams(tokens);
  const ngramSet = new Set(ngrams);
  const counts = new Map<string, number>();

  for (const [category, keywords] of dictionary) {
    let count = 0;
    for (const keyword of keywords) {
      // For multi-word keywords, check against n-grams
      if (keyword.includes(' ')) {
        if (ngramSet.has(keyword)) {
          count++;
        }
      } else {
        // For single-word keywords, check if any token starts with or equals
        // the keyword stem (allows "controlling" to match "control")
        for (const token of tokens) {
          if (token === keyword || token.startsWith(keyword)) {
            count++;
            break; // Count each keyword once per category
          }
        }
      }
    }
    if (count > 0) {
      counts.set(category, count);
    }
  }

  return counts;
}

/**
 * Calculate a confidence score (0-1) based on the number of pattern
 * matches relative to input length.
 */
function calculateConfidence(
  matchCounts: Map<string, number>,
  tokenCount: number,
): number {
  if (tokenCount === 0) return 0;

  const totalMatches = Array.from(matchCounts.values()).reduce(
    (sum, c) => sum + c,
    0,
  );
  const categoryCount = matchCounts.size;

  // Factor 1: match density (how many keywords matched relative to input size)
  const density = Math.min(totalMatches / Math.max(tokenCount * 0.3, 1), 1);

  // Factor 2: category diversity (more categories = richer signal)
  const diversity = Math.min(categoryCount / 4, 1);

  // Weighted combination: density matters more than diversity
  const raw = density * 0.65 + diversity * 0.35;

  // Clamp and round to 2 decimal places
  return Math.round(Math.min(Math.max(raw, 0), 1) * 100) / 100;
}

/**
 * Get the top N categories sorted by match count (descending).
 */
function topCategories(
  matchCounts: Map<string, number>,
  n: number,
): string[] {
  return Array.from(matchCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([category]) => category);
}

/**
 * Describe the functional role that a set of patterns serves.
 * This is the Phase 4 (Function) interpretive layer.
 */
function describeFunctions(
  dominantPatterns: string[],
  tensions: string[],
): string {
  if (dominantPatterns.length === 0) {
    return 'Insufficient pattern signal to determine functional role.';
  }

  const parts: string[] = [];
  const dominant = dominantPatterns[0];
  const secondary = dominantPatterns[1] || null;

  // Primary function based on dominant pattern
  const primaryFunctions: Record<string, string> = {
    CONTROL:
      'The text functions as a structuring mechanism — an attempt to impose order on internal or external chaos.',
    CONNECTION:
      'The text functions as a relational bid — reaching toward closeness, belonging, or shared meaning.',
    ACHIEVEMENT:
      'The text functions as a performance narrative — organizing experience around goals and measurable progress.',
    FREEDOM:
      'The text functions as a liberation narrative — articulating the need to break from constraint.',
    IDENTITY:
      'The text functions as a self-construction act — building or questioning a coherent sense of who the speaker is.',
    CONFLICT:
      'The text functions as a processing space for opposition — giving form to resistance, friction, or ambivalence.',
    GROWTH:
      'The text functions as a transformation narrative — marking movement from one state toward another.',
    LOSS:
      'The text functions as a grief container — holding absence, emptiness, or what has been left behind.',
  };

  parts.push(primaryFunctions[dominant] || `Dominant pattern: ${dominant}.`);

  // Secondary modulation
  if (secondary) {
    parts.push(
      `This is modulated by ${secondary} patterns, which add ${CATEGORY_DESCRIPTIONS[secondary]?.toLowerCase() || 'additional dimensionality'}.`,
    );
  }

  // Tension function
  if (tensions.length > 0) {
    parts.push(
      `The presence of ${tensions.length === 1 ? 'a tension' : 'tensions'} (${tensions.join('; ')}) suggests the text is working through unresolved opposing forces, which often signals active psychological processing.`,
    );
  }

  return parts.join(' ');
}

// ============================================
// EXPORTED FUNCTIONS
// ============================================

/**
 * Extract matched pattern category names from text.
 * Returns an array of category names (e.g., ['CONTROL', 'FREEDOM'])
 * that have at least one keyword match.
 */
export function extractPatterns(text: string): string[] {
  if (!text || text.trim().length === 0) return [];

  const tokens = tokenize(text);
  const counts = matchPatterns(tokens, PATTERN_DICTIONARY);

  // Return categories sorted by match strength (most matches first)
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category);
}

/**
 * Detect opposing pattern pairs (tensions) from a set of pattern categories.
 * Returns human-readable tension descriptions.
 */
export function detectTensions(patterns: string[]): string[] {
  if (!patterns || patterns.length < 2) return [];

  const patternSet = new Set(patterns);
  const found: string[] = [];

  for (const [a, b] of TENSION_PAIRS) {
    if (patternSet.has(a) && patternSet.has(b)) {
      found.push(`${a} vs ${b}`);
    }
  }

  return found;
}

/**
 * Generate dual-lens interpretation of the input text.
 *
 * Lens A (Structural): what patterns ARE present — objective, taxonomic reading.
 * Lens B (Relational): what patterns MEAN — empathic, contextual reading.
 */
export function dualLens(input: string): DualLens {
  if (!input || input.trim().length === 0) {
    return {
      lens_a: {
        title: 'Structural',
        interpretation: 'No input text provided for analysis.',
        confidence: 0,
      },
      lens_b: {
        title: 'Relational',
        interpretation: 'No input text provided for analysis.',
        confidence: 0,
      },
    };
  }

  const tokens = tokenize(input);
  const counts = matchPatterns(tokens, PATTERN_DICTIONARY);
  const dominant = topCategories(counts, 3);
  const tensions = detectTensions(dominant);
  const confidence = calculateConfidence(counts, tokens.length);

  // --- LENS A: Structural ---
  let structuralParts: string[] = [];

  if (dominant.length === 0) {
    structuralParts.push(
      'The text does not contain strong pattern signals from the standard taxonomy.',
    );
    structuralParts.push(
      'This may indicate highly personal or metaphorical language that resists direct categorization.',
    );
  } else {
    structuralParts.push(
      `Dominant pattern${dominant.length > 1 ? 's' : ''}: ${dominant.join(', ')}.`,
    );

    for (const cat of dominant) {
      const desc = CATEGORY_DESCRIPTIONS[cat];
      const count = counts.get(cat) || 0;
      if (desc) {
        structuralParts.push(
          `${cat} (${count} signal${count !== 1 ? 's' : ''}): ${desc}.`,
        );
      }
    }

    if (tensions.length > 0) {
      structuralParts.push(
        `Structural tensions detected: ${tensions.join('; ')}.`,
      );
    }
  }

  // --- LENS B: Relational ---
  let relationalParts: string[] = [];

  if (dominant.length === 0) {
    relationalParts.push(
      'Without clear pattern signals, the text may be expressing something pre-verbal or deeply embodied.',
    );
    relationalParts.push(
      'Consider what is being avoided or left unsaid — silence itself can be a pattern.',
    );
  } else {
    // Lead with the relational meaning of the primary pattern
    const primary = dominant[0];
    const relDesc = RELATIONAL_DESCRIPTIONS[primary];
    if (relDesc) {
      relationalParts.push(relDesc + '.');
    }

    // Add relational meaning of secondary patterns
    for (let i = 1; i < dominant.length; i++) {
      const desc = RELATIONAL_DESCRIPTIONS[dominant[i]];
      if (desc) {
        relationalParts.push(desc + '.');
      }
    }

    // Add tension interpretation
    for (const t of tensions) {
      const tDesc = TENSION_DESCRIPTIONS[t];
      if (tDesc) {
        relationalParts.push(tDesc + '.');
      }
    }

    // Add a synthesizing observation if we have multiple patterns
    if (dominant.length >= 2) {
      relationalParts.push(
        `The interplay between ${dominant[0]} and ${dominant[1]} suggests this person is navigating a space where both needs are active but may be pulling in different directions.`,
      );
    }
  }

  // Lens B confidence is slightly lower (interpretive, not taxonomic)
  const lensAConf = confidence;
  const lensBConf = Math.round(Math.max(confidence - 0.1, 0) * 100) / 100;

  return {
    lens_a: {
      title: 'Structural',
      interpretation: structuralParts.join(' '),
      confidence: lensAConf,
    },
    lens_b: {
      title: 'Relational',
      interpretation: relationalParts.join(' '),
      confidence: lensBConf,
    },
  };
}

/**
 * Full 4-phase analysis of an input text.
 *
 * Phase 1 (Context): Identify which pattern categories are present.
 * Phase 2 (Tension): Find opposing patterns that create dynamic tension.
 * Phase 3 (Meaning): Determine dominant patterns and suggest archetype hints.
 * Phase 4 (Function): Describe what functional role the patterns serve.
 *
 * Returns a complete AnalysisResult with patterns, lenses, and archetype hint.
 */
export function analyzeObject(input: string): AnalysisResult {
  const now =
    typeof globalThis.Date !== 'undefined'
      ? new Date().toISOString()
      : '1970-01-01T00:00:00.000Z';

  if (!input || input.trim().length === 0) {
    return {
      object: input || '',
      patterns: {
        patterns: [],
        tensions: [],
        phase: 'context',
        confidence: 0,
      },
      lenses: dualLens(''),
      archetype_hint: null,
      timestamp: now,
    };
  }

  // --- Phase 1: Context ---
  // Tokenize and detect which pattern categories are present.
  const tokens = tokenize(input);
  const counts = matchPatterns(tokens, PATTERN_DICTIONARY);
  const detectedPatterns = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category);

  // --- Phase 2: Tension ---
  // Find opposing pattern pairs that create psychological tension.
  const tensions = detectTensions(detectedPatterns);

  // --- Phase 3: Meaning ---
  // Determine dominant patterns and map to archetype hints.
  const dominant = topCategories(counts, 3);
  const dominantSet = new Set(dominant);
  const allDetectedSet = new Set(detectedPatterns);

  let archetypeHint: string | null = null;
  let bestArchetypeScore = 0;

  for (const mapping of ARCHETYPE_MAP) {
    // All required patterns must be present in the detected set
    const requiredMet = mapping.required.every((p) => allDetectedSet.has(p));
    if (!requiredMet) continue;

    // Score: required matches in dominant positions are worth more
    let score = 0;
    for (const req of mapping.required) {
      score += dominantSet.has(req) ? 3 : 1;
    }
    for (const opt of mapping.optional) {
      if (allDetectedSet.has(opt)) {
        score += dominantSet.has(opt) ? 2 : 1;
      }
    }

    if (score > bestArchetypeScore) {
      bestArchetypeScore = score;
      archetypeHint = `${mapping.archetype}: ${mapping.description}`;
    }
  }

  // --- Phase 4: Function ---
  // The function phase is encoded in the dual-lens interpretation
  // and in the PatternResult's phase field. We compute the deepest
  // phase the analysis reached.
  let finalPhase: Phase = 'context';
  if (detectedPatterns.length > 0) finalPhase = 'context';
  if (tensions.length > 0) finalPhase = 'tension';
  if (dominant.length > 0) finalPhase = 'meaning';
  if (dominant.length > 0 && tensions.length >= 0) finalPhase = 'function';

  const confidence = calculateConfidence(counts, tokens.length);

  // Build the dual-lens interpretation
  const lenses = dualLens(input);

  // Enhance lens_b interpretation with functional description
  const functionalDescription = describeFunctions(dominant, tensions);
  if (
    functionalDescription &&
    !lenses.lens_b.interpretation.includes('functions as')
  ) {
    lenses.lens_b = {
      ...lenses.lens_b,
      interpretation:
        lenses.lens_b.interpretation + ' ' + functionalDescription,
    };
  }

  return {
    object: input,
    patterns: {
      patterns: detectedPatterns,
      tensions,
      phase: finalPhase,
      confidence,
    },
    lenses,
    archetype_hint: archetypeHint,
    timestamp: now,
  };
}

// ============================================
// UTILITY EXPORTS
// ============================================

/** All recognized pattern category names */
export const PATTERN_CATEGORIES = Array.from(PATTERN_DICTIONARY.keys());

/** All recognized tension pairs */
export const KNOWN_TENSIONS = TENSION_PAIRS.map(
  ([a, b]) => `${a} vs ${b}`,
);

/** Get the keyword list for a given pattern category */
export function getPatternKeywords(category: string): string[] {
  return PATTERN_DICTIONARY.get(category.toUpperCase()) || [];
}

/** Get the match counts per category for a given text (useful for visualizations) */
export function getPatternCounts(
  text: string,
): Record<string, number> {
  if (!text || text.trim().length === 0) return {};

  const tokens = tokenize(text);
  const counts = matchPatterns(tokens, PATTERN_DICTIONARY);
  const result: Record<string, number> = {};
  counts.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}
