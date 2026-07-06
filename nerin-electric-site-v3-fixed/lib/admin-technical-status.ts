import path from 'node:path'

export type AdminTechnicalStatus = {
  dbConfigured: boolean
  dbPersistent: boolean
  dbTemporary: boolean
  storageConfigured: boolean
  uploadPersistent: boolean
  storageProvider: string
  databaseUrlLabel: string
  storageDirLabel: string
  warnings: string[]
}

function redactDatabaseUrl(value: string) {
  if (!value) return 'No configurada'
  if (value.startsWith('file:')) return value
  const protocol = value.split(':')[0] || 'db'
  return `${protocol}://***`
}

export function getAdminTechnicalStatus(): AdminTechnicalStatus {
  const databaseUrl = process.env.DATABASE_URL?.trim() || ''
  const storageProvider = (process.env.STORAGE_PROVIDER || 'local').trim().toLowerCase()
  const storageDir = process.env.STORAGE_DIR?.trim() || ''
  const dbTemporary = databaseUrl.includes('/tmp') || databaseUrl.includes('file:/tmp')
  const dbConfigured = Boolean(databaseUrl) && !dbTemporary
  const dbPersistent = dbConfigured && !dbTemporary
  const localStorageTemporary = storageProvider === 'local' && (!storageDir || path.resolve(storageDir).startsWith('/tmp'))
  const cloudinaryReady = storageProvider === 'cloudinary' && Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_UPLOAD_PRESET)
  const localStoragePersistent = storageProvider === 'local' && Boolean(storageDir) && !localStorageTemporary
  const storageConfigured = cloudinaryReady || localStoragePersistent
  const uploadPersistent = storageConfigured && (cloudinaryReady || localStoragePersistent)
  const warnings: string[] = []

  if (!databaseUrl) warnings.push('Falta DATABASE_URL: el admin no puede garantizar persistencia de contenido.')
  if (dbTemporary) warnings.push('DATABASE_URL apunta a /tmp: los cambios pueden perderse en restart o redeploy.')
  if (!dbPersistent) warnings.push('La base no está marcada como persistente. No se debe mostrar “guardado definitivo”.')
  if (!storageConfigured) warnings.push('Falta storage persistente. Configurá Cloudinary, S3, R2, Supabase Storage, UploadThing o un Render Disk explícito.')
  if (localStorageTemporary) warnings.push('Storage local sin directorio persistente: los uploads pueden perderse. No guardar imágenes dinámicas en /public ni /tmp.')
  if (storageProvider === 'cloudinary' && !cloudinaryReady) warnings.push('STORAGE_PROVIDER=cloudinary requiere CLOUDINARY_CLOUD_NAME y CLOUDINARY_UPLOAD_PRESET.')

  return {
    dbConfigured,
    dbPersistent,
    dbTemporary,
    storageConfigured,
    uploadPersistent,
    storageProvider,
    databaseUrlLabel: redactDatabaseUrl(databaseUrl),
    storageDirLabel: storageDir || 'No configurado',
    warnings,
  }
}
