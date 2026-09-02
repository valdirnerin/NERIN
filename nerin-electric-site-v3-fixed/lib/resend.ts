import nodemailer from 'nodemailer'
import { htmlToPlainText, neriEmailLayout } from './email-template'

export async function sendTransactionalEmail({
  to,
  subject,
  html,
  text,
  cc,
  bcc,
}: {
  to: string | string[]
  subject: string
  html: string
  text?: string
  cc?: string | string[]
  bcc?: string | string[]
}) {
  const from = process.env.FROM_EMAIL || process.env.EMAIL_SERVER_FROM || 'NERIN <hola@nerin.com.ar>'
  const documentHtml = /<html[\s>]/i.test(html)
    ? html
    : neriEmailLayout({ preheader: subject, title: subject.replace(/^NERIN\s*[·\-|:]\s*/i, ''), html })
  const plainText = text || htmlToPlainText(html)

  if (process.env.BREVO_API_KEY) {
    const recipients = (Array.isArray(to) ? to : [to]).map((email) => ({ email }))
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY, 'content-type': 'application/json' },
      body: JSON.stringify({
        sender: { name: 'NERIN', email: from.match(/<(.+)>/)?.[1] || from },
        to: recipients,
        subject,
        htmlContent: documentHtml,
        textContent: plainText,
        cc: cc ? (Array.isArray(cc) ? cc : [cc]).map((email) => ({ email })) : undefined,
        bcc: bcc ? (Array.isArray(bcc) ? bcc : [bcc]).map((email) => ({ email })) : undefined,
      }),
    })
    if (!response.ok) throw new Error(`Brevo email failed: ${response.status}`)
    return
  }

  if (process.env.SMTP_HOST) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
    })

    await transporter.sendMail({
      from,
      to,
      subject,
      html: documentHtml,
      text: plainText,
      cc,
      bcc,
    })
    return
  }

  console.info('[EMAIL] No email provider configured, skipping', { to, subject })
}
