import { describe, expect, it, vi } from 'vitest'
import type { NextRequest } from 'next/server'

vi.mock('next/server', () => {
  const createResponse = (location?: string) => ({
    headers: new Headers(location ? [['location', location]] : undefined),
  })

  return {
    NextResponse: {
      redirect(url: URL | string) {
        const target = typeof url === 'string' ? url : url.toString()
        return createResponse(target)
      },
      next() {
        return createResponse()
      },
    },
  }
})

import { baseMiddleware } from '@/middleware/base'

function createRequest(
  pathname: string,
  options: { locale?: string; method?: string } = {},
): NextRequest {
  const localePath = options.locale ? `/${options.locale}` : ''
  const url = new URL(`https://nerin.test${localePath}${pathname}`)
  const headers = new Headers()
  const nextUrl = Object.assign(new URL(url), {
    clone() {
      return new URL(url)
    },
    locale: options.locale,
  })

  return {
    method: options.method ?? 'GET',
    headers,
    nextUrl,
  } as unknown as NextRequest
}

describe('baseMiddleware', () => {
  const paths = [
    '/clientes/login',
    '/clientes/certificados',
    '/admin',
    '/admin/login',
    '/clientes/verificar',
  ]

  it('allows requests to continue without redirects', () => {
    for (const path of paths) {
      const response = baseMiddleware(createRequest(path))
      expect(response.headers.get('location')).toBeNull()
    }
  })
})
