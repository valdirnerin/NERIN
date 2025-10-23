import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { readMarkdown, writeMarkdown, deleteMarkdown } from '@/lib/content'
import { requireAdmin } from '@/lib/auth'

class RevalidationError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message)
    this.name = 'RevalidationError'
  }
}

function revalidateBlogPaths(slug: string) {
  try {
    revalidatePath('/blog')
    revalidatePath(`/blog/${slug}`)
  } catch (error) {
    throw new RevalidationError('Blog revalidation failed', error)
  }
}

function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function GET(req: Request) {
  try {
    await requireAdmin()
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse()
    }

    throw error
  }

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'blog'
  const slug = searchParams.get('slug')!
  const item = readMarkdown(type, slug)
  return NextResponse.json(item || { data: {}, content: '' })
}

export async function POST(req: Request) {
  await requireAdmin()
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'blog'
  const slug = searchParams.get('slug')!
  const body = await req.json()

  try {
    writeMarkdown(type, slug, body.data, body.content)

    if (type === 'blog') {
      revalidateBlogPaths(slug)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof RevalidationError) {
      console.error(`Error revalidating blog content for slug "${slug}"`, error.cause ?? error)
      return NextResponse.json(
        { ok: false, error: 'No se pudo refrescar el contenido del blog. Intentá nuevamente.' },
        { status: 500 },
      )
    }

    console.error(`Error saving markdown content for slug "${slug}"`, error)
    return NextResponse.json(
      { ok: false, error: 'No se pudo guardar el contenido. Intentá nuevamente.' },
      { status: 500 },
    )
  }
}

export async function DELETE(req: Request) {
  await requireAdmin()
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'blog'
  const slug = searchParams.get('slug')!
  try {
    deleteMarkdown(type, slug)

    if (type === 'blog') {
      revalidateBlogPaths(slug)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof RevalidationError) {
      console.error(`Error revalidating blog content after deleting slug "${slug}"`, error.cause ?? error)
      return NextResponse.json(
        { ok: false, error: 'No se pudo refrescar el contenido del blog. Intentá nuevamente.' },
        { status: 500 },
      )
    }

    console.error(`Error deleting markdown content for slug "${slug}"`, error)
    return NextResponse.json(
      { ok: false, error: 'No se pudo eliminar el contenido. Intentá nuevamente.' },
      { status: 500 },
    )
  }
}
