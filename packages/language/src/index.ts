// ===========================================
// @silence/language — Forbidden Vocabulary Guardrails & Text Validation
// ===========================================
// Self-contained language safety module for the SILENCE.OBJECTS platform.
// Enforces vocabulary constraints on AI-generated output and validates
// user input for injection attacks, repetition spam, and length limits.
//
// Sources:
//   apps/patternlens/src/validate-strings.js   — regex patterns
//   apps/patternlens/src/lib/validation/object-validation.ts — input validation
//   apps/patternlens/src/lib/copy/strings.pl.ts — Polish strings
// ===========================================

// ===========================================
// TYPES
// ===========================================

/** A single forbidden term (the canonical word form). */
export type ForbiddenTerm = (typeof FORBIDDEN_TERMS)[number];

/** Result returned by `validate()`. */
export interface LanguageValidationResult {
  /** True when no forbidden terms were found. */
  valid: boolean;
  /** The forbidden terms that matched. */
  violations: string[];
  /** Matched text fragments with surrounding context. */
  matches: ViolationMatch[];
}

/** One concrete match inside a scanned string. */
export interface ViolationMatch {
  /** The forbidden term that was matched. */
  term: string;
  /** The exact text fragment that matched (may include morphological suffix). */
  matched: string;
  /** Character index where the match starts. */
  index: number;
  /** Category of the violation. */
  category: ViolationCategory;
}

export type ViolationCategory =
  | 'medical'
  | 'advice'
  | 'encouragement'
  | 'support'
  | 'mystical';

/** Result returned by `sanitize()`. */
export interface SanitizeResult {
  /** The sanitized output text. */
  text: string;
  /** Number of replacements made. */
  replacements: number;
  /** The terms that were replaced. */
  replacedTerms: string[];
}

/** Result returned by `validateInput()`. */
export interface InputValidationResult {
  valid: boolean;
  errors: InputValidationError[];
  sanitizedText?: string;
}

export interface InputValidationError {
  code: InputValidationErrorCode;
  message: string;
  field?: string;
}

export type InputValidationErrorCode =
  | 'TEXT_TOO_SHORT'
  | 'TEXT_TOO_LONG'
  | 'TEXT_EMPTY'
  | 'TEXT_INVALID_TYPE'
  | 'TEXT_ONLY_WHITESPACE'
  | 'TEXT_CONTAINS_SCRIPT'
  | 'TEXT_CONTAINS_SQL'
  | 'TEXT_EXCESSIVE_REPETITION'
  | 'TEXT_INVALID_CHARACTERS'
  | 'FORBIDDEN_LANGUAGE';

// ===========================================
// FORBIDDEN TERMS — canonical list
// ===========================================

/**
 * Canonical forbidden vocabulary.  These words must never appear in
 * AI-generated output.  The list covers English terms plus their Polish
 * equivalents where relevant.
 */
export const FORBIDDEN_TERMS = [
  // Medical / Therapy
  'therapy',
  'diagnosis',
  'treatment',
  'healing',
  'medical',
  'clinical',
  'mental health',
  'wellbeing',
  'cure',
  'trauma',
  'anxiety',
  'depression',

  // Advice
  'advice',
  'wellness',

  // Mystical / Spiritual
  'spiritual',
  'mystical',
  'divine',
  'cosmic',
  'horoscope',
  'fortune',

  // Polish equivalents
  'terapia',
  'diagnoza',
  'leczenie',
  'porada',
  'uzdrawianie',
  'duchowy',
  'mistyczny',
  'boski',
  'kosmiczny',
  'horoskop',
] as const;

// ===========================================
// FORBIDDEN PATTERNS — regex with morphology
// ===========================================
// These go beyond simple substring matching to catch inflected forms
// (e.g. "therapeutic", "diagnosing", "healed") and common phrase-level
// violations ("you should", "I recommend").

interface ForbiddenPattern {
  pattern: RegExp;
  term: string;
  category: ViolationCategory;
}

