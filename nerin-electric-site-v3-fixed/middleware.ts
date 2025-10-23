import type { NextMiddleware, NextRequest } from 'next/server'
import { baseMiddleware } from './middleware/base'

export const middleware: NextMiddleware = (request: NextRequest) => baseMiddleware(request)

export default middleware

export const config = {
  matcher: ['/((?!api/health|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
}
