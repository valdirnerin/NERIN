import { Resend } from 'resend'

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
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith('re_mock')) {
    console.info('[RESEND:mock]', { to, subject })
    return
  }

  await resendClient.emails.send({
    from: process.env.EMAIL_SERVER_FROM || 'NERIN <hola@nerin.com.ar>',
    to,
    subject,
    html,
    cc,
    bcc,
  })
}
