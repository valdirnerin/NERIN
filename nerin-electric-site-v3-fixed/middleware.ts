import type { NextMiddleware, NextRequest } from 'next/server'
import { baseMiddleware } from './middleware/base'

export const middleware: NextMiddleware = (request: NextRequest) => baseMiddleware(request)

export default middleware

export const config = {
  matcher: [
    '/((?!api/auth|api/health|_next/static|_next/image|images|media|uploads|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|webp|svg|gif|ico)$).*)',
  ],
}
