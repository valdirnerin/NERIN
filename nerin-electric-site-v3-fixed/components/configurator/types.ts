export type QuoteMode = 'EXPRESS' | 'ASSISTED' | 'PROFESSIONAL'
export type ServiceFlow = 'ONLINE' | 'SURVEY'
export type ServicePath = 'PUNTUAL' | 'OBRA'
export type ZoneTier = 'PRIORITY' | 'SECONDARY' | 'REVIEW'
export type PriceKind = 'UNIT' | 'PER_POINT' | 'FIXED'

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

export interface QuoteService {
  id: string
  name: string
  description: string
  flow: ServiceFlow
  path: ServicePath
  basePrice: number
  minPrice?: number
  includes: string[]
  excludes: string[]
}

export interface QuoteCatalogItem {
  id: string
  name: string
  unit: string
  baseUnitPrice: number
  kind: PriceKind
  suggestedQty?: number
}

export interface WizardSummary {
  mode: QuoteMode
  serviceId: string
  serviceUnits: number
  zoneTier: ZoneTier
  urgencyMultiplier: number
  difficultyMultiplier: number
  packId: string
  ambientes: number
  bocasExtra: number
  adicionales: Array<{
    id: string
    cantidad: number
  }>
  professionalItems: Array<{
    id: string
    cantidad: number
  }>
  comentarios?: string
}
