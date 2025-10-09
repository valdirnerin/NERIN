import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET
  const signature = request.headers.get('x-mp-signature') || request.headers.get('x-signature')
  if (secret && signature !== secret) {
    return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
  }

  const payload = await request.json()
  const externalReference = payload?.data?.id || payload?.external_reference
  const topic = payload?.type || payload?.topic

  if (!externalReference) {
    return NextResponse.json({ received: true })
  }

  if (topic === 'payment' || topic === 'merchant_order') {
    if (String(externalReference).startsWith('certificate-')) {
      const certificateId = String(externalReference).replace('certificate-', '')
      await prisma.progressCertificate.updateMany({
        where: { id: certificateId },
        data: { estado: 'pagado', paidAt: new Date() },
      })
    }
    if (String(externalReference).startsWith('maintenance-')) {
      const subscriptionId = String(externalReference).replace('maintenance-', '')
      await prisma.maintenanceSubscription.update({
        where: { id: subscriptionId },
        data: { estado: 'pagado' },
      })
    }
  }

  return NextResponse.json({ received: true })
}
