import { WizardAdditional, WizardPack, WizardSummary } from './types'

export interface QuoteTotals {
  subtotalPack: number
  adicionales: Array<{
    id: string
    nombre: string
    cantidad: number
    precioUnitario: number
    subtotal: number
  }>
  totalManoObra: number
  recomendado?: WizardPack
}

export function calculateTotals({
  pack,
  adicionales,
  summary,
}: {
  pack: WizardPack
  adicionales: WizardAdditional[]
  summary: WizardSummary
}): QuoteTotals {
  const subtotalPack = Number(pack.precioManoObraBase)
  const adicionalesCalculados = summary.adicionales
    .map((item) => {
      const adicional = adicionales.find((a) => a.id === item.id)
      if (!adicional) return null
      const precio = Number(adicional.precioUnitarioManoObra)
      const subtotal = precio * item.cantidad
      return {
        id: adicional.id,
        nombre: adicional.nombre,
        cantidad: item.cantidad,
        precioUnitario: precio,
        subtotal,
      }
    })
    .filter(Boolean) as QuoteTotals['adicionales']

  const totalAdicionales = adicionalesCalculados.reduce((acc, item) => acc + item.subtotal, 0)
  const totalManoObra = subtotalPack + totalAdicionales

  let recomendado: WizardPack | undefined
  if (summary.bocasExtra > pack.bocasIncluidas * 0.5) {
    recomendado = {
      ...pack,
      nombre: `${pack.nombre} (considerar pack superior)` ,
    }
  }

  return {
    subtotalPack,
    adicionales: adicionalesCalculados,
    totalManoObra,
    recomendado,
  }
}
