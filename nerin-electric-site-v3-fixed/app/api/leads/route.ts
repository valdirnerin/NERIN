import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { sendTransactionalEmail } from '@/lib/resend'

const LeadSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email(),
  clientType: z.string().min(1),
  location: z.string().min(2),
  address: z.string().optional().or(z.literal('')),
  workType: z.string().min(1),
  urgency: z.string().min(1),
  details: z.string().min(2),
  leadType: z.string().optional(),
  plan: z.string().optional(),
  hasFiles: z.boolean().optional(),
  consent: z.literal(true),
})

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null)
  if (!payload) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const parsed = LeadSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', issues: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  try {
    const lead = await prisma.lead.create({
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email,
        clientType: parsed.data.clientType,
        location: parsed.data.location,
        address: parsed.data.address || null,
        workType: parsed.data.workType,
        urgency: parsed.data.urgency,
        details: parsed.data.details,
        leadType: parsed.data.leadType,
        plan: parsed.data.plan,
        hasFiles: parsed.data.hasFiles ?? false,
        consent: parsed.data.consent,
      },
    })

    if (process.env.SALES_TO_EMAIL) {
      await sendTransactionalEmail({
        to: process.env.SALES_TO_EMAIL,
        subject: `Nuevo lead web · ${lead.name}`,
        html: `
          <h2>Nuevo lead desde Presupuesto</h2>
          <p><strong>ID:</strong> ${lead.id}</p>
          <p><strong>Nombre:</strong> ${lead.name}</p>
          <p><strong>Email:</strong> ${lead.email}</p>
          <p><strong>Teléfono:</strong> ${lead.phone}</p>
          <p><strong>Tipo cliente:</strong> ${lead.clientType}</p>
          <p><strong>Ubicación:</strong> ${lead.location}</p>
          <p><strong>Dirección:</strong> ${lead.address ?? '-'}</p>
          <p><strong>Tipo de trabajo:</strong> ${lead.workType}</p>
          <p><strong>Urgencia:</strong> ${lead.urgency}</p>
          <p><strong>Plan:</strong> ${lead.plan ?? '-'}</p>
          <p><strong>Origen:</strong> ${lead.leadType ?? '-'}</p>
          <p><strong>Adjuntos:</strong> ${lead.hasFiles ? 'Sí' : 'No'}</p>
          <p><strong>Detalle:</strong> ${lead.details}</p>
        `,
      })
    } else {
      console.info('[LEADS] SALES_TO_EMAIL not configured, lead stored', { id: lead.id })
    }

    if (lead.email) {
      await sendTransactionalEmail({
        to: lead.email,
        subject: 'Recibimos tu solicitud de presupuesto',
        html: `
          <p>Hola ${lead.name},</p>
          <p>¡Gracias por contactarnos! Recibimos tu pedido y te responderemos en 24–48 h.</p>
          <p>Tu ID de solicitud es <strong>${lead.id}</strong>. Si necesitás adjuntar fotos o planos, podés enviarlas por WhatsApp.</p>
          <p>Equipo NERIN</p>
        `,
      })
    }

    return NextResponse.json({ ok: true, leadId: lead.id })
  } catch (error) {
    console.error('[LEADS] Error saving lead', error)
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}
