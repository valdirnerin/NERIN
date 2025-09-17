import { NextResponse } from 'next/server'
import { listItems } from '@/lib/content'
export async function GET(req: Request){
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'blog'
  return NextResponse.json(listItems(type))
}
