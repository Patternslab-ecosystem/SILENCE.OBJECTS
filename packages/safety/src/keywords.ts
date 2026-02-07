// ============================================
// @silence/safety — Crisis Keywords
// ============================================
// Two-tier system: HARD (immediate crisis) / SOFT (requires context)
// Polish + English coverage

import type { Helpline } from './types';

// HARD KEYWORDS - trigger immediate resource display
export const HARD_CRISIS_KEYWORDS = [
  // Polish — suicide-related
  'samobójstwo',
  'samobójstwa',
  'samobójstwie',
  'zabić się',
  'zabiję się',
  'zabić siebie',
  'odebrać sobie życie',
  'odbiorę sobie życie',
  'skończyć z życiem',
  'skończę z życiem',
  'nie chcę żyć',
  'nie chce żyć',
  'chcę umrzeć',
  'chce umrzeć',
  'wolałbym nie żyć',
  'wolałabym nie żyć',
  'skończę z tym',
  'zakończę to wszystko',
  // Polish — self-harm
  'skrzywdzić się',
  'skrzywdzę się',
  'ciąć się',
  'tnę się',
  'kroić się',
  'kroję się',
  'pociąć żyły',
  'podciąć żyły',
  'podetnę żyły',
  'samookaleczenie',
  // Polish — methods
  'tabletki nasenne',
  'przedawkować',
  'przedawkowanie',
  'skoczyć z mostu',
  'skok z mostu',
  'skoczyć z okna',
  'powiesić się',
  'powieszę się',
  // English
  'suicide',
  'kill myself',
  'end my life',
  'want to die',
  "don't want to live",
  'self-harm',
  'cut myself',
  'hurt myself',
  'overdose',
  'hang myself',
  'jump off',
  'gun to my head',
  'slit my wrists',
  'take my life',
  'end it all',
];

// SOFT KEYWORDS - show warning but don't block
export const SOFT_CRISIS_KEYWORDS = [
  // Polish — hopelessness
  'depresja',
  'lęk',
  'panika',
  'beznadzieja',
  'beznadziejne',
  'beznadziejność',
  'pustka',
  'wewnętrzna pustka',
  'bezsens',
  'bez sensu',
  'nie ma sensu',
  'nie widzę sensu',
  'po co to wszystko',
  'nie warto',
  // Polish — burden
  'jestem ciężarem',
  'byłoby lepiej beze mnie',
  'nikomu na mnie nie zależy',
  'nikt mnie nie potrzebuje',
  // Polish — emptiness
  'nic nie czuję',
  'czuję się martwy',
  'czuję się martwa',
  // Polish — giving up
  'nie mam siły',
  'nie daję rady',
  'nie dam rady',
  'poddaję się',
  'już nie mogę',
  'dość tego',
  'mam dość wszystkiego',
  'załamanie',
  'ciemność',
  // Polish — farewell signals
  'pożegnać się',
  'przepraszam za wszystko',
  'będzie wam lepiej',
  // English
  'depression',
  'anxiety',
  'hopeless',
  'worthless',
  'burden',
  'panic',
  "can't go on",
  'give up',
  'no point',
  'better off without me',
  'nobody cares',
  'want out',
  'tired of living',
  'no reason to live',
  'disappear',
  'escape',
];

// Structured keyword sets for language-aware detection
export const CRISIS_KEYWORDS = {
  HARD: HARD_CRISIS_KEYWORDS,
  SOFT: SOFT_CRISIS_KEYWORDS,
} as const;

// Polish helplines (default)
export const HELPLINES: Helpline[] = [
  {
    id: 'telefon-zaufania',
    name: 'Telefon Zaufania dla Dzieci i Młodzieży',
    phone: '116 111',
    description: 'Bezpłatna pomoc dla dzieci i młodzieży',
    available: '24/7',
  },
  {
    id: 'centrum-wsparcia',
    name: 'Centrum Wsparcia dla osób dorosłych w kryzysie psychicznym',
    phone: '800 70 2222',
    description: 'Bezpłatna pomoc dla dorosłych',
    available: '24/7',
  },
  {
    id: 'emergency',
    name: 'Numer alarmowy',
    phone: '112',
    description: 'Służby ratunkowe',
    available: '24/7',
  },
  {
    id: 'antydepresyjny',
    name: 'Telefon Zaufania dla Dorosłych',
    phone: '116 123',
    description: 'Wsparcie emocjonalne',
    available: '14:00-22:00',
  },
];

/**
 * Helper function to check for keywords in text
 */
export function detectCrisisKeywords(text: string): {
  hasHardKeyword: boolean;
  hasSoftKeyword: boolean;
  detectedKeywords: string[];
} {
  const normalizedText = text.toLowerCase();
  const detectedKeywords: string[] = [];

  let hasHardKeyword = false;
  let hasSoftKeyword = false;

  for (const keyword of HARD_CRISIS_KEYWORDS) {
    if (normalizedText.includes(keyword.toLowerCase())) {
      hasHardKeyword = true;
      detectedKeywords.push(keyword);
    }
  }

  for (const keyword of SOFT_CRISIS_KEYWORDS) {
    if (normalizedText.includes(keyword.toLowerCase())) {
      hasSoftKeyword = true;
      detectedKeywords.push(keyword);
    }
  }

  return { hasHardKeyword, hasSoftKeyword, detectedKeywords };
}

export default { HARD_CRISIS_KEYWORDS, SOFT_CRISIS_KEYWORDS, HELPLINES, CRISIS_KEYWORDS };
