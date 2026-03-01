import { describe, expect, it } from 'vitest'
import { calculateTotals } from '@/components/configurator/calculations'
import { professionalCatalog, quoteServices } from '@/components/configurator/catalog'
import type { WizardAdditional, WizardPack, WizardSummary } from '@/components/configurator/types'

const pack: WizardPack = {
  id: 'pack-1',
  slug: 'pack-1',
  name: 'Vivienda Estándar',
  description: 'Pack base',
  scope: 'Hasta 120 m²',
  features: ['Item'],
  basePrice: 2_500_000,
  advancePrice: 900_000,
}

const adicionales: WizardAdditional[] = [
  {
    id: 'add-1',
    nombre: 'CCTV',
    descripcion: 'Por cámara',
    unidad: 'cámara',
    precioUnitarioManoObra: 42000,
    reglasCompatibilidad: null,
    packId: null,
  },
]

describe('calculateTotals', () => {
  it('calcula totales para obra/reforma con recargos', () => {
    const summary: WizardSummary = {
      mode: 'PROJECT',
      serviceId: 'reforma-parcial',
      serviceUnits: 1,
      zoneTier: 'STANDARD',
      address: 'Av. Cabildo 2450',
      urgencyMultiplier: 1.1,
      difficultyMultiplier: 1,
      packId: pack.id,
      ambientes: 6,
      bocasExtra: 10,
      hasPlan: false,
      adicionales: [{ id: 'add-1', cantidad: 3 }],
      professionalItems: [],
      comentarios: '',
    }

    const totals = calculateTotals({ pack, adicionales, summary, services: quoteServices, catalog: professionalCatalog })
    expect(totals.totalManoObra).toBeGreaterThan(2500000 + 3 * 42000)
    expect(totals.requiresSurvey).toBe(true)
  })

  it('usa cantidades técnicas cuando tengo plano o cantidades', () => {
    const summary: WizardSummary = {
      mode: 'PROJECT',
      serviceId: 'reforma-parcial',
      serviceUnits: 1,
      zoneTier: 'PRIORITY',
      address: 'Av. Santa Fe 1000',
      urgencyMultiplier: 1,
      difficultyMultiplier: 1,
      packId: pack.id,
      ambientes: 0,
      bocasExtra: 0,
      hasPlan: true,
      adicionales: [],
      professionalItems: [{ id: 'boca-iluminacion', cantidad: 2 }],
      comentarios: '',
    }

    const totals = calculateTotals({ pack, adicionales, summary, services: quoteServices, catalog: professionalCatalog })
    expect(totals.adicionales[0].nombre).toContain('Bocas de iluminación')
  })
})
