import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import { prisma } from './prisma'
import { resendClient } from './resend'

const fromEmail = process.env.EMAIL_SERVER_FROM || 'NERIN <hola@nerin.com.ar>'

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
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

  const { default: EmailProvider } = await import('next-auth/providers/email')

  config.providers = [
    EmailProvider({
      from: fromEmail,
      sendVerificationRequest: async ({ identifier, url }) => {
        const to = identifier
        await resendClient.emails.send({
          from: fromEmail,
          to,
          subject: 'Ingresá a tu portal NERIN',
          html: `<p>Hola,</p><p>Hacé clic en el enlace para ingresar al portal de clientes NERIN:</p><p><a href="${url}">${url}</a></p><p>Si no solicitaste este acceso, ignorá este correo.</p>`
            .replace(/\n/g, ''),
        })
      },
    }),
  ]

  return config
})

export const getSession = () => auth()

export async function requireAdmin() {
  const session = await auth()

  if (!session || session.user?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  return session
}
