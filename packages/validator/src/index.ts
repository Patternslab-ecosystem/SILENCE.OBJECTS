// ===========================================
// @silence/validator — Contract & Language Audit Engine
// ===========================================
// Wraps @silence/language with extended audit capabilities:
// framing analysis, tone detection, XSS/injection scanning,
// batch auditing, CI/CD integration, and markdown reporting.
//
// Edge-runtime compatible. No Node.js-only APIs used.
// ===========================================

import {
  validate,
  sanitize,
  containsForbiddenLanguage,
} from '@silence/language';

// ===========================================
// TYPES
// ===========================================

export interface AuditIssue {
  type:
    | 'forbidden_term'
    | 'framing_violation'
    | 'tone_warning'
    | 'xss'
    | 'injection';
  severity: 'low' | 'medium' | 'high' | 'critical';
  term: string;
  context: string;
  suggestion: string;
}

export interface AuditResult {
  pass: boolean;
  score: number;
  issues: AuditIssue[];
  summary: string;
}

export interface BatchResult {
  total: number;
  passed: number;
  failed: number;
  issues: AuditIssue[];
  passRate: number;
}

// ===========================================
// INTERNAL PATTERNS
// ===========================================

/** Framing patterns — manipulative "you"-directed phrasing. */
const FRAMING_PATTERNS: Array<{ pattern: RegExp; term: string; suggestion: string }> = [
  {
    pattern: /\byou are\b/gi,
    term: 'you are',
    suggestion: 'Avoid identity-level framing. Describe observations, not labels.',
  },
  {
    pattern: /\byou have a problem\b/gi,
    term: 'you have a problem',
    suggestion: 'Do not pathologize the user. Reframe neutrally.',
  },
  {
    pattern: /\byou should\b/gi,
    term: 'you should',
    suggestion: 'Avoid directive advice. Present options instead of prescriptions.',
  },
  {
    pattern: /\bthe truth is\b/gi,
    term: 'the truth is',
    suggestion: 'Avoid authoritative truth claims. Use hedged language.',
  },
];

/** Tone patterns — imperatives and absolutes that imply authority. */
const TONE_PATTERNS: Array<{ pattern: RegExp; term: string; suggestion: string }> = [
  {
    pattern: /\balways\b/gi,
    term: 'always',
    suggestion: 'Absolute language overpromises. Consider "often" or "typically".',
  },
  {
    pattern: /\bnever\b/gi,
    term: 'never',
    suggestion: 'Absolute language overpromises. Consider "rarely" or "seldom".',
  },
  {
    pattern: /\bmust\b/gi,
    term: 'must',
    suggestion: 'Imperative tone may feel coercive. Consider "may" or "could".',
  },
  {
    pattern: /\bdo this\b/gi,
    term: 'do this',
    suggestion: 'Direct imperatives can feel commanding. Rephrase as a suggestion.',
  },
  {
    pattern: /\bstop\s+\w+ing\b/gi,
    term: 'stop [verb]ing',
    suggestion: 'Negative imperatives can feel controlling. Offer alternatives instead.',
  },
  {
    pattern: /\byou need to\b/gi,
    term: 'you need to',
    suggestion: 'Implies obligation. Consider "you might consider" or "one option is".',
  },
];

