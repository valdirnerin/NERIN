import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

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

export function baseMiddleware(req: NextRequest) {
  const { pathname, locale } = req.nextUrl

  const normalizedPathname =
    locale && pathname.startsWith(`/${locale}`) ? pathname.slice(locale.length + 1) || '/' : pathname

  console.info('[MIDDLEWARE] Incoming request', buildLogContext(req, normalizedPathname))

  return NextResponse.next()
}
