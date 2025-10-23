import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getStorageDir } from '@/lib/content'
import { requireAdmin } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

function filePath() {
  const storage = getStorageDir()
  return path.join(storage, 'pricing.json')
}

export async function GET() {
  try {
    await requireAdmin()
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    throw error
  }

  const filepath = filePath()

  if (!fs.existsSync(filepath)) {
    return NextResponse.json({ plans: [] })
  }

  const json = JSON.parse(fs.readFileSync(filepath, 'utf8'))
  return NextResponse.json(json)
}

export async function POST(req: Request) {
  await requireAdmin()
  const body = await req.json()
  fs.writeFileSync(filePath(), JSON.stringify(body, null, 2))
  const pathsToRevalidate = ['/', '/packs', '/presupuestador']

  const revalidationResults = pathsToRevalidate.map((pathname) => {
    try {
      revalidatePath(pathname)
      return { path: pathname, revalidated: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      console.error(`Failed to revalidate ${pathname}:`, error)
      return { path: pathname, revalidated: false, error: message }
    }
  })

  const allRevalidated = revalidationResults.every((result) => result.revalidated)

  return NextResponse.json({ ok: true, revalidated: revalidationResults, allRevalidated })
}
