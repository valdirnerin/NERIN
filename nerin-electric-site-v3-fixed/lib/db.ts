// lib/db.ts
import { existsSync } from 'node:fs'

import { PrismaClient } from '@prisma/client'

const TMP_DB_URL = 'file:/tmp/nerin.db'
const DEV_DB_URL = 'file:./dev.db'

const dbEnabledEnv = (process.env.DB_ENABLED || '').toLowerCase()
const dbExplicitlyDisabled = dbEnabledEnv === 'false'
const storageDir = process.env.STORAGE_DIR?.trim() || (existsSync('/var/data') ? '/var/data' : '')
const storageDirAvailable = storageDir.length > 0 && existsSync(storageDir)
const persistentUrl = storageDirAvailable ? `file:${storageDir}/nerin.db` : null
const isDatabaseUrlMissing =
  !process.env.DATABASE_URL || process.env.DATABASE_URL.trim().length === 0

if (isDatabaseUrlMissing && !dbExplicitlyDisabled) {
  if (persistentUrl) {
    process.env.DATABASE_URL = persistentUrl
  } else {
    process.env.DATABASE_URL = process.env.NODE_ENV === 'development' ? DEV_DB_URL : TMP_DB_URL
  }
}

const databaseUrl = process.env.DATABASE_URL?.trim()
const resolvedDatabaseUrl = databaseUrl && databaseUrl.length > 0 ? databaseUrl : TMP_DB_URL

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