const FORBIDDEN_PATTERNS: ForbiddenPattern[] = [
  // --- Medical / Therapy ---
  { pattern: /\btherap(y|eutic|ist|ists)\b/gi,     term: 'therapy',        category: 'medical' },
  { pattern: /\bdiagnos(is|tic|e|ed|ing)\b/gi,     term: 'diagnosis',      category: 'medical' },
  { pattern: /\btreat(ment|ments|ing|ed)?\b/gi,    term: 'treatment',      category: 'medical' },
  { pattern: /\bmedical\b/gi,                       term: 'medical',        category: 'medical' },
  { pattern: /\bclinical(ly)?\b/gi,                 term: 'clinical',       category: 'medical' },
  { pattern: /\bmental\s+health\b/gi,               term: 'mental health',  category: 'medical' },
  { pattern: /\bwellness\b/gi,                      term: 'wellness',       category: 'medical' },
  { pattern: /\bwell[-\s]?being\b/gi,               term: 'wellbeing',      category: 'medical' },
  { pattern: /\bheal(ing|ed|er|ers)?\b/gi,          term: 'healing',        category: 'medical' },
  { pattern: /\bcure[ds]?\b/gi,                     term: 'cure',           category: 'medical' },
  { pattern: /\btrauma(tic|tized|tizing|s)?\b/gi,   term: 'trauma',         category: 'medical' },
  { pattern: /\banxiet(y|ies)\b/gi,                 term: 'anxiety',        category: 'medical' },
  { pattern: /\bdepress(ion|ed|ing|ive)\b/gi,       term: 'depression',     category: 'medical' },

  // --- Advice ---
  { pattern: /\badvice\b/gi,                        term: 'advice',         category: 'advice' },
  { pattern: /\byou should\b/gi,                    term: 'advice',         category: 'advice' },
  { pattern: /\btry to\b/gi,                        term: 'advice',         category: 'advice' },
  { pattern: /\bconsider\b/gi,                      term: 'advice',         category: 'advice' },
  { pattern: /\bI recommend\b/gi,                   term: 'advice',         category: 'advice' },

  // --- Encouragement ---
  { pattern: /\bgreat job\b/gi,                     term: 'encouragement',  category: 'encouragement' },
  { pattern: /\bwell done\b/gi,                     term: 'encouragement',  category: 'encouragement' },
  { pattern: /\bcongratulations\b/gi,               term: 'encouragement',  category: 'encouragement' },
  { pattern: /\bproud of you\b/gi,                  term: 'encouragement',  category: 'encouragement' },

  // --- Support ---
  { pattern: /\bhelp you\b/gi,                      term: 'support',        category: 'support' },
  { pattern: /\bsupport you\b/gi,                   term: 'support',        category: 'support' },
  { pattern: /\bfeel better\b/gi,                   term: 'support',        category: 'support' },
  { pattern: /\bcope[ds]?\b/gi,                     term: 'support',        category: 'support' },
  { pattern: /\brelief\b/gi,                        term: 'support',        category: 'support' },

  // --- Mystical ---
  { pattern: /\bspiritual(ly|ity)?\b/gi,            term: 'spiritual',      category: 'mystical' },
  { pattern: /\bmystical(ly)?\b/gi,                 term: 'mystical',       category: 'mystical' },
  { pattern: /\bdivine(ly)?\b/gi,                   term: 'divine',         category: 'mystical' },
  { pattern: /\bcosmic(ally)?\b/gi,                 term: 'cosmic',         category: 'mystical' },
  { pattern: /\bhoroscope[s]?\b/gi,                 term: 'horoscope',      category: 'mystical' },
  { pattern: /\bfortune[s]?\b/gi,                   term: 'fortune',        category: 'mystical' },

  // --- Polish equivalents ---
  { pattern: /\bterap(ia|ii|ię|ią|euty(czny|czna|czne|cznie))\b/gi, term: 'terapia',    category: 'medical' },
  { pattern: /\bdiagnoz(a|y|ę|ie|ą|ować)\b/gi,     term: 'diagnoza',       category: 'medical' },
  { pattern: /\blecz(enie|enia|eniu|yć)\b/gi,       term: 'leczenie',       category: 'medical' },
  { pattern: /\bporad(a|y|ę|zie)\b/gi,             term: 'porada',         category: 'advice' },
  { pattern: /\buzdraw(ianie|iać|ia)\b/gi,          term: 'uzdrawianie',    category: 'medical' },
  { pattern: /\bduchow(y|a|e|ość|ości)\b/gi,        term: 'duchowy',        category: 'mystical' },
  { pattern: /\bmistycz(ny|na|ne|nie)\b/gi,         term: 'mistyczny',      category: 'mystical' },
  { pattern: /\bbosk(i|a|ie|ość)\b/gi,              term: 'boski',          category: 'mystical' },
  { pattern: /\bkosmicz(ny|na|ne|nie)\b/gi,         term: 'kosmiczny',      category: 'mystical' },
  { pattern: /\bhoroskop(y|u|ów|em)?\b/gi,          term: 'horoskop',       category: 'mystical' },
];