/** XSS / script injection patterns. */
const XSS_PATTERNS: Array<{ pattern: RegExp; term: string }> = [
  { pattern: /<script\b[^]*?<\/script>/gi, term: '<script> tag' },
  { pattern: /<script\b/gi, term: '<script> tag (unclosed)' },
  { pattern: /javascript\s*:/gi, term: 'javascript: protocol' },
  { pattern: /on(click|load|error|mouseover|mouseout|focus|blur|submit|change|input|keydown|keyup|keypress)\s*=/gi, term: 'event handler attribute' },
  { pattern: /<iframe\b/gi, term: '<iframe> tag' },
  { pattern: /<object\b/gi, term: '<object> tag' },
  { pattern: /<embed\b/gi, term: '<embed> tag' },
  { pattern: /data\s*:\s*text\/html/gi, term: 'data: text/html URI' },
  { pattern: /expression\s*\(/gi, term: 'CSS expression()' },
  { pattern: /url\s*\(\s*['"]?\s*javascript:/gi, term: 'CSS url(javascript:)' },
  { pattern: /<svg\b[^>]*\bon\w+\s*=/gi, term: 'SVG with event handler' },
];

/** SQL injection patterns. */
const SQL_PATTERNS: Array<{ pattern: RegExp; term: string }> = [
  { pattern: /\bUNION\s+(ALL\s+)?SELECT\b/gi, term: 'UNION SELECT' },
  { pattern: /\bSELECT\b.+\bFROM\b/gi, term: 'SELECT ... FROM' },
  { pattern: /\bDROP\s+(TABLE|DATABASE|INDEX)\b/gi, term: 'DROP statement' },
  { pattern: /\bINSERT\s+INTO\b/gi, term: 'INSERT INTO' },
  { pattern: /\bDELETE\s+FROM\b/gi, term: 'DELETE FROM' },
  { pattern: /\bUPDATE\b.+\bSET\b/gi, term: 'UPDATE ... SET' },
  { pattern: /\bALTER\s+TABLE\b/gi, term: 'ALTER TABLE' },
  { pattern: /\bTRUNCATE\s+TABLE\b/gi, term: 'TRUNCATE TABLE' },
  { pattern: /\bEXEC(UTE)?\s*\(/gi, term: 'EXEC/EXECUTE' },
  { pattern: /--\s/g, term: 'SQL comment (--)' },
  { pattern: /;\s*(DROP|SELECT|INSERT|UPDATE|DELETE|ALTER|TRUNCATE)/gi, term: 'chained SQL statement' },
  { pattern: /('|")\s*(OR|AND)\s+('|")\s*\1\s*=\s*\1/gi, term: 'OR/AND tautology injection' },
  { pattern: /'\s*OR\s+'?\d+'?\s*=\s*'?\d+/gi, term: 'OR numeric tautology' },
];

// ===========================================
// SCORING
// ===========================================

/** Penalty weights per issue type. */
const SEVERITY_PENALTY: Record<AuditIssue['severity'], number> = {
  low: 3,
  medium: 8,
  high: 15,
  critical: 30,
};

function computeScore(issues: AuditIssue[]): number {
  let deductions = 0;
  for (const issue of issues) {
    deductions += SEVERITY_PENALTY[issue.severity];
  }
  return Math.max(0, Math.min(100, 100 - deductions));
}

// ===========================================
// CONTEXT EXTRACTION
// ===========================================

/**
 * Extracts a surrounding context window from the source text around a match.
 * Returns up to 80 characters of context centered on the match position.
 */
function extractContext(text: string, matchIndex: number, matchLength: number): string {
  const contextRadius = 30;
  const start = Math.max(0, matchIndex - contextRadius);
  const end = Math.min(text.length, matchIndex + matchLength + contextRadius);
  let slice = text.slice(start, end).replace(/\n/g, ' ');
  if (start > 0) slice = '...' + slice;
  if (end < text.length) slice = slice + '...';
  return slice;
}

/**
 * Runs a regex against text and returns all match positions.
 * Creates a fresh RegExp each time to avoid lastIndex state issues.
 */
function findAllMatches(text: string, pattern: RegExp): Array<{ index: number; matched: string }> {
  const regex = new RegExp(pattern.source, pattern.flags);
  const results: Array<{ index: number; matched: string }> = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    results.push({ index: m.index, matched: m[0] });
    // Prevent infinite loops on zero-length matches
    if (m[0].length === 0) regex.lastIndex++;
  }
  return results;
}

// ===========================================
// PRIMARY API
// ===========================================

/**
 * Comprehensive single-text audit.
 *
 * Runs five audit passes:
 *  1. Forbidden term detection (via @silence/language `validate`)
 *  2. Framing violation detection
 *  3. Tone analysis (imperatives, absolutes)
 *  4. XSS / script injection detection
 *  5. SQL injection detection
 *
 * Returns a score from 0-100 (100 = perfect), a pass/fail verdict,
 * a list of structured issues, and a human-readable summary.
 */
export function auditText(text: string): AuditResult {
  const issues: AuditIssue[] = [];

  // ---- Pass 1: Forbidden terms via @silence/language ----
  const langResult = validate(text);
  if (!langResult.valid) {
    for (const match of langResult.matches) {
      issues.push({
        type: 'forbidden_term',
        severity: 'high',
        term: match.term,
        context: extractContext(text, match.index, match.matched.length),
        suggestion: `Remove or replace forbidden term "${match.term}" (category: ${match.category}).`,
      });
    }
    // If validate found violations via substring but no regex matches produced
    // detailed positions, still record them as issues.
    const matchedTerms = new Set(langResult.matches.map((m: { term: string }) => m.term));
    for (const v of langResult.violations) {
      if (!matchedTerms.has(v)) {
        const idx = text.toLowerCase().indexOf(v.toLowerCase());
        issues.push({
          type: 'forbidden_term',
          severity: 'high',
          term: v,
          context: idx >= 0 ? extractContext(text, idx, v.length) : text.slice(0, 80),
          suggestion: `Remove or replace forbidden term "${v}".`,
        });
      }
    }
  }

  // ---- Pass 2: Framing violations ----
  for (const fp of FRAMING_PATTERNS) {
    const matches = findAllMatches(text, fp.pattern);
    for (const m of matches) {
      issues.push({
        type: 'framing_violation',
        severity: 'medium',
        term: fp.term,
        context: extractContext(text, m.index, m.matched.length),
        suggestion: fp.suggestion,
      });
    }
  }

  // ---- Pass 3: Tone warnings ----
  for (const tp of TONE_PATTERNS) {
    const matches = findAllMatches(text, tp.pattern);
    for (const m of matches) {
      issues.push({
        type: 'tone_warning',
        severity: 'low',
        term: tp.term,
        context: extractContext(text, m.index, m.matched.length),
        suggestion: tp.suggestion,
      });
    }
  }

  // ---- Pass 4: XSS detection ----
  for (const xp of XSS_PATTERNS) {
    const matches = findAllMatches(text, xp.pattern);
    for (const m of matches) {
      issues.push({
        type: 'xss',
        severity: 'critical',
        term: xp.term,
        context: extractContext(text, m.index, m.matched.length),
        suggestion: `Dangerous markup detected: ${xp.term}. Strip or encode this content.`,
      });
    }
  }

  // ---- Pass 5: SQL injection detection ----
  for (const sp of SQL_PATTERNS) {
    const matches = findAllMatches(text, sp.pattern);
    for (const m of matches) {
      issues.push({
        type: 'injection',
        severity: 'critical',
        term: sp.term,
        context: extractContext(text, m.index, m.matched.length),
        suggestion: `Potential SQL injection detected: ${sp.term}. Sanitize or reject this input.`,
      });
    }
  }

  // ---- Scoring ----
  const score = computeScore(issues);
  const pass = score >= 70 && !issues.some((i) => i.severity === 'critical');

  // ---- Summary ----
  const criticalCount = issues.filter((i) => i.severity === 'critical').length;
  const highCount = issues.filter((i) => i.severity === 'high').length;
  const mediumCount = issues.filter((i) => i.severity === 'medium').length;
  const lowCount = issues.filter((i) => i.severity === 'low').length;

  let summary: string;
  if (issues.length === 0) {
    summary = 'Clean. No issues detected.';
  } else {
    const parts: string[] = [];
    if (criticalCount > 0) parts.push(`${criticalCount} critical`);
    if (highCount > 0) parts.push(`${highCount} high`);
    if (mediumCount > 0) parts.push(`${mediumCount} medium`);
    if (lowCount > 0) parts.push(`${lowCount} low`);
    summary = `${issues.length} issue(s) found: ${parts.join(', ')}. Score: ${score}/100.`;
  }

  return { pass, score, issues, summary };
}

/**
 * Batch audit with aggregate statistics.
 *
 * Runs `auditText` on each string and collects results into a single
 * summary with total/passed/failed counts and a consolidated issue list.
 */
export function auditBatch(texts: string[]): BatchResult {
  const allIssues: AuditIssue[] = [];
  let passed = 0;
  let failed = 0;

  for (const text of texts) {
    const result = auditText(text);
    if (result.pass) {
      passed++;
    } else {
      failed++;
    }
    allIssues.push(...result.issues);
  }

  const total = texts.length;
  const passRate = total > 0 ? Math.round((passed / total) * 10000) / 10000 : 1;

  return {
    total,
    passed,
    failed,
    issues: allIssues,
    passRate,
  };
}

/**
 * CI/CD-friendly audit that returns an exit code and formatted report.
 *
 * - `exitCode: 0` means all texts passed.
 * - `exitCode: 1` means at least one text failed.
 * - `report` is a human-readable string suitable for CI log output.
 */
export function auditForCI(texts: string[]): { exitCode: number; report: string } {
  const results: AuditResult[] = [];
  for (const text of texts) {
    results.push(auditText(text));
  }

  const batchTotal = results.length;
  const batchPassed = results.filter((r) => r.pass).length;
  const batchFailed = batchTotal - batchPassed;
  const exitCode = batchFailed > 0 ? 1 : 0;

  const lines: string[] = [];
  lines.push('=== SILENCE Validator CI Report ===');
  lines.push('');
  lines.push(`Total texts audited: ${batchTotal}`);
  lines.push(`Passed: ${batchPassed}`);
  lines.push(`Failed: ${batchFailed}`);
  lines.push('');

  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const status = r.pass ? 'PASS' : 'FAIL';
    lines.push(`[${i + 1}/${batchTotal}] ${status} (score: ${r.score}/100)`);
    if (r.issues.length > 0) {
      for (const issue of r.issues) {
        lines.push(`  - [${issue.severity.toUpperCase()}] ${issue.type}: "${issue.term}"`);
        lines.push(`    Context: ${issue.context}`);
        lines.push(`    Suggestion: ${issue.suggestion}`);
      }
    }
  }

  lines.push('');
  lines.push(`Result: ${exitCode === 0 ? 'PASS' : 'FAIL'}`);

  return { exitCode, report: lines.join('\n') };
}

/**
 * Quick boolean check: is the text safe for edge runtime deployment?
 *
 * Returns `true` only if:
 *  - No forbidden terms are present (via @silence/language `containsForbiddenLanguage`)
 *  - No XSS patterns are detected
 *
 * This is a fast pre-flight check — it does not compute a full audit score.
 */
export function isEdgeSafe(text: string): boolean {
  // Check forbidden language
  if (containsForbiddenLanguage(text)) {
    return false;
  }

  // Check XSS patterns
  for (const xp of XSS_PATTERNS) {
    const regex = new RegExp(xp.pattern.source, xp.pattern.flags);
    if (regex.test(text)) {
      return false;
    }
  }

  return true;
}

/**
 * Generates a Markdown-formatted report from an array of audit results.
 *
 * Designed for CI log output, pull request comments, or pipeline artifacts.
 */
export function generateReport(results: AuditResult[]): string {
  const lines: string[] = [];

  lines.push('# SILENCE Validator Audit Report');
  lines.push('');

  // Aggregate stats
  const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
  const passedCount = results.filter((r) => r.pass).length;
  const failedCount = results.length - passedCount;
  const avgScore =
    results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
      : 100;

  lines.push('## Summary');
  lines.push('');
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Texts audited | ${results.length} |`);
  lines.push(`| Passed | ${passedCount} |`);
  lines.push(`| Failed | ${failedCount} |`);
  lines.push(`| Average score | ${avgScore}/100 |`);
  lines.push(`| Total issues | ${totalIssues} |`);
  lines.push('');

  // Severity breakdown
  const critical = results.reduce((n, r) => n + r.issues.filter((i) => i.severity === 'critical').length, 0);
  const high = results.reduce((n, r) => n + r.issues.filter((i) => i.severity === 'high').length, 0);
  const medium = results.reduce((n, r) => n + r.issues.filter((i) => i.severity === 'medium').length, 0);
  const low = results.reduce((n, r) => n + r.issues.filter((i) => i.severity === 'low').length, 0);

  if (totalIssues > 0) {
    lines.push('## Issues by Severity');
    lines.push('');
    lines.push(`| Severity | Count |`);
    lines.push(`|----------|-------|`);
    if (critical > 0) lines.push(`| Critical | ${critical} |`);
    if (high > 0) lines.push(`| High | ${high} |`);
    if (medium > 0) lines.push(`| Medium | ${medium} |`);
    if (low > 0) lines.push(`| Low | ${low} |`);
    lines.push('');
  }

  // Per-text details
  lines.push('## Details');
  lines.push('');

  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const status = r.pass ? 'PASS' : 'FAIL';
    lines.push(`### Text ${i + 1} — ${status} (${r.score}/100)`);
    lines.push('');
    lines.push(`> ${r.summary}`);
    lines.push('');

    if (r.issues.length > 0) {
      lines.push('| Type | Severity | Term | Suggestion |');
      lines.push('|------|----------|------|------------|');
      for (const issue of r.issues) {
        // Escape pipe characters in table cells
        const safeTerm = issue.term.replace(/\|/g, '\\|');
        const safeSuggestion = issue.suggestion.replace(/\|/g, '\\|');
        lines.push(`| ${issue.type} | ${issue.severity} | ${safeTerm} | ${safeSuggestion} |`);
      }
      lines.push('');
    }
  }

  // Footer
  lines.push('---');
  lines.push(`*Generated by @silence/validator*`);

  return lines.join('\n');
}

// ===========================================
// RE-EXPORTS from @silence/language for convenience
// ===========================================

export { validate, sanitize, containsForbiddenLanguage };
