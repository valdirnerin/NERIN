import { prisma } from '@/lib/db'
import { parseJson, parseStringArray } from '@/lib/serialization'

export interface AdditionalItemForUI {
  id: string
  nombre: string
  descripcion: string
  unidad: string
  precioUnitarioManoObra: number
  reglasCompatibilidad?: Record<string, unknown> | null
  packId?: string | null
}

export interface PackForUI {
  id: string
  slug: string
  nombre: string
  descripcion: string
  alcanceDetallado: string[]
  bocasIncluidas: number
  ambientesReferencia: number
  precioManoObraBase: number
  soloManoObra?: boolean
  additionalItems: AdditionalItemForUI[]
}

export interface MaintenancePlanForUI {
  id: string
  slug: string
  nombre: string
  incluyeTareasFijas: string[]
  visitasMes: number
  precioMensual: number
  cantidadesFijasInalterables?: boolean
}

export interface CaseStudyForUI {
  id: string
  slug: string
  titulo: string
  resumen: string
  contenido: string
  metricas: Array<{ label: string; value: string }>
  fotos: string[]
}

export interface BrandForUI {
  id: string
  nombre: string
  logoUrl?: string | null
}

export interface TechnicianForUI {
  id: string
  nombre: string
  credenciales: string[]
  fotoUrl?: string | null
}

const fallbackAdditionalItems: AdditionalItemForUI[] = [
  {
    id: 'fallback-add-1',
    nombre: 'Colocación de artefacto de iluminación',
    descripcion: 'Montaje, conexionado y puesta en marcha de artefactos provistos por el cliente.',
    unidad: 'unidad',
    precioUnitarioManoObra: 15000,
    reglasCompatibilidad: null,
    packId: null,
  },
  {
    id: 'fallback-add-2',
    nombre: 'Tablero seccional adicional',
    descripcion: 'Armado de tablero con protecciones termomagnéticas y diferencial.',
    unidad: 'tablero',
    precioUnitarioManoObra: 320000,
    reglasCompatibilidad: null,
    packId: null,
  },
  {
    id: 'fallback-add-3',
    nombre: 'CCTV por cámara',
    descripcion: 'Instalación y conexionado de cámara CCTV con ajuste y prueba.',
    unidad: 'cámara',
    precioUnitarioManoObra: 42000,
    reglasCompatibilidad: null,
    packId: null,
  },
  {
    id: 'fallback-add-4',
    nombre: 'Punto de datos categoría 6A',
    descripcion: 'Cableado y certificación de punto de red para oficina u hogar.',
    unidad: 'punto',
    precioUnitarioManoObra: 28000,
    reglasCompatibilidad: null,
    packId: null,
  },
  {
    id: 'fallback-add-5',
    nombre: 'Circuito para bomba elevadora',
    descripcion: 'Cañería, cableado y protecciones dedicadas para bomba.',
    unidad: 'circuito',
    precioUnitarioManoObra: 180000,
    reglasCompatibilidad: null,
    packId: null,
  },
  {
    id: 'fallback-add-6',
    nombre: 'Preinstalación de split',
    descripcion: 'Cañería de cobre, desagüe y alimentación eléctrica independiente.',
    unidad: 'equipo',
    precioUnitarioManoObra: 95000,
    reglasCompatibilidad: null,
    packId: null,
  },
  {
    id: 'fallback-add-7',
    nombre: 'Cableado de audio distribuido',
    descripcion: 'Canalización y tendido para sistema de audio multizona.',
    unidad: 'zona',
    precioUnitarioManoObra: 70000,
    reglasCompatibilidad: null,
    packId: null,
  },
  {
    id: 'fallback-add-8',
    nombre: 'Zanjeo y cañería exterior',
    descripcion: 'Zanja con cañería PVC reforzada para alimentaciones exteriores.',
    unidad: 'metro lineal',
    precioUnitarioManoObra: 35000,
    reglasCompatibilidad: null,
    packId: null,
  },
  {
    id: 'fallback-add-9',
    nombre: 'Puesta a tierra suplementaria',
    descripcion: 'Instalación de jabalina adicional con medición final.',
    unidad: 'jabalina',
    precioUnitarioManoObra: 120000,
    reglasCompatibilidad: null,
    packId: null,
  },
]

