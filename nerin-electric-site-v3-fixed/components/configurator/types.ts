import { AdditionalItem, Pack } from '@prisma/client'

export type WizardPack = Pick<Pack, 'id' | 'slug' | 'nombre' | 'descripcion' | 'bocasIncluidas' | 'ambientesReferencia' | 'precioManoObraBase'> & {
  alcanceDetallado: string[]
}

export type WizardAdditional = Pick<
  AdditionalItem,
  'id' | 'nombre' | 'descripcion' | 'unidad' | 'precioUnitarioManoObra' | 'reglasCompatibilidad'
> & { packId?: string | null }

export interface WizardSummary {
  packId: string
  ambientes: number
  bocasExtra: number
  adicionales: Array<{
    id: string
    cantidad: number
  }>
  comentarios?: string
}
