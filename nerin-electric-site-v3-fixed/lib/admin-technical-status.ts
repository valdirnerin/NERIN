import path from 'node:path'

export type AdminTechnicalStatus = {
  dbConfigured: boolean
  dbTemporary: boolean
  storageConfigured: boolean
  uploadPersistent: boolean
  storageProvider: string
  warnings: string[]
}

export function getAdminTechnicalStatus(): AdminTechnicalStatus {
  const databaseUrl = process.env.DATABASE_URL || ''
  const storageProvider = process.env.STORAGE_PROVIDER || 'local'
  const storageDir = process.env.STORAGE_DIR || ''
  const dbTemporary = databaseUrl.includes('/tmp') || databaseUrl.includes('file:/tmp')
  const localStorageTemporary = storageProvider === 'local' && (!storageDir || path.resolve(storageDir).startsWith('/tmp'))
  const cloudinaryReady = storageProvider === 'cloudinary' && Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_UPLOAD_PRESET)
  const storageConfigured = storageProvider === 'cloudinary' ? cloudinaryReady : Boolean(storageDir)
  const uploadPersistent = storageProvider === 'cloudinary' ? cloudinaryReady : storageConfigured && !localStorageTemporary
  const warnings: string[] = []

  if (!databaseUrl) warnings.push('Falta DATABASE_URL: el admin no debe prometer persistencia sin base configurada.')
  if (dbTemporary) warnings.push('DATABASE_URL apunta a /tmp: los cambios pueden perderse en restart/redeploy.')
  if (!storageConfigured) warnings.push('Falta storage persistente. Configurá Cloudinary/S3/R2/Supabase o STORAGE_DIR sobre Render Disk.')
  if (localStorageTemporary) warnings.push('Storage local sin Render Disk persistente: no guardar uploads dinámicos en /public ni en filesystem efímero.')
  if (storageProvider === 'cloudinary' && !cloudinaryReady) warnings.push('STORAGE_PROVIDER=cloudinary requiere CLOUDINARY_CLOUD_NAME y CLOUDINARY_UPLOAD_PRESET.')

  return { dbConfigured: Boolean(databaseUrl), dbTemporary, storageConfigured, uploadPersistent, storageProvider, warnings }
}
