// lib/db.ts
import { existsSync } from 'node:fs'

import { PrismaClient } from '@prisma/client'

const VAR_DATA_DB_URL = 'file:/var/data/nerin.db'
const DEV_DB_URL = 'file:./dev.db'

const isDatabaseUrlMissing =
  !process.env.DATABASE_URL || process.env.DATABASE_URL.trim().length === 0

if (isDatabaseUrlMissing && existsSync('/var/data')) {
  process.env.DATABASE_URL = VAR_DATA_DB_URL
}

const databaseUrl = process.env.DATABASE_URL?.trim()
const resolvedDatabaseUrl = databaseUrl && databaseUrl.length > 0 ? databaseUrl : DEV_DB_URL

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: resolvedDatabaseUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient

export const prisma = prismaClient

export default prisma
