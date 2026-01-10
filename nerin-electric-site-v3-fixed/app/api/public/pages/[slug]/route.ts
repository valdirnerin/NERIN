import { NextResponse } from 'next/server'
import { getContentStore } from '@/lib/content-store'

interface Params {
  params: { slug: string }
}

export async function GET(_: Request, { params }: Params) {
  const store = getContentStore()
  const page = await store.getPage(params.slug)
  if (!page) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(page)
}
