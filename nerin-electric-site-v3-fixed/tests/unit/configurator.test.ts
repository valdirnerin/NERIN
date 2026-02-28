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
  it('calcula totales para modo asistido con recargos', () => {
    const summary: WizardSummary = {
      mode: 'ASSISTED',
      serviceId: 'reforma-parcial',
      zoneTier: 'SECONDARY',
      urgencyMultiplier: 1.1,
      difficultyMultiplier: 1,
      packId: pack.id,
      ambientes: 6,
      bocasExtra: 10,
      adicionales: [{ id: 'add-1', cantidad: 3 }],
      professionalItems: [],
    }

    const totals = calculateTotals({ pack, adicionales, summary, services: quoteServices, catalog: professionalCatalog })
    expect(totals.totalManoObra).toBeGreaterThan(2500000 + 3 * 42000)
    expect(totals.requiresSurvey).toBe(true)
  })

  it('usa el mismo motor para profesional', () => {
    const summary: WizardSummary = {
      mode: 'PROFESSIONAL',
      serviceId: 'reforma-parcial',
      zoneTier: 'PRIORITY',
      urgencyMultiplier: 1,
      difficultyMultiplier: 1,
      packId: pack.id,
      ambientes: 0,
      bocasExtra: 0,
      adicionales: [],
      professionalItems: [{ id: 'boca-iluminacion', cantidad: 2 }],
    }

    const totals = calculateTotals({ pack, adicionales, summary, services: quoteServices, catalog: professionalCatalog })
    expect(totals.adicionales[0].nombre).toContain('Bocas de iluminación')
  })
})
