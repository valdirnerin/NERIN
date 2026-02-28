import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { storeMediaFile, sanitizeMediaFolder } from '@/lib/media'

export async function POST(req: Request) {
  await requireAdmin()

  const form = await req.formData()
  const file = form.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file' }, { status: 400 })
  }

  const folder = sanitizeMediaFolder(form.get('folder')?.toString())
  const originalName = (form.get('name') as string) || file.name || 'upload.png'

  try {
    const stored = await storeMediaFile({ file, folder, preferredName: originalName })
    return NextResponse.json({ ok: true, url: stored.publicUrl, storedPath: stored.storedPath })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo subir el archivo'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
