'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { writeAttribution } from '@/lib/tracking'

export function AttributionCapture() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!searchParams) {
      return
    }

    const utmSource = searchParams.get('utm_source') || undefined
    const utmMedium = searchParams.get('utm_medium') || undefined
    const utmCampaign = searchParams.get('utm_campaign') || undefined
    const utmTerm = searchParams.get('utm_term') || undefined
    const utmContent = searchParams.get('utm_content') || undefined
    const fbclid = searchParams.get('fbclid') || undefined
    const gclid = searchParams.get('gclid') || undefined

    const payload = {
      ...(utmSource ? { utmSource } : {}),
      ...(utmMedium ? { utmMedium } : {}),
      ...(utmCampaign ? { utmCampaign } : {}),
      ...(utmTerm ? { utmTerm } : {}),
      ...(utmContent ? { utmContent } : {}),
      ...(fbclid ? { fbclid } : {}),
      ...(gclid ? { gclid } : {}),
      landingPage: window.location.pathname + window.location.search,
      referrer: document.referrer || undefined,
    }

    writeAttribution(payload)
  }, [searchParams])

  return null
}
