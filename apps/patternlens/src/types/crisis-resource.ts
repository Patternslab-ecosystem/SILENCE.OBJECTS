export interface CrisisResource {
  id: string;
  name: string;
  phone: string;
  description: string;
  region: 'PL' | 'UK' | 'US' | 'EU';
}

export const CRISIS_RESOURCES: Record<string, CrisisResource[]> = {
  PL: [{ id: 'tel', name: 'Telefon Zaufania', phone: '116123', description: '24/7', region: 'PL' }, { id: 'emer', name: 'Alarmowy', phone: '112', description: 'Nagłe', region: 'PL' }],
  US: [{ id: '988', name: '988 Lifeline', phone: '988', description: '24/7', region: 'US' }],
  UK: [{ id: 'sam', name: 'Samaritans', phone: '116123', description: '24/7', region: 'UK' }],
  EU: [{ id: 'eu', name: 'EU Emergency', phone: '112', description: 'EU', region: 'EU' }]
};

export function getCrisisResourcesByLocale(locale: string = 'pl'): CrisisResource[] {
  const map: Record<string, string> = { pl: 'PL', 'en-US': 'US', 'en-GB': 'UK', en: 'US' };
  return CRISIS_RESOURCES[map[locale] || 'PL'] || CRISIS_RESOURCES.PL;
}
