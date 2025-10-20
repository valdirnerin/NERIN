import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import type { EmailConfig } from 'next-auth/providers/email'
import { timingSafeEqual } from 'node:crypto'
import { prisma } from './db'
import { authLogger } from './auth-logger'
import { resendClient } from './resend'
import { sanitizeError } from './logging'
import { createAuthAdapter } from './auth-adapter'

let authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET
if (!authSecret) {
  if (process.env.NODE_ENV === 'production') {
    console.error(
      '[AUTH] Missing AUTH_SECRET or NEXTAUTH_SECRET environment variable. Authentication flows will fail in production until it is configured.',
    )
  } else {
    authSecret = 'development-secret'
    console.warn(
      '[AUTH] AUTH_SECRET/NEXTAUTH_SECRET was not set. Using a development-only fallback secret. Configure a real secret in production environments.',
    )
  }
}

const authBaseUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL
if (!authBaseUrl) {
  console.warn('[AUTH] AUTH_URL/NEXTAUTH_URL is not configured. Falling back to the request host at runtime.')
}

const fromEmail = process.env.EMAIL_SERVER_FROM || 'NERIN <hola@nerin.com.ar>'

const defaultAdminEmail = 'admin@nerin.com.ar'
const defaultAdminPassword = 'AccesoNerin123'
const adminEmailEnv = process.env.ADMIN_EMAIL
const adminPasswordEnv = process.env.ADMIN_PASSWORD
const adminDisplayName = process.env.ADMIN_NAME?.trim() || 'Administrador NERIN'

if (!adminEmailEnv || !adminPasswordEnv) {
  console.warn(
    "[AUTH] Usando las credenciales admin por defecto (admin@nerin.com.ar / AccesoNerin123). Configurá ADMIN_EMAIL y ADMIN_PASSWORD en producción para personalizarlas.",
  )
}

const normalizedAdminEmail = (adminEmailEnv || defaultAdminEmail).trim().toLowerCase()
const adminPassword = adminPasswordEnv || defaultAdminPassword

function safeCompare(input: string, expected: string) {
  if (input.length !== expected.length) {
    return false
  }

  try {
    return timingSafeEqual(Buffer.from(input), Buffer.from(expected))
  } catch (error) {
    console.error('[AUTH] Error comparando credenciales', sanitizeError(error))
    return false
  }
}

const adminCredentialsProvider = Credentials({
  id: 'admin-credentials',
  name: 'Acceso administrador',
  credentials: {
    email: {
      label: 'Correo corporativo',
      type: 'email',
      placeholder: normalizedAdminEmail,
    },
    password: {
      label: 'Contraseña',
      type: 'password',
      placeholder: '••••••••',
    },
  },
  authorize: async (credentials) => {
    const email = credentials?.email?.trim().toLowerCase()
    const password = credentials?.password || ''

    if (!email || !password) {
      return null
    }

    if (!safeCompare(email, normalizedAdminEmail) || !safeCompare(password, adminPassword)) {
      return null
    }

    const adminUser = await prisma.user.upsert({
      where: { email: normalizedAdminEmail },
      update: {
        role: 'admin',
        name: adminDisplayName,
        emailVerified: new Date(),
      },
      create: {
        email: normalizedAdminEmail,
        role: 'admin',
        name: adminDisplayName,
        emailVerified: new Date(),
      },
    })

    return adminUser
  },
})

export const authOptions: NextAuthConfig = {
  adapter: createAuthAdapter(prisma),
  trustHost: true,
  secret: authSecret,
  logger: authLogger,
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
        session.user.name = user.name || user.email || session.user.name
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
  providers: [adminCredentialsProvider],
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

  config.providers = [...config.providers, resendEmailProvider]

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
