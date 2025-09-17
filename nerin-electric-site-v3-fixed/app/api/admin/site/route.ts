import { NextResponse } from 'next/server'
import { readSite, writeSite } from '@/lib/content'
import { requireAdmin } from '@/lib/auth'
export async function GET(){ return NextResponse.json(readSite()) }
export async function POST(req: Request){ await requireAdmin(); const body = await req.json(); writeSite(body); return NextResponse.json({ ok: true }) }
