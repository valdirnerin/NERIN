import { prisma } from '@/lib/db'
import { quickServices, diagnosticFaults } from '@/data/electricalServices'
import { electricalServiceVisualGuides } from '@/data/electricalServiceVisualGuides'

export type ElectricalAdminContent = {
  quickServices: typeof quickServices
  visualGuides: typeof electricalServiceVisualGuides
  diagnosticFaults: typeof diagnosticFaults
  commercialServices: Array<Record<string, unknown>>
}

export const ELECTRICAL_CONTENT_KEY = 'electrical_services_admin_v1'

export const defaultElectricalContent: ElectricalAdminContent = {
  quickServices,
  visualGuides: electricalServiceVisualGuides,
  diagnosticFaults,
  commercialServices: [],
}

function mergeContent(raw: unknown): ElectricalAdminContent {
  if (!raw || typeof raw !== 'object') return defaultElectricalContent
  const value = raw as Partial<ElectricalAdminContent>
  return {
    quickServices: Array.isArray(value.quickServices)
      ? (value.quickServices as typeof quickServices)
      : quickServices,
    visualGuides: Array.isArray(value.visualGuides)
      ? (value.visualGuides as typeof electricalServiceVisualGuides)
      : electricalServiceVisualGuides,
    diagnosticFaults: Array.isArray(value.diagnosticFaults)
      ? (value.diagnosticFaults as typeof diagnosticFaults)
      : diagnosticFaults,
    commercialServices: Array.isArray(value.commercialServices) ? value.commercialServices : [],
  }
}

export async function getElectricalAdminContent(): Promise<ElectricalAdminContent> {
  try {
    const row = await prisma.websiteContent.findUnique({ where: { key: ELECTRICAL_CONTENT_KEY } })
    if (!row?.content) return defaultElectricalContent
    return mergeContent(JSON.parse(row.content))
  } catch (error) {
    console.warn('[electrical-content] Using static fallback.', error)
    return defaultElectricalContent
  }
}

export async function saveElectricalAdminContent(content: ElectricalAdminContent) {
  return prisma.websiteContent.upsert({
    where: { key: ELECTRICAL_CONTENT_KEY },
    create: {
      key: ELECTRICAL_CONTENT_KEY,
      title: 'Trabajos eléctricos',
      content: JSON.stringify(content),
      visible: true,
    },
    update: { content: JSON.stringify(content), visible: true },
  })
}
