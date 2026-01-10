import { NextResponse } from 'next/server'
import { getContentStore } from '@/lib/content-store'

export async function GET() {
  const store = getContentStore()
  const posts = await store.listPosts()
  const published = posts
    .filter((post) => post.publishedAt)
    .map((post) => ({
      ...post,
      publishedAt: post.publishedAt as string,
    }))
  return NextResponse.json(published)
}
