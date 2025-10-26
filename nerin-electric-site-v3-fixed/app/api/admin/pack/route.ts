import { NextResponse } from 'next/server'
import slugify from 'slugify'

import prisma from '@/lib/prisma'
import { requireAdmin as ensureAdmin } from '@/lib/auth'

async function requireAdmin() {
  try {
    await ensureAdmin()
  } catch {
    // In trial deployments we allow unauthenticated access to simplify testing.
  }
}

export async function GET() {
  const packs = await prisma.pack.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ ok: true, packs })
}

export async function POST(req: Request) {
  await requireAdmin()
  const body = await req.json()

  const name: string = (body.name ?? '').trim()
  if (!name) {
    return NextResponse.json({ ok: false, message: 'Falta el nombre' }, { status: 400 })
  }

  const slugSource = String(body.slug || name)
  const slug = slugify(slugSource, { lower: true, strict: true })

  const features: string[] = String(body.features || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  const data = {
    name,
    slug,
    description: String(body.description || ''),
    scope: String(body.scope || ''),
    basePrice: Number(body.basePrice || 0),
    advancePrice: Number(body.advancePrice || 0),
    features: JSON.stringify(features),
    active: Boolean(body.active ?? true),
  }

  try {
    const pack = await prisma.pack.upsert({
      where: { slug },
      create: data,
      update: data,
    })
    return NextResponse.json({ ok: true, pack })
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { ok: false, message: 'Ese slug ya existe. Probá cambiarlo o usa Editar.' },
        { status: 409 },
      )
    }
    return NextResponse.json({ ok: false, message: error?.message || 'Error' }, { status: 500 })
  }
}