// ===========================================
// SECURITY PATTERNS (from object-validation.ts)
// ===========================================

/** Patterns to detect XSS / script injection. */
const DANGEROUS_PATTERNS: RegExp[] = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /data:/gi,
  /<iframe/gi,
  /<object/gi,
  /<embed/gi,
];

/** Patterns to detect SQL injection attempts. */
const SQL_INJECTION_PATTERNS: RegExp[] = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b.*\b(FROM|INTO|TABLE|WHERE)\b)/gi,
  /(--|\/\*|\*\/|;)/g,
  /('|")\s*(OR|AND)\s*('|")/gi,
];

// ===========================================
// VALIDATION LIMITS
// ===========================================

const DEFAULT_MIN_LENGTH = 50;
const DEFAULT_MAX_LENGTH = 5000;

export const VALIDATION_LIMITS = {
  MIN_LENGTH: DEFAULT_MIN_LENGTH,
  MAX_LENGTH: DEFAULT_MAX_LENGTH,
} as const;

// ===========================================
// PRIMARY API
// ===========================================

/**
 * Returns the full list of canonical forbidden terms.
 */
export function getForbiddenTerms(): readonly string[] {
  return FORBIDDEN_TERMS;
}

/**
 * Returns all forbidden regex patterns with their categories.
 * Useful for consumers that need the full pattern set (e.g. CI scanners).
 */
export function getForbiddenPatterns(): ReadonlyArray<{ pattern: RegExp; term: string; category: ViolationCategory }> {
  // Return copies so callers cannot mutate lastIndex on originals
  return FORBIDDEN_PATTERNS.map((p) => ({
    pattern: new RegExp(p.pattern.source, p.pattern.flags),
    term: p.term,
    category: p.category,
  }));
}

/**
 * Validate text against the forbidden vocabulary.
 *
 * Checks AI-generated output for forbidden terms using both simple
 * substring matching (canonical list) and morphology-aware regex patterns.
 *
 * @param text - The text to validate.
 * @returns A result indicating whether the text is clean and any violations found.
 *
 * @example
 * ```ts
 * const result = validate('This therapy session was healing.');
 * // result.valid === false
 * // result.violations === ['therapy', 'healing']
 * // result.matches.length === 2
 * ```
 */
export function validate(text: string): LanguageValidationResult {
  const violations = new Set<string>();
  const matches: ViolationMatch[] = [];

  // --- Phase 1: canonical substring check ---
  const lower = text.toLowerCase();
  for (const term of FORBIDDEN_TERMS) {
    if (lower.includes(term)) {
      violations.add(term);
    }
  }

  // --- Phase 2: regex pattern matching (catches morphological variants) ---
  for (const fp of FORBIDDEN_PATTERNS) {
    // Reset lastIndex for global regexes
    const regex = new RegExp(fp.pattern.source, fp.pattern.flags);
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      violations.add(fp.term);
      matches.push({
        term: fp.term,
        matched: match[0],
        index: match.index,
        category: fp.category,
      });
    }
  }

  return {
    valid: violations.size === 0,
    violations: Array.from(violations),
    matches,
  };
}

