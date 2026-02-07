// ============================================
// src/app/api/objects/interpret/route.ts
// PatternLens v5.0 - AI Processing Endpoint
// MATCHED TO 001_patternlens.sql MIGRATION SCHEMA
// PASSIVE safety profile (v5.0 ADR)
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Anthropic from '@anthropic-ai/sdk';

// ============================================
// CONFIGURATION
// ============================================

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Crisis keywords (PASSIVE: show resources only, no DB logging)
const HARD_KEYWORDS_PL = [
  'samobójstwo', 'zabić się', 'odebrać sobie życie',
  'skok z balkonu', 'przedawkowanie', 'powiesić się',
  'chcę umrzeć', 'nie chcę żyć', 'skończę z tym',
  'zakończyć życie', 'targnąć się na życie'
];

// ============================================
// HELPER: Create Supabase Client
// ============================================

async function createSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}

// ============================================
// HELPER: Crisis Resources
// ============================================

function getCrisisResources() {
  return [
    { id: 'telefon-zaufania', name: 'Telefon Zaufania', phone: '116 123', description: '24/7' },
    { id: 'centrum-wsparcia', name: 'Centrum Wsparcia', phone: '800 70 2222', description: '24/7' },
    { id: 'emergency', name: 'Numer alarmowy', phone: '112', description: '24/7' }
  ];
}

// ============================================
// AI PROMPT TEMPLATE
// ============================================

const SYSTEM_PROMPT = `Jesteś analitykiem strukturalnym SILENCE.OBJECTS. Analizujesz wzorce zachowań, NIE dajesz porad.

KRYTYCZNE ZASADY:
1. To narzędzie analizy wzorców, NIE terapia
2. Używasz TYLKO terminologii SILENCE.OBJECTS
3. ZAKAZANE słowa: porada, terapia, diagnoza, leczenie, pomoc, wsparcie, granice, trauma
4. WYMAGANE słowa: wzorzec, struktura, funkcja, napięcie, konstrukcja, obiekt

STRUKTURA ODPOWIEDZI (JSON):
{
  "kontekst": "Obiektywny opis sytuacji (max 100 słów)",
  "napiecie": "Główne napięcie strukturalne (max 80 słów)",
  "znaczenie": "Co napięcie ujawnia o wzorcu (max 100 słów)",
  "funkcja": "Jaką funkcję pełni ten wzorzec (max 80 słów)",
  "temat": "work|relationship|conflict|self",
  "pewnosc": 70-95
}

Odpowiadaj TYLKO w formacie JSON, bez żadnego tekstu przed ani po.`;

