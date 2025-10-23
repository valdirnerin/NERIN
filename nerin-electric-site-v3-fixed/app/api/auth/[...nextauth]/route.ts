import NextAuth from 'next-auth'

import { createAdminCredentialsProvider, resolveAuthOptions } from '@/lib/auth-config'

const adminCredentialsProvider = createAdminCredentialsProvider()

const nextAuth = NextAuth(async () => resolveAuthOptions(adminCredentialsProvider))

export const { GET, POST } = nextAuth.handlers

export const runtime = 'nodejs'
