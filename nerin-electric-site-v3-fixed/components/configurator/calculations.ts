import {
  QuoteCatalogItem,
  QuoteService,
  WizardAdditional,
  WizardPack,
  WizardSummary,
  ZoneTier,
} from './types'

const zoneMultipliers: Record<ZoneTier, number> = {
  PRIORITY: 1,
  SECONDARY: 1.12,
  REVIEW: 1.25,
}

export interface QuoteTotals {
  mode: WizardSummary['mode']
  service: QuoteService | null
  requiresSurvey: boolean
  subtotalBase: number
  adicionales: Array<{
    id: string
    nombre: string
    cantidad: number
    precioUnitario: number
    subtotal: number
  }>
  recargoZona: number
  recargoUrgencia: number
  recargoDificultad: number
  totalManoObra: number
  warning?: string
}

function buildSelectedItems({
  summary,
  adicionales,
  catalog,
}: {
  summary: WizardSummary
  adicionales: WizardAdditional[]
  catalog: QuoteCatalogItem[]
}) {
  const selected = summary.mode === 'PROFESSIONAL' ? summary.professionalItems : summary.adicionales
  const source = summary.mode === 'PROFESSIONAL'
    ? catalog.map((item) => ({
      id: item.id,
      nombre: item.name,
      precioUnitarioManoObra: item.baseUnitPrice,
    }))
    : adicionales

  return selected
    .map((item) => {
      const match = source.find((entry) => entry.id === item.id)
      if (!match || item.cantidad <= 0) return null
      const precio = Number(match.precioUnitarioManoObra)
      return {
        id: item.id,
        nombre: match.nombre,
        cantidad: item.cantidad,
        precioUnitario: precio,
        subtotal: precio * item.cantidad,
      }
    })
    .filter(Boolean) as QuoteTotals['adicionales']
}

export function calculateTotals({
  pack,
  adicionales,
  summary,
  services,
  catalog,
}: {
  pack: WizardPack | null
  adicionales: WizardAdditional[]
  summary: WizardSummary
  services: QuoteService[]
  catalog: QuoteCatalogItem[]
}): QuoteTotals {
  const service = services.find((item) => item.id === summary.serviceId) ?? null
  const selectedItems = buildSelectedItems({ summary, adicionales, catalog })
  const itemsSubtotal = selectedItems.reduce((acc, item) => acc + item.subtotal, 0)
  const packSubtotal = pack ? Number(pack.basePrice) : 0

  const subtotalBase = Math.max(
    service?.basePrice ?? 0,
    summary.mode === 'EXPRESS' ? service?.minPrice ?? 0 : packSubtotal + itemsSubtotal,
  )

  const zoneMultiplier = zoneMultipliers[summary.zoneTier] ?? 1
  const recargoZona = subtotalBase * (zoneMultiplier - 1)
  const recargoUrgencia = subtotalBase * (Math.max(summary.urgencyMultiplier, 1) - 1)
  const recargoDificultad = subtotalBase * (Math.max(summary.difficultyMultiplier, 1) - 1)
  const totalManoObra = subtotalBase + recargoZona + recargoUrgencia + recargoDificultad

  return {
    mode: summary.mode,
    service,
    requiresSurvey: service?.flow === 'SURVEY',
    subtotalBase,
    adicionales: selectedItems,
    recargoZona,
    recargoUrgencia,
    recargoDificultad,
    totalManoObra,
    warning: summary.zoneTier === 'REVIEW' ? 'Zona fuera de cobertura inmediata. Revisión comercial manual.' : undefined,
  }
}
