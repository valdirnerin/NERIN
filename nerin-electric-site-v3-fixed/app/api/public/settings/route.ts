import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/siteSettings'

export const dynamic = 'force-dynamic'

export async function GET() {
  const settings = await getSettings()
  return NextResponse.json({
    companyName: settings.companyName,
    industry: settings.industry,
    whatsappNumber: settings.whatsappNumber,
    whatsappMessage: settings.whatsappMessage,
    emailContacto: settings.emailContacto,
    zone: settings.zone,
    schedule: settings.schedule,
    primaryCopy: settings.primaryCopy,
    metrics: settings.metrics,
  })
}
