// ============================================
// @silence/safety — PASSIVE Safety Detection
// ============================================
// Profile: INFORMED_ADULT_TOOL
// Method: Hard keyword string match only
// Action: SHOW_RESOURCES (non-blocking) -- never blocks input
// Logging: NONE (no server-side logging)

import { HARD_CRISIS_KEYWORDS, HELPLINES } from './keywords';
import type { Helpline, RiskLevel, CrisisDetectionResult } from './types';

/**
 * SafetyDetector -- PASSIVE mode (v5.0 INFORMED_ADULT_TOOL)
 *
 * Hard keyword string match only (sub-1ms, pure synchronous).
 * When matched: show resources inline (non-blocking banner).
 * Never blocks input. Never logs.
 */
export class SafetyDetector {
  private hardKeywords: string[];

  constructor() {
    this.hardKeywords = HARD_CRISIS_KEYWORDS;
  }

  /**
   * Passive detection -- checks hard keywords only.
   * Returns showResources=true when matched, but shouldBlock is always false.
   */
  detect(text: string): CrisisDetectionResult {
    const lowerText = text.toLowerCase();

    const hardMatches = this.findMatches(lowerText, this.hardKeywords);
    if (hardMatches.length > 0) {
      return {
        shouldBlock: false,
        riskLevel: 'critical',
        detectedKeywords: hardMatches,
        helplines: HELPLINES,
        showResources: true,
        message: 'Jeśli potrzebujesz pomocy, poniżej znajdziesz numery wsparcia.',
      };
    }

    return {
      shouldBlock: false,
      riskLevel: 'none',
      detectedKeywords: [],
      helplines: [],
      showResources: false,
    };
  }

  /**
   * PASSIVE mode: never blocks. Always returns false.
   */
  shouldBlock(_text: string): false {
    return false;
  }

  /**
   * Check if text triggered resource display
   */
  shouldShowResources(text: string): boolean {
    return this.detect(text).showResources;
  }

  /**
   * Get helplines for static display
   */
  getHelplines(): Helpline[] {
    return HELPLINES;
  }

  private findMatches(text: string, keywords: string[]): string[] {
    const matches: string[] = [];
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        matches.push(keyword);
      }
    }
    return matches;
  }
}

// Singleton instance
export const safetyDetector = new SafetyDetector();

// Convenience functions
export function containsCrisisContent(text: string): boolean {
  return safetyDetector.shouldShowResources(text);
}

/** @deprecated PASSIVE mode -- always returns false. Use containsCrisisContent() to check if resources should be shown. */
export function shouldBlockSubmission(_text: string): false {
  return false;
}

export default SafetyDetector;
