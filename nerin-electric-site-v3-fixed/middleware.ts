import type { NextMiddleware, NextRequest } from 'next/server'
import { baseMiddleware } from './middleware/base'

export const middleware: NextMiddleware = (request: NextRequest) => baseMiddleware(request)

export default middleware

export const config = {
  matcher: ['/admin/:path*', '/clientes/:path*'],
}
