import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getAdminTechnicalStatus } from '@/lib/admin-technical-status'
import { storeMediaFile, sanitizeMediaFolder } from '@/lib/media'
import { addMediaLibraryItem } from '@/lib/media-library'

export const runtime = 'nodejs'

const ADMIN_IMAGE_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function POST(req: Request) {
  try {
    await requireAdmin()
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') return unauthorized()
    throw error
  }

  const technicalStatus = getAdminTechnicalStatus()
  if (!technicalStatus.uploadPersistent) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Storage persistente no configurado. No se subió el archivo para evitar imágenes que se pierdan en refresh, restart o redeploy.',
        technicalStatus,
      },
      { status: 503 },
    )
  }

  const form = await req.formData()
  const file = form.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file' }, { status: 400 })
  }

  if (!ADMIN_IMAGE_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: 'Formato no permitido. Usá PNG, JPG, JPEG, WEBP o SVG.' },
      { status: 400 },
    )
  }

  const folder = sanitizeMediaFolder(form.get('folder')?.toString())
  const originalName = (form.get('name') as string) || file.name || 'upload.png'

  try {
    const stored = await storeMediaFile({ file, folder, preferredName: originalName })
    const media = await addMediaLibraryItem({
      url: stored.publicUrl,
      name: stored.originalName,
      mimeType: stored.mimeType,
      size: stored.size,
      provider: process.env.STORAGE_PROVIDER || 'local',
      storedPath: stored.storedPath,
    })
    return NextResponse.json({ ok: true, url: stored.publicUrl, storedPath: stored.storedPath, media })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo subir el archivo'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
