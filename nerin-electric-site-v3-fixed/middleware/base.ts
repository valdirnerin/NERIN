import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const NOINDEX_HEADER_VALUE = 'noindex, nofollow, noarchive'

const PRIVATE_PATH_PREFIXES = [
  '/admin',
  '/api/admin',
  '/api/upload/project-photo',
  '/api/quotes',
  '/clientes',
  '/tecnico',
] as const

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

function shouldNoindex(pathname: string) {
  return PRIVATE_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

export function baseMiddleware(req: NextRequest) {
  const { pathname, locale } = req.nextUrl

  const normalizedPathname =
    locale && pathname.startsWith(`/${locale}`) ? pathname.slice(locale.length + 1) || '/' : pathname

  console.info('[MIDDLEWARE] Incoming request', buildLogContext(req, normalizedPathname))

  const response = NextResponse.next()

  if (shouldNoindex(normalizedPathname)) {
    response.headers.set('X-Robots-Tag', NOINDEX_HEADER_VALUE)
  }

  return response
}