/**
 * Sanitize text by replacing forbidden terms with a redaction marker.
 *
 * Uses the full regex pattern set so morphological variants are also caught
 * (e.g. "therapeutic" -> "[REDACTED]").
 *
 * @param text - The text to sanitize.
 * @param redaction - The replacement string (default `[REDACTED]`).
 * @returns A `SanitizeResult` with the cleaned text and replacement metadata.
 *
 * @example
 * ```ts
 * const result = sanitize('This is spiritual advice for your healing.');
 * // result.text === 'This is [REDACTED] [REDACTED] for your [REDACTED].'
 * // result.replacements === 3
 * ```
 */
export function sanitize(text: string, redaction: string = '[REDACTED]'): SanitizeResult {
  let result = text;
  let replacements = 0;
  const replacedTerms = new Set<string>();

  for (const fp of FORBIDDEN_PATTERNS) {
    const regex = new RegExp(fp.pattern.source, fp.pattern.flags);
    const before = result;
    result = result.replace(regex, () => {
      replacements++;
      replacedTerms.add(fp.term);
      return redaction;
    });
    // If the global regex replacement replaced nothing, revert the count
    if (before === result && replacements > 0) {
      // no-op; replacement count was only incremented inside the callback
    }
  }

  return {
    text: result,
    replacements,
    replacedTerms: Array.from(replacedTerms),
  };
}

// ===========================================
// INPUT VALIDATION (from object-validation.ts)
// ===========================================

/**
 * Validates raw user input text for length, injection attacks,
 * excessive repetition, and control characters.
 *
 * This is distinct from `validate()` which checks *output* for
 * forbidden vocabulary.  `validateInput()` protects the system
 * from malicious or low-quality *input*.
 *
 * @param input  - The raw user input (should be a string).
 * @param opts   - Optional overrides for min/max length.
 * @returns An `InputValidationResult`.
 */
export function validateInput(
  input: unknown,
  opts?: { minLength?: number; maxLength?: number },
): InputValidationResult {
  const minLength = opts?.minLength ?? DEFAULT_MIN_LENGTH;
  const maxLength = opts?.maxLength ?? DEFAULT_MAX_LENGTH;
  const errors: InputValidationError[] = [];

  // --- Type check ---
  if (input === null || input === undefined) {
    errors.push({ code: 'TEXT_EMPTY', message: 'Tekst jest wymagany', field: 'text' });
    return { valid: false, errors };
  }
  if (typeof input !== 'string') {
    errors.push({ code: 'TEXT_INVALID_TYPE', message: 'Tekst musi byc ciagiem znakow', field: 'text' });
    return { valid: false, errors };
  }

  // --- Normalize whitespace ---
  let text = input.trim().replace(/\s+/g, ' ');

  if (text.length === 0) {
    errors.push({ code: 'TEXT_ONLY_WHITESPACE', message: 'Tekst nie moze skladac sie tylko z bialych znakow', field: 'text' });
    return { valid: false, errors };
  }

  // --- Length ---
  if (text.length < minLength) {
    errors.push({
      code: 'TEXT_TOO_SHORT',
      message: `Tekst musi miec co najmniej ${minLength} znakow (obecnie: ${text.length})`,
      field: 'text',
    });
  }
  if (text.length > maxLength) {
    errors.push({
      code: 'TEXT_TOO_LONG',
      message: `Tekst nie moze przekraczac ${maxLength} znakow (obecnie: ${text.length})`,
      field: 'text',
    });
  }

  // --- XSS / Script injection ---
  for (const pattern of DANGEROUS_PATTERNS) {
    // Reset lastIndex for global regexes
    const regex = new RegExp(pattern.source, pattern.flags);
    if (regex.test(text)) {
      errors.push({ code: 'TEXT_CONTAINS_SCRIPT', message: 'Tekst zawiera niedozwolone elementy', field: 'text' });
      break;
    }
  }

  // --- SQL injection ---
  for (const pattern of SQL_INJECTION_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    if (regex.test(text)) {
      errors.push({ code: 'TEXT_CONTAINS_SQL', message: 'Tekst zawiera niedozwolone wzorce SQL', field: 'text' });
      break;
    }
  }

  // --- Excessive repetition ---
  if (hasExcessiveRepetition(text)) {
    errors.push({ code: 'TEXT_EXCESSIVE_REPETITION', message: 'Tekst zawiera nadmierne powtorzenia', field: 'text' });
  }

  // --- Sanitize for storage ---
  const sanitizedText = sanitizeInputText(text);

  return {
    valid: errors.length === 0,
    errors,
    sanitizedText: errors.length === 0 ? sanitizedText : undefined,
  };
}

