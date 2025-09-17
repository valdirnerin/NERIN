import { NextResponse } from 'next/server'
import { getStorageDir } from '@/lib/content'
import { requireAdmin } from '@/lib/auth'
import fs from 'fs'
import path from 'path'
function filePath(){ const storage = getStorageDir(); return path.join(storage, 'pricing.json') }
export async function GET(){ const p=filePath(); if(!fs.existsSync(p)) return NextResponse.json({plans:[]}); const j=JSON.parse(fs.readFileSync(p,'utf8')); return NextResponse.json(j) }
export async function POST(req: Request){ await requireAdmin(); const body = await req.json(); fs.writeFileSync(filePath(), JSON.stringify(body,null,2)); return NextResponse.json({ ok: true }) }
