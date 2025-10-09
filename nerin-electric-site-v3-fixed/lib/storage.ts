import fs from 'node:fs/promises'
import path from 'node:path'

export type StorageProvider = 'local' | 's3'

const provider = (process.env.STORAGE_PROVIDER as StorageProvider) || 'local'
const baseDir = process.env.STORAGE_DIR || path.join(process.cwd(), '.data/uploads')

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true })
}

export async function saveLocalFile(buffer: Buffer, filename: string) {
  const targetDir = baseDir
  await ensureDir(targetDir)
  const filePath = path.join(targetDir, filename)
  await fs.writeFile(filePath, buffer)
  return filePath
}

export async function saveFile(buffer: Buffer, filename: string) {
  if (provider === 's3') {
    throw new Error('S3 storage provider not implementado. Configurar SDK correspondiente.')
  }
  return saveLocalFile(buffer, filename)
}
