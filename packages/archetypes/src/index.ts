// @silence/archetypes — 12 Jungian Behavioral Pattern Classification

export const ARCHETYPES = [
  'Creator', 'Ruler', 'Caregiver', 'Explorer', 'Sage', 'Hero',
  'Rebel', 'Magician', 'Lover', 'Jester', 'Innocent', 'Orphan',
] as const;

export type ArchetypeName = typeof ARCHETYPES[number];

export interface ArchetypeProfile {
  name: ArchetypeName;
  dominant_pattern: string;
  typical_tension: string;
  shadow_pattern: string;
  growth_edge: string;
  score: number;
}

export function mapArchetype(patterns: string[]): ArchetypeProfile | null {
  return null; // Stub
}

export function scoreBlend(patterns: string[]): Record<ArchetypeName, number> {
  return Object.fromEntries(ARCHETYPES.map((a) => [a, 0])) as Record<ArchetypeName, number>;
}

export function trackShift(previous: ArchetypeName, current: ArchetypeName): string {
  return `Shift: ${previous} → ${current}`;
}
