import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

const clientWhitelist = ['/clientes/login', '/clientes/verificar']

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (clientWhitelist.includes(pathname)) {
    return NextResponse.next()
  }

  const session = await auth(req)

  if (pathname.startsWith('/admin')) {
    if (!session) {
      const signInUrl = new URL('/clientes/login', req.url)
      return NextResponse.redirect(signInUrl)
    }
    if (session.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/clientes', req.url))
    }
  }

  if (pathname.startsWith('/clientes')) {
    if (!session) {
      return NextResponse.redirect(new URL('/clientes/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/clientes/:path*'],
}
