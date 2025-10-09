'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

const QuoteSchema = z.object({
  packId: z.string(),
  ambientes: z.number().min(1).max(30),
  bocasExtra: z.number().min(0).max(500),
  adicionales: z.array(z.object({ id: z.string(), cantidad: z.number().min(1).max(100) })),
  comentarios: z.string().optional(),
  email: z.string().email().optional(),
  nombre: z.string().optional(),
})

export async function createConfiguratorQuote(data: z.infer<typeof QuoteSchema>) {
  const payload = QuoteSchema.parse(data)

  const pack = await prisma.pack.findUnique({ where: { id: payload.packId } })
  if (!pack) {
    throw new Error('Pack no encontrado')
  }

  const adicionales = await prisma.additionalItem.findMany({
    where: { id: { in: payload.adicionales.map((item) => item.id) } },
  })

  const totalAdicionales = payload.adicionales.reduce((acc, item) => {
    const adicional = adicionales.find((a) => a.id === item.id)
    if (!adicional) return acc
    return acc + Number(adicional.precioUnitarioManoObra) * item.cantidad
  }, 0)

  const totalManoObra = Number(pack.precioManoObraBase) + totalAdicionales

  const quote = await prisma.configuratorQuote.create({
    data: {
      packId: pack.id,
      itemsSeleccionados: payload,
      totalManoObra: new Prisma.Decimal(totalManoObra),
      proyectoElectricoAparte: new Prisma.Decimal(500000),
      configuratorQuoteItems: {
        create: [
          {
            descripcion: `Pack base ${pack.nombre}`,
            cantidad: 1,
            precioUnitario: pack.precioManoObraBase,
            subtotal: pack.precioManoObraBase,
          },
          ...payload.adicionales.map((item) => {
            const adicional = adicionales.find((a) => a.id === item.id)
            const precio = adicional ? Number(adicional.precioUnitarioManoObra) : 0
            return {
              additionalItemId: item.id,
              descripcion: adicional?.nombre ?? 'Adicional',
              cantidad: item.cantidad,
              precioUnitario: new Prisma.Decimal(precio),
              subtotal: new Prisma.Decimal(precio * item.cantidad),
            }
          }),
        ],
      },
    },
  })

  revalidatePath('/presupuestador')

  return { id: quote.id, pdfUrl: `/api/quotes/${quote.id}/pdf` }
}
