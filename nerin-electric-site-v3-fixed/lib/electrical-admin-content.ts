import { prisma } from '@/lib/db'
import {
  diagnosticFaults,
  quickServices,
  type DiagnosticFault,
  type ElectricalService,
} from '@/data/electricalServices'
import {
  electricalServiceVisualGuides,
  type ElectricalServiceVisualGuide,
} from '@/data/electricalServiceVisualGuides'
import { getAdminTechnicalStatus, type AdminTechnicalStatus } from '@/lib/admin-technical-status'

export type ManagedElectricalService = ElectricalService & {
  active: boolean
  order: number
  visualGuideServiceId?: string
}

export type ManagedElectricalVisualGuide = ElectricalServiceVisualGuide & {
  active: boolean
  order: number
}

export type ManagedDiagnosticFault = DiagnosticFault & {
  active: boolean
  order: number
}

export type ManagedCommercialElectricalService = {
  id: string
  title: string
  description: string
  quoteNeeds: string
  access: string
  requiredFields: string[]
  accessConditions: string[]
  materials: string
  schedule: string
  height: string
  authorization: string
  priceLabel: string
  basePrice: number | null
  active: boolean
  order: number
  configurable?: boolean
}

export type ElectricalAdminContent = {
  quickServices: ManagedElectricalService[]
  visualGuides: ManagedElectricalVisualGuide[]
  diagnosticFaults: ManagedDiagnosticFault[]
  commercialServices: ManagedCommercialElectricalService[]
}

export type ElectricalAdminContentState = {
  content: ElectricalAdminContent
  status: {
    key: string
    hasPersistedContent: boolean
    isFallback: boolean
    technicalStatus: AdminTechnicalStatus
    warnings: string[]
  }
}

export const ELECTRICAL_CONTENT_KEY = 'electrical_services_admin_v1'

const commercialSeed = [
  ['cambio-lamparas-comercio', 'Cambio de lámparas en comercio', 'Cantidad de luminarias, altura aproximada, tipo de espacio, horario, materiales y fotos.', 'Ingreso autorizado, sector despejado y medio de acceso validado.'],
  ['mantenimiento-luminarias', 'Mantenimiento de luminarias', 'Cantidad, altura, tipo de artefacto, fotos del espacio y horario disponible.', 'Acceso autorizado, corte coordinado si corresponde y responsable presente.'],
  ['revision-tablero-local', 'Revisión de tablero de local', 'Fotos del tablero abierto/cerrado, síntomas, potencia de equipos y horarios posibles.', 'Puede requerir corte parcial, autorización del local/administración y sector despejado.'],
  ['tomas-mostrador-equipos', 'Tomas para mostrador/equipos', 'Cantidad, consumo de equipos, distancia al tablero, recorrido posible y fotos.', 'Se valida canalización, interferencias, horarios y permisos del inmueble.'],
  ['urgencia-fuera-horario', 'Urgencia fuera de horario', 'Síntoma, criticidad, dirección, contacto responsable y fotos/videos si existen.', 'Sujeto a disponibilidad, seguridad de acceso y aprobación previa del adicional horario.'],
  ['preventivo-mensual', 'Mantenimiento preventivo mensual', 'Superficie, cantidad de sectores, frecuencia, horarios y listado de equipos críticos.', 'Requiere referente operativo, permiso de ingreso y agenda recurrente aprobada.'],
  ['trabajo-consorcio', 'Trabajo en consorcio', 'Autorización, alcance, fotos, ubicación de llaves/tableros y horario permitido.', 'Debe coordinarse con administración, encargado o consejo.'],
  ['trabajo-country', 'Trabajo en country / barrio privado', 'Lote/unidad, autorización de ingreso, contacto de seguridad, fotos y alcance.', 'Sujeto a ingreso aprobado, documentación requerida, zona y ventana horaria.'],
] as const

