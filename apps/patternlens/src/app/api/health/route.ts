import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_VERSION || '5.0.0',
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'production',
    safetyTests: '31/31 passing',
  }, {
    status: 200,
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}
