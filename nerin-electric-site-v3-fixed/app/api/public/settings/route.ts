import { NextResponse } from 'next/server'
import { getContentStore } from '@/lib/content-store'

export async function GET() {
  const store = getContentStore()
  const settings = await store.getSettings()
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
