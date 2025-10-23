import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import type { EmailConfig } from 'next-auth/providers/email'
import type { AdapterUser } from 'next-auth/adapters'
import type { JWT } from 'next-auth/jwt'

import { prisma } from './db'
import { authLogger } from './auth-logger'
import { createAuthAdapter } from './auth-adapter'
import { resendClient } from './resend'
import { sanitizeError } from './logging'

type ExtendedJWT = JWT & {
  id?: string
  role?: string
}

type AdminCredentialsProvider = ReturnType<typeof Credentials>

const textEncoder = new TextEncoder()

function safeCompare(input: string, expected: string) {
  if (input.length !== expected.length) {
    return false
  }

  const inputBytes = textEncoder.encode(input)
  const expectedBytes = textEncoder.encode(expected)

  if (inputBytes.length !== expectedBytes.length) {
    return false
  }

  let diff = 0

  for (let index = 0; index < inputBytes.length; index += 1) {
    diff |= inputBytes[index] ^ expectedBytes[index]
  }

  return diff === 0
}

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
    '[AUTH] Usando las credenciales admin por defecto (admin@nerin.com.ar / AccesoNerin123). Configurá ADMIN_EMAIL y ADMIN_PASSWORD en producción para personalizarlas.',
  )
}

const normalizedAdminEmail = (adminEmailEnv || defaultAdminEmail).trim().toLowerCase()
const adminPassword = adminPasswordEnv || defaultAdminPassword

function createAdminUserFallback(): AdapterUser {
  return {
    id: 'admin',
    email: normalizedAdminEmail,
    name: adminDisplayName,
    role: 'admin',
    emailVerified: new Date(),
  }
}

export function createAdminCredentialsProvider(): AdminCredentialsProvider {
  return Credentials({
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
      const emailInput = typeof credentials?.email === 'string' ? credentials.email : undefined
      const passwordInput = typeof credentials?.password === 'string' ? credentials.password : undefined

      const email = emailInput?.trim().toLowerCase() || ''
      const password = passwordInput || ''

      if (!email || !password) {
        return null
      }

      if (!safeCompare(email, normalizedAdminEmail) || !safeCompare(password, adminPassword)) {
        return null
      }

      try {
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
      } catch (error) {
        console.error('[AUTH] Failed to sync admin user with database', sanitizeError(error))
        return createAdminUserFallback()
      }
    },
  })
}

export function buildBaseAuthOptions(overrideProvider?: AdminCredentialsProvider): NextAuthConfig {
  const adminCredentialsProvider = overrideProvider ?? createAdminCredentialsProvider()

  return {
    adapter: createAuthAdapter(prisma),
    trustHost: true,
    secret: authSecret,
    logger: authLogger,
    session: {
      strategy: 'jwt',
      maxAge: 60 * 60 * 24 * 30,
    },
    pages: {
      signIn: '/clientes/login',
      verifyRequest: '/clientes/verificar',
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          const extendedToken = token as ExtendedJWT

          if (user.id) {
            extendedToken.id = String(user.id)
            token.sub = String(user.id)
          }

          if ('role' in user && typeof user.role === 'string') {
            extendedToken.role = user.role
          }

          if (user.email) {
            token.email = user.email
          }

          if (user.name) {
            token.name = user.name
          }
        }

        return token
      },
      async session({ session, token }) {
        if (session.user) {
          const extendedToken = token as ExtendedJWT

          session.user.id = extendedToken.id || (typeof token.sub === 'string' ? token.sub : session.user.id)
          session.user.role = extendedToken.role || session.user.role

          if (token.email) {
            session.user.email = token.email
          }

          if (token.name) {
            session.user.name = token.name
          }
        }

        return session
      },
      async signIn({ user }) {
        if (!user?.email) {
          return false
        }

        return true
      },
    },
    providers: [adminCredentialsProvider],
  }
}

export async function resolveAuthOptions(
  overrideProvider?: AdminCredentialsProvider,
): Promise<NextAuthConfig> {
  const baseConfig = buildBaseAuthOptions(overrideProvider)

  const config: NextAuthConfig = {
    ...baseConfig,
    providers: [...baseConfig.providers],
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
        html: `<p>Hola,</p><p>Hacé clic en el enlace para ingresar al portal de clientes NERIN:</p><p><a href="${url}">${url}</a></p><p>Si no solicitaste este acceso, ignorá este correo.</p>`.replace(/\n/g, ''),
      })
    },
  }

  config.providers = [...config.providers, resendEmailProvider]

  return config
}
