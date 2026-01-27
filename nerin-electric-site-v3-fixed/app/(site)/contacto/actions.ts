'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import { rateLimit } from '@/lib/security'
import { sendTransactionalEmail } from '@/lib/resend'
import { getContentStore } from '@/lib/content-store'

const ContactSchema = z.object({
  nombre: z.string().min(2),
  empresa: z.string().optional(),
  cuit: z.string().optional(),
  email: z.string().email(),
  telefono: z.string().min(6),
  direccion: z.string().optional(),
  servicio: z.string(),
  urgencia: z.enum(['48hs', '7dias', 'planificado']),
  mensaje: z.string().optional(),
  reason: z.string().optional(),
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

export async function submitContact(formData: FormData) {
  const payload = ContactSchema.parse({
    nombre: formData.get('nombre'),
    empresa: formData.get('empresa') || undefined,
    cuit: formData.get('cuit') || undefined,
    email: formData.get('email'),
    telefono: formData.get('telefono'),
    direccion: formData.get('direccion') || undefined,
    servicio: formData.get('servicio'),
    urgencia: formData.get('urgencia'),
    mensaje: formData.get('mensaje') || undefined,
    reason: formData.get('reason') || undefined,
    utmSource: formData.get('utmSource') || undefined,
    utmMedium: formData.get('utmMedium') || undefined,
    utmCampaign: formData.get('utmCampaign') || undefined,
    utmTerm: formData.get('utmTerm') || undefined,
    utmContent: formData.get('utmContent') || undefined,
    fbclid: formData.get('fbclid') || undefined,
    gclid: formData.get('gclid') || undefined,
    landingPage: formData.get('landingPage') || undefined,
    referrer: formData.get('referrer') || undefined,
  })

  const ip = headers().get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(ip, 5, 60_000)) {
    throw new Error('Demasiadas solicitudes. Probá en unos minutos.')
  }

  const html = `
    <h1>Nueva consulta desde nerin.com.ar</h1>
    <p><strong>Nombre:</strong> ${payload.nombre}</p>
    <p><strong>Empresa:</strong> ${payload.empresa ?? 'No informado'}</p>
    <p><strong>CUIT:</strong> ${payload.cuit ?? 'No informado'}</p>
    <p><strong>Email:</strong> ${payload.email}</p>
    <p><strong>Teléfono:</strong> ${payload.telefono}</p>
    <p><strong>Dirección de obra:</strong> ${payload.direccion ?? 'No informada'}</p>
    <p><strong>Servicio:</strong> ${payload.servicio}</p>
    <p><strong>Urgencia:</strong> ${payload.urgencia}</p>
    <p><strong>Detalle:</strong> ${payload.mensaje ?? 'Sin comentarios'}</p>
  `

  const store = getContentStore()
  await store.createLead({
    name: payload.nombre,
    phone: payload.telefono,
    email: payload.email,
    clientType: payload.empresa ?? 'contacto',
    location: payload.direccion ?? 'Sin ubicación',
    address: payload.direccion ?? null,
    workType: payload.servicio,
    urgency: payload.urgencia,
    details: payload.mensaje ?? 'Consulta desde contacto',
    reason: payload.reason ?? payload.servicio,
    leadType: 'contacto',
    consent: true,
    utmSource: payload.utmSource,
    utmMedium: payload.utmMedium,
    utmCampaign: payload.utmCampaign,
    utmTerm: payload.utmTerm,
    utmContent: payload.utmContent,
    fbclid: payload.fbclid,
    gclid: payload.gclid,
    landingPage: payload.landingPage,
    referrer: payload.referrer,
  })

  await sendTransactionalEmail({
    to: [process.env.RESEND_CONTACT_TO || 'hola@nerin.com.ar', payload.email],
    subject: 'Nueva consulta desde el sitio NERIN',
    html,
    bcc: process.env.RESEND_BCC || undefined,
  })

  return { ok: true }
}
