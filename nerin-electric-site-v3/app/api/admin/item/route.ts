import { NextResponse } from 'next/server'
import { readMarkdown, writeMarkdown, deleteMarkdown } from '@/lib/content'
import { requireAdmin } from '@/lib/auth'
export async function GET(req: Request){
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'blog'
  const slug = searchParams.get('slug')!
  const item = readMarkdown(type, slug)
  return NextResponse.json(item || { data:{}, content:'' })
}
export async function POST(req: Request){
  await requireAdmin()
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'blog'
  const slug = searchParams.get('slug')!
  const body = await req.json()
  writeMarkdown(type, slug, body.data, body.content)
  return NextResponse.json({ ok: true })
}
export async function DELETE(req: Request){
  await requireAdmin()
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'blog'
  const slug = searchParams.get('slug')!
  deleteMarkdown(type, slug)
  return NextResponse.json({ ok: true })
}
