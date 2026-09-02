const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

/** Email-safe envelope: table layout and inline styles work in Gmail and Outlook. */
export function neriEmailLayout({ preheader, title, html }: { preheader: string; title: string; html: string }) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${escapeHtml(title)}</title></head><body style="margin:0;padding:0;background:#f3f5f7;font-family:Arial,Helvetica,sans-serif;color:#18212b;"><div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f5f7;"><tr><td align="center" style="padding:28px 14px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 4px 18px rgba(20,31,45,.08);"><tr><td style="padding:26px 30px;background:#101c2b;color:#ffffff;"><div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#86e1c0;margin-bottom:8px;">NERIN ELECTRICIDAD</div><div style="font-size:25px;line-height:30px;font-weight:700;">${escapeHtml(title)}</div></td></tr><tr><td style="padding:30px;font-size:16px;line-height:24px;color:#263442;">${html}</td></tr><tr><td style="padding:20px 30px;background:#f7f9fb;border-top:1px solid #e6ebf0;color:#657383;font-size:12px;line-height:18px;">NERIN Electricidad<br>Este es un correo automático. Si necesitás ayuda, respondé este mensaje.</td></tr></table></td></tr></table></body></html>`
}

export function htmlToPlainText(html: string) {
  return html.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>|<\/div>|<\/li>|<\/h\d>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\n{3,}/g, '\n\n').trim()
}
