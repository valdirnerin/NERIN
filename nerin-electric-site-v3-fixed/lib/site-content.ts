import { SITE_DEFAULTS, readSite, writeSite } from '@/lib/content'
import type { SiteExperience } from '@/types/site'

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

export function getSiteContent(): SiteExperience {
  const raw = readSite()
  return mergeSite(SITE_DEFAULTS, raw)
}

export function saveSiteContent(payload: SiteExperience) {
  writeSite(payload)
}

export function getWhatsappHref(site: SiteExperience): string {
  return `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(site.contact.whatsappMessage)}`
}
