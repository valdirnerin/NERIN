import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { readSite, writeSite } from '@/lib/content'
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

  return NextResponse.json(readSite())
}

export async function POST(req: Request) {
  await requireAdmin()
  const body = await req.json()
  writeSite(body)
  revalidatePath('/')
  revalidatePath('/contacto')
  revalidatePath('/empresa')
  revalidatePath('/obras')
  revalidatePath('/blog')
  revalidatePath('/packs')
  revalidatePath('/mantenimiento')
  return NextResponse.json({ ok: true })
}
