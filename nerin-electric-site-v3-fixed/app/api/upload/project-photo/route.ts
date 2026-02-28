import { NextResponse } from 'next/server'
import path from 'node:path'
import fs from 'node:fs/promises'
import { prisma } from '@/lib/db'
import { DB_ENABLED } from '@/lib/dbMode'
import { requireAdmin } from '@/lib/auth'
import { getMediaDir, getMediaPublicUrl, sanitizeMediaFilename } from '@/lib/media'

export async function POST(req: Request) {
  await requireAdmin()

  if (!DB_ENABLED) {
    return NextResponse.json({ error: 'DB_DISABLED' }, { status: 400 })
  }

  const form = await req.formData()
  const projectId = form.get('projectId')?.toString() ?? ''
  const title = form.get('title')?.toString() ?? null
  const file = form.get('file') as File | null

  if (!projectId || !file) {
    return NextResponse.json({ error: 'Missing projectId or file' }, { status: 400 })
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  const safeName = sanitizeMediaFilename(file.name || 'upload.png')
  const uniqueName = `${Date.now()}-${safeName}`
  const storedPath = path.posix.join('projects', projectId, uniqueName)
  const outputPath = path.join(getMediaDir(), storedPath)

  await fs.mkdir(path.dirname(outputPath), { recursive: true })

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  await fs.writeFile(outputPath, buffer)

  const photo = await prisma.projectPhoto.create({
    data: {
      projectId,
      title,
      filename: uniqueName,
      mimeType: file.type || 'application/octet-stream',
      size: buffer.length,
      storedPath,
    },
  })

  return NextResponse.json({
    ok: true,
    id: photo.id,
    url: getMediaPublicUrl(storedPath),
  })
}
