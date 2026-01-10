import { NextResponse } from 'next/server'
import { getContentStore } from '@/lib/content-store'
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
  const store = getContentStore()

  if (type === 'blog') {
    const posts = await store.listPosts()
    return NextResponse.json(posts.map((post) => post.slug))
  }

  return NextResponse.json([])
}
