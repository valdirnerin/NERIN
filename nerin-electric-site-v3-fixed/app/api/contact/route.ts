import { NextResponse } from 'next/server'
import { getStorageDir } from '@/lib/content'
import fs from 'fs'
import path from 'path'
import { sendTransactionalEmail } from '@/lib/resend'
export async function POST(req: Request){
  const body = await req.json().catch(()=>null)
  if (!body) return NextResponse.json({ error: 'Invalid' }, { status: 400 })
  const { nombre, email, mensaje } = body
  if (process.env.BREVO_API_KEY || process.env.SMTP_HOST) {
    try {
      await sendTransactionalEmail({
        to: process.env.CONTACT_TO || 'contacto@nerin.com.ar',
        subject: 'Nuevo contacto desde la web',
        html: `<p><b>Nombre:</b> ${nombre}</p><p><b>Email:</b> ${email}</p><p>${mensaje}</p>`,
      })
      return NextResponse.json({ ok: true })
    } catch (e) {}
  }
  const storage = getStorageDir()
  const dir = path.join(storage, 'forms')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const fn = path.join(dir, `contact-${Date.now()}.json`)
  fs.writeFileSync(fn, JSON.stringify({ nombre, email, mensaje, ts: new Date().toISOString() }, null, 2))
  return NextResponse.json({ ok: true, stored: true })
}
