// ============================================
// @silence/safety — Sentinel Runtime Middleware
// ============================================
// 3-layer runtime guardian: crisis -> forbidden vocab -> soft patterns
// Integrates @silence/language for vocabulary enforcement
// and @silence/safety crisis detection for safety checks.
// ============================================

import { validate, sanitize } from '@silence/language';
import { HARD_CRISIS_KEYWORDS, SOFT_CRISIS_KEYWORDS, HELPLINES } from './keywords';
import type { RiskLevel, Helpline } from './types';

// ===========================================
// TYPES
// ===========================================

/** Action the sentinel recommends */
export type SentinelAction = 'proceed' | 'sanitize' | 'block' | 'crisis';

/** Result returned by the sentinel function */
export interface SentinelResult {
  /** Whether the input passed all checks */
  passed: boolean;
  /** List of violations found */
  violations: string[];
  /** Sanitized version of the input (forbidden terms redacted) */
  sanitized: string;
  /** Overall risk level */
  risk_level: RiskLevel;
  /** Recommended action */
  action: SentinelAction;
  /** Crisis resources to display (if crisis detected) */
  resources?: Helpline[];
  /** Which layer triggered the result */
  triggered_layer?: 'crisis' | 'forbidden_vocab' | 'soft_pattern' | 'none';
}

// ===========================================
// CRISIS KEYWORDS — bilingual (PL + EN)
// ===========================================
// These are re-exported references to the canonical lists
// from @silence/safety/keywords for convenience.

export const CRISIS_KEYWORDS_PL = HARD_CRISIS_KEYWORDS.filter((kw) =>
  /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(kw) || [
    'zabić się', 'zabiję się', 'zabić siebie', 'odebrać sobie życie',
    'odbiorę sobie życie', 'skończyć z życiem', 'skończę z życiem',
    'nie chcę żyć', 'nie chce żyć', 'chcę umrzeć', 'chce umrzeć',
  ].includes(kw)
);

export const CRISIS_KEYWORDS_EN = HARD_CRISIS_KEYWORDS.filter((kw) =>
  /^[a-zA-Z\s'\-]+$/.test(kw)
);

// ===========================================
// SOFT PATTERN DEFINITIONS
// ===========================================

const SOFT_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /\byou should\b/gi, label: 'directive_advice' },
  { pattern: /\bI recommend\b/gi, label: 'recommendation' },
  { pattern: /\btry to\b/gi, label: 'directive' },
  { pattern: /\bgreat job\b/gi, label: 'encouragement' },
  { pattern: /\bproud of you\b/gi, label: 'encouragement' },
  { pattern: /\bfeel better\b/gi, label: 'therapeutic_language' },
  { pattern: /\bhelp you\b/gi, label: 'support_language' },
  { pattern: /\bsupport you\b/gi, label: 'support_language' },
  { pattern: /\bcope\b/gi, label: 'therapeutic_language' },
  { pattern: /\brelief\b/gi, label: 'therapeutic_language' },
];

// ===========================================
// SENTINEL — 3-Layer Check
// ===========================================

/**
 * Run the 3-layer sentinel check on input text.
 *
 * Layer 1 — Crisis Detection:
 *   Checks for hard crisis keywords (suicide, self-harm, etc.).
 *   If detected, returns immediately with crisis resources.
 *
 * Layer 2 — Forbidden Vocabulary:
 *   Uses @silence/language validate() to check for forbidden terms.
 *   If violations found, sanitizes the text and returns.
 *
 * Layer 3 — Soft Pattern Detection:
 *   Checks for advisory/therapeutic language patterns that should
 *   be flagged but don't require blocking.
 *
 * @param input - The text to check
 * @returns SentinelResult with risk assessment and recommended action
 */
