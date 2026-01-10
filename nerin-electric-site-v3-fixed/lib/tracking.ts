export type AttributionData = {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  fbclid?: string
  gclid?: string
  landingPage?: string
  referrer?: string
}

const STORAGE_KEY = 'nerin_attribution'

export function readAttribution(): AttributionData {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return {}
    }
    return JSON.parse(raw) as AttributionData
  } catch (error) {
    return {}
  }
}

export function writeAttribution(next: AttributionData) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const current = readAttribution()
    const merged = { ...current, ...next }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
  } catch (error) {
    console.warn('[TRACKING] Failed to store attribution', error)
  }
}

export function trackLeadEvent() {
  if (typeof window === 'undefined') {
    return
  }

  if (typeof (window as any).fbq === 'function') {
    ;(window as any).fbq('track', 'Lead')
  }

  if (typeof (window as any).gtag === 'function') {
    ;(window as any).gtag('event', 'generate_lead', { event_category: 'lead', event_label: 'form' })
  }
}