const defaultCommercialServices: ManagedCommercialElectricalService[] = commercialSeed.map(
  ([id, title, quoteNeeds, access], index) => ({
    id,
    title,
    description: quoteNeeds,
    quoteNeeds,
    access,
    requiredFields: quoteNeeds.split(',').map((item) => item.trim()),
    accessConditions: access.split(',').map((item) => item.trim()),
    materials: 'cliente / cotiza NERIN / a definir',
    schedule: 'a coordinar',
    height: 'según caso',
    authorization: 'según inmueble',
    priceLabel: 'a cotizar',
    basePrice: null,
    active: true,
    order: index + 1,
    configurable: index === 0,
  }),
)

function numberOrDefault(value: unknown, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function stringArray(value: unknown, fallback: string[] = []) {
  if (Array.isArray(value)) return value.map((item) => String(item)).filter(Boolean)
  if (typeof value === 'string') return value.split('\n').map((item) => item.trim()).filter(Boolean)
  return fallback
}

function normalizeQuickServices(value: unknown): ManagedElectricalService[] {
  const source = Array.isArray(value) && value.length ? value : quickServices
  return source.map((raw, index) => {
    const item = raw as Partial<ManagedElectricalService>
    const fallback = quickServices.find((service) => service.id === item.id) ?? quickServices[index] ?? quickServices[0]
    return {
      ...fallback,
      ...item,
      active: item.active ?? true,
      order: numberOrDefault(item.order, index + 1),
      visualGuideServiceId: item.visualGuideServiceId ?? item.id ?? fallback.id,
    } as ManagedElectricalService
  })
}

function normalizeVisualGuides(value: unknown): ManagedElectricalVisualGuide[] {
  const source = Array.isArray(value) && value.length ? value : electricalServiceVisualGuides
  return source.map((raw, index) => {
    const item = raw as Partial<ManagedElectricalVisualGuide>
    const fallback = electricalServiceVisualGuides.find((guide) => guide.serviceId === item.serviceId) ?? electricalServiceVisualGuides[index] ?? electricalServiceVisualGuides[0]
    return {
      ...fallback,
      ...item,
      visualGuide: {
        ...fallback.visualGuide,
        ...(item.visualGuide ?? {}),
        appliesIf: stringArray(item.visualGuide?.appliesIf, fallback.visualGuide.appliesIf),
        doesNotApplyIf: stringArray(item.visualGuide?.doesNotApplyIf, fallback.visualGuide.doesNotApplyIf),
        callouts: Array.isArray(item.visualGuide?.callouts) ? item.visualGuide.callouts : fallback.visualGuide.callouts,
        relatedIfNotApplies: Array.isArray(item.visualGuide?.relatedIfNotApplies) ? item.visualGuide.relatedIfNotApplies : fallback.visualGuide.relatedIfNotApplies,
      },
      active: item.active ?? true,
      order: numberOrDefault(item.order, index + 1),
    } as ManagedElectricalVisualGuide
  })
}

function normalizeDiagnosticFaults(value: unknown): ManagedDiagnosticFault[] {
  const source = Array.isArray(value) && value.length ? value : diagnosticFaults
  return source.map((raw, index) => {
    const item = raw as Partial<ManagedDiagnosticFault>
    const fallback = diagnosticFaults.find((fault) => fault.id === item.id) ?? diagnosticFaults[index] ?? diagnosticFaults[0]
    return {
      ...fallback,
      ...item,
      possibleCauses: stringArray(item.possibleCauses, fallback.possibleCauses),
      usualTests: stringArray(item.usualTests, fallback.usualTests),
      possibleSolutions: stringArray(item.possibleSolutions, fallback.possibleSolutions),
      advancedRequiredWhen: stringArray(item.advancedRequiredWhen, fallback.advancedRequiredWhen),
      active: item.active ?? true,
      order: numberOrDefault(item.order, index + 1),
    } as ManagedDiagnosticFault
  })
}

function normalizeCommercialServices(value: unknown): ManagedCommercialElectricalService[] {
  const source = Array.isArray(value) && value.length ? value : defaultCommercialServices
  return source.map((raw, index) => {
    const item = raw as Partial<ManagedCommercialElectricalService>
    const fallback = defaultCommercialServices.find((service) => service.id === item.id) ?? defaultCommercialServices[index] ?? defaultCommercialServices[0]
    const requiredFields = stringArray(item.requiredFields, fallback.requiredFields)
    const accessConditions = stringArray(item.accessConditions, fallback.accessConditions)
    return {
      ...fallback,
      ...item,
      id: item.id || fallback.id || `comercial-${index + 1}`,
      title: item.title || fallback.title || 'Servicio comercial',
      requiredFields,
      accessConditions,
      quoteNeeds: item.quoteNeeds || requiredFields.join(', ') || fallback.quoteNeeds,
      access: item.access || accessConditions.join(', ') || fallback.access,
      basePrice: item.basePrice === undefined || item.basePrice === null ? null : numberOrDefault(item.basePrice, 0),
      active: item.active ?? true,
      order: numberOrDefault(item.order, index + 1),
    }
  })
}

function publicList<T extends { active: boolean; order: number }>(items: T[]) {
  return items.filter((item) => item.active !== false).sort((a, b) => a.order - b.order)
}

export function normalizeElectricalContent(raw: unknown): ElectricalAdminContent {
  const value = raw && typeof raw === 'object' ? (raw as Partial<ElectricalAdminContent>) : {}
  return {
    quickServices: normalizeQuickServices(value.quickServices),
    visualGuides: normalizeVisualGuides(value.visualGuides),
    diagnosticFaults: normalizeDiagnosticFaults(value.diagnosticFaults),
    commercialServices: normalizeCommercialServices(value.commercialServices),
  }
}

export function toPublicElectricalContent(content: ElectricalAdminContent): ElectricalAdminContent {
  return {
    quickServices: publicList(content.quickServices),
    visualGuides: publicList(content.visualGuides),
    diagnosticFaults: publicList(content.diagnosticFaults),
    commercialServices: publicList(content.commercialServices),
  }
}

export const defaultElectricalContent: ElectricalAdminContent = normalizeElectricalContent({})

export async function getElectricalAdminContentState(): Promise<ElectricalAdminContentState> {
  const technicalStatus = getAdminTechnicalStatus()
  const warnings = [...technicalStatus.warnings]

  try {
    const row = await prisma.websiteContent.findUnique({ where: { key: ELECTRICAL_CONTENT_KEY } })
    if (!row?.content) {
      warnings.push('No existe contenido guardado para trabajos eléctricos: se está usando fallback TypeScript visible.')
      return { content: defaultElectricalContent, status: { key: ELECTRICAL_CONTENT_KEY, hasPersistedContent: false, isFallback: true, technicalStatus, warnings } }
    }

    return { content: normalizeElectricalContent(JSON.parse(row.content)), status: { key: ELECTRICAL_CONTENT_KEY, hasPersistedContent: true, isFallback: false, technicalStatus, warnings } }
  } catch (error) {
    console.warn('[electrical-content] Using static fallback.', error)
    warnings.push('Falló la lectura de DB para trabajos eléctricos: la web usa fallback estático.')
    return { content: defaultElectricalContent, status: { key: ELECTRICAL_CONTENT_KEY, hasPersistedContent: false, isFallback: true, technicalStatus, warnings } }
  }
}

export async function getElectricalAdminContent(): Promise<ElectricalAdminContent> {
  const state = await getElectricalAdminContentState()
  return toPublicElectricalContent(state.content)
}

export async function saveElectricalAdminContent(content: ElectricalAdminContent) {
  const normalized = normalizeElectricalContent(content)
  return prisma.websiteContent.upsert({
    where: { key: ELECTRICAL_CONTENT_KEY },
    create: {
      key: ELECTRICAL_CONTENT_KEY,
      title: 'Trabajos eléctricos',
      content: JSON.stringify(normalized),
      visible: true,
    },
    update: { content: JSON.stringify(normalized), visible: true },
  })
}
