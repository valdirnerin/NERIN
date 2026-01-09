import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const planSlug = searchParams.get('plan')
  const target = new URL('/presupuesto', origin)
  target.searchParams.set('tipo', 'mantenimiento')
  if (planSlug) {
    target.searchParams.set('plan', planSlug)
  }
  return NextResponse.redirect(target.toString())
}
