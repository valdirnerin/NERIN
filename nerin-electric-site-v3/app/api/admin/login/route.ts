import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
export async function POST(req: Request){
  const { username, password } = await req.json()
  const u = process.env.ADMIN_USER || 'valdir'
  const p = process.env.ADMIN_PASS || 'superstrongpassword'
  if (username === u && password === p) {
    const session = await getSession()
    session.user = { role: 'admin', name: username }
    await session.save()
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
}
