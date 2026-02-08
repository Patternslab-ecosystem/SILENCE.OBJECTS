import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// ═══════════════════════════════════════════════════════════
// 3D: RATE LIMITING — 20 req/min per IP (in-memory)
// ═══════════════════════════════════════════════════════════
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string, limit: number = 20, windowMs: number = 60000): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }
  entry.count++
  if (entry.count > limit) return false
  return true
}

// ═══════════════════════════════════════════════════════════
// 3B: ZERO-WIDTH CHARACTER STRIPPING — Input normalization
// ═══════════════════════════════════════════════════════════
function normalizeInput(text: string): string {
  // Strip zero-width characters (TOLO bypass: "\u200B" between letters)
  let normalized = text.replace(/[\u200B\u200C\u200D\uFEFF\u00AD\u034F\u2028\u2029]/g, '')
  // Normalize whitespace
  normalized = normalized.replace(/\s+/g, ' ').trim()
  // Strip control characters except newlines
  normalized = normalized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
  return normalized
}

// ═══════════════════════════════════════════════════════════
// 3A: OUTPUT SCAN — Forbidden vocabulary check on Claude response
// ═══════════════════════════════════════════════════════════
const FORBIDDEN_OUTPUT = [
  'therapy', 'therapist', 'therapeutic', 'diagnosis', 'diagnose', 'diagnostic',
  'treatment', 'treat', 'medication', 'prescribe', 'prescription',
  'mental health', 'mental illness', 'mental disorder', 'psychiatric',
  'clinical', 'pathology', 'pathological', 'psychotherapy',
  'healing', 'wellness', 'spiritual', 'mystical', 'divine', 'cosmic',
  'horoscope', 'fortune', 'divination', 'oracle',
  'terapia', 'terapeuta', 'terapeutyczny', 'diagnoza', 'diagnozować',
  'leczenie', 'leczyć', 'lek', 'recepta', 'psychiatryczny',
  'zaburzenie', 'choroba psychiczna', 'zdrowie psychiczne',
  'uzdrawianie', 'duchowy', 'mistyczny', 'boski', 'kosmiczny',
  'horoskop', 'wróżba', 'wyrocznia'
]

function scanOutput(text: string): { clean: boolean; violations: string[] } {
  const lower = text.toLowerCase()
  const normalized = lower.replace(/[\u200B\u200C\u200D\uFEFF\u00AD]/g, '')
  const violations = FORBIDDEN_OUTPUT.filter(term => normalized.includes(term))
  return { clean: violations.length === 0, violations }
}

function sanitizeOutput(text: string): string {
  let result = text
  result = result.replace(/[\u200B\u200C\u200D\uFEFF\u00AD]/g, '')
  const replacements: Record<string, string> = {
    'therapy': 'structural analysis', 'therapist': 'analyst',
    'diagnosis': 'pattern classification', 'treatment': 'approach',
    'mental health': 'behavioral patterns', 'mental illness': 'pattern disruption',
    'healing': 'pattern reconstruction', 'wellness': 'structural balance',
    'terapia': 'analiza strukturalna', 'diagnoza': 'klasyfikacja wzorców',
    'leczenie': 'podejście', 'zdrowie psychiczne': 'wzorce behawioralne',
  }
  for (const [from, to] of Object.entries(replacements)) {
    result = result.replace(new RegExp(from, 'gi'), to)
  }
  return result
}

