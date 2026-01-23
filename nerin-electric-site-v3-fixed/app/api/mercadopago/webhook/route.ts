import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { DB_ENABLED } from '@/lib/dbMode'

type RelatedInfo = {
  type: 'CERTIFICATE' | 'ADDITIONAL' | 'LEGACY_CERTIFICATE' | 'MAINTENANCE' | 'UNKNOWN'
  id: string | null
}

function parseExternalReference(reference?: string | null): RelatedInfo {
  if (!reference) return { type: 'UNKNOWN', id: null }
  if (reference.startsWith('cert:')) {
    return { type: 'CERTIFICATE', id: reference.replace('cert:', '') }
  }
  if (reference.startsWith('add:')) {
    return { type: 'ADDITIONAL', id: reference.replace('add:', '') }
  }
  if (reference.startsWith('certificate-')) {
    return { type: 'LEGACY_CERTIFICATE', id: reference.replace('certificate-', '') }
  }
  if (reference.startsWith('maintenance-')) {
    return { type: 'MAINTENANCE', id: reference.replace('maintenance-', '') }
  }
  return { type: 'UNKNOWN', id: reference }
}

async function fetchPaymentDetails(paymentId: string) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!accessToken) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN missing')
  }
  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Mercado Pago payment fetch failed: ${response.status} ${errorBody}`)
  }
  return response.json()
}

export async function POST(request: Request) {
  if (!DB_ENABLED) {
    return NextResponse.json({ error: 'DB not configured' }, { status: 503 })
  }

  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET
  const requestUrl = new URL(request.url)
  const providedSecret = request.headers.get('x-webhook-secret') || requestUrl.searchParams.get('secret')
  if (!secret || providedSecret !== secret) {
    return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
  }

  const payload = await request.json()
  const paymentId = String(payload?.data?.id || payload?.payment_id || payload?.id || '')
  if (!paymentId) {
    return NextResponse.json({ received: true })
  }

  let paymentDetails: any
  try {
    paymentDetails = await fetchPaymentDetails(paymentId)
  } catch (error) {
    console.error('[mercadopago] Failed to fetch payment details', error)
    return NextResponse.json({ received: true })
  }

  const externalReference = String(paymentDetails?.external_reference || payload?.external_reference || '')
  const related = parseExternalReference(externalReference)
  const existing = await prisma.paymentEvent.findUnique({
    where: {
      provider_externalId: {
        provider: 'MERCADOPAGO',
        externalId: paymentId,
      },
    },
  })
  if (existing) {
    return NextResponse.json({ received: true })
  }

  await prisma.paymentEvent.create({
    data: {
      provider: 'MERCADOPAGO',
      externalId: paymentId,
      status: String(paymentDetails?.status || 'unknown'),
      raw: JSON.stringify({
        webhook: payload,
        payment: paymentDetails,
      }),
      relatedType: related.type === 'ADDITIONAL' ? 'ADDITIONAL' : 'CERTIFICATE',
      relatedId: related.id || externalReference || paymentId,
    },
  })

  if (String(paymentDetails?.status).toLowerCase() === 'approved') {
    if (related.type === 'CERTIFICATE' && related.id) {
      const certificate = await prisma.opsProgressCertificate.findUnique({
        where: { id: related.id },
        include: { project: true },
      })
      if (certificate) {
        const nextPercent = Math.min(100, certificate.project.progressPercent + certificate.percentToAdd)
        await prisma.$transaction([
          prisma.opsProgressCertificate.update({
            where: { id: certificate.id },
            data: {
              status: 'PAID',
              paidAt: new Date(),
              percentAfter: nextPercent,
            },
          }),
          prisma.opsProject.update({
            where: { id: certificate.projectId },
            data: { progressPercent: nextPercent, status: 'IN_PROGRESS' },
          }),
        ])
      }
    }

    if (related.type === 'ADDITIONAL' && related.id) {
      await prisma.opsProjectAdditionalItem.updateMany({
        where: { id: related.id },
        data: { status: 'PAID', paidAt: new Date() },
      })
    }

    if (related.type === 'LEGACY_CERTIFICATE' && related.id) {
      await prisma.progressCertificate.updateMany({
        where: { id: related.id },
        data: { estado: 'pagado', paidAt: new Date() },
      })
    }

    if (related.type === 'MAINTENANCE' && related.id) {
      await prisma.maintenanceSubscription.update({
        where: { id: related.id },
        data: { estado: 'pagado' },
      })
    }
  }

  return NextResponse.json({ received: true })
}
