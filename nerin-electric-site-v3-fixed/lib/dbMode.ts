import { existsSync } from 'node:fs'

const dbEnabledEnv = (process.env.DB_ENABLED || '').toLowerCase()
const dbExplicitlyDisabled = dbEnabledEnv === 'false'
const storageDir = process.env.STORAGE_DIR?.trim() || (existsSync('/var/data') ? '/var/data' : '')
const storageDirAvailable = storageDir.length > 0 && existsSync(storageDir)

export const DB_ENABLED = !dbExplicitlyDisabled
export const DB_PERSISTENT = DB_ENABLED && storageDirAvailable
export const DB_DEMO_MODE = DB_ENABLED && !storageDirAvailable
