import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getSiteContent, saveSiteContent } from '@/lib/site-content'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdmin()
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    throw error
  }

  const site = await getSiteContent()
  return NextResponse.json(site)
}

export async function POST(req: Request) {
  await requireAdmin()
  const body = await req.json()
  await saveSiteContent(body)
  revalidatePath('/admin')
  revalidatePath('/')
  revalidatePath('/contacto')
  revalidatePath('/empresa')
  revalidatePath('/obras')
  revalidatePath('/blog')
  revalidatePath('/packs')
  revalidatePath('/mantenimiento')
  return NextResponse.json({ ok: true, site: body })
}
