import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import type { EmailConfig } from 'next-auth/providers/email'
import { prisma } from './db'
import { resendClient } from './resend'
import { sanitizeError, sanitizeMetadata } from './logging'

const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET
if (!authSecret) {
  console.error(
    '[AUTH] Missing AUTH_SECRET or NEXTAUTH_SECRET environment variable. Authentication flows will fail in production until it is configured.',
  )
}

const authBaseUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL
if (!authBaseUrl) {
  console.warn('[AUTH] AUTH_URL/NEXTAUTH_URL is not configured. Falling back to the request host at runtime.')
}

const fromEmail = process.env.EMAIL_SERVER_FROM || 'NERIN <hola@nerin.com.ar>'

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  secret: authSecret,
  logger: {
    error(code, metadata) {
      console.error('[AUTH] Logger error', {
        code,
        details: sanitizeMetadata(metadata),
      })
    },
    warn(code, metadata) {
      console.warn('[AUTH] Logger warn', {
        code,
        details: sanitizeMetadata(metadata),
      })
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV !== 'production') {
        console.debug('[AUTH] Logger debug', {
          code,
          details: sanitizeMetadata(metadata),
        })
      }
    },
  },
  session: {
    strategy: 'database',
    maxAge: 60 * 60 * 24 * 30,
  },
  pages: {
    signIn: '/clientes/login',
    verifyRequest: '/clientes/verificar',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = user.role
        session.user.name = user.name
        session.user.email = user.email
      }
      return session
    },
    async signIn({ user }) {
      if (!user.email) {
        return false
      }
      // permitir login siempre; la UI decidirá qué mostrar según aprobación
      return true
    },
  },
  providers: [],
}

export const { handlers, auth, signIn, signOut } = NextAuth(async () => {
  const config: NextAuthConfig = {
    ...authOptions,
    providers: [...authOptions.providers],
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    return config
  }

  const resendEmailProvider: EmailConfig = {
    id: 'email',
    type: 'email',
    name: 'Email',
    from: fromEmail,
    sendVerificationRequest: async ({ identifier, url }) => {
      const to = identifier

      const resendApiKey = process.env.RESEND_API_KEY
      if (!resendApiKey || resendApiKey.startsWith('re_mock')) {
        console.info('[AUTH:magic-link]', { to, url })
        return
      }

      await resendClient.emails.send({
        from: fromEmail,
        to,
        subject: 'Ingresá a tu portal NERIN',
        html: `<p>Hola,</p><p>Hacé clic en el enlace para ingresar al portal de clientes NERIN:</p><p><a href="${url}">${url}</a></p><p>Si no solicitaste este acceso, ignorá este correo.</p>`
          .replace(/\n/g, ''),
      })
    },
  }

  config.providers = [resendEmailProvider]

  return config
})

export const getSession = async () => {
  try {
    return await auth()
  } catch (error) {
    console.error('[AUTH] Failed to retrieve session', sanitizeError(error))
    return null
  }
}

export async function requireAdmin() {
  const session = await auth()

  if (!session || session.user?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  return session
}
