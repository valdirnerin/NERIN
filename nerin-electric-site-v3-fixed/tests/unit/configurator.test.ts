import { describe, expect, it } from 'vitest'
import { calculateTotals } from '@/components/configurator/calculations'
import type { WizardAdditional, WizardPack, WizardSummary } from '@/components/configurator/types'

const pack: WizardPack = {
  id: 'pack-1',
  slug: 'pack-1',
  nombre: 'Vivienda Estándar',
  descripcion: 'Pack base',
  bocasIncluidas: 60,
  ambientesReferencia: 6,
  precioManoObraBase: 2500000,
  alcanceDetallado: ['Item'],
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
  it('calcula totales de mano de obra', () => {
    const summary: WizardSummary = {
      packId: pack.id,
      ambientes: 6,
      bocasExtra: 10,
      adicionales: [{ id: 'add-1', cantidad: 3 }],
    }

    const totals = calculateTotals({ pack, adicionales, summary })
    expect(totals.subtotalPack).toBe(2500000)
    expect(totals.totalManoObra).toBe(2500000 + 3 * 42000)
    expect(totals.adicionales[0].subtotal).toBe(3 * 42000)
  })
})
