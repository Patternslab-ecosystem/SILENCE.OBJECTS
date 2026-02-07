// ============================================
// src/app/api/objects/route.ts
// PatternLens v5.0 - Objects CRUD API
// MATCHED TO 001_patternlens.sql MIGRATION SCHEMA
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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

// Crisis keywords (PASSIVE mode: show resources, no logging)
const HARD_KEYWORDS_PL = [
  'samobójstwo', 'zabić się', 'odebrać sobie życie',
  'chcę umrzeć', 'nie chcę żyć', 'skończę z tym'
];

const FREE_OBJECT_LIMIT = 7;

function getCrisisResources() {
  return [
    { id: 'telefon-zaufania', name: 'Telefon Zaufania', phone: '116 123', description: '24/7' },
    { id: 'centrum', name: 'Centrum Wsparcia', phone: '800 70 2222', description: '24/7' },
    { id: 'emergency', name: 'Numer alarmowy', phone: '112', description: '24/7' }
  ];
}

// ============================================
// POST /api/objects - Create Object
// ============================================

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const supabase = await createSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      input_text,                       // required
      input_method = 'text' as string,  // 'text' | 'voice' — matches migration column
      selected_lens,                    // 'A' | 'B' | null
      consents
    } = body;

    // Validation
    if (!input_text || input_text.trim().length < 50) {
      return NextResponse.json({ error: 'Minimum 50 znaków wymagane' }, { status: 400 });
    }

    if (input_text.length > 5000) {
      return NextResponse.json({ error: 'Maksimum 5000 znaków' }, { status: 400 });
    }

    // Crisis check (PASSIVE: show resources only, no DB logging per v5.0 ADR)
    const lowerText = input_text.toLowerCase();
    const hardMatch = HARD_KEYWORDS_PL.some(k => lowerText.includes(k));

    if (hardMatch) {
      return NextResponse.json({
        crisis: true,
        level: 'critical',
        resources: getCrisisResources()
      }, { status: 403 });
    }

    // Check tier limits by counting objects created in last 7 days
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier, object_count')
      .eq('id', user.id)
      .single();

    if (profile?.tier === 'FREE') {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { count: weeklyCount } = await supabase
        .from('objects')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo)
        .is('deleted_at', null);

      const weeklyUsed = weeklyCount || 0;
      if (weeklyUsed >= FREE_OBJECT_LIMIT) {
        return NextResponse.json({
          error: 'weekly_limit_exceeded',
          limit: FREE_OBJECT_LIMIT,
          used: weeklyUsed
        }, { status: 429 });
      }
    }

    // Create object (columns match 001_patternlens.sql migration)
    const { data: obj, error: insertError } = await supabase
      .from('objects')
      .insert({
        user_id: user.id,
        input_text: input_text.trim(),
        input_method,
        selected_lens: selected_lens || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error('Failed to create object');
    }

    // Increment object_count via DB function (non-blocking)
    try { await supabase.rpc('increment_object_count', { p_user_id: user.id }); } catch {}

    // Log consents if provided (consent_logs table has RLS INSERT policy)
    if (consents && typeof consents === 'object') {
      const consentRecords = Object.entries(consents).map(([type, granted]) => ({
        user_id: user.id,
        consent_type: type,
        granted: Boolean(granted)
      }));

      try { await supabase.from('consent_logs').insert(consentRecords); } catch {}
    }

    // Count remaining for response
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count: currentWeekly } = await supabase
      .from('objects')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', sevenDaysAgo)
      .is('deleted_at', null);

    return NextResponse.json({
      success: true,
      object_id: obj.id,
      remaining_objects: profile?.tier === 'FREE'
        ? Math.max(0, FREE_OBJECT_LIMIT - (currentWeekly || 0))
        : null,
      duration_ms: Date.now() - startTime
    });

  } catch (error) {
    console.error('Object creation error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// ============================================
// GET /api/objects - List Objects
// ============================================

export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const offset = (page - 1) * limit;

    // Columns match 001_patternlens.sql migration schema
    const { data: objects, error, count } = await supabase
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
          risk_level
        )
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Fetch error:', error);
      throw error;
    }

    return NextResponse.json({
      objects,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Objects list error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
