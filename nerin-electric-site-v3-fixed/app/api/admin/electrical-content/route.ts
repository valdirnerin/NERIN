import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { getAdminTechnicalStatus } from '@/lib/admin-technical-status'
import {
  getElectricalAdminContentState,
  saveElectricalAdminContent,
} from '@/lib/electrical-admin-content'

export const runtime = 'nodejs'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function GET() {
  try {
    await requireAdmin()
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') return unauthorized()
    throw error
  }

  const state = await getElectricalAdminContentState()
  return NextResponse.json(state)
}

export async function PUT(req: Request) {
  try {
    await requireAdmin()
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') return unauthorized()
    throw error
  }

  const technicalStatus = getAdminTechnicalStatus()
  if (!technicalStatus.dbPersistent) {
    return NextResponse.json(
      {
        ok: false,
        persisted: false,
        error: 'La base de datos no es persistente. No se guardaron cambios para evitar un guardado falso.',
        technicalStatus,
      },
      { status: 503 },
    )
  }

  const body = await req.json()
  await saveElectricalAdminContent(body)
  revalidatePath('/trabajos-electricos')
  revalidatePath('/admin/contenido')
  revalidatePath('/admin/contenido/trabajos-electricos')
  revalidatePath('/admin/trabajos-electricos')
  return NextResponse.json({ ok: true, persisted: true, technicalStatus })
}
