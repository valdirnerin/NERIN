import type { SiteExperience } from '@/types/site'
import { SITE_DEFAULTS } from '@/lib/content'
import { getContentStore } from '@/lib/content-store'

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
  try {
    const store = getContentStore()
    return await store.getSettings()
  } catch (error) {
    return DEFAULT_SETTINGS
  }
}
