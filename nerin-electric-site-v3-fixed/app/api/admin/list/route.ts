import { NextResponse } from 'next/server'
import { listItems } from '@/lib/content'
import { requireAdmin } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    await requireAdmin()
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    throw error
  }

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'blog'
  return NextResponse.json(listItems(type))
}
