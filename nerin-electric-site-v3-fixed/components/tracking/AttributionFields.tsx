'use client'

import { useEffect, useState } from 'react'
import type { AttributionData } from '@/lib/tracking'
import { readAttribution } from '@/lib/tracking'

export function AttributionFields() {
  const [data, setData] = useState<AttributionData>({})

  useEffect(() => {
    setData(readAttribution())
  }, [])

  return (
    <>
      <input type="hidden" name="utmSource" value={data.utmSource ?? ''} />
      <input type="hidden" name="utmMedium" value={data.utmMedium ?? ''} />
      <input type="hidden" name="utmCampaign" value={data.utmCampaign ?? ''} />
      <input type="hidden" name="utmTerm" value={data.utmTerm ?? ''} />
      <input type="hidden" name="utmContent" value={data.utmContent ?? ''} />
      <input type="hidden" name="fbclid" value={data.fbclid ?? ''} />
      <input type="hidden" name="gclid" value={data.gclid ?? ''} />
      <input type="hidden" name="landingPage" value={data.landingPage ?? ''} />
      <input type="hidden" name="referrer" value={data.referrer ?? ''} />
    </>
  )
}