const fallbackPacks: PackForUI[] = [
  {
    id: 'fallback-pack-1',
    slug: 'vivienda-estandar',
    nombre: 'Vivienda Estándar',
    descripcion: 'Pack para departamentos o PH hasta 120 m². Incluye tablero principal, cableado y puesta a tierra básica.',
    alcanceDetallado: [
      'Canalización EMT y bandejas vistas donde aplique',
      'Tablero principal con protecciones curvas C',
      'Circuitos independientes para AA, cocina y tomas generales',
      'Puesta a tierra con jabalina de 2.4 m',
      'Certificado de mediciones',
    ],
    bocasIncluidas: 60,
    ambientesReferencia: 6,
    precioManoObraBase: 2_500_000,
    soloManoObra: true,
    additionalItems: fallbackAdditionalItems.slice(0, 4),
  },
  {
    id: 'fallback-pack-2',
    slug: 'casa-country-1',
    nombre: 'Casa Country 1',
    descripcion: 'Pack para viviendas premium hasta 250 m² con doble tablero y previsión de domótica.',
    alcanceDetallado: [
      'Doble tablero con seccional por planta',
      'Circuito exclusivo para piscina y bomba',
      'Preinstalación domótica y cableado de datos categoría 6A',
      'Puesta a tierra mejorada con anillo perimetral',
      'Documentación completa y ensayos finales',
    ],
    bocasIncluidas: 120,
    ambientesReferencia: 10,
    precioManoObraBase: 5_200_000,
    soloManoObra: true,
    additionalItems: fallbackAdditionalItems.slice(2, 7),
  },
  {
    id: 'fallback-pack-3',
    slug: 'casa-country-2',
    nombre: 'Casa Country 2',
    descripcion: 'Pack para residencias superiores a 250 m² con tableros múltiples y backup.',
    alcanceDetallado: [
      'Tableros seccionales por planta y exteriores',
      'Integración con grupo electrógeno y UPS',
      'Circuito para sala de máquinas y presurizadora',
      'Canalizaciones ocultas con bandejas portacables',
      'Planos, memorias y certificación final',
    ],
    bocasIncluidas: 180,
    ambientesReferencia: 14,
    precioManoObraBase: 7_800_000,
    soloManoObra: true,
    additionalItems: fallbackAdditionalItems.slice(4),
  },
]

const fallbackMaintenancePlans: MaintenancePlanForUI[] = [
  {
    id: 'fallback-plan-basic',
    slug: 'basic',
    nombre: 'BASIC',
    incluyeTareasFijas: ['Revisión de 10 lámparas LED', 'Chequeo de tableros', 'Informe mensual'],
    visitasMes: 1,
    precioMensual: 180_000,
    cantidadesFijasInalterables: true,
  },
  {
    id: 'fallback-plan-pro',
    slug: 'pro',
    nombre: 'PRO',
    incluyeTareasFijas: ['20 lámparas LED', 'Termografía bimestral', 'Chequeo de bombas'],
    visitasMes: 2,
    precioMensual: 320_000,
    cantidadesFijasInalterables: true,
  },
  {
    id: 'fallback-plan-enterprise',
    slug: 'enterprise',
    nombre: 'ENTERPRISE',
    incluyeTareasFijas: ['40 lámparas LED', 'Guardia de urgencias', 'Reportes ejecutivos'],
    visitasMes: 4,
    precioMensual: 620_000,
    cantidadesFijasInalterables: true,
  },
]

const fallbackCaseStudies: CaseStudyForUI[] = [
  {
    id: 'fallback-case-1',
    slug: 'edificio-4000',
    titulo: 'Edificio corporativo 4.000 m²',
    resumen: 'Adecuación completa de tablero general, CCTV y grupo electrógeno para edificio AAA.',
    contenido:
      'El desafío fue migrar la instalación existente sin cortar suministro crítico. Implementamos tableros modulares, cableado LSZH y monitoreo remoto. Cumplimos normativa AEA 90364-7-771 y entregamos documentación completa.',
    metricas: [
      { label: 'Tiempo de obra', value: '90 días' },
      { label: 'Circuitos', value: '120' },
    ],
    fotos: [],
  },
  {
    id: 'fallback-case-2',
    slug: 'smart-fit',
    titulo: 'Smart Fit - Red de gimnasios',
    resumen: 'Implementación de tableros, datos y CCTV para múltiples sedes simultáneas.',
    contenido:
      'Coordinamos logística y montaje nocturno para minimizar cierres. Cada sede recibió tableros nuevos, canalizaciones ocultas y cableado estructurado certificado. Implementamos checklist digital y reportes diarios.',
    metricas: [
      { label: 'Sedes', value: '6' },
      { label: 'Horas fuera de servicio', value: '<4 h por sede' },
    ],
    fotos: [],
  },
]

