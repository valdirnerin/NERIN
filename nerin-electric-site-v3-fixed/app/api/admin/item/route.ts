import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getContentStore } from '@/lib/content-store'
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
  const store = getContentStore()

  if (type === 'blog') {
    const post = await store.getPost(slug)
    if (!post) {
      return NextResponse.json({ data: {}, content: '' })
    }
    return NextResponse.json({
      data: {
        title: post.title,
        excerpt: post.excerpt,
        publishedAt: post.publishedAt ?? undefined,
        heroImage: post.coverImage ?? undefined,
      },
      content: post.content,
    })
  }

  return NextResponse.json({ data: {}, content: '' })
}

export async function POST(req: Request) {
  await requireAdmin()
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'blog'
  const slug = searchParams.get('slug')!
  const body = await req.json()
  const store = getContentStore()

  try {
    if (type === 'blog') {
      await store.upsertPost({
        slug,
        title: body.data?.title ?? '',
        excerpt: body.data?.excerpt ?? '',
        content: body.content ?? '',
        coverImage: body.data?.heroImage ?? null,
        publishedAt: body.data?.publishedAt ?? null,
      })
    }

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
  const store = getContentStore()
  try {
    if (type === 'blog') {
      const post = await store.getPost(slug)
      if (post?.id) {
        await store.deletePost(post.id)
      }
    }

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