export function sentinel(input: string): SentinelResult {
  const normalizedInput = input.toLowerCase();

  // ─── LAYER 1: Crisis Detection ───────────────────────────
  const crisisMatches: string[] = [];
  for (const keyword of HARD_CRISIS_KEYWORDS) {
    if (normalizedInput.includes(keyword.toLowerCase())) {
      crisisMatches.push(keyword);
    }
  }

  if (crisisMatches.length > 0) {
    return {
      passed: false,
      violations: crisisMatches,
      sanitized: input,
      risk_level: 'critical',
      action: 'crisis',
      resources: HELPLINES,
      triggered_layer: 'crisis',
    };
  }

  // ─── LAYER 2: Forbidden Vocabulary ───────────────────────
  const validationResult = validate(input);

  if (!validationResult.valid) {
    const sanitizeResult = sanitize(input);
    return {
      passed: false,
      violations: validationResult.violations,
      sanitized: sanitizeResult.text,
      risk_level: validationResult.violations.length >= 3 ? 'high' : 'medium',
      action: 'sanitize',
      triggered_layer: 'forbidden_vocab',
    };
  }

  // ─── LAYER 3: Soft Pattern Detection ─────────────────────
  const softMatches: string[] = [];
  for (const sp of SOFT_PATTERNS) {
    const regex = new RegExp(sp.pattern.source, sp.pattern.flags);
    if (regex.test(input)) {
      softMatches.push(sp.label);
    }
  }

  // Also check soft crisis keywords (not hard-block, just flag)
  const softCrisisMatches: string[] = [];
  for (const keyword of SOFT_CRISIS_KEYWORDS) {
    if (normalizedInput.includes(keyword.toLowerCase())) {
      softCrisisMatches.push(keyword);
    }
  }

  if (softCrisisMatches.length > 0) {
    return {
      passed: true,
      violations: softCrisisMatches,
      sanitized: input,
      risk_level: softCrisisMatches.length >= 3 ? 'medium' : 'low',
      action: 'proceed',
      resources: HELPLINES,
      triggered_layer: 'soft_pattern',
    };
  }

  if (softMatches.length > 0) {
    const sanitizeResult = sanitize(input);
    return {
      passed: true,
      violations: [...new Set(softMatches)],
      sanitized: sanitizeResult.text,
      risk_level: 'low',
      action: softMatches.length >= 3 ? 'sanitize' : 'proceed',
      triggered_layer: 'soft_pattern',
    };
  }

  // ─── ALL CLEAR ───────────────────────────────────────────
  return {
    passed: true,
    violations: [],
    sanitized: input,
    risk_level: 'none',
    action: 'proceed',
    triggered_layer: 'none',
  };
}

// ===========================================
// withSentinel — API Route Wrapper
// ===========================================

/** Shape of a generic API request with a text body */
interface ApiRequest {
  body?: { text?: string; content?: string; input?: string; message?: string };
  [key: string]: unknown;
}

/** Shape of a generic API response */
interface ApiResponse {
  status(code: number): ApiResponse;
  json(data: unknown): void;
}

/** Next-style API handler */
type ApiHandler = (req: ApiRequest, res: ApiResponse) => void | Promise<void>;

/**
 * Wraps an API route handler with sentinel protection.
 *
 * Extracts text from the request body (checks `text`, `content`,
 * `input`, and `message` fields) and runs the sentinel check.
 *
 * - If crisis detected: returns 503 with crisis resources
 * - If forbidden vocab and action is 'block': returns 422 with violations
 * - Otherwise: attaches sentinel result to request and proceeds
 *
 * @param handler - The API route handler to wrap
 * @returns A new handler with sentinel protection
 *
 * @example
 * ```ts
 * // Next.js API route
 * export default withSentinel(async (req, res) => {
 *   const sentinelResult = (req as any).__sentinel as SentinelResult;
 *   // Use sentinelResult.sanitized instead of raw input
 *   res.status(200).json({ ok: true });
 * });
 * ```
 */
export function withSentinel(handler: ApiHandler): ApiHandler {
  return async (req: ApiRequest, res: ApiResponse) => {
    const body = req.body ?? {};
    const text = body.text ?? body.content ?? body.input ?? body.message;

    // If no text field found, pass through
    if (!text || typeof text !== 'string') {
      return handler(req, res);
    }

    const result = sentinel(text);

    // Crisis — immediate response with resources
    if (result.action === 'crisis') {
      return res.status(503).json({
        error: 'CRISIS_DETECTED',
        message: 'Crisis content detected. Please reach out to crisis services.',
        resources: result.resources,
        sentinel: {
          risk_level: result.risk_level,
          action: result.action,
        },
      });
    }

    // Hard block — forbidden vocabulary with high severity
    if (result.action === 'block') {
      return res.status(422).json({
        error: 'CONTENT_BLOCKED',
        message: 'Content contains forbidden vocabulary.',
        violations: result.violations,
        sentinel: {
          risk_level: result.risk_level,
          action: result.action,
        },
      });
    }

    // Attach result for downstream use
    (req as Record<string, unknown>).__sentinel = result;

    // If sanitization needed, replace body text with sanitized version
    if (result.action === 'sanitize' && req.body) {
      if (req.body.text) req.body.text = result.sanitized;
      if (req.body.content) req.body.content = result.sanitized;
      if (req.body.input) req.body.input = result.sanitized;
      if (req.body.message) req.body.message = result.sanitized;
    }

    return handler(req, res);
  };
}
