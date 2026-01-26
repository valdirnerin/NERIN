'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { DB_ENABLED } from '@/lib/dbMode'
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
  cacActual: z.coerce.number().min(0),
  aplicaIVA: z.coerce.boolean().optional(),
})

export async function createCertificate(formData: FormData) {
  if (!DB_ENABLED) {
    throw new Error('DB_DISABLED')
  }

  const payload = CertificateSchema.parse({
    projectId: formData.get('projectId'),
    porcentaje: formData.get('porcentaje'),
    cacActual: formData.get('cacActual'),
    aplicaIVA: formData.get('aplicaIVA'),
  })

  const project = await prisma.project.findUnique({
    where: { id: payload.projectId },
  })

  if (!project) {
    throw new Error('PROJECT_NOT_FOUND')
  }

  const valorObraBase = project.valorObraBase ?? new Prisma.Decimal(0)
  const ivaPorcentaje = project.ivaPorcentaje ?? 21
  const cacAnterior = project.cacUltimo ?? project.cacInicial ?? new Prisma.Decimal(0)
  const cacActual = new Prisma.Decimal(payload.cacActual)
  const porcentajeDecimal = new Prisma.Decimal(payload.porcentaje).div(100)
  const factor = cacAnterior.equals(0) ? new Prisma.Decimal(1) : cacActual.div(cacAnterior)
  const montoBase = valorObraBase.mul(porcentajeDecimal)
  const ajusteCAC = montoBase.mul(factor.minus(1))
  const subtotal = montoBase.plus(ajusteCAC)
  const ivaMonto = payload.aplicaIVA
    ? subtotal.mul(new Prisma.Decimal(ivaPorcentaje).div(100))
    : new Prisma.Decimal(0)
  const total = subtotal.plus(ivaMonto)

  const [certificate, percentSum] = await prisma.$transaction([
    prisma.progressCertificate.create({
      data: {
        projectId: payload.projectId,
        porcentaje: payload.porcentaje,
        monto: total,
        estado: 'pendiente',
        cacAnterior,
        cacActual,
        factorCAC: factor,
        montoBase,
        ajusteCAC,
        subtotalSinIVA: subtotal,
        ivaMonto,
        totalConIVA: total,
      },
    }),
    prisma.progressCertificate.aggregate({
      where: { projectId: payload.projectId },
      _sum: { porcentaje: true },
    }),
  ])

  const newPercent = Math.min(100, percentSum._sum.porcentaje ?? 0)

  await prisma.project.update({
    where: { id: payload.projectId },
    data: {
      cacUltimo: cacActual,
      avanceCertificado: newPercent,
    },
  })

  revalidatePath('/admin')
  revalidatePath('/admin/operativo')
  revalidatePath(`/admin/operativo`)

  return certificate
}

const MarkPaidSchema = z.object({
  certificateId: z.string(),
})

export async function markCertificatePaid(formData: FormData) {
  if (!DB_ENABLED) {
    throw new Error('DB_DISABLED')
  }

  const payload = MarkPaidSchema.parse({
    certificateId: formData.get('certificateId'),
  })

  const certificate = await prisma.progressCertificate.findUnique({
    where: { id: payload.certificateId },
    include: { project: true },
  })

  if (!certificate) {
    throw new Error('CERTIFICATE_NOT_FOUND')
  }

  await prisma.progressCertificate.update({
    where: { id: payload.certificateId },
    data: {
      estado: 'pagado',
      pagadoAt: new Date(),
      paidAt: new Date(),
    },
  })

  const paidSum = await prisma.progressCertificate.aggregate({
    where: { projectId: certificate.projectId, estado: 'pagado' },
    _sum: { porcentaje: true },
  })

  const newPaidPercent = Math.min(100, paidSum._sum.porcentaje ?? 0)

  await prisma.project.update({
    where: { id: certificate.projectId },
    data: { avancePagado: newPaidPercent },
  })

  revalidatePath('/admin')
  revalidatePath('/admin/operativo')
  revalidatePath(`/admin/operativo`)
}
