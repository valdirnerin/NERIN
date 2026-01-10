import type { SiteExperience } from '@/types/site'
import { SITE_DEFAULTS } from '@/lib/content'
import { DB_ENABLED } from '@/lib/dbMode'
import { prisma } from '@/lib/db'
import { parseJson } from '@/lib/serialization'

export type SiteSetting = {
  id?: string
  companyName: string
  industry: string
  whatsappNumber: string
  whatsappMessage: string
  emailContacto: string
  zone: string
  schedule: string
  primaryCopy: string
  metrics: Array<{ label: string; value: string }>
  siteExperience: SiteExperience
}

export const DEFAULT_SETTINGS: SiteSetting = {
  companyName: SITE_DEFAULTS.name,
  industry: 'Instalaciones eléctricas',
  whatsappNumber: SITE_DEFAULTS.contact.whatsappNumber,
  whatsappMessage: SITE_DEFAULTS.contact.whatsappMessage,
  emailContacto: SITE_DEFAULTS.contact.email,
  zone: SITE_DEFAULTS.contact.serviceArea,
  schedule: SITE_DEFAULTS.contact.schedule,
  primaryCopy: SITE_DEFAULTS.tagline,
  metrics: SITE_DEFAULTS.trust.metrics.map((metric) => ({ label: metric.label, value: metric.value })),
  siteExperience: SITE_DEFAULTS,
}

export async function getSettings(): Promise<SiteSetting> {
  if (!DB_ENABLED) {
    return DEFAULT_SETTINGS
  }

  try {
    const record = await prisma.siteSetting.findFirst()
    if (!record) {
      return DEFAULT_SETTINGS
    }

    const siteExperience =
      parseJson<SiteExperience>(record.siteExperience) ?? DEFAULT_SETTINGS.siteExperience
    const metrics =
      parseJson<Array<{ label: string; value: string }>>(record.metrics) ?? DEFAULT_SETTINGS.metrics

    return {
      id: record.id,
      companyName: record.companyName,
      industry: record.industry,
      whatsappNumber: record.whatsappNumber,
      whatsappMessage: record.whatsappMessage,
      emailContacto: record.emailContacto,
      zone: record.zone,
      schedule: record.schedule,
      primaryCopy: record.primaryCopy,
      metrics,
      siteExperience,
    }
  } catch (error) {
    return DEFAULT_SETTINGS
  }
}
