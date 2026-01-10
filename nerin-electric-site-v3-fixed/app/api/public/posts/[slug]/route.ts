import { NextResponse } from 'next/server'
import { getContentStore } from '@/lib/content-store'

interface Params {
  params: { slug: string }
}

export async function GET(_: Request, { params }: Params) {
  const store = getContentStore()
  const post = await store.getPost(params.slug)
  if (!post || !post.publishedAt) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ ...post, publishedAt: post.publishedAt })
}
