import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
export async function POST(req: Request){
  const { username, password } = await req.json()
  const u = process.env.ADMIN_USER || 'valdir'
  const p = process.env.ADMIN_PASS || 'superstrongpassword'
  if (username === u && password === p) {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Sesión no disponible' }, { status: 401 })
    }

    if (!session.user?.id) {
      return NextResponse.json({ error: 'Sesión no disponible' }, { status: 401 })
    }

    session.user = { ...session.user, role: 'admin', name: username }

    if (typeof session.save === 'function') {
      await session.save()
    }

    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
}
