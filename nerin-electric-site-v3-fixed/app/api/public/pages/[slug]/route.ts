import { NextResponse } from 'next/server'
import { mockPages } from '@/lib/mockData'

interface Params {
  params: { slug: string }
}

export async function GET(_: Request, { params }: Params) {
  const page = mockPages.find((item) => item.slug === params.slug) ?? null
  return NextResponse.json(page)
}
