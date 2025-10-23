import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockRequireAdmin = vi.fn<() => Promise<void>>()
const mockReadMarkdown = vi.fn()
const mockWriteMarkdown = vi.fn()
const mockDeleteMarkdown = vi.fn()
const mockRevalidatePath = vi.fn<[string], void>()

vi.mock('next/server', () => ({
  NextResponse: {
    json(body: unknown, init?: ResponseInit) {
      return new Response(JSON.stringify(body), init)
    },
  },
}))

vi.mock('next/cache', () => ({
  revalidatePath: (path: string) => mockRevalidatePath(path),
}))

vi.mock('@/lib/auth', () => ({
  requireAdmin: () => mockRequireAdmin(),
}))

vi.mock('@/lib/content', () => ({
  readMarkdown: (...args: unknown[]) => mockReadMarkdown(...args),
  writeMarkdown: (...args: unknown[]) => mockWriteMarkdown(...args),
  deleteMarkdown: (...args: unknown[]) => mockDeleteMarkdown(...args),
}))

import { POST, DELETE } from '@/app/api/admin/item/route'

describe('app/api/admin/item/route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRequireAdmin.mockResolvedValue()
    mockRevalidatePath.mockImplementation(() => {})
    mockWriteMarkdown.mockImplementation(() => {})
    mockDeleteMarkdown.mockImplementation(() => {})
  })

  describe('POST', () => {
    it('revalidates blog listing and entry after saving markdown', async () => {
      const request = new Request('https://example.com/api/admin/item?type=blog&slug=test-post', {
        method: 'POST',
        body: JSON.stringify({ data: { title: 'Test' }, content: 'Hello' }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
      await expect(response.json()).resolves.toEqual({ ok: true })
      expect(mockWriteMarkdown).toHaveBeenCalledWith('blog', 'test-post', { title: 'Test' }, 'Hello')
      expect(mockRevalidatePath).toHaveBeenNthCalledWith(1, '/blog')
      expect(mockRevalidatePath).toHaveBeenNthCalledWith(2, '/blog/test-post')
    })

    it('returns a 500 response when revalidation fails', async () => {
      let callCount = 0
      mockRevalidatePath.mockImplementation(() => {
        callCount += 1
        if (callCount === 2) {
          throw new Error('revalidate error')
        }
      })

      const request = new Request('https://example.com/api/admin/item?type=blog&slug=broken-post', {
        method: 'POST',
        body: JSON.stringify({ data: { title: 'Broken' }, content: 'Hello' }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)

      expect(response.status).toBe(500)
      await expect(response.json()).resolves.toEqual({
        ok: false,
        error: 'No se pudo refrescar el contenido del blog. Intentá nuevamente.',
      })
      expect(mockWriteMarkdown).toHaveBeenCalled()
    })
  })

  describe('DELETE', () => {
    it('revalidates blog listing and entry after deleting markdown', async () => {
      const request = new Request('https://example.com/api/admin/item?type=blog&slug=to-delete', {
        method: 'DELETE',
      })

      const response = await DELETE(request)

      expect(response.status).toBe(200)
      await expect(response.json()).resolves.toEqual({ ok: true })
      expect(mockDeleteMarkdown).toHaveBeenCalledWith('blog', 'to-delete')
      expect(mockRevalidatePath).toHaveBeenNthCalledWith(1, '/blog')
      expect(mockRevalidatePath).toHaveBeenNthCalledWith(2, '/blog/to-delete')
    })

    it('returns a 500 response when revalidation fails after deletion', async () => {
      mockRevalidatePath.mockImplementation(() => {
        throw new Error('fail')
      })

      const request = new Request('https://example.com/api/admin/item?type=blog&slug=broken-delete', {
        method: 'DELETE',
      })

      const response = await DELETE(request)

      expect(response.status).toBe(500)
      await expect(response.json()).resolves.toEqual({
        ok: false,
        error: 'No se pudo refrescar el contenido del blog. Intentá nuevamente.',
      })
      expect(mockDeleteMarkdown).toHaveBeenCalled()
    })
  })
})
