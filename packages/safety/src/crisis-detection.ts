// ============================================
// @silence/safety — PASSIVE Safety System
// ============================================
// Profile: INFORMED_ADULT_TOOL
// Action: SHOW_RESOURCES (non-blocking) or PROCEED

import { HARD_CRISIS_KEYWORDS } from './keywords';
import type { CrisisLevel, CrisisAction, CrisisCheckResult, CrisisResource } from './types';

export const CRISIS_RESOURCES: Record<string, CrisisResource[]> = {
  PL: [
    { id: 'telefon-zaufania-pl', name: 'Telefon Zaufania', phone: '116123', description: '24/7 wsparcie', region: 'PL' },
    { id: 'emergency-pl', name: 'Numer alarmowy', phone: '112', description: 'Nagłe przypadki', region: 'PL' },
  ],
  US: [
    { id: '988-us', name: '988 Suicide & Crisis Lifeline', phone: '988', description: '24/7 crisis support', region: 'US' },
    { id: 'crisis-text-us', name: 'Crisis Text Line', phone: '741741', description: 'Text HOME', region: 'US' },
  ],
  UK: [
    { id: 'samaritans-uk', name: 'Samaritans', phone: '116123', description: '24/7 emotional support', region: 'UK' },
    { id: 'shout-uk', name: 'Shout', phone: '85258', description: 'Text SHOUT', region: 'UK' },
  ],
};

export function getCrisisResourcesByLocale(locale: string = 'pl'): CrisisResource[] {
  const map: Record<string, string> = { pl: 'PL', 'pl-PL': 'PL', 'en-US': 'US', en: 'US', 'en-GB': 'UK' };
  return CRISIS_RESOURCES[map[locale] || 'PL'] || CRISIS_RESOURCES.PL;
}

/**
 * PASSIVE crisis detection -- hard keyword match only.
 * Never blocks input. Shows resources when hard keywords detected.
 * No logging. No server-side incident tracking.
 */
export class CrisisDetectionSystem {
  private hardKeywords: readonly string[] = HARD_CRISIS_KEYWORDS;

  checkContent(text: string): CrisisCheckResult {
    const norm = text.toLowerCase();
    const ts = new Date().toISOString();

    const hardMatches = this.hardKeywords.filter((k) =>
      norm.includes(k.toLowerCase())
    );

    if (hardMatches.length > 0) {
      return {
        blocked: false,
        level: 'critical',
        action: 'SHOW_RESOURCES',
        matchedKeywords: hardMatches,
        timestamp: ts,
      };
    }

    return {
      blocked: false,
      level: 'none',
      action: 'PROCEED',
      timestamp: ts,
    };
  }
}

export const crisisDetection = new CrisisDetectionSystem();
