'use client'

import { useEffect } from 'react'
import type { TrackingPayload } from '@/lib/tracking'
import { trackEvent } from '@/lib/tracking'

type TrackEventOnLoadProps = {
  eventName: string
  payload?: TrackingPayload
}

export function TrackEventOnLoad({ eventName, payload }: TrackEventOnLoadProps) {
  useEffect(() => {
    trackEvent(eventName, payload ?? {})
  }, [eventName, payload])

  return null
}
