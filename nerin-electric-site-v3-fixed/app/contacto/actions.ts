'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import { rateLimit } from '@/lib/security'
import { sendTransactionalEmail } from '@/lib/resend'

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

  await sendTransactionalEmail({
    to: [process.env.RESEND_CONTACT_TO || 'hola@nerin.com.ar', payload.email],
    subject: 'Nueva consulta desde el sitio NERIN',
    html,
    bcc: process.env.RESEND_BCC || undefined,
  })

  return { ok: true }
}
