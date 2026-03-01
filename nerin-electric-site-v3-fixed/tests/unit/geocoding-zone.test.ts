import { describe, expect, it } from 'vitest'
import { normalizeAddressQuery } from '@/lib/geocoding'
import { resolveZoneByCoordinates } from '@/lib/service-area'

describe('address normalization', () => {
  it('expands caba shorthand and appends Argentina', () => {
    const normalized = normalizeAddressQuery('Av Cabildo 2450, CABA')
    expect(normalized).toContain('Ciudad Autónoma de Buenos Aires')
    expect(normalized).toContain('Argentina')
  })

  it('keeps explicit country untouched', () => {
    const normalized = normalizeAddressQuery('Belgrano 450, Ramos Mejía, Argentina')
    expect(normalized).toBe('Belgrano 450, Ramos Mejía, Argentina')
  })
})

describe('zone resolution', () => {
  it('resolves priority area in CABA core', () => {
    const zone = resolveZoneByCoordinates(-34.6037, -58.3816)
    expect(zone.tier).toBe('PRIORITY')
  })

  it('resolves review outside configured polygons', () => {
    const zone = resolveZoneByCoordinates(-34.1, -59.2)
    expect(zone.tier).toBe('REVIEW')
  })
})
