import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { parseJson, parseStringArray, serializeJson, serializeStringArray } from '@/lib/serialization'

type Metric = { label: string; value: string }

type CaseStudyPayload = {
  id?: string
  titulo?: string
  slug?: string
  resumen?: string
  contenido?: string
  metricas?: unknown
  fotos?: unknown
  publicado?: unknown
}

function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

function badRequestResponse(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}

function parseMetrics(value: unknown): Metric[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => {
      if (item && typeof item === 'object' && 'label' in item && 'value' in item) {
        const label = String((item as Record<string, unknown>).label ?? '')
        const metricValue = String((item as Record<string, unknown>).value ?? '')

        if (label.trim() && metricValue.trim()) {
          return { label: label.trim(), value: metricValue.trim() }
        }
      }
      return null
    })
    .filter((item): item is Metric => Boolean(item))
}

function parseFotos(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => String(item ?? '').trim())
    .filter((item) => Boolean(item))
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function ensureUniqueSlug(desired: string, excludeId?: string): Promise<string> {
  const fallback = 'caso-de-exito'
  const baseSlug = slugify(desired) || fallback

  let candidate = baseSlug
  let suffix = 2

  while (true) {
    const existing = await prisma.caseStudy.findUnique({ where: { slug: candidate } })

    if (!existing || existing.id === excludeId) {
      return candidate
    }

    candidate = `${baseSlug}-${suffix}`
    suffix += 1
  }
}

function serializeMetrics(metricas: Metric[]): string | null {
  if (!metricas.length) {
    return null
  }

  return serializeJson(metricas)
}

function formatCaseStudy(caseStudy: {
  id: string
  titulo: string
  slug: string
  resumen: string
  contenido: string
  metricas: string | null
  fotos: string
  publicado: boolean
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: caseStudy.id,
    titulo: caseStudy.titulo,
    slug: caseStudy.slug,
    resumen: caseStudy.resumen,
    contenido: caseStudy.contenido,
    metricas: parseMetrics(parseJson(caseStudy.metricas) ?? []),
    fotos: parseStringArray(caseStudy.fotos),
    publicado: caseStudy.publicado,
    createdAt: caseStudy.createdAt,
    updatedAt: caseStudy.updatedAt,
  }
}

function revalidateCaseStudyPaths(slug?: string) {
  try {
    revalidatePath('/blog')
    revalidatePath('/blog/[slug]')
    if (slug) {
      revalidatePath(`/blog/${slug}`)
    }
    revalidatePath('/admin')
  } catch (error) {
    console.error('Error al revalidar las rutas del blog', error)
  }
}

export async function GET() {
  try {
    await requireAdmin()
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse()
    }

    throw error
  }

  const caseStudies = await prisma.caseStudy.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({
    items: caseStudies.map((caseStudy) => formatCaseStudy(caseStudy)),
  })
}

export async function POST(req: Request) {
  try {
    await requireAdmin()
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse()
    }

    throw error
  }

  const body = (await req.json()) as CaseStudyPayload
  const titulo = body.titulo?.trim()
  const resumen = body.resumen?.trim()
  const contenido = body.contenido?.trim()

  if (!titulo || !resumen || !contenido) {
    return badRequestResponse('Faltan datos obligatorios para crear la noticia.')
  }

  const metricas = parseMetrics(body.metricas)
  const fotos = parseFotos(body.fotos)
  const publicado = Boolean(body.publicado)

  const desiredSlug = body.slug?.trim() || titulo
  const uniqueSlug = await ensureUniqueSlug(desiredSlug)

  const created = await prisma.caseStudy.create({
    data: {
      titulo,
      resumen,
      contenido,
      slug: uniqueSlug,
      metricas: serializeMetrics(metricas),
      fotos: serializeStringArray(fotos),
      publicado,
    },
  })

  revalidateCaseStudyPaths(created.slug)

  return NextResponse.json({ item: formatCaseStudy(created) }, { status: 201 })
}

export async function PUT(req: Request) {
  try {
    await requireAdmin()
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse()
    }

    throw error
  }

  const body = (await req.json()) as CaseStudyPayload
  const id = body.id

  if (!id) {
    return badRequestResponse('Falta el identificador de la noticia.')
  }

  const existing = await prisma.caseStudy.findUnique({ where: { id } })

  if (!existing) {
    return NextResponse.json({ error: 'Noticia no encontrada.' }, { status: 404 })
  }

  const titulo = body.titulo?.trim() || existing.titulo
  const resumen = body.resumen?.trim() || existing.resumen
  const contenido = body.contenido?.trim() || existing.contenido
  const metricas = body.metricas ? parseMetrics(body.metricas) : parseMetrics(parseJson(existing.metricas) ?? [])
  const fotos = body.fotos ? parseFotos(body.fotos) : parseStringArray(existing.fotos)
  const publicado = body.publicado !== undefined ? Boolean(body.publicado) : existing.publicado

  const desiredSlug = body.slug?.trim() || existing.slug
  const uniqueSlug = await ensureUniqueSlug(desiredSlug, existing.id)
  const previousSlug = existing.slug

  const updated = await prisma.caseStudy.update({
    where: { id },
    data: {
      titulo,
      resumen,
      contenido,
      slug: uniqueSlug,
      metricas: serializeMetrics(metricas),
      fotos: serializeStringArray(fotos),
      publicado,
    },
  })

  revalidateCaseStudyPaths(updated.slug)
  if (previousSlug !== updated.slug) {
    revalidateCaseStudyPaths(previousSlug)
  }

  return NextResponse.json({ item: formatCaseStudy(updated) })
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin()
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse()
    }

    throw error
  }

  const { searchParams } = new URL(req.url)
  const idFromQuery = searchParams.get('id') ?? undefined
  const body = idFromQuery ? null : ((await req.json().catch(() => null)) as CaseStudyPayload | null)
  const id = idFromQuery ?? body?.id

  if (!id) {
    return badRequestResponse('Falta el identificador de la noticia.')
  }

  const existing = await prisma.caseStudy.findUnique({ where: { id } })

  if (!existing) {
    return NextResponse.json({ error: 'Noticia no encontrada.' }, { status: 404 })
  }

  await prisma.caseStudy.delete({ where: { id } })

  revalidateCaseStudyPaths(existing.slug)

  return NextResponse.json({ ok: true })
}
