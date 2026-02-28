import fs from 'node:fs'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getMediaDir, getMediaPublicUrl, sanitizeMediaFilename, sanitizeMediaFolder } from '@/lib/media'

const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
])

export async function POST(req: Request) {
  await requireAdmin()

  const form = await req.formData()
  const file = form.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file' }, { status: 400 })
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Formato no permitido' }, { status: 400 })
  }

  const folder = sanitizeMediaFolder(form.get('folder')?.toString())
  const originalName = (form.get('name') as string) || file.name || 'upload.png'

  try {
    const safeName = sanitizeMediaFilename(originalName)
    const uniqueName = `${Date.now()}-${safeName}`
    const relativePath = folder ? path.posix.join(folder, uniqueName) : uniqueName
    const mediaDir = getMediaDir()
    const outPath = path.join(mediaDir, relativePath)

    fs.mkdirSync(path.dirname(outPath), { recursive: true })

    const arrayBuffer = await file.arrayBuffer()
    fs.writeFileSync(outPath, Buffer.from(arrayBuffer))

    return NextResponse.json({ ok: true, url: getMediaPublicUrl(relativePath) })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo subir el archivo'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
