import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { getContentStore } from '@/lib/content-store'

export async function GET() {
  await requireAdmin()
  const store = getContentStore()
  const projects = await store.listProjects()
  return NextResponse.json({ items: projects })
}

export async function POST(req: Request) {
  await requireAdmin()
  const store = getContentStore()
  const body = await req.json()
  const created = await store.upsertProject({
    title: body.title,
    description: body.description,
    tags: Array.isArray(body.tags) ? body.tags : [],
    locationText: body.locationText ?? null,
    images: Array.isArray(body.images) ? body.images : [],
  })
  revalidatePath('/obras')
  return NextResponse.json({ item: created }, { status: 201 })
}

export async function PUT(req: Request) {
  await requireAdmin()
  const store = getContentStore()
  const body = await req.json()
  if (!body.id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }
  const updated = await store.upsertProject({
    id: body.id,
    title: body.title,
    description: body.description,
    tags: Array.isArray(body.tags) ? body.tags : [],
    locationText: body.locationText ?? null,
    images: Array.isArray(body.images) ? body.images : [],
  })
  revalidatePath('/obras')
  return NextResponse.json({ item: updated })
}

export async function DELETE(req: Request) {
  await requireAdmin()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }
  const store = getContentStore()
  await store.deleteProject(id)
  revalidatePath('/obras')
  return NextResponse.json({ ok: true })
}
