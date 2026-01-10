import { NextResponse } from 'next/server'
import { getContentStore } from '@/lib/content-store'

export async function GET() {
  const store = getContentStore()
  const settings = await store.getSettings()
  return NextResponse.json(settings.siteExperience)
}
