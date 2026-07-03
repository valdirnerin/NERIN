import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import {
  getElectricalAdminContent,
  saveElectricalAdminContent,
} from '@/lib/electrical-admin-content'

export const runtime = 'nodejs'

export async function GET() {
  await requireAdmin()
  const content = await getElectricalAdminContent()
  return NextResponse.json(content)
}

export async function PUT(req: Request) {
  await requireAdmin()
  const body = await req.json()
  await saveElectricalAdminContent(body)
  revalidatePath('/trabajos-electricos')
  revalidatePath('/admin/trabajos-electricos')
  return NextResponse.json({ ok: true })
}
