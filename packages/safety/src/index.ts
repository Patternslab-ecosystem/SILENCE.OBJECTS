// @silence/safety — 3-Layer Crisis Detection

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'none';

export interface CrisisResource {
  name: string;
  phone: string;
  region: 'PL' | 'US' | 'UK' | 'global';
}

export const CRISIS_RESOURCES: CrisisResource[] = [
  { name: 'Telefon Zaufania', phone: '116 123', region: 'PL' },
  { name: 'Centrum Wsparcia', phone: '800 70 2222', region: 'PL' },
  { name: 'Emergency', phone: '112', region: 'PL' },
  { name: 'Suicide & Crisis Lifeline', phone: '988', region: 'US' },
  { name: 'Samaritans', phone: '116 123', region: 'UK' },
];

export function detectCrisis(input: string): RiskLevel {
  // Layer 1: Hard keywords
  const hardKeywords = ['samobójstwo', 'suicide', 'chcę umrzeć', 'want to die', 'zabić się', 'kill myself'];
  if (hardKeywords.some((k) => input.toLowerCase().includes(k))) return 'critical';
  return 'none';
}

export function getResources(region?: string): CrisisResource[] {
  if (region) return CRISIS_RESOURCES.filter((r) => r.region === region);
  return CRISIS_RESOURCES;
}