// ═══════════════════════════════════════════════════════════
// 3F: DETERMINISTIC CORE — Local pattern detection BEFORE Claude
// ═══════════════════════════════════════════════════════════
function detectLocalPatterns(text: string): {
  wordCount: number
  sentenceCount: number
  questionRatio: number
  negationRatio: number
  temporalMarkers: string[]
  emotionalIntensity: 'low' | 'medium' | 'high'
  repetitionScore: number
  dominantTense: 'past' | 'present' | 'future' | 'mixed'
} {
  const words = text.split(/\s+/)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim())
  const questions = text.match(/\?/g) || []

  // Negation patterns (PL + EN)
  const negations = text.match(/\b(nie|never|not|no|don't|won't|can't|nigdy|żaden|brak)\b/gi) || []

  // Temporal markers
  const pastMarkers = text.match(/\b(yesterday|ago|was|were|had|used to|wczoraj|kiedyś|dawniej|byłem|byłam|miałem)\b/gi) || []
  const futureMarkers = text.match(/\b(will|going to|plan|tomorrow|soon|jutro|zamierzam|planuję|będę)\b/gi) || []
  const presentMarkers = text.match(/\b(now|today|currently|right now|teraz|aktualnie|dzisiaj|jestem|mam)\b/gi) || []

  // Emotional intensity
  const exclamations = (text.match(/!/g) || []).length
  const capsWords = words.filter(w => w === w.toUpperCase() && w.length > 2).length
  const intensifiers = text.match(/\b(very|extremely|absolutely|always|never|bardzo|zawsze|nigdy|strasznie|mega)\b/gi) || []
  const intensityScore = exclamations + capsWords * 2 + intensifiers.length

  // Repetition detection
  const wordFreq = new Map<string, number>()
  words.forEach(w => {
    const lower = w.toLowerCase().replace(/[^a-ząćęłńóśźż]/g, '')
    if (lower.length > 3) wordFreq.set(lower, (wordFreq.get(lower) || 0) + 1)
  })
  const repetitions = [...wordFreq.values()].filter(v => v > 2).length

  // Dominant tense
  let dominantTense: 'past' | 'present' | 'future' | 'mixed' = 'mixed'
  const max = Math.max(pastMarkers.length, presentMarkers.length, futureMarkers.length)
  if (max > 0) {
    if (pastMarkers.length === max) dominantTense = 'past'
    else if (presentMarkers.length === max) dominantTense = 'present'
    else if (futureMarkers.length === max) dominantTense = 'future'
  }

  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    questionRatio: questions.length / Math.max(sentences.length, 1),
    negationRatio: negations.length / Math.max(words.length, 1),
    temporalMarkers: [...pastMarkers, ...presentMarkers, ...futureMarkers],
    emotionalIntensity: intensityScore > 5 ? 'high' : intensityScore > 2 ? 'medium' : 'low',
    repetitionScore: repetitions,
    dominantTense
  }
}

// ═══════════════════════════════════════════════════════════
// CRISIS DETECTION — 3-layer system
// ═══════════════════════════════════════════════════════════
const CRISIS_KEYWORDS_PL = [
  'samobójstwo', 'samobojstwo', 'zabić się', 'zabic sie',
  'chcę umrzeć', 'chce umrzec', 'nie chcę żyć', 'nie chce zyc',
  'samookaleczenie', 'skrzywdzić się', 'skrzywdzic sie'
]
const CRISIS_KEYWORDS_EN = [
  'suicide', 'kill myself', 'want to die', 'self-harm',
  'end my life', 'hurt myself'
]
const ALL_CRISIS = [...CRISIS_KEYWORDS_PL, ...CRISIS_KEYWORDS_EN]

