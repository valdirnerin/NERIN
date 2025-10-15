import { describe, expect, it, vi } from 'vitest'
import type { NextAuthRequest } from 'next-auth'

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

type Session = NonNullable<NextAuthRequest['auth']>

function createRequest(
  pathname: string,
  options: { session?: Session | null; locale?: string; method?: string } = {},
): NextAuthRequest {
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
    auth: options.session ?? null,
    method: options.method ?? 'GET',
    headers,
    nextUrl,
  } as unknown as NextAuthRequest
}

describe('baseMiddleware', () => {
  it('allows anonymous access to the client login page', async () => {
    const response = await baseMiddleware(createRequest('/clientes/login'))
    expect(response.headers.get('location')).toBeNull()
  })

  it('allows anonymous access to the admin login page', async () => {
    const response = await baseMiddleware(createRequest('/admin/login'))
    expect(response.headers.get('location')).toBeNull()
  })

  it('redirects authenticated admins away from the login pages', async () => {
    const response = await baseMiddleware(
      createRequest('/admin/login', {
        session: {
          user: {
            id: 'admin-id',
            role: 'admin',
            email: 'admin@example.com',
            name: 'Admin',
          },
          expires: new Date().toISOString(),
        },
      }),
    )

    expect(response.headers.get('location')).toBe('https://nerin.test/admin')
  })

  it('redirects authenticated clients away from the login pages', async () => {
    const response = await baseMiddleware(
      createRequest('/clientes/login', {
        session: {
          user: {
            id: 'client-id',
            role: 'client',
            email: 'client@example.com',
            name: 'Client',
          },
          expires: new Date().toISOString(),
        },
      }),
    )

    expect(response.headers.get('location')).toBe('https://nerin.test/clientes')
  })

  it('redirects unauthenticated admin requests to the admin login page', async () => {
    const response = await baseMiddleware(createRequest('/admin'))
    expect(response.headers.get('location')).toBe('https://nerin.test/admin/login')
  })

  it('prevents non-admin users from hitting admin routes', async () => {
    const response = await baseMiddleware(
      createRequest('/admin/configuracion', {
        session: {
          user: {
            id: 'client-id',
            role: 'client',
            email: 'client@example.com',
            name: 'Client',
          },
          expires: new Date().toISOString(),
        },
      }),
    )

    expect(response.headers.get('location')).toBe('https://nerin.test/clientes')
  })

  it('allows authenticated client routes to continue', async () => {
    const response = await baseMiddleware(
      createRequest('/clientes/certificados', {
        session: {
          user: {
            id: 'client-id',
            role: 'client',
            email: 'client@example.com',
            name: 'Client',
          },
          expires: new Date().toISOString(),
        },
      }),
    )

    expect(response.headers.get('location')).toBeNull()
  })
})
