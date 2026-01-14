'use client'

import { useEffect } from 'react'
import { initTracking, trackEvent } from '@/lib/tracking'

type TrackingProviderProps = {
  config?: Parameters<typeof initTracking>[0]
}

type TrackableElement = HTMLElement & {
  dataset: {
    track?: string
    contentName?: string
    contentType?: string
    value?: string
    currency?: string
    planTier?: string
    channel?: string
  }
}

export function TrackingProvider({ config }: TrackingProviderProps) {
  useEffect(() => {
    initTracking(config)

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) {
        return
      }

      const trackTarget = target.closest('[data-track]') as TrackableElement | null
      if (!trackTarget) {
        return
      }

      const trackType = trackTarget.dataset.track
      if (!trackType) {
        return
      }

      const payload = {
        content_name: trackTarget.dataset.contentName,
        content_type: trackTarget.dataset.contentType,
        value: trackTarget.dataset.value ? Number(trackTarget.dataset.value) : undefined,
        currency: trackTarget.dataset.currency,
        plan_tier: trackTarget.dataset.planTier,
        channel: trackTarget.dataset.channel,
      }

      switch (trackType) {
        case 'whatsapp':
          trackEvent('generate_lead', {
            ...payload,
            content_type: payload.content_type ?? 'whatsapp',
            channel: payload.channel ?? 'whatsapp',
          })
          break
        case 'lead':
          trackEvent('generate_lead', { ...payload, content_type: payload.content_type ?? 'lead' })
          break
        case 'schedule':
          trackEvent('book_appointment', { ...payload, content_type: payload.content_type ?? 'schedule' })
          break
        case 'view_pack':
          trackEvent('view_item', { ...payload, content_type: payload.content_type ?? 'pack' })
          break
        case 'begin_checkout':
          trackEvent('begin_checkout', { ...payload, content_type: payload.content_type ?? 'checkout' })
          break
        case 'purchase':
          trackEvent('purchase', { ...payload, content_type: payload.content_type ?? 'purchase' })
          break
        default:
          trackEvent(trackType, payload)
      }
    }

    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [config])

  return null
}
