import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockLeadCreate = vi.fn()

vi.mock('next/server', () => ({
  NextResponse: {
    json(body: unknown, init?: ResponseInit) {
      return new Response(JSON.stringify(body), init)
    },
  },
}))

vi.mock('@/lib/db', () => ({
  prisma: {
    lead: {
      create: (...args: any[]) => mockLeadCreate(...args),
    },
  },
}))

vi.mock('@/lib/resend', () => ({
  sendTransactionalEmail: vi.fn(),
}))

import { POST } from '@/app/api/leads/route'

describe('app/api/leads/route POST', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 for invalid payload', async () => {
    const response = await POST(
      new Request('http://test', {
        method: 'POST',
        body: JSON.stringify({ name: 'Ana' }),
      })
    )

    expect(response.status).toBe(400)
  })

  it('returns leadId when payload is valid', async () => {
    mockLeadCreate.mockResolvedValue({
      id: 'lead_123',
      name: 'Ana Pérez',
      phone: '1155555555',
      email: 'ana@example.com',
      clientType: 'empresa',
      location: 'Palermo',
      address: null,
      workType: 'mantenimiento',
      urgency: '24-48h',
      details: 'Detalle',
      leadType: 'mantenimiento',
      plan: 'plan-basico',
      hasFiles: false,
      attachments: [],
      createdAt: new Date().toISOString(),
    })

    const response = await POST(
      new Request('http://test', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Ana Pérez',
          phone: '1155555555',
          email: 'ana@example.com',
          clientType: 'empresa',
          location: 'Palermo',
          address: '',
          workType: 'mantenimiento',
          urgency: '24-48h',
          details: 'Detalle',
          leadType: 'mantenimiento',
          plan: 'plan-basico',
          hasFiles: false,
          consent: true,
        }),
      })
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true, leadId: 'lead_123', attachmentsCount: 0 })
    expect(mockLeadCreate).toHaveBeenCalledOnce()
  })
})
