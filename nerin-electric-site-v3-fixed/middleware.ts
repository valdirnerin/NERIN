import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { sanitizeError } from '@/lib/logging'

const clientWhitelist = new Set(['/clientes/login', '/clientes/verificar'])

const adminDashboardRoute = '/admin' as const
const clientDashboardRoute = '/clientes' as const

async function resolveSession(req: NextRequest) {
  try {
    const session = await auth(req)
    if (session?.user) {
      console.info('[MIDDLEWARE] Session resolved', {
        userId: session.user.id,
        role: session.user.role,
      })
    }
    return session
  } catch (error) {
    console.error('[MIDDLEWARE] Failed to resolve session', sanitizeError(error))
    return null
  }
}

function buildLogContext(req: NextRequest, normalizedPathname: string) {
  return {
    method: req.method,
    pathname: req.nextUrl.pathname,
    normalizedPathname,
    host: req.headers.get('host') ?? undefined,
    referer: req.headers.get('referer') ?? undefined,
    userAgent: req.headers.get('user-agent') ?? undefined,
  }
}

export default async function middleware(req: NextRequest) {
  const { pathname, locale } = req.nextUrl

  const normalizedPathname =
    locale && pathname.startsWith(`/${locale}`)
      ? pathname.slice(locale.length + 1) || '/'
      : pathname

  console.info('[MIDDLEWARE] Incoming request', buildLogContext(req, normalizedPathname))

  if (clientWhitelist.has(normalizedPathname)) {
    if (normalizedPathname === '/clientes/login') {
      const session = await resolveSession(req)
      if (session?.user) {
        const destination = session.user.role === 'admin' ? adminDashboardRoute : clientDashboardRoute
        console.info('[MIDDLEWARE] Redirecting authenticated user away from login', {
          destination,
          userId: session.user.id,
        })
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = destination
        return NextResponse.redirect(redirectUrl)
      }
    }

    console.info('[MIDDLEWARE] Allowing public access', { pathname: normalizedPathname })
    return NextResponse.next()
  }

  const session = await resolveSession(req)

  if (pathname.startsWith('/admin')) {
    if (!session) {
      console.info('[MIDDLEWARE] Blocking unauthenticated admin request, redirecting to login')
      const signInUrl = req.nextUrl.clone()
      signInUrl.pathname = '/clientes/login'
      return NextResponse.redirect(signInUrl)
    }
    if (session.user?.role !== 'admin') {
      console.info('[MIDDLEWARE] Blocking non-admin access to admin area', {
        userId: session.user?.id,
        role: session.user?.role,
      })
      const clientUrl = req.nextUrl.clone()
      clientUrl.pathname = clientDashboardRoute
      return NextResponse.redirect(clientUrl)
    }
    console.info('[MIDDLEWARE] Admin access granted', { userId: session.user?.id })
  }

  if (normalizedPathname.startsWith('/clientes')) {
    if (!session) {
      console.info('[MIDDLEWARE] Redirecting unauthenticated client request to login')
      const signInUrl = req.nextUrl.clone()
      signInUrl.pathname = '/clientes/login'
      return NextResponse.redirect(signInUrl)
    }
    console.info('[MIDDLEWARE] Client access granted', { userId: session.user?.id })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/clientes/:path*'],
}
