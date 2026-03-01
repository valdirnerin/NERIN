import { NextResponse } from 'next/server'
import { geocodeAddress } from '@/lib/geocoding'
import { resolveZoneByCoordinates } from '@/lib/service-area'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') ?? ''

  if (query.trim().length < 5) {
    return NextResponse.json({ candidates: [] })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    const candidates = await geocodeAddress(query, controller.signal)
    const enriched = candidates.map((candidate) => ({
      ...candidate,
      zone: resolveZoneByCoordinates(candidate.lat, candidate.lng),
    }))

    return NextResponse.json({ candidates: enriched })
  } catch (error) {
    console.error('[GEO] Failed to resolve address', { query, error })
    return NextResponse.json(
      {
        error: 'No pudimos ubicar esa dirección en este momento. Revisá calle y altura e intentá nuevamente.',
      },
      { status: 502 },
    )
  } finally {
    clearTimeout(timeout)
  }
}
