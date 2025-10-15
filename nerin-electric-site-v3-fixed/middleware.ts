import type { NextFetchEvent, NextMiddleware, NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { baseMiddleware } from './middleware/base'

const middlewareHandler = auth(async (req) => baseMiddleware(req)) as unknown as
  | NextMiddleware
  | Promise<NextMiddleware>

export const middleware: NextMiddleware = async (request: NextRequest, event: NextFetchEvent) => {
  const handler = await middlewareHandler
  return handler(request, event)
}

export default middleware

export const config = {
  matcher: ['/admin/:path*', '/clientes/:path*'],
}
