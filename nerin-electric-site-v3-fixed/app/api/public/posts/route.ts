import { NextResponse } from 'next/server'
import { mockPosts } from '@/lib/mockData'

export async function GET() {
  const published = mockPosts
    .filter((post) => post.publishedAt)
    .map((post) => ({
      ...post,
      publishedAt: post.publishedAt as string,
    }))
  return NextResponse.json(published)
}
