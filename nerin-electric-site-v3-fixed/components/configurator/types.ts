export interface WizardPack {
  id: string
  slug: string
  nombre: string
  descripcion: string
  alcanceDetallado: string[]
  bocasIncluidas: number
  ambientesReferencia: number
  precioManoObraBase: number
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
