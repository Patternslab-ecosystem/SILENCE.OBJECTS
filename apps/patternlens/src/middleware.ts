import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Allowed origins for CORS (ADR §12)
const ALLOWED_ORIGINS = [
  'https://patternlens.app',
  'https://www.patternlens.app',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
].filter(Boolean)

function setCorsHeaders(response: NextResponse, origin: string): NextResponse {
  if (ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Max-Age', '86400')
  }
  return response
}

export async function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') ?? ''

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 })
    return setCorsHeaders(response, origin)
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session
  const { data: { user } } = await supabase.auth.getUser()

  // Public routes - no auth required
  const publicRoutes = ['/login', '/auth', '/signup', '/reset-password', '/help', '/pricing', '/test-supabase']
  const isPublicRoute = publicRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  // API routes that don't require auth
  const publicApiRoutes = ['/api/health', '/api/debug', '/api/auth/callback', '/api/stripe/webhook']
  const isPublicApi = publicApiRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  // If not logged in and trying to access protected route
  if (!user && !isPublicRoute && !isPublicApi) {
    const redirectUrl = new URL('/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If logged in and trying to access login page, redirect to dashboard
  if (user && request.nextUrl.pathname === '/login') {
    const redirectUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Set CORS headers on API responses
  if (request.nextUrl.pathname.startsWith('/api/')) {
    setCorsHeaders(supabaseResponse, origin)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, icons, etc.)
     * - API routes that don't need auth
     */
    '/((?!_next/static|_next/image|favicon.ico|icon-.*|apple-icon.*|manifest.json|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)',
  ],
}
