'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { serializeJson } from '@/lib/serialization'
import { calculateTotals } from './calculations'
import { professionalCatalog, quoteServices } from './catalog'

const QuoteSchema = z.object({
  mode: z.enum(['EXPRESS', 'PROJECT']),
  serviceId: z.string(),
  serviceUnits: z.number().min(1).max(20),
  zoneTier: z.enum(['PRIORITY', 'STANDARD', 'EXTENDED', 'REVIEW']),
  address: z.string().default(''),
  zoneLabel: z.string().optional(),
  zoneLat: z.number().optional(),
  zoneLng: z.number().optional(),
  urgencyMultiplier: z.number().min(1).max(2),
  difficultyMultiplier: z.number().min(1).max(2),
  packId: z.string(),
  ambientes: z.number().min(0).max(40),
  bocasExtra: z.number().min(0).max(500),
  hasPlan: z.boolean(),
  adicionales: z.array(z.object({ id: z.string(), cantidad: z.number().min(1).max(300) })),
  professionalItems: z.array(z.object({ id: z.string(), cantidad: z.number().min(1).max(500) })),
  comentarios: z.string().optional(),
  email: z.string().email().optional(),
  nombre: z.string().optional(),
})

export async function createConfiguratorQuote(data: z.infer<typeof QuoteSchema>) {
  const payload = QuoteSchema.parse(data)

  const pack = await prisma.pack.findUnique({ where: { id: payload.packId } })
  const adicionales = await prisma.additionalItem.findMany({
    where: { id: { in: payload.adicionales.map((item) => item.id) } },
  })

  const totals = calculateTotals({
    pack: pack
      ? {
          id: pack.id,
          slug: pack.slug,
          name: pack.name,
          description: pack.description,
          scope: pack.scope,
          features: [],
          basePrice: Number(pack.basePrice),
          advancePrice: Number(pack.advancePrice),
        }
      : null,
    adicionales: adicionales.map((item) => ({
      id: item.id,
      nombre: item.nombre,
      descripcion: item.descripcion,
      unidad: item.unidad,
      precioUnitarioManoObra: Number(item.precioUnitarioManoObra),
      reglasCompatibilidad: null,
      packId: item.packId,
    })),
    summary: payload,
    services: quoteServices,
    catalog: professionalCatalog,
  })

  const quote = await prisma.configuratorQuote.create({
    data: {
      packId: pack?.id ?? (await prisma.pack.findFirstOrThrow()).id,
      itemsSeleccionados: serializeJson(payload),
      totalManoObra: new Prisma.Decimal(totals.totalManoObra),
      aclaracionesMateriales: totals.requiresSurvey
        ? 'Requiere visita técnica para validar cantidades finales y materiales.'
        : 'Servicio contratable online. Materiales se confirman antes de ejecutar.',
      proyectoElectricoAparte: new Prisma.Decimal(500000),
      configuratorQuoteItems: {
        create: totals.adicionales.map((item) => ({
          additionalItemId: payload.mode === 'PROJECT' && payload.hasPlan ? null : item.id,
          descripcion: item.nombre,
          cantidad: item.cantidad,
          precioUnitario: new Prisma.Decimal(item.precioUnitario),
          subtotal: new Prisma.Decimal(item.subtotal),
        })),
      },
    },
  })

  revalidatePath('/presupuestador')

  return { id: quote.id, pdfUrl: `/api/quotes/${quote.id}/pdf` }
}
