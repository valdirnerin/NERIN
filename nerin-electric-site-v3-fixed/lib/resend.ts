import { Resend } from 'resend'
import nodemailer from 'nodemailer'

export const resendClient = new Resend(process.env.RESEND_API_KEY ?? 're_mock_key')

export async function sendTransactionalEmail({
  to,
  subject,
  html,
  cc,
  bcc,
}: {
  to: string | string[]
  subject: string
  html: string
  cc?: string | string[]
  bcc?: string | string[]
}) {
  const from = process.env.FROM_EMAIL || process.env.EMAIL_SERVER_FROM || 'NERIN <hola@nerin.com.ar>'

  if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.startsWith('re_mock')) {
    await resendClient.emails.send({
      from,
      to,
      subject,
      html,
      cc,
      bcc,
    })
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
      html,
      cc,
      bcc,
    })
    return
  }

  console.info('[EMAIL] No email provider configured, skipping', { to, subject })
}
