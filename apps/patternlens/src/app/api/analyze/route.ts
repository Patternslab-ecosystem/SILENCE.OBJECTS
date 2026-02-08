import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Crisis keywords — Layer 1 (hard block)
const CRISIS_KEYWORDS_PL = ['samobójstwo', 'zabić się', 'chcę umrzeć', 'nie chcę żyć', 'samookaleczenie']
const CRISIS_KEYWORDS_EN = ['suicide', 'kill myself', 'want to die', 'self-harm', 'end my life']
const ALL_CRISIS = [...CRISIS_KEYWORDS_PL, ...CRISIS_KEYWORDS_EN]

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text || text.length < 10) {
      return NextResponse.json({ error: 'Text too short. Minimum 10 characters.' }, { status: 400 })
    }

    // Layer 1: Hard keyword crisis detection
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

    // Try Claude API
    const anthropicKey = process.env.ANTHROPIC_API_KEY
    if (!anthropicKey) {
      return NextResponse.json(mockAnalysis(text))
    }

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
          messages: [{ role: 'user', content: `Analyze this Object structurally:\n\n${text}` }]
        })
      })

      if (!response.ok) {
        return NextResponse.json(mockAnalysis(text))
      }

      const data = await response.json()
      const content = data.content?.[0]?.text || ''

      // Try to parse JSON from Claude response
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          return NextResponse.json({
            analysis: parsed,
            model: 'claude-sonnet-4',
            timestamp: new Date().toISOString(),
            disclaimer: 'Structural analysis proposal. Not advice, diagnosis, or treatment.'
          })
        }
      } catch {}

      // Return raw text if JSON parse fails
      return NextResponse.json({
        analysis: { raw: content },
        model: 'claude-sonnet-4',
        timestamp: new Date().toISOString(),
        disclaimer: 'Structural analysis proposal. Not advice, diagnosis, or treatment.'
      })

    } catch {
      return NextResponse.json(mockAnalysis(text))
    }

  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

function mockAnalysis(text: string) {
  const wordCount = text.split(/\s+/).length
  return {
    analysis: {
      context: 'Structural context identified from input text.',
      tension: 'Primary tension detected between expressed state and underlying pattern.',
      meaning: 'The structural significance relates to recurring behavioral cycles.',
      function: 'This pattern serves a protective/adaptive function in the described context.',
      lensA: 'Primary interpretation: The described pattern suggests a structural response to environmental pressure.',
      lensB: 'Alternative interpretation: The pattern may represent an exploratory phase in behavioral adaptation.',
      archetype: wordCount > 50 ? 'Explorer' : 'Creator',
      confidence: 0.72,
    },
    model: 'mock-fallback',
    timestamp: new Date().toISOString(),
    disclaimer: 'Structural analysis proposal. Not advice, diagnosis, or treatment.',
    note: 'Claude API unavailable — showing structural mock. Full analysis requires API connection.'
  }
}
