import { NextResponse } from 'next/server'
import { getStorageDir } from '@/lib/content'
import { getSiteContent } from '@/lib/site-content'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request){
  const body = await req.json().catch(()=>null)
  if (!body) return NextResponse.json({ error: 'Invalid' }, { status: 400 })
  const { clientName, clientEmail, notes, items, currency } = body as any
  if (!clientName || !Array.isArray(items) || items.length===0) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }
  const site = await getSiteContent()
  const total = items.reduce((a:any,b:any)=> a + (Number(b.qty)||0) * (Number(b.price)||0), 0)

  const storage = getStorageDir()
  const outDir = path.join(storage, 'media', 'quotes')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
  const ts = new Date().toISOString().replace(/[:.]/g,'-')
  const fname = `presupuesto-${ts}.html`
  const fpath = path.join(outDir, fname)

  const rows = items.map((it:any)=>`
      <tr>
        <td style="padding:8px;border:1px solid #000;">${it.code}</td>
        <td style="padding:8px;border:1px solid #000;">${it.name}</td>
        <td style="padding:8px;border:1px solid #000; text-align:right;">${it.qty}</td>
        <td style="padding:8px;border:1px solid #000; text-align:right;">$${Number(it.price).toLocaleString()}</td>
        <td style="padding:8px;border:1px solid #000; text-align:right;">$${(Number(it.qty)*Number(it.price)).toLocaleString()}</td>
      </tr>
  `).join('\n')

  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Presupuesto NERIN</title></head>
<body style="font-family:Arial, sans-serif; color:#0a0a0a;">
  <div style="max-width:900px;margin:40px auto;">
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">
      <div>
        <div style="font-size:22px;font-weight:800;">${site.name || 'NERIN Ingeniería Eléctrica'}</div>
        <div style="font-size:12px;color:#555;">${site.contact.email || ''} · ${site.contact.phone || ''} · ${site.contact.address || ''}</div>
      </div>
    </div>
    <h1 style="font-size:26px;margin:16px 0;">Presupuesto</h1>
    <div style="font-size:14px;margin-bottom:12px;">Cliente: <b>${clientName}</b>${clientEmail ? ' · ' + clientEmail : ''}</div>
    ${notes ? `<div style="font-size:13px;margin-bottom:12px;">Notas: ${notes}</div>` : ''}
    <table style="border-collapse:collapse;width:100%;margin-top:8px;">
      <thead><tr>
        <th style="padding:8px;border:1px solid #000;text-align:left;">Código</th>
        <th style="padding:8px;border:1px solid #000;text-align:left;">Descripción</th>
        <th style="padding:8px;border:1px solid #000;text-align:right;">Cant.</th>
        <th style="padding:8px;border:1px solid #000;text-align:right;">Precio</th>
        <th style="padding:8px;border:1px solid #000;text-align:right;">Subtotal</th>
      </tr></thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr>
          <td colspan="4" style="padding:8px;border:1px solid #000;text-align:right;"><b>Total</b></td>
          <td style="padding:8px;border:1px solid #000;text-align:right;"><b>$${total.toLocaleString()}</b></td>
        </tr>
      </tfoot>
    </table>
    <div style="font-size:12px;color:#555;margin-top:16px;">
      Valores orientativos (mano de obra). Materiales, repuestos y certificaciones se cotizan aparte. Vigencia 15 días. Sujeto a relevamiento, accesos y plazos.
    </div>
  </div>
</body></html>`

  fs.writeFileSync(fpath, html, 'utf8')
  const publicUrl = `/media/quotes/${fname}`

  const key = process.env.RESEND_API_KEY
  if (key) {
    try {
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${key}`, 'Content-Type':'application/json' },
        body: JSON.stringify({
          from: 'NERIN <noreply@nerin.com.ar>',
          to: [process.env.CONTACT_TO || 'contacto@nerin.com.ar'].concat(clientEmail ? [clientEmail] : []),
          subject: `Presupuesto NERIN - ${clientName}`,
          html
        })
      })
      // Non-fatal if fails
    } catch(e){}
  }

  return NextResponse.json({ ok:true, url: publicUrl })
}
