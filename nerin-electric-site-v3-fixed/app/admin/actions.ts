'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { serializeStringArray } from '@/lib/serialization'
import { makeUniqueSlug } from '@/lib/slug'
import type {
  CaseStudyFormState,
  MaintenanceFormState,
} from './constants'

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

export async function createMaintenance(
  _prevState: MaintenanceFormState,
  formData: FormData,
): Promise<MaintenanceFormState> {
  const payload = MaintenanceSchema.parse({
    nombre: formData.get('nombre'),
    slug: formData.get('slug'),
    visitasMes: formData.get('visitasMes'),
    precioMensual: formData.get('precioMensual'),
    incluye: formData.get('incluye'),
  })

  const incluyeTareasFijas = serializeStringArray(
    payload.incluye
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean),
  )

  const maintenanceData = {
    nombre: payload.nombre,
    slug: payload.slug,
    visitasMes: payload.visitasMes,
    precioMensual: new Prisma.Decimal(payload.precioMensual),
    incluyeTareasFijas,
    cantidadesFijasInalterables: true,
  }

  try {
    await prisma.maintenancePlan.upsert({
      where: { slug: payload.slug },
      create: maintenanceData,
      update: maintenanceData,
    })

    revalidatePath('/admin')
    revalidatePath('/mantenimiento')

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

    throw error
  }
}

const CaseStudySchema = z.object({
  titulo: z.string().min(3),
  resumen: z.string().min(10),
  contenido: z.string().min(20),
})

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
    revalidatePath('/blog')
    revalidatePath('/blog/[slug]')

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
