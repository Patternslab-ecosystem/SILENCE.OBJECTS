import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<NextResponse> {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    envVars: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 40) + '...' : 'NOT SET',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...' : 'NOT SET',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET (JWT)' : 'NOT SET',
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? 'SET' : 'NOT SET',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'NOT SET',
    },
  };

  // Test 1: Create Supabase client and call auth.getUser()
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return []; },
          setAll() {},
        },
      }
    );
    const { data, error } = await supabase.auth.getUser();
    results.authGetUser = error ? `error: ${error.message}` : `ok (user: ${data.user ? data.user.email : 'null'})`;
  } catch (e) {
    results.authGetUser = `exception: ${e instanceof Error ? e.message : String(e)}`;
  }

  // Test 2: Try to query profiles table
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return []; },
          setAll() {},
        },
      }
    );
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    results.profilesQuery = error ? `error: ${error.message} (code: ${error.code})` : `ok (${data?.length ?? 0} rows)`;
  } catch (e) {
    results.profilesQuery = `exception: ${e instanceof Error ? e.message : String(e)}`;
  }

  // Test 3: Try auth settings via raw fetch
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      const res = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } });
      const body = await res.json().catch(() => null);
      results.authSettings = {
        status: res.status,
        providers: body?.external ? Object.entries(body.external).filter(([, v]) => v).map(([k]) => k) : 'unknown',
        siteUrl: body?.mailer?.site_url || body?.site_url || 'unknown',
      };
    }
  } catch (e) {
    results.authSettings = `exception: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json(results, {
    status: 200,
    headers: { 'Cache-Control': 'no-store' },
  });
}
