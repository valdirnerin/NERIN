import { SITE_DEFAULTS } from '@/lib/content'
import type { SiteExperience } from '@/types/site'
import { getContentStore } from '@/lib/content-store'
import { fetchPublicJson } from '@/lib/public-api'
import { getSettings } from '@/lib/siteSettings'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function cloneDefaults(defaults: SiteExperience): SiteExperience {
  return JSON.parse(JSON.stringify(defaults))
}

function mergeSite(defaults: SiteExperience, incoming: unknown): SiteExperience {
  const target = cloneDefaults(defaults)

  if (!isRecord(incoming)) {
    return target
  }

  const merge = (base: any, patch: any): any => {
    if (Array.isArray(base)) {
      if (Array.isArray(patch)) {
        return patch
      }
      return base
    }

    if (isRecord(base)) {
      const result: Record<string, unknown> = { ...base }
      if (isRecord(patch)) {
        for (const [key, value] of Object.entries(patch)) {
          if (key in base) {
            result[key] = merge((base as Record<string, unknown>)[key], value)
          } else {
            result[key] = value
          }
        }
      }
      return result
    }

    return patch ?? base
  }

  return merge(target, incoming) as SiteExperience
}

export async function getSiteContent(): Promise<SiteExperience> {
  try {
    const site = await fetchPublicJson<SiteExperience>('/api/public/site')
    return mergeSite(SITE_DEFAULTS, site)
  } catch (error) {
    const settings = await getSettings()
    const raw = settings?.siteExperience ?? SITE_DEFAULTS
    return mergeSite(SITE_DEFAULTS, raw)
  }
}

export async function saveSiteContent(payload: SiteExperience) {
  const store = getContentStore()
  const current = await store.getSettings()
  const nextSettings = {
    ...current,
    companyName: payload.name,
    whatsappNumber: payload.contact.whatsappNumber,
    whatsappMessage: payload.contact.whatsappMessage,
    emailContacto: payload.contact.email,
    zone: payload.contact.serviceArea,
    schedule: payload.contact.schedule,
    primaryCopy: payload.tagline,
    metrics: payload.trust.metrics.map((metric) => ({ label: metric.label, value: metric.value })),
    siteExperience: payload,
  }
  await store.saveSettings(nextSettings)
}

export function getWhatsappHref(site: SiteExperience): string {
  return `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(site.contact.whatsappMessage)}`
}
