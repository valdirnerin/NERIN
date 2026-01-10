import { NextResponse } from 'next/server'
import { mockPosts } from '@/lib/mockData'

interface Params {
  params: { slug: string }
}

export async function GET(_: Request, { params }: Params) {
  const post = mockPosts.find((item) => item.slug === params.slug && item.publishedAt)
  return NextResponse.json(post ? { ...post, publishedAt: post.publishedAt } : null)
}
