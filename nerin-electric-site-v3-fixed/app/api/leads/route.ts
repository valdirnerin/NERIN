import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sendTransactionalEmail } from '@/lib/resend'
import { getContentStore } from '@/lib/content-store'
import { storeMediaFile } from '@/lib/media'

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
  reason: z.string().optional(),
  leadType: z.string().optional(),
  plan: z.string().optional(),
  hasFiles: z.boolean().optional(),
  consent: z.literal(true),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  fbclid: z.string().optional(),
  gclid: z.string().optional(),
  landingPage: z.string().optional(),
  referrer: z.string().optional(),
})

function parseBoolean(value: FormDataEntryValue | null) {
  if (typeof value !== 'string') return false
  const normalized = value.toLowerCase().trim()
  return normalized === 'true' || normalized === '1' || normalized === 'on'
}

async function parseLeadPayload(request: Request) {
  const contentType = request.headers.get('content-type') || ''

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData()
    const files = formData
      .getAll('adjuntos')
      .filter((entry): entry is File => entry instanceof File && entry.size > 0)

    const payload = {
      name: String(formData.get('name') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      email: String(formData.get('email') ?? ''),
      clientType: String(formData.get('clientType') ?? ''),
      location: String(formData.get('location') ?? ''),
      address: String(formData.get('address') ?? ''),
      workType: String(formData.get('workType') ?? ''),
      urgency: String(formData.get('urgency') ?? ''),
      details: String(formData.get('details') ?? ''),
      reason: String(formData.get('reason') ?? ''),
      leadType: String(formData.get('leadType') ?? ''),
      plan: String(formData.get('plan') ?? ''),
      hasFiles: files.length > 0,
      consent: parseBoolean(formData.get('consent')),
      utmSource: String(formData.get('utmSource') ?? ''),
      utmMedium: String(formData.get('utmMedium') ?? ''),
      utmCampaign: String(formData.get('utmCampaign') ?? ''),
      utmTerm: String(formData.get('utmTerm') ?? ''),
      utmContent: String(formData.get('utmContent') ?? ''),
      fbclid: String(formData.get('fbclid') ?? ''),
      gclid: String(formData.get('gclid') ?? ''),
      landingPage: String(formData.get('landingPage') ?? ''),
      referrer: String(formData.get('referrer') ?? ''),
    }

    return { payload, files }
  }

  const payload = await request.json().catch(() => null)
  if (!payload) {
    return { payload: null, files: [] as File[] }
  }

  return { payload, files: [] as File[] }
}

export async function POST(request: Request) {
  const parsedRequest = await parseLeadPayload(request)
  if (!parsedRequest.payload) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const parsed = LeadSchema.safeParse(parsedRequest.payload)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', issues: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  try {
    const storedAttachments = await Promise.all(
      parsedRequest.files.map((file) =>
        storeMediaFile({
          file,
          folder: 'leads',
          preferredName: file.name,
        }),
      ),
    )

    const store = getContentStore()
    const lead = await store.createLead({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      clientType: parsed.data.clientType,
      location: parsed.data.location,
      address: parsed.data.address || null,
      workType: parsed.data.workType,
      urgency: parsed.data.urgency,
      details: parsed.data.details,
      reason: parsed.data.reason ?? null,
      leadType: parsed.data.leadType ?? null,
      plan: parsed.data.plan ?? null,
      hasFiles: storedAttachments.length > 0 || (parsed.data.hasFiles ?? false),
      attachments: storedAttachments,
      consent: parsed.data.consent,
      utmSource: parsed.data.utmSource ?? null,
      utmMedium: parsed.data.utmMedium ?? null,
      utmCampaign: parsed.data.utmCampaign ?? null,
      utmTerm: parsed.data.utmTerm ?? null,
      utmContent: parsed.data.utmContent ?? null,
      fbclid: parsed.data.fbclid ?? null,
      gclid: parsed.data.gclid ?? null,
      landingPage: parsed.data.landingPage ?? null,
      referrer: parsed.data.referrer ?? null,
    })

    if (process.env.SALES_TO_EMAIL) {
      const attachmentsHtml =
        lead.attachments.length > 0
          ? `<ul>${lead.attachments
              .map(
                (attachment) =>
                  `<li><a href="${attachment.publicUrl}">${attachment.originalName}</a> (${Math.round(
                    attachment.size / 1024,
                  )} KB)</li>`,
              )
              .join('')}</ul>`
          : '<p>Sin adjuntos.</p>'

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
          <p><strong>Motivo:</strong> ${lead.reason ?? '-'}</p>
          <p><strong>Plan:</strong> ${lead.plan ?? '-'}</p>
          <p><strong>Origen:</strong> ${lead.leadType ?? '-'}</p>
          <p><strong>Adjuntos:</strong> ${lead.hasFiles ? 'Sí' : 'No'}</p>
          ${attachmentsHtml}
          <p><strong>Detalle:</strong> ${lead.details}</p>
          <p><strong>UTM Source:</strong> ${lead.utmSource ?? '-'}</p>
          <p><strong>UTM Medium:</strong> ${lead.utmMedium ?? '-'}</p>
          <p><strong>UTM Campaign:</strong> ${lead.utmCampaign ?? '-'}</p>
          <p><strong>UTM Term:</strong> ${lead.utmTerm ?? '-'}</p>
          <p><strong>UTM Content:</strong> ${lead.utmContent ?? '-'}</p>
          <p><strong>fbclid:</strong> ${lead.fbclid ?? '-'}</p>
          <p><strong>gclid:</strong> ${lead.gclid ?? '-'}</p>
          <p><strong>Landing:</strong> ${lead.landingPage ?? '-'}</p>
          <p><strong>Referrer:</strong> ${lead.referrer ?? '-'}</p>
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
          <p>Tu ID de solicitud es <strong>${lead.id}</strong>. ${
            lead.attachments.length > 0
              ? 'Recibimos tus adjuntos correctamente.'
              : 'Si necesitás adjuntar fotos o planos, podés enviarlas por WhatsApp.'
          }</p>
          <p>Equipo NERIN</p>
        `,
      })
    }

    return NextResponse.json({ ok: true, leadId: lead.id, attachmentsCount: lead.attachments.length })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create lead'
    console.error('[LEADS] Error saving lead', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