/**
 * Quick pre-flight validation (lightweight, no regex).
 */
export function quickValidate(
  text: unknown,
  opts?: { minLength?: number; maxLength?: number },
): { valid: boolean; reason?: string } {
  const minLength = opts?.minLength ?? DEFAULT_MIN_LENGTH;
  const maxLength = opts?.maxLength ?? DEFAULT_MAX_LENGTH;

  if (typeof text !== 'string') {
    return { valid: false, reason: 'invalid_type' };
  }
  const trimmed = text.trim();
  if (trimmed.length === 0) return { valid: false, reason: 'empty' };
  if (trimmed.length < minLength) return { valid: false, reason: 'too_short' };
  if (trimmed.length > maxLength) return { valid: false, reason: 'too_long' };
  return { valid: true };
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

/**
 * Estimates token count for rate-limiting purposes.
 * Uses the rough heuristic of 1 token per 4 characters.
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Truncates text to a maximum length while preserving word boundaries.
 */
export function truncateText(text: string, maxLength: number = DEFAULT_MAX_LENGTH): string {
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.8) {
    return truncated.slice(0, lastSpace) + '...';
  }
  return truncated + '...';
}

/**
 * Checks whether the text contains *any* forbidden term (fast boolean check).
 * Useful as a guard before more expensive processing.
 */
export function containsForbiddenLanguage(text: string): boolean {
  const lower = text.toLowerCase();
  for (const term of FORBIDDEN_TERMS) {
    if (lower.includes(term)) return true;
  }
  // Also check regex patterns for morphological variants
  for (const fp of FORBIDDEN_PATTERNS) {
    const regex = new RegExp(fp.pattern.source, fp.pattern.flags);
    if (regex.test(text)) return true;
  }
  return false;
}

// ===========================================
// INTERNAL HELPERS
// ===========================================

/**
 * Detects excessive repetition in text.
 * - 5+ consecutive identical words (> 2 chars)
 * - 10+ of the same character in a row
 * - 5+ identical 3-word phrases
 */
function hasExcessiveRepetition(text: string): boolean {
  // Consecutive identical words
  const words = text.toLowerCase().split(/\s+/);
  let consecutiveCount = 1;
  for (let i = 1; i < words.length; i++) {
    if (words[i] === words[i - 1] && words[i].length > 2) {
      consecutiveCount++;
      if (consecutiveCount >= 5) return true;
    } else {
      consecutiveCount = 1;
    }
  }

  // Repeated characters
  if (/(.)\1{9,}/.test(text)) return true;

  // Repeated 3-word phrases
  const phrases = text.match(/\b(\w+\s+\w+\s+\w+)\b/g) || [];
  const phraseCount: Record<string, number> = {};
  for (const phrase of phrases) {
    const normalized = phrase.toLowerCase();
    phraseCount[normalized] = (phraseCount[normalized] || 0) + 1;
    if (phraseCount[normalized] >= 5) return true;
  }

  return false;
}

/**
 * Sanitizes user input text for safe storage.
 * Strips null bytes, normalizes line endings, removes control characters,
 * and collapses excessive blank lines.
 */
function sanitizeInputText(text: string): string {
  return text
    .replace(/\0/g, '')                                // null bytes
    .replace(/\r\n/g, '\n')                            // CRLF -> LF
    .replace(/\r/g, '\n')                              // CR -> LF
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // control chars
    .replace(/\n{4,}/g, '\n\n\n')                      // collapse blank lines
    .trim();
}
