import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getStorageDir } from '@/lib/content'

export async function GET() {
  const storage = getStorageDir()
  const fp = path.join(storage, 'calculator.json')
  if (!fs.existsSync(fp)) return NextResponse.json({ currency: 'ARS', items: [] })
  const j = JSON.parse(fs.readFileSync(fp, 'utf8'))
  return NextResponse.json(j)
}