const fallbackBrands: BrandForUI[] = [
  { id: 'fallback-brand-1', nombre: 'Schneider Electric' },
  { id: 'fallback-brand-2', nombre: 'Prysmian' },
  { id: 'fallback-brand-3', nombre: 'Gimsa' },
  { id: 'fallback-brand-4', nombre: 'Daisa' },
  { id: 'fallback-brand-5', nombre: 'Genrock' },
]

const fallbackTechnicians: TechnicianForUI[] = [
  {
    id: 'fallback-tech-1',
    nombre: 'Ing. Laura Fernández',
    credenciales: ['Mat. COPIME 12345', 'Especialista en Tableros BT'],
    fotoUrl: null,
  },
  {
    id: 'fallback-tech-2',
    nombre: 'Téc. Martín Gómez',
    credenciales: ['Habilitación ENRE', 'Termografía nivel II'],
    fotoUrl: null,
  },
  {
    id: 'fallback-tech-3',
    nombre: 'Ing. Paula Ríos',
    credenciales: ['Project Manager', 'AEA 90364-7-771'],
    fotoUrl: null,
  },
]

function logFallback(context: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[marketing-data] ${context}: ${message}`)
}

function parseMetricas(metricas: unknown): Array<{ label: string; value: string }> {
  if (!Array.isArray(metricas)) {
    return []
  }
  return metricas
    .map((item) => {
      if (item && typeof item === 'object' && 'label' in item && 'value' in item) {
        const label = String((item as Record<string, unknown>).label)
        const value = String((item as Record<string, unknown>).value)
        return { label, value }
      }
      return null
    })
    .filter((item): item is { label: string; value: string } => Boolean(item))
}

export async function getPacksForMarketing(): Promise<PackForUI[]> {
  try {
    const packs = await prisma.pack.findMany({
      include: { additionalItems: true },
      orderBy: { precioManoObraBase: 'asc' },
    })

    if (!packs.length) {
      return fallbackPacks
    }

    return packs.map((pack) => ({
      id: pack.id,
      slug: pack.slug,
      nombre: pack.nombre,
      descripcion: pack.descripcion,
      alcanceDetallado: parseStringArray(pack.alcanceDetallado),
      bocasIncluidas: pack.bocasIncluidas,
      ambientesReferencia: pack.ambientesReferencia,
      precioManoObraBase: Number(pack.precioManoObraBase),
      soloManoObra: pack.soloManoObra,
      additionalItems:
        pack.additionalItems?.map((item) => ({
          id: item.id,
          nombre: item.nombre,
          descripcion: item.descripcion,
          unidad: item.unidad,
          precioUnitarioManoObra: Number(item.precioUnitarioManoObra),
          reglasCompatibilidad: parseJson<Record<string, unknown>>(item.reglasCompatibilidad),
          packId: item.packId,
        })) ?? [],
    }))
  } catch (error) {
    logFallback('packs', error)
    return fallbackPacks
  }
}

export async function getMaintenancePlansForMarketing(): Promise<MaintenancePlanForUI[]> {
  try {
    const plans = await prisma.maintenancePlan.findMany({
      orderBy: { precioMensual: 'asc' },
    })

    if (!plans.length) {
      return fallbackMaintenancePlans
    }

    return plans.map((plan) => ({
      id: plan.id,
      slug: plan.slug,
      nombre: plan.nombre,
      incluyeTareasFijas: parseStringArray(plan.incluyeTareasFijas),
      visitasMes: plan.visitasMes,
      precioMensual: Number(plan.precioMensual),
      cantidadesFijasInalterables: plan.cantidadesFijasInalterables,
    }))
  } catch (error) {
    logFallback('maintenance plans', error)
    return fallbackMaintenancePlans
  }
}

export async function getCaseStudiesForMarketing(): Promise<CaseStudyForUI[]> {
  try {
    const caseStudies = await prisma.caseStudy.findMany({
      where: { publicado: true },
      orderBy: { createdAt: 'desc' },
    })

    if (!caseStudies.length) {
      return fallbackCaseStudies
    }

    return caseStudies.map((cs) => ({
      id: cs.id,
      slug: cs.slug,
      titulo: cs.titulo,
      resumen: cs.resumen,
      contenido: cs.contenido,
      metricas: parseMetricas(parseJson(cs.metricas)),
      fotos: parseStringArray(cs.fotos),
    }))
  } catch (error) {
    logFallback('case studies', error)
    return fallbackCaseStudies
  }
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudyForUI | null> {
  try {
    const caseStudy = await prisma.caseStudy.findUnique({ where: { slug } })
    if (!caseStudy) {
      return fallbackCaseStudies.find((item) => item.slug === slug) ?? null
    }

    return {
      id: caseStudy.id,
      slug: caseStudy.slug,
      titulo: caseStudy.titulo,
      resumen: caseStudy.resumen,
      contenido: caseStudy.contenido,
      metricas: parseMetricas(parseJson(caseStudy.metricas)),
      fotos: parseStringArray(caseStudy.fotos),
    }
  } catch (error) {
    logFallback(`case study ${slug}`, error)
    return fallbackCaseStudies.find((item) => item.slug === slug) ?? null
  }
}

export async function getBrandsForMarketing(): Promise<BrandForUI[]> {
  try {
    const brands = await prisma.brand.findMany({ orderBy: { nombre: 'asc' } })
    if (!brands.length) {
      return fallbackBrands
    }
    return brands.map((brand) => ({
      id: brand.id,
      nombre: brand.nombre,
      logoUrl: brand.logoUrl,
    }))
  } catch (error) {
    logFallback('brands', error)
    return fallbackBrands
  }
}

export async function getTechniciansForMarketing(): Promise<TechnicianForUI[]> {
  try {
    const technicians = await prisma.technician.findMany({
      where: { activo: true },
      include: { user: true },
    })

    if (!technicians.length) {
      return fallbackTechnicians
    }

    return technicians.map((tech) => ({
      id: tech.id,
      nombre: tech.user?.name ?? 'Equipo NERIN',
      credenciales: parseStringArray(tech.credenciales),
      fotoUrl: tech.fotoUrl,
    }))
  } catch (error) {
    logFallback('technicians', error)
    return fallbackTechnicians
  }
}

export async function getConfiguratorData(): Promise<{
  packs: PackForUI[]
  adicionales: AdditionalItemForUI[]
}> {
  try {
    const [packs, adicionales] = await Promise.all([
      prisma.pack.findMany({ orderBy: { precioManoObraBase: 'asc' } }),
      prisma.additionalItem.findMany({ orderBy: { nombre: 'asc' } }),
    ])

    const normalizedPacks = packs.map((pack) => ({
      id: pack.id,
      slug: pack.slug,
      nombre: pack.nombre,
      descripcion: pack.descripcion,
      alcanceDetallado: parseStringArray(pack.alcanceDetallado),
      bocasIncluidas: pack.bocasIncluidas,
      ambientesReferencia: pack.ambientesReferencia,
      precioManoObraBase: Number(pack.precioManoObraBase),
      soloManoObra: pack.soloManoObra,
      additionalItems: [],
    }))

    const normalizedAdicionales = adicionales.map((item) => ({
      id: item.id,
      nombre: item.nombre,
      descripcion: item.descripcion,
      unidad: item.unidad,
      precioUnitarioManoObra: Number(item.precioUnitarioManoObra),
      reglasCompatibilidad: parseJson<Record<string, unknown>>(item.reglasCompatibilidad),
      packId: item.packId,
    }))

    return {
      packs: normalizedPacks.length ? normalizedPacks : fallbackPacks,
      adicionales: normalizedAdicionales.length ? normalizedAdicionales : fallbackAdditionalItems,
    }
  } catch (error) {
    logFallback('configurator data', error)
    return { packs: fallbackPacks, adicionales: fallbackAdditionalItems }
  }
}

export async function getMarketingHomeData(): Promise<{
  packs: PackForUI[]
  plans: MaintenancePlanForUI[]
  caseStudies: CaseStudyForUI[]
  brands: BrandForUI[]
}> {
  const [packs, plans, caseStudies, brands] = await Promise.all([
    getPacksForMarketing(),
    getMaintenancePlansForMarketing(),
    getCaseStudiesForMarketing(),
    getBrandsForMarketing(),
  ])

  return {
    packs: packs.slice(0, 3),
    plans: plans,
    caseStudies: caseStudies.slice(0, 2),
    brands: brands.slice(0, 8),
  }
}
