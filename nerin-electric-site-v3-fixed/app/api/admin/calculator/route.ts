import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getStorageDir } from '@/lib/content'
import { requireAdmin } from '@/lib/auth'

function filePath(){ const storage = getStorageDir(); return path.join(storage, 'calculator.json') }

export async function GET(){
  const fp = filePath()
  if (!fs.existsSync(fp)) return NextResponse.json({ currency:'ARS', items: [] })
  return NextResponse.json(JSON.parse(fs.readFileSync(fp,'utf8')))
}

export async function POST(req: Request){
  await requireAdmin()
  const body = await req.json()
  fs.writeFileSync(filePath(), JSON.stringify(body, null, 2))
  return NextResponse.json({ ok: true })
}
