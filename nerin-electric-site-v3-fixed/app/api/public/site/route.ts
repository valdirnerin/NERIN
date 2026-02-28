import { NextResponse } from 'next/server'
import { SITE_DEFAULTS } from '@/lib/content'
import { getSettings } from '@/lib/siteSettings'

export const dynamic = 'force-dynamic'

export async function GET() {
  const settings = await getSettings()
  return NextResponse.json(settings.siteExperience ?? SITE_DEFAULTS)
}
