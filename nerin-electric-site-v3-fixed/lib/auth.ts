import { PrismaAdapter } from '@auth/prisma-adapter'
import type { NextAuthOptions, Session } from 'next-auth'
import NextAuth from 'next-auth'
import { Adapter } from 'next-auth/adapters'
import EmailProvider from 'next-auth/providers/email'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from './prisma'
import { resendClient } from './resend'

const fromEmail = process.env.EMAIL_SERVER_FROM || 'NERIN <hola@nerin.com.ar>'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: 'database',
    maxAge: 60 * 60 * 24 * 30,
  },
  pages: {
    signIn: '/clientes/login',
    verifyRequest: '/clientes/verificar',
  },
  callbacks: {
    async session({ session, user }): Promise<Session> {
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
  providers: [
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
  ],
}

export const { handlers: authHandlers, auth, signIn, signOut } = NextAuth(authOptions)

export const getSession = () => getServerSession(authOptions)

export const requireAdmin = async () => {
  const session = await auth()

  if (!session || session.user?.role !== 'admin') {
    throw new NextResponse('Unauthorized', { status: 401 })
  }

  return session
}
