import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'

import { buildBaseAuthOptions, resolveAuthOptions } from './auth-config'
import { sanitizeError } from './logging'

export const authOptions: NextAuthConfig = buildBaseAuthOptions()

const nextAuth = NextAuth(async () => resolveAuthOptions())

export const { handlers, auth, signIn, signOut } = nextAuth

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
