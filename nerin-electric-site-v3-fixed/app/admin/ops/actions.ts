import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { DB_ENABLED } from '@/lib/dbMode'
import { createPreference } from '@/lib/mercadopago'

const toNumber = (value: FormDataEntryValue | null, fallback = 0) => {
  if (typeof value !== 'string') return fallback
  const normalized = value.replace(',', '.')
  const parsed = Number(normalized)
  return Number.isNaN(parsed) ? fallback : parsed
}

const toCents = (value: FormDataEntryValue | null) => Math.round(toNumber(value, 0) * 100)

const ensureDb = () => {
  if (!DB_ENABLED) {
    throw new Error('DB_DISABLED')
  }
}

export async function createOpsClient(formData: FormData) {
  ensureDb()
  const name = String(formData.get('name') || '').trim()
  const email = String(formData.get('email') || '').trim()
  if (!name || !email) return

  await prisma.opsClient.create({
    data: {
      name,
      email,
      phone: String(formData.get('phone') || '').trim() || null,
      companyName: String(formData.get('companyName') || '').trim() || null,
      cuit: String(formData.get('cuit') || '').trim() || null,
    },
  })

  revalidatePath('/admin/ops/clients')
}

export async function updateOpsClient(formData: FormData) {
  ensureDb()
  const id = String(formData.get('id') || '')
  if (!id) return

  await prisma.opsClient.update({
    where: { id },
    data: {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      phone: String(formData.get('phone') || '').trim() || null,
      companyName: String(formData.get('companyName') || '').trim() || null,
      cuit: String(formData.get('cuit') || '').trim() || null,
    },
  })

  revalidatePath(`/admin/ops/clients/${id}`)
}

export async function createOpsProject(formData: FormData) {
  ensureDb()
  const title = String(formData.get('title') || '').trim()
  const clientId = String(formData.get('clientId') || '').trim()
  if (!title || !clientId) return

  await prisma.opsProject.create({
    data: {
      title,
      clientId,
      address: String(formData.get('address') || '').trim() || null,
      city: String(formData.get('city') || '').trim() || null,
      areaM2: toNumber(formData.get('areaM2')) || null,
      electrificationLevel: String(formData.get('electrificationLevel') || '').trim() || null,
      status: String(formData.get('status') || 'PLANNING'),
      notes: String(formData.get('notes') || '').trim() || null,
      cacIndex: toNumber(formData.get('cacIndex')) || null,
    },
  })

  revalidatePath('/admin/ops/projects')
}

export async function updateOpsProject(formData: FormData) {
  ensureDb()
  const id = String(formData.get('id') || '')
  if (!id) return

  await prisma.opsProject.update({
    where: { id },
    data: {
      title: String(formData.get('title') || '').trim(),
      address: String(formData.get('address') || '').trim() || null,
      city: String(formData.get('city') || '').trim() || null,
      areaM2: toNumber(formData.get('areaM2')) || null,
      electrificationLevel: String(formData.get('electrificationLevel') || '').trim() || null,
      status: String(formData.get('status') || 'PLANNING'),
      progressPercent: Math.max(0, Math.min(100, Math.round(toNumber(formData.get('progressPercent'), 0)))),
      notes: String(formData.get('notes') || '').trim() || null,
      cacIndex: toNumber(formData.get('cacIndex')) || null,
    },
  })

  revalidatePath(`/admin/ops/projects/${id}`)
}

export async function createAdditionalCatalogItem(formData: FormData) {
  ensureDb()
  const name = String(formData.get('name') || '').trim()
  const unit = String(formData.get('unit') || '').trim()
  if (!name || !unit) return

  await prisma.additionalCatalogItem.create({
    data: {
      name,
      description: String(formData.get('description') || '').trim() || null,
      unit,
      laborUnitPrice: toCents(formData.get('laborUnitPrice')),
      active: formData.get('active') === 'on',
    },
  })

  revalidatePath('/admin/ops')
}

