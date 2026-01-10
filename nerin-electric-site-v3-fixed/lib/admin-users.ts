import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db'
import { sanitizeError } from '@/lib/logging'

type EnsureAdminInput = {
  email: string
  password: string
  displayName: string
}

export async function ensureAdminUser({ email, password, displayName }: EnsureAdminInput) {
  if (!email || !password) {
    return
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } })
  if (existing) {
    return
  }

  try {
    const passwordHash = await hash(password, 12)
    await prisma.adminUser.create({
      data: {
        email,
        passwordHash,
        role: 'ADMIN',
      },
    })

    await prisma.user.upsert({
      where: { email },
      update: {
        role: 'admin',
        name: displayName,
        emailVerified: new Date(),
      },
      create: {
        email,
        role: 'admin',
        name: displayName,
        emailVerified: new Date(),
      },
    })
  } catch (error) {
    console.error('[AUTH] Failed to create admin user', sanitizeError(error))
  }
}

export async function getAdminUserByEmail(email: string) {
  if (!email) {
    return null
  }
  return prisma.adminUser.findUnique({ where: { email } })
}
