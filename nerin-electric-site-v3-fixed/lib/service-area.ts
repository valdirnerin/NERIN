export type ZoneTier = 'PRIORITY' | 'STANDARD' | 'EXTENDED' | 'REVIEW'

export type ZoneResolution = {
  tier: ZoneTier
  label: string
  area: string
}

type Coordinate = [number, number]

type ZonePolygon = {
  tier: Exclude<ZoneTier, 'REVIEW'>
  label: string
  area: string
  polygon: Coordinate[]
}

const zonePolygons: ZonePolygon[] = [
  {
    tier: 'PRIORITY',
    label: 'Zona prioritaria',
    area: 'CABA núcleo y primer cordón inmediato',
    polygon: [
      [-58.54, -34.71],
      [-58.33, -34.71],
      [-58.27, -34.57],
      [-58.29, -34.49],
      [-58.39, -34.52],
      [-58.47, -34.55],
      [-58.54, -34.62],
      [-58.54, -34.71],
    ],
  },
  {
    tier: 'STANDARD',
    label: 'Zona estándar',
    area: 'CABA + GBA cercano',
    polygon: [
      [-58.72, -34.84],
      [-58.20, -34.84],
      [-58.15, -34.63],
      [-58.21, -34.45],
      [-58.49, -34.38],
      [-58.69, -34.50],
      [-58.72, -34.84],
    ],
  },
  {
    tier: 'EXTENDED',
    label: 'Zona extendida',
    area: 'GBA ampliado',
    polygon: [
      [-58.92, -34.96],
      [-58.12, -34.96],
      [-58.08, -34.62],
      [-58.18, -34.36],
      [-58.57, -34.30],
      [-58.89, -34.47],
      [-58.92, -34.96],
    ],
  },
]

export const serviceAreaBounds = {
  west: -58.92,
  south: -34.96,
  east: -58.12,
  north: -34.36,
}

function pointInPolygon(lng: number, lat: number, polygon: Coordinate[]) {
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]

    const intersects = yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi

    if (intersects) inside = !inside
  }

  return inside
}

export function resolveZoneByCoordinates(lat: number, lng: number): ZoneResolution {
  const zone = zonePolygons.find((candidate) => pointInPolygon(lng, lat, candidate.polygon))

  if (!zone) {
    return {
      tier: 'REVIEW',
      label: 'Fuera de cobertura / revisión manual',
      area: 'No coincide con las áreas de cobertura actuales',
    }
  }

  return { tier: zone.tier, label: zone.label, area: zone.area }
}

export function getZoneTierLabel(tier: ZoneTier) {
  switch (tier) {
    case 'PRIORITY':
      return 'Zona prioritaria'
    case 'STANDARD':
      return 'Zona estándar'
    case 'EXTENDED':
      return 'Zona extendida'
    case 'REVIEW':
      return 'Fuera de cobertura / revisión manual'
  }
}

export function getZoneBadgeClasses(tier: ZoneTier) {
  switch (tier) {
    case 'PRIORITY':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300'
    case 'STANDARD':
      return 'bg-sky-100 text-sky-800 border-sky-300'
    case 'EXTENDED':
      return 'bg-amber-100 text-amber-800 border-amber-300'
    case 'REVIEW':
      return 'bg-rose-100 text-rose-800 border-rose-300'
  }
}