export async function createOpsCertificate(formData: FormData) {
  ensureDb()
  const projectId = String(formData.get('projectId') || '')
  if (!projectId) return

  const returnTo = String(formData.get('returnTo') || `/admin/ops/projects/${projectId}`)
  const percentToAdd = Math.round(toNumber(formData.get('percentToAdd'), 0))
  const amountCents = toCents(formData.get('amount'))
  const description = String(formData.get('description') || '').trim() || null

  const project = await prisma.opsProject.findUnique({ where: { id: projectId } })
  if (!project) return

  const percentAfter = Math.min(100, project.progressPercent + percentToAdd)
  const certificate = await prisma.opsProgressCertificate.create({
    data: {
      projectId,
      percentToAdd,
      percentAfter,
      amount: amountCents,
      description,
      status: 'DRAFT',
    },
  })

  try {
    const baseUrl = process.env.PUBLIC_BASE_URL
    if (!baseUrl) throw new Error('PUBLIC_BASE_URL missing')
    const preference = await createPreference({
      title: `Certificado de avance - ${project.title}`,
      amount: amountCents / 100,
      externalRef: `cert:${certificate.id}`,
      notificationUrl: `${baseUrl}/api/mercadopago/webhook`,
      backUrls: {
        success: `${baseUrl}/clientes/obra/${projectId}?pago=certificado&estado=ok`,
        failure: `${baseUrl}/clientes/obra/${projectId}?pago=certificado&estado=error`,
        pending: `${baseUrl}/clientes/obra/${projectId}?pago=certificado&estado=pendiente`,
      },
    })

    await prisma.opsProgressCertificate.update({
      where: { id: certificate.id },
      data: {
        status: 'PENDING_PAYMENT',
        mercadoPagoPreferenceId: preference.preferenceId,
        mercadoPagoInitPoint: preference.initPoint,
      },
    })
  } catch (error) {
    console.error('[ops] Mercado Pago preference failed', error)
    revalidatePath(returnTo)
    redirect(`${returnTo}?mpError=1`)
  }

  revalidatePath(returnTo)
  redirect(returnTo)
}

export async function createOpsPhoto(formData: FormData) {
  ensureDb()
  const projectId = String(formData.get('projectId') || '')
  const returnTo = String(formData.get('returnTo') || `/admin/ops/projects/${projectId}`)
  if (!projectId) return

  await prisma.opsProjectPhoto.create({
    data: {
      projectId,
      title: String(formData.get('title') || '').trim() || null,
      url: String(formData.get('url') || '').trim(),
      takenAt: formData.get('takenAt') ? new Date(String(formData.get('takenAt'))) : null,
    },
  })

  revalidatePath(returnTo)
  redirect(returnTo)
}

export async function createOpsAdditional(formData: FormData) {
  ensureDb()
  const projectId = String(formData.get('projectId') || '')
  const returnTo = String(formData.get('returnTo') || `/admin/ops/projects/${projectId}`)
  if (!projectId) return

  const catalogItemId = String(formData.get('catalogItemId') || '')
  const quantity = toNumber(formData.get('quantity'), 1)
  const generatePayment = formData.get('generatePayment') === 'on'

  let name = String(formData.get('name') || '').trim()
  let description = String(formData.get('description') || '').trim() || null
  let unit = String(formData.get('unit') || '').trim()
  let unitPriceCents = toCents(formData.get('unitPrice'))
  let resolvedCatalogId: string | null = null

  if (catalogItemId) {
    const catalogItem = await prisma.additionalCatalogItem.findUnique({ where: { id: catalogItemId } })
    if (catalogItem) {
      name = catalogItem.name
      description = catalogItem.description
      unit = catalogItem.unit
      unitPriceCents = catalogItem.laborUnitPrice
      resolvedCatalogId = catalogItem.id
    }
  }

  if (!name || !unit || unitPriceCents <= 0) {
    revalidatePath(returnTo)
    redirect(`${returnTo}?mpError=1`)
  }

  const additional = await prisma.opsProjectAdditionalItem.create({
    data: {
      projectId,
      catalogItemId: resolvedCatalogId,
      name,
      description,
      unit,
      unitPrice: unitPriceCents,
      quantity,
      status: generatePayment ? 'APPROVED' : 'QUOTED',
    },
  })

  if (generatePayment) {
    try {
      const baseUrl = process.env.PUBLIC_BASE_URL
      if (!baseUrl) throw new Error('PUBLIC_BASE_URL missing')
      const preference = await createPreference({
        title: `Adicional - ${name}`,
        amount: (unitPriceCents * quantity) / 100,
        externalRef: `add:${additional.id}`,
        notificationUrl: `${baseUrl}/api/mercadopago/webhook`,
        backUrls: {
          success: `${baseUrl}/clientes/obra/${projectId}?pago=adicional&estado=ok`,
          failure: `${baseUrl}/clientes/obra/${projectId}?pago=adicional&estado=error`,
          pending: `${baseUrl}/clientes/obra/${projectId}?pago=adicional&estado=pendiente`,
        },
      })

      await prisma.opsProjectAdditionalItem.update({
        where: { id: additional.id },
        data: {
          mercadoPagoPreferenceId: preference.preferenceId,
          mercadoPagoInitPoint: preference.initPoint,
        },
      })
    } catch (error) {
      console.error('[ops] Mercado Pago preference failed', error)
      revalidatePath(returnTo)
      redirect(`${returnTo}?mpError=1`)
    }
  }

  revalidatePath(returnTo)
  redirect(returnTo)
}
