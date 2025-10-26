export interface WizardPack {
  id: string
  slug: string
  name: string
  description: string
  scope: string
  features: string[]
  basePrice: number
  advancePrice: number
}

export interface WizardAdditional {
  id: string
  nombre: string
  descripcion: string
  unidad: string
  precioUnitarioManoObra: number
  reglasCompatibilidad?: Record<string, unknown> | null
  packId?: string | null
}

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
