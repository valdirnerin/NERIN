import { serviceAreaBounds } from '@/lib/service-area'

export type GeocodeCandidate = {
  displayName: string
  lat: number
  lng: number
}

const CABA_EXPANSIONS: Record<string, string> = {
  caba: 'Ciudad Autónoma de Buenos Aires',
  bsas: 'Buenos Aires',
  gba: 'Gran Buenos Aires',
}

export function normalizeAddressQuery(input: string) {
  const trimmed = input.trim()
  if (!trimmed) return ''

  const normalizedTokens = trimmed
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((token) => {
      const cleanToken = token
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
      const expansion = CABA_EXPANSIONS[cleanToken.toLowerCase()]
      return expansion ?? token
    })

  const joined = normalizedTokens.join(' ')
  if (/argentina/i.test(joined)) return joined

  return `${joined}, Argentina`
}

export async function geocodeAddress(query: string, signal?: AbortSignal): Promise<GeocodeCandidate[]> {
  const normalized = normalizeAddressQuery(query)
  if (normalized.length < 5) return []

  const params = new URLSearchParams({
    format: 'jsonv2',
    addressdetails: '1',
    limit: '5',
    countrycodes: 'ar',
    bounded: '1',
    viewbox: `${serviceAreaBounds.west},${serviceAreaBounds.north},${serviceAreaBounds.east},${serviceAreaBounds.south}`,
    q: normalized,
  })

  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'es-AR,es;q=0.9',
      'User-Agent': 'nerin-electric-site/1.0',
    },
    signal,
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Geocoding request failed with status ${response.status}`)
  }

  const payload = (await response.json()) as Array<{ display_name: string; lat: string; lon: string }>

  return payload
    .map((item) => ({
      displayName: item.display_name,
      lat: Number(item.lat),
      lng: Number(item.lon),
    }))
    .filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng))
}
