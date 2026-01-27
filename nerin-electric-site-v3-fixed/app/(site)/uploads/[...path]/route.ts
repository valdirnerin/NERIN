import { NextResponse } from 'next/server'
import path from 'node:path'
import fs from 'node:fs/promises'
import { getStorageDir } from '@/lib/content'

const contentTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
}

export async function GET(_req: Request, { params }: { params: { path: string[] } }) {
  const storageDir = getStorageDir()
  const baseDir = path.resolve(storageDir, 'uploads')
  const relativePath = params.path.join('/')
  const filePath = path.resolve(baseDir, relativePath)

  if (!filePath.startsWith(baseDir)) {
    return new NextResponse('Invalid path', { status: 400 })
  }

  try {
    const file = await fs.readFile(filePath)
    const ext = path.extname(filePath).toLowerCase()
    const contentType = contentTypes[ext] || 'application/octet-stream'
    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}