// ============================================
// POST /api/objects/interpret
// ============================================

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. AUTH
    const supabase = await createSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. PARSE REQUEST
    const body = await req.json();
    const { object_id } = body;

    if (!object_id) {
      return NextResponse.json({ error: 'object_id required' }, { status: 400 });
    }

    // 3. FETCH OBJECT (columns match 001_patternlens.sql)
    const { data: object, error: fetchError } = await supabase
      .from('objects')
      .select('id, input_text, input_method, selected_lens, detected_theme')
      .eq('id', object_id)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .single();

    if (fetchError || !object) {
      return NextResponse.json({ error: 'Object not found' }, { status: 404 });
    }

    // 4. SAFETY CHECK (PASSIVE: show resources only, no DB logging per v5.0 ADR)
    const lowerText = object.input_text.toLowerCase();
    const hardMatch = HARD_KEYWORDS_PL.some(k => lowerText.includes(k));

    if (hardMatch) {
      return NextResponse.json({
        crisis: true,
        level: 'critical',
        resources: getCrisisResources()
      }, { status: 403 });
    }

    // 5. AI PROCESSING - DUAL LENS
    const lensAPrompt = `Analiza przez SOCZEWKĘ A (perspektywa ochronna - co wzorzec chroni):

"${object.input_text}"

${SYSTEM_PROMPT}`;

    const lensBPrompt = `Analiza przez SOCZEWKĘ B (perspektywa adaptacyjna - dokąd wzorzec prowadzi):

"${object.input_text}"

${SYSTEM_PROMPT}`;

    const [lensAResponse, lensBResponse] = await Promise.all([
      anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [{ role: 'user', content: lensAPrompt }]
      }),
      anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [{ role: 'user', content: lensBPrompt }]
      })
    ]);

    // 6. PARSE AI RESPONSES
    const parseAIResponse = (response: Anthropic.Message) => {
      const text = response.content[0].type === 'text' ? response.content[0].text : '';
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      } catch {
        console.error('JSON parse error:', text);
        return null;
      }
    };

    const lensA = parseAIResponse(lensAResponse);
    const lensB = parseAIResponse(lensBResponse);

    if (!lensA || !lensB) {
      throw new Error('AI response parsing failed');
    }

    // 7. SAVE INTERPRETATIONS (columns match 001_patternlens.sql)
    // phase_1_context through phase_4_function are JSONB columns
    // confidence_score is DECIMAL(3,2) — store as 0.00-1.00
    const interpretations = [
      {
        object_id,
        lens: 'A',
        phase_1_context: { title: 'Kontekst', content: lensA.kontekst },
        phase_2_tension: { title: 'Napięcie', content: lensA.napiecie },
        phase_3_meaning: { title: 'Znaczenie', content: lensA.znaczenie },
        phase_4_function: { title: 'Funkcja', content: lensA.funkcja },
        confidence_score: (lensA.pewnosc || 80) / 100,
        risk_level: 'none'
      },
      {
        object_id,
        lens: 'B',
        phase_1_context: { title: 'Kontekst', content: lensB.kontekst },
        phase_2_tension: { title: 'Napięcie', content: lensB.napiecie },
        phase_3_meaning: { title: 'Znaczenie', content: lensB.znaczenie },
        phase_4_function: { title: 'Funkcja', content: lensB.funkcja },
        confidence_score: (lensB.pewnosc || 80) / 100,
        risk_level: 'none'
      }
    ];

    const { data: savedInterpretations, error: saveError } = await supabase
      .from('interpretations')
      .insert(interpretations)
      .select();

    if (saveError) {
      console.error('Save error:', saveError);
      throw new Error('Failed to save interpretations');
    }

    // 8. UPDATE OBJECT detected_theme (only mutable column in migration)
    const detectedTheme = lensA.temat || 'self';
    await supabase
      .from('objects')
      .update({ detected_theme: detectedTheme })
      .eq('id', object_id);

    // 9. RETURN SUCCESS
    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      object_id,
      interpretations: {
        lensA: savedInterpretations?.find(i => i.lens === 'A'),
        lensB: savedInterpretations?.find(i => i.lens === 'B')
      },
      performance: {
        duration_ms: duration,
        target_ms: 15000,
        within_target: duration < 15000
      }
    });

  } catch (error) {
    console.error('Interpret error:', error);

    return NextResponse.json({
      error: 'Processing failed',
      message: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      duration_ms: Date.now() - startTime
    }, { status: 500 });
  }
}

// ============================================
// GET /api/objects/interpret - Status Check
// ============================================

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const object_id = searchParams.get('object_id');

  if (!object_id) {
    return NextResponse.json({ error: 'object_id required' }, { status: 400 });
  }

  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only select columns that exist in 001_patternlens.sql
  const { data, error } = await supabase
    .from('objects')
    .select(`
      id,
      input_text,
      input_method,
      selected_lens,
      detected_theme,
      created_at,
      interpretations (
        id,
        lens,
        phase_1_context,
        phase_2_tension,
        phase_3_meaning,
        phase_4_function,
        confidence_score,
        risk_level,
        created_at
      )
    `)
    .eq('id', object_id)
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Object not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}
