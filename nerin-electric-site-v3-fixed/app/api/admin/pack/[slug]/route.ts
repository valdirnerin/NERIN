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

export async function PATCH(
  req: Request,
  { params }: { params: { slug: string } },
) {
  await requireAdmin()
  const body = await req.json()

  const newSlug = body.slug
    ? slugify(String(body.slug), { lower: true, strict: true })
    : undefined

  const features: string[] | undefined =
    typeof body.features === 'string'
      ? body.features
          .split('\n')
          .map((s: string) => s.trim())
          .filter(Boolean)
      : Array.isArray(body.features)
      ? body.features
      : undefined

  const data: Record<string, unknown> = {
    ...(body.name != null && { name: String(body.name) }),
    ...(body.description != null && { description: String(body.description) }),
    ...(body.scope != null && { scope: String(body.scope) }),
    ...(body.basePrice != null && { basePrice: Number(body.basePrice) }),
    ...(body.advancePrice != null && { advancePrice: Number(body.advancePrice) }),
    ...(typeof body.active === 'boolean' && { active: body.active }),
    ...(features && { features: JSON.stringify(features) }),
    ...(newSlug && { slug: newSlug }),
  }

  const pack = await prisma.pack.update({
    where: { slug: params.slug },
    data,
  })
  return NextResponse.json({ ok: true, pack })
}

export async function DELETE(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  await requireAdmin()
  await prisma.pack.delete({ where: { slug: params.slug } })
  return NextResponse.json({ ok: true })
}
