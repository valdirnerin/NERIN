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

export type TrackingUserData = {
  email?: string
  phone?: string
}

export type TrackingPayload = {
  content_name?: string
  content_type?: string
  value?: number
  currency?: string
  page_path?: string
  page_title?: string
  page_url?: string
  event_id?: string
  plan_tier?: string
  channel?: string
  user_data?: TrackingUserData
}

export type TrackingConfig = {
  gtmId?: string
  ga4MeasurementId?: string
  metaPixelId?: string
  metaCapiEnabled?: boolean
  googleAdsConversionId?: string
  googleAdsConversionLabelLead?: string
  googleAdsConversionLabelSchedule?: string
  googleAdsConversionLabelWhatsapp?: string
  currency?: string
}

const STORAGE_KEY = 'nerin_attribution'
const META_EVENT_MAP: Record<string, string> = {
  view_item: 'ViewContent',
  generate_lead: 'Lead',
  book_appointment: 'Schedule',
  begin_checkout: 'InitiateCheckout',
  purchase: 'Purchase',
}

const DEFAULT_CURRENCY = 'ARS'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    fbq?: (...args: any[]) => void
    gtag?: (...args: any[]) => void
    __trackingConfig?: TrackingConfig
  }
}

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

export function initTracking(config?: TrackingConfig) {
  if (typeof window === 'undefined') {
    return
  }

  window.dataLayer = window.dataLayer || []
  if (config) {
    window.__trackingConfig = { ...window.__trackingConfig, ...config }
  }
}

export function trackEvent(name: string, payload: TrackingPayload = {}) {
  if (typeof window === 'undefined') {
    return
  }

  const config = window.__trackingConfig || {}
  const eventId = payload.event_id ?? createEventId()
  const pagePath = payload.page_path ?? window.location.pathname
  const pageTitle = payload.page_title ?? document.title
  const currency = payload.currency || config.currency || DEFAULT_CURRENCY
  const eventPayload = {
    page_path: pagePath,
    page_title: pageTitle,
    content_name: payload.content_name,
    content_type: payload.content_type,
    value: payload.value,
    currency,
    event_id: eventId,
    plan_tier: payload.plan_tier,
    channel: payload.channel,
  }

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event: name, ...eventPayload })

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, sanitizeEventPayload(eventPayload))
  }

  const metaEventName = META_EVENT_MAP[name] ?? name
  if (typeof window.fbq === 'function' && metaEventName) {
    window.fbq('track', metaEventName, sanitizeEventPayload(eventPayload), { eventID: eventId })
  }

  if (config.googleAdsConversionId && typeof window.gtag === 'function') {
    sendGoogleAdsConversion(name, eventPayload, config)
  }

  if (config.metaCapiEnabled) {
    void sendMetaCapiEvent({
      event_name: metaEventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      value: payload.value,
      currency,
      page_url: payload.page_url ?? window.location.href,
      user_data: payload.user_data,
    })
  }
}

function sanitizeEventPayload(payload: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined))
}

function createEventId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `evt_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

function sendGoogleAdsConversion(name: string, payload: Record<string, unknown>, config: TrackingConfig) {
  const conversionId = config.googleAdsConversionId
  if (!conversionId) {
    return
  }

  const isLead = name === 'generate_lead'
  const isSchedule = name === 'book_appointment'
  const isWhatsapp = isLead && payload.channel === 'whatsapp'

  const label = isWhatsapp
    ? config.googleAdsConversionLabelWhatsapp
    : isSchedule
      ? config.googleAdsConversionLabelSchedule
      : isLead
        ? config.googleAdsConversionLabelLead
        : undefined

  if (!label) {
    return
  }

  const sendTo = `${conversionId}/${label}`
  window.gtag?.('event', 'conversion', {
    send_to: sendTo,
    value: payload.value,
    currency: payload.currency,
  })
}

async function sendMetaCapiEvent(payload: {
  event_name: string
  event_time: number
  event_id: string
  value?: number
  currency?: string
  page_url: string
  user_data?: TrackingUserData
}) {
  try {
    await fetch('/api/meta/capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    })
  } catch (error) {
    console.warn('[TRACKING] Meta CAPI request failed', error)
  }
}
