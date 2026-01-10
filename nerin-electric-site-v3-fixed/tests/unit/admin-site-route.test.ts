import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockRequireAdmin = vi.fn<() => Promise<void>>()
const mockGetSiteContent = vi.fn<() => Promise<unknown>>()

vi.mock('next/server', () => ({
  NextResponse: {
    json(body: unknown, init?: ResponseInit) {
      return new Response(JSON.stringify(body), init)
    },
  },
}))

vi.mock('@/lib/auth', () => ({
  requireAdmin: () => mockRequireAdmin(),
}))

vi.mock('@/lib/site-content', () => ({
  getSiteContent: () => mockGetSiteContent(),
  saveSiteContent: vi.fn(),
}))

import { GET } from '@/app/api/admin/site/route'

describe('app/api/admin/site/route GET', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSiteContent.mockResolvedValue({ title: 'Mock site' })
  })

  it('returns 401 when the admin session is missing', async () => {
    mockRequireAdmin.mockRejectedValueOnce(new Error('Unauthorized'))

    const response = await GET()

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({ error: 'Unauthorized' })
  })

  it('returns site content when admin session is present', async () => {
    mockRequireAdmin.mockResolvedValueOnce(undefined)

    const response = await GET()

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ title: 'Mock site' })
  })
})
