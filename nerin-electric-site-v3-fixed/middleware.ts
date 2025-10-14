import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const clientWhitelist = ['/clientes/login', '/clientes/verificar']

export default auth(async (req) => {
  const { pathname, locale } = req.nextUrl

  const normalizedPathname =
    locale && pathname.startsWith(`/${locale}`)
      ? pathname.slice(locale.length + 1) || '/'
      : pathname

  if (clientWhitelist.includes(normalizedPathname)) {
    return NextResponse.next()
  }

  const session = req.auth

  if (pathname.startsWith('/admin')) {
    if (!session) {
      const signInUrl = req.nextUrl.clone()
      signInUrl.pathname = '/clientes/login'
      return NextResponse.redirect(signInUrl)
    }
    if (session.user?.role !== 'admin') {
      const clientUrl = req.nextUrl.clone()
      clientUrl.pathname = '/clientes'
      return NextResponse.redirect(clientUrl)
    }
  }

  if (normalizedPathname.startsWith('/clientes')) {
    if (!session) {
      const signInUrl = req.nextUrl.clone()
      signInUrl.pathname = '/clientes/login'
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/clientes/:path*'],
}
