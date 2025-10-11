import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createPreference } from '@/lib/mercadopago'
import { auth } from '@/lib/auth'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const planSlug = searchParams.get('plan')
  if (!planSlug) {
    return NextResponse.redirect(`${origin}/mantenimiento`)
  }

  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.redirect(`${origin}/clientes/login`)
  }

  const client = await prisma.client.findUnique({ where: { userId: session.user.id } })
  if (!client) {
    return NextResponse.redirect(`${origin}/clientes?registro=1`)
  }

  const plan = await prisma.maintenancePlan.findUnique({ where: { slug: planSlug } })
  if (!plan) {
    return NextResponse.redirect(`${origin}/mantenimiento`)
  }

  const subscription = await prisma.maintenanceSubscription.create({
    data: {
      planId: plan.id,
      clientId: client.id,
      estado: 'pendiente',
    },
  })

  const preference = await createPreference({
    items: [
      {
        title: `Plan ${plan.nombre} - NERIN`,
        quantity: 1,
        unit_price: Number(plan.precioMensual),
      },
    ],
    statementDescriptor: 'NERIN MANT',
    externalReference: `maintenance-${subscription.id}`,
    notificationUrl: `${origin}/api/mercadopago/webhook`,
    backUrls: {
      success: `${origin}/clientes`,
      pending: `${origin}/clientes`,
      failure: `${origin}/mantenimiento`,
    },
  })

  if (!preference || !('init_point' in preference)) {
    await prisma.maintenanceSubscription.delete({ where: { id: subscription.id } })
    return NextResponse.redirect(`${origin}/mantenimiento?error=mp`)
  }

  await prisma.maintenanceSubscription.update({
    where: { id: subscription.id },
    data: {
      mpPreferenceId: 'id' in preference ? String(preference.id) : undefined,
      mpInitPointUrl: 'init_point' in preference ? String(preference.init_point) : undefined,
    },
  })

  return NextResponse.redirect(String(preference.init_point))
}
