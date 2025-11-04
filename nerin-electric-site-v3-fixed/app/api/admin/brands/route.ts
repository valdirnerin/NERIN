
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

const BrandSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(2, 'El nombre es obligatorio'),
  logoUrl: z.string().url().optional().or(z.literal('').transform(() => undefined)),
})

function sanitizeLogo(logoUrl?: string) {
  if (!logoUrl) return undefined
  const trimmed = logoUrl.trim()
  return trimmed.length ? trimmed : undefined
}

function revalidateMarketing() {
  revalidatePath('/')
  revalidatePath('/contacto')
}

export async function GET() {
  await requireAdmin()
  const items = await prisma.brand.findMany({ orderBy: { nombre: 'asc' } })
  return NextResponse.json({ items })
}

export async function POST(request: Request) {
  await requireAdmin()
  const json = await request.json()
  const payload = BrandSchema.parse(json)

  const brand = await prisma.brand.create({
    data: {
      nombre: payload.nombre,
      logoUrl: sanitizeLogo(payload.logoUrl) ?? null,
    },
  })

  revalidateMarketing()
  return NextResponse.json({ item: brand })
}

export async function PUT(request: Request) {
  await requireAdmin()
  const json = await request.json()
  const payload = BrandSchema.extend({ id: z.string() }).parse(json)

  const brand = await prisma.brand.update({
    where: { id: payload.id },
    data: {
      nombre: payload.nombre,
      logoUrl: sanitizeLogo(payload.logoUrl) ?? null,
    },
  })

  revalidateMarketing()
  return NextResponse.json({ item: brand })
}

export async function DELETE(request: Request) {
  await requireAdmin()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Falta id' }, { status: 400 })
  }

  await prisma.brand.delete({ where: { id } })
  revalidateMarketing()
  return NextResponse.json({ ok: true })
}
