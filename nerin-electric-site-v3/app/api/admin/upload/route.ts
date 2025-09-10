import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getStorageDir } from '@/lib/content'
import fs from 'fs'
import path from 'path'
export async function POST(req: Request){
  await requireAdmin()
  const form = await req.formData()
  const file = form.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  const storage = getStorageDir()
  const mediaDir = path.join(storage, 'media')
  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true })
  const arrayBuffer = await file.arrayBuffer()
  const bytes = Buffer.from(arrayBuffer)
  const safeName = (form.get('name') as string || file.name || 'upload').replace(/[^a-zA-Z0-9._-]/g,'_')
  const outPath = path.join(mediaDir, safeName)
  fs.writeFileSync(outPath, bytes)
  const url = `/media/${safeName}`
  return NextResponse.json({ ok: true, url })
}