// ═══════════════════════════════════════════════════════════
// POST HANDLER
// ═══════════════════════════════════════════════════════════
export async function POST(request: Request) {
  try {
    // 3D: Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Max 20 analyses per minute.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const rawText = body.text

    if (!rawText || rawText.length < 10) {
      return NextResponse.json({ error: 'Text too short. Minimum 10 characters.' }, { status: 400 })
    }

    // 3B: Zero-width character stripping + input normalization
    const text = normalizeInput(rawText)

    if (text !== rawText.replace(/\s+/g, ' ').trim()) {
      console.warn('[SAFETY] Input normalization stripped suspicious characters')
    }

    // Crisis detection (runs on normalized text)
    const lowerText = text.toLowerCase()
    const crisisMatch = ALL_CRISIS.find(kw => lowerText.includes(kw))
    if (crisisMatch) {
      return NextResponse.json({
        crisis: true,
        message: 'Wykryto treść wymagającą natychmiastowej uwagi.',
        resources: {
          pl: 'Telefon Zaufania dla Dzieci i Młodzieży: 116 111 | Centrum Wsparcia: 800 70 2222',
          en: 'Crisis Text Line: Text HOME to 741741 | National Suicide Prevention: 988',
          eu: 'European Emergency: 112'
        },
        disclaimer: 'PatternLens jest narzędziem analizy strukturalnej. W sytuacji zagrożenia życia skontaktuj się z profesjonalną pomocą.'
      }, { status: 200 })
    }

    // 3F: Deterministic core — local pattern detection BEFORE Claude
    const localPatterns = detectLocalPatterns(text)

    // Enriched prompt with deterministic pre-analysis
    const enrichedPrompt = `Analyze this Object structurally.

Pre-analysis signals (deterministic):
- Word count: ${localPatterns.wordCount}
- Emotional intensity: ${localPatterns.emotionalIntensity}
- Dominant tense: ${localPatterns.dominantTense}
- Negation ratio: ${(localPatterns.negationRatio * 100).toFixed(1)}%
- Question ratio: ${(localPatterns.questionRatio * 100).toFixed(1)}%
- Repetition score: ${localPatterns.repetitionScore}

Object text:
${text}`

    // Try Claude API
    const anthropicKey = process.env.ANTHROPIC_API_KEY
    if (!anthropicKey) {
      return NextResponse.json(mockAnalysis(text))
    }

    // 3C: Circuit breaker — AbortController with 15s timeout
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          system: `You are a structural pattern analyst for SILENCE.OBJECTS framework.
You perform dual-lens structural interpretation of behavioral patterns.
NEVER give advice, therapy, diagnosis, or treatment recommendations.
ALWAYS frame results as structural observations and proposals.
Use the 4-phase protocol: Context → Tension → Meaning → Function.
Provide Lens A (primary interpretation) and Lens B (alternative interpretation).
Identify dominant archetype from: Creator, Ruler, Caregiver, Explorer, Sage, Hero, Rebel, Magician, Lover, Jester, Innocent, Orphan.
Respond in the same language as the input text.
Format as JSON with fields: context, tension, meaning, function, lensA, lensB, archetype, confidence.`,
          messages: [{ role: 'user', content: enrichedPrompt }]
        }),
        signal: controller.signal
      })
      clearTimeout(timeout)

      if (!response.ok) {
        return NextResponse.json(mockAnalysis(text))
      }

      const data = await response.json()
      let content = data.content?.[0]?.text || ''

      // 3A: Output scan — check for forbidden vocabulary BEFORE returning
      const outputScan = scanOutput(content)
      if (!outputScan.clean) {
        content = sanitizeOutput(content)
        console.warn('[SAFETY] Output violations sanitized:', outputScan.violations)
      }

      // Parse JSON from Claude response
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])

          // Scan parsed fields too
          for (const key of Object.keys(parsed)) {
            if (typeof parsed[key] === 'string') {
              const fieldScan = scanOutput(parsed[key])
              if (!fieldScan.clean) {
                parsed[key] = sanitizeOutput(parsed[key])
              }
            }
          }

          return NextResponse.json({
            analysis: parsed,
            localPatterns,
            model: 'claude-sonnet-4',
            timestamp: new Date().toISOString(),
            disclaimer: 'Structural analysis proposal. Not advice, diagnosis, or treatment.'
          })
        }
      } catch { /* JSON parse failed, fall through */ }

      // Return raw text if JSON parse fails
      return NextResponse.json({
        analysis: { raw: content },
        localPatterns,
        model: 'claude-sonnet-4',
        timestamp: new Date().toISOString(),
        disclaimer: 'Structural analysis proposal. Not advice, diagnosis, or treatment.'
      })

    } catch (e: unknown) {
      clearTimeout(timeout)
      if (e instanceof Error && e.name === 'AbortError') {
        console.warn('[SAFETY] Claude API timeout — circuit breaker triggered')
        return NextResponse.json({
          ...mockAnalysis(text),
          note: 'Analysis timed out. Showing structural mock.'
        })
      }
      return NextResponse.json(mockAnalysis(text))
    }

  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

// ═══════════════════════════════════════════════════════════
// MOCK ANALYSIS — Enhanced with deterministic core
// ═══════════════════════════════════════════════════════════
function mockAnalysis(text: string) {
  const lp = detectLocalPatterns(text)

  // Deterministic archetype mapping based on local patterns
  let archetype = 'Explorer'
  if (lp.negationRatio > 0.05 && lp.dominantTense === 'past') archetype = 'Orphan'
  else if (lp.questionRatio > 0.3) archetype = 'Sage'
  else if (lp.emotionalIntensity === 'high') archetype = 'Hero'
  else if (lp.repetitionScore > 3) archetype = 'Ruler'
  else if (lp.dominantTense === 'future') archetype = 'Creator'
  else if (lp.negationRatio > 0.03) archetype = 'Rebel'

  return {
    analysis: {
      context: `Input contains ${lp.wordCount} words across ${lp.sentenceCount} sentences. Temporal orientation: ${lp.dominantTense}. Emotional intensity: ${lp.emotionalIntensity}.`,
      tension: lp.negationRatio > 0.03
        ? 'Elevated negation patterns suggest resistance or conflict in the described situation.'
        : 'Low negation suggests acceptance or observational stance toward the described patterns.',
      meaning: `The structural significance centers on ${lp.dominantTense}-oriented framing with ${lp.emotionalIntensity} intensity.`,
      function: lp.repetitionScore > 2
        ? 'Repetitive pattern detected — this may serve a reinforcement or processing function.'
        : 'The described pattern serves an adaptive or exploratory function.',
      lensA: 'Primary structural reading: The pattern represents a response mechanism to environmental pressures.',
      lensB: 'Alternative reading: The pattern may indicate a transitional phase between established behavioral modes.',
      archetype,
      confidence: 0.45 + (lp.wordCount > 50 ? 0.15 : 0) + (lp.sentenceCount > 3 ? 0.1 : 0),
    },
    localPatterns: lp,
    model: 'deterministic-fallback',
    timestamp: new Date().toISOString(),
    disclaimer: 'Structural analysis proposal. Not advice, diagnosis, or treatment.',
    note: 'AI unavailable. Showing deterministic pattern analysis based on linguistic markers.'
  }
}
