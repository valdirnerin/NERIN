import { zoneDefinitions } from './catalog'
import { ZoneTier } from './types'

const NERIN_BASE = { lat: -34.6037, lng: -58.3816 }

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRadians = (value: number) => (value * Math.PI) / 180
  const earthRadiusKm = 6371
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadiusKm * c
}

export function resolveZoneByCoordinates(lat: number, lng: number): { tier: ZoneTier; label: string } {
  const distance = haversineKm(NERIN_BASE.lat, NERIN_BASE.lng, lat, lng)
  const match = zoneDefinitions.find((zone) => distance <= zone.maxDistanceKm)

  if (match) {
    return { tier: match.tier, label: `${match.label} · ${distance.toFixed(1)} km` }
  }

  if (distance <= 55) {
    return { tier: 'REVIEW', label: `Fuera de cobertura inmediata · ${distance.toFixed(1)} km` }
  }

  return { tier: 'REVIEW', label: 'Fuera de cobertura / revisión manual' }
}

export function getZoneTierLabel(tier: ZoneTier) {
  switch (tier) {
    case 'PRIORITY':
      return 'Prioritaria'
    case 'STANDARD':
      return 'Estándar'
    case 'EXTENDED':
      return 'Extendida'
    case 'REVIEW':
      return 'Fuera de cobertura / revisión manual'
  }
}
