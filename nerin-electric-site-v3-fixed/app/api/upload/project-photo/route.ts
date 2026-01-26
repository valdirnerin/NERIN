import { NextResponse } from 'next/server'
import path from 'node:path'
import fs from 'node:fs/promises'
import { prisma } from '@/lib/db'
import { DB_ENABLED } from '@/lib/dbMode'
import { getStorageDir } from '@/lib/content'
import { requireAdmin } from '@/lib/auth'

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

  const safeName = (file.name || 'upload').replace(/[^a-zA-Z0-9._-]/g, '_')
  const storageDir = getStorageDir()
  const uploadsDir = path.join(storageDir, 'uploads', 'projects', projectId)
  await fs.mkdir(uploadsDir, { recursive: true })

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const outputPath = path.join(uploadsDir, safeName)
  await fs.writeFile(outputPath, buffer)

  const storedPath = path.posix.join('projects', projectId, safeName)

  const photo = await prisma.projectPhoto.create({
    data: {
      projectId,
      title,
      filename: safeName,
      mimeType: file.type || 'application/octet-stream',
      size: buffer.length,
      storedPath,
    },
  })

  return NextResponse.json({
    ok: true,
    id: photo.id,
    url: `/uploads/${storedPath}`,
  })
}
