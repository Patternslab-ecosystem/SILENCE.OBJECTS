// @silence/language — Forbidden Vocabulary Guardrails

export const FORBIDDEN_TERMS = [
  'therapy', 'diagnosis', 'advice', 'treatment', 'healing',
  'wellness', 'spiritual', 'mystical', 'divine', 'cosmic',
  'horoscope', 'fortune', 'terapia', 'diagnoza', 'leczenie',
] as const;

export function sanitize(text: string): string {
  let result = text;
  FORBIDDEN_TERMS.forEach((term) => {
    const regex = new RegExp(term, 'gi');
    result = result.replace(regex, '[REDACTED]');
  });
  return result;
}

export function validate(text: string): { valid: boolean; violations: string[] } {
  const violations = FORBIDDEN_TERMS.filter((t) => text.toLowerCase().includes(t));
  return { valid: violations.length === 0, violations: [...violations] };
}

export function getForbiddenTerms(): readonly string[] {
  return FORBIDDEN_TERMS;
}
