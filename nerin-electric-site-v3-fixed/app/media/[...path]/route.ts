import fs from 'node:fs/promises'
import { NextResponse } from 'next/server'
import { getMediaContentType, resolveMediaPath } from '@/lib/media'

export const dynamic = 'force-dynamic'

export async function GET(_: Request, context: { params: { path: string[] } }) {
  const parts = context.params.path

  if (!Array.isArray(parts) || parts.length === 0) {
    return new NextResponse('Not found', { status: 404 })
  }

  const filePath = resolveMediaPath(parts)
  if (!filePath) {
    return new NextResponse('Invalid path', { status: 400 })
  }

  try {
    const file = await fs.readFile(filePath)
    return new NextResponse(file, {
      status: 200,
      headers: {
        'Content-Type': getMediaContentType(filePath),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}
