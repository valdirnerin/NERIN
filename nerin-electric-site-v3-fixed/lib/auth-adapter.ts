import { PrismaAdapter } from '@auth/prisma-adapter'
import type { Adapter, VerificationToken } from 'next-auth/adapters'
import type { PrismaClient } from '@prisma/client'
import { Prisma } from '@prisma/client'

import { sanitizeError } from './logging'

function normalizeIdentifier(identifier: string | null | undefined) {
  if (typeof identifier !== 'string') {
    return undefined
  }

  return identifier.trim().toLowerCase()
}

export function createAuthAdapter(prisma: PrismaClient): Adapter {
  const baseAdapter = PrismaAdapter(prisma)

  return {
    ...baseAdapter,
    async createVerificationToken(data) {
      const identifier = normalizeIdentifier(data.identifier) ?? data.identifier

      return baseAdapter.createVerificationToken?.({
        ...data,
        identifier,
      } as VerificationToken)
    },
    async useVerificationToken(params) {
      const identifier = normalizeIdentifier(params.identifier) ?? params.identifier

      const resolveWithBaseAdapter = async () => {
        try {
          return await baseAdapter.useVerificationToken?.({
            ...params,
            identifier,
          })
        } catch (error) {
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025'
          ) {
            return null
          }
          throw error
        }
      }

      const baseResult = await resolveWithBaseAdapter()
      if (baseResult) {
        return baseResult
      }

      try {
        const tokenRecord = await prisma.verificationToken.findUnique({
          where: { token: params.token },
        })

        if (!tokenRecord) {
          return null
        }

        await prisma.verificationToken.delete({
          where: {
            identifier_token: {
              identifier: tokenRecord.identifier,
              token: tokenRecord.token,
            },
          },
        })

        return tokenRecord
      } catch (error) {
        console.error(
          '[AUTH] Failed to resolve verification token with fallback lookup',
          sanitizeError(error),
        )
        throw error
      }
    },
  }
}

export default createAuthAdapter
