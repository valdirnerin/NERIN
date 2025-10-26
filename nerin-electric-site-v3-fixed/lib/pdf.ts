import PDFDocument from 'pdfkit'
import { ConfiguratorQuote, Pack } from '@prisma/client'

export function generateQuotePdf({
  quote,
  pack,
}: {
  quote: ConfiguratorQuote & { configuratorQuoteItems: { descripcion: string; cantidad: number; subtotal: any }[] }
  pack: Pack
}) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 })
  doc.fontSize(20).fillColor('#0f172a').text('NERIN · Presupuesto Eléctrico', { align: 'center' })
  doc.moveDown()
  doc.fontSize(14).fillColor('#1e293b').text(`Pack base: ${pack.name}`)
  doc.fontSize(12).fillColor('#334155').text(pack.description)
  doc.moveDown()

  doc.fontSize(13).fillColor('#0f172a').text('Desglose de mano de obra:')
  const items = quote.configuratorQuoteItems
  items.forEach((item) => {
    doc
      .fontSize(11)
      .fillColor('#1f2937')
      .text(`${item.descripcion} · ${item.cantidad} unidad(es)`, { continued: true })
      .text(` $${Number(item.subtotal).toLocaleString('es-AR')}`, { align: 'right' })
  })

  doc.moveDown()
  doc.fontSize(13).fillColor('#0f172a').text('Resumen')
  doc
    .fontSize(12)
    .fillColor('#1f2937')
    .text(`Total mano de obra: $${Number(quote.totalManoObra).toLocaleString('es-AR')}`)
  doc
    .fontSize(12)
    .text(
      `Proyecto eléctrico (se cobra aparte): $${Number(quote.proyectoElectricoAparte).toLocaleString('es-AR')}`,
    )
  doc.moveDown()
  doc
    .fontSize(11)
    .fillColor('#334155')
    .text('Los materiales se cotizan aparte según las marcas elegidas (Schneider, Prysmian, Gimsa, Daisa, Genrock).')
  doc.text('Normativa de referencia: AEA 90364-7-771 (2006).')

  doc.end()
  return doc
}
