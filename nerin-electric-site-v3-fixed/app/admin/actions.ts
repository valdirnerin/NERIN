'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { serializeStringArray } from '@/lib/serialization'
import { makeUniqueSlug } from '@/lib/slug'

const PackSchema = z.object({
  nombre: z.string().min(3),
  slug: z.string().min(3),
  descripcion: z.string().min(10),
  bocasIncluidas: z.coerce.number().min(10),
  ambientesReferencia: z.coerce.number().min(1),
  precioManoObraBase: z.coerce.number().min(0),
  alcanceDetallado: z.string().min(5),
})

export async function createPack(formData: FormData) {
  const payload = PackSchema.parse({
    nombre: formData.get('nombre'),
    slug: formData.get('slug'),
    descripcion: formData.get('descripcion'),
    bocasIncluidas: formData.get('bocasIncluidas'),
    ambientesReferencia: formData.get('ambientesReferencia'),
    precioManoObraBase: formData.get('precioManoObraBase'),
    alcanceDetallado: formData.get('alcanceDetallado'),
  })

  await prisma.pack.create({
    data: {
      nombre: payload.nombre,
      slug: payload.slug,
      descripcion: payload.descripcion,
      bocasIncluidas: payload.bocasIncluidas,
      ambientesReferencia: payload.ambientesReferencia,
      precioManoObraBase: new Prisma.Decimal(payload.precioManoObraBase),
      alcanceDetallado: serializeStringArray(
        payload.alcanceDetallado
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    },
  })

  revalidatePath('/admin')
  revalidatePath('/packs')
}

const AdditionalSchema = z.object({
  nombre: z.string().min(3),
  descripcion: z.string().min(5),
  unidad: z.string().min(1),
  precioUnitarioManoObra: z.coerce.number().min(0),
})

export async function createAdditional(formData: FormData) {
  const payload = AdditionalSchema.parse({
    nombre: formData.get('nombre'),
    descripcion: formData.get('descripcion'),
    unidad: formData.get('unidad'),
    precioUnitarioManoObra: formData.get('precioUnitarioManoObra'),
  })

  await prisma.additionalItem.create({
    data: {
      nombre: payload.nombre,
      descripcion: payload.descripcion,
      unidad: payload.unidad,
      precioUnitarioManoObra: new Prisma.Decimal(payload.precioUnitarioManoObra),
    },
  })

  revalidatePath('/admin')
  revalidatePath('/presupuestador')
}

const MaintenanceSchema = z.object({
  nombre: z.string().min(3),
  slug: z.string().min(3),
  visitasMes: z.coerce.number().min(1),
  precioMensual: z.coerce.number().min(0),
  incluye: z.string().min(5),
})

export async function createMaintenance(formData: FormData) {
  const payload = MaintenanceSchema.parse({
    nombre: formData.get('nombre'),
    slug: formData.get('slug'),
    visitasMes: formData.get('visitasMes'),
    precioMensual: formData.get('precioMensual'),
    incluye: formData.get('incluye'),
  })

  await prisma.maintenancePlan.create({
    data: {
      nombre: payload.nombre,
      slug: payload.slug,
      visitasMes: payload.visitasMes,
      precioMensual: new Prisma.Decimal(payload.precioMensual),
      incluyeTareasFijas: serializeStringArray(
        payload.incluye
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
      ),
      cantidadesFijasInalterables: true,
    },
  })

  revalidatePath('/admin')
  revalidatePath('/mantenimiento')
}

const CaseStudySchema = z.object({
  titulo: z.string().min(3),
  resumen: z.string().min(10),
  contenido: z.string().min(20),
})

export type CaseStudyFormState = {
  success: boolean
  error?: string
}

export const initialCaseStudyState: CaseStudyFormState = {
  success: false,
}

export async function upsertCaseStudy(
  _prevState: CaseStudyFormState,
  formData: FormData,
): Promise<CaseStudyFormState> {
  const parsed = CaseStudySchema.safeParse({
    titulo: formData.get('titulo'),
    resumen: formData.get('resumen'),
    contenido: formData.get('contenido'),
  })

  if (!parsed.success) {
    return {
      success: false,
      error: 'Revisá los datos del caso de éxito.',
    }
  }

  const payload = parsed.data

  try {
    const slug = await makeUniqueSlug(payload.titulo)

    await prisma.caseStudy.upsert({
      where: { slug },
      create: {
        titulo: payload.titulo,
        slug,
        resumen: payload.resumen,
        contenido: payload.contenido,
        publicado: true,
        fotos: serializeStringArray([]),
      },
      update: {
        titulo: payload.titulo,
        resumen: payload.resumen,
        contenido: payload.contenido,
        publicado: true,
      },
    })

    revalidatePath('/admin')
    revalidatePath('/obras')

    return { success: true }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return {
        success: false,
        error: 'Ese slug ya existe',
      }
    }

    console.error('Error al guardar el caso de éxito', error)

    return {
      success: false,
      error: 'No se pudo guardar el caso de éxito. Intentá nuevamente.',
    }
  }
}

const CertificateSchema = z.object({
  projectId: z.string(),
  porcentaje: z.coerce.number().min(1).max(100),
  monto: z.coerce.number().min(0),
})

export async function createCertificate(formData: FormData) {
  const payload = CertificateSchema.parse({
    projectId: formData.get('projectId'),
    porcentaje: formData.get('porcentaje'),
    monto: formData.get('monto'),
  })

  await prisma.progressCertificate.create({
    data: {
      projectId: payload.projectId,
      porcentaje: payload.porcentaje,
      monto: new Prisma.Decimal(payload.monto),
      estado: 'pendiente',
    },
  })

  revalidatePath('/admin')
}
