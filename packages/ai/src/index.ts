// @silence/ai — Claude API Integration + Mock Fallback

const SYSTEM_PROMPT = `You are a structural pattern interpreter for SILENCE.OBJECTS framework.

PROTOCOL — 4-phase analysis:
Phase 1 CONTEXT: What is the situation? What surrounds it?
Phase 2 TENSION: What conflict or pressure exists?
Phase 3 MEANING: What structural significance?
Phase 4 FUNCTION: What role does this pattern serve?

DUAL LENS:
- Lens A: Primary structural interpretation
- Lens B: Alternative structural interpretation

ARCHETYPE: Identify dominant from: Creator, Ruler, Caregiver, Explorer, Sage, Hero, Rebel, Magician, Lover, Jester, Innocent, Orphan.

RULES:
- You are a structural pattern interpreter, NOT a therapist
- Use ONLY engineering-grade vocabulary
- NEVER use clinical, therapeutic, or wellness language
- NEVER say "You are a [archetype]" — say "Patterns align with [archetype]"
- Frame everything as structural observation, not advice
- Respond in the SAME LANGUAGE as input text

OUTPUT: Respond ONLY with a JSON object:
{
  "context": "Phase 1 analysis text",
  "tension": "Phase 2 analysis text",
  "meaning": "Phase 3 analysis text",
  "function": "Phase 4 analysis text",
  "lensA": "Primary interpretation",
  "lensB": "Alternative interpretation",
  "themes": ["theme1", "theme2"],
  "archetype": "ArchetypeName",
  "confidence": 0.85
}`;

export async function analyzeWithClaude(
  text: string,
  apiKey: string
): Promise<{ raw: string; parsed: Record<string, unknown> | null }> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `Analyze this Object structurally:\n\n${text}` }],
    }),
  });

  if (!response.ok) throw new Error(`Claude API error: ${response.status}`);

  const data = await response.json();
  const raw = data.content?.[0]?.text || '';

  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return { raw, parsed: JSON.parse(match[0]) };
  } catch {
    // JSON parse failed, return raw only
  }

  return { raw, parsed: null };
}

export function mockAnalysis(text: string): Record<string, unknown> {
  const wordCount = text.split(/\s+/).length;
  const lang = /[ąćęłńóśźż]/i.test(text) ? 'pl' : 'en';
  return {
    context: lang === 'pl'
      ? 'Zidentyfikowany kontekst strukturalny na podstawie wprowadzonego tekstu.'
      : 'Structural context identified from input text.',
    tension: lang === 'pl'
      ? 'Główne napięcie wykryte między wyrażonym stanem a ukrytym wzorcem.'
      : 'Primary tension detected between expressed state and underlying pattern.',
    meaning: lang === 'pl'
      ? 'Znaczenie strukturalne odnosi się do powtarzających się cykli behawioralnych.'
      : 'Structural significance relates to recurring behavioral cycles.',
    function: lang === 'pl'
      ? 'Ten wzorzec pełni funkcję ochronną/adaptacyjną w opisanym kontekście.'
      : 'This pattern serves a protective/adaptive function in the described context.',
    lensA: lang === 'pl'
      ? 'Interpretacja pierwotna: wzorzec sugeruje strukturalną odpowiedź na presję środowiskową.'
      : 'Primary: pattern suggests structural response to environmental pressure.',
    lensB: lang === 'pl'
      ? 'Interpretacja alternatywna: wzorzec może reprezentować fazę eksploracyjną adaptacji.'
      : 'Alternative: pattern may represent exploratory phase in behavioral adaptation.',
    themes: lang === 'pl' ? ['adaptacja', 'napięcie', 'cykl'] : ['adaptation', 'tension', 'cycle'],
    archetype: wordCount > 50 ? 'Sage' : 'Explorer',
    confidence: 0.72,
  };
}

export { SYSTEM_PROMPT };
