import fs from 'fs'
import path from 'path'
import type { SiteExperience } from '@/types/site'

export function getStorageDir() {
  const storagePath = process.env.STORAGE_DIR || path.join(process.cwd(), '.data')
  if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath, { recursive: true })
  }
  return storagePath
}

const SITE_FILE = 'site.json'

export const SITE_DEFAULTS: SiteExperience = {
  name: 'NERIN · Ingeniería Eléctrica',
  tagline: 'Instalaciones de alta performance con trazabilidad completa.',
  accent: '#f59e0b',
  socials: {
    instagram: 'https://www.instagram.com/nerin.electric',
    linkedin: 'https://www.linkedin.com/company/nerin-electric',
  },
  contact: {
    email: 'hola@nerin.com.ar',
    phone: '+54 11 0000 0000',
    secondaryPhones: ['+54 11 5555 5555'],
    address: 'Villa Ortúzar · CABA, Argentina',
    schedule: 'Lunes a viernes de 08:00 a 18:00',
    serviceArea: 'Ciudad Autónoma de Buenos Aires y GBA',
    whatsappNumber: '5491100000000',
    whatsappMessage: 'Hola, soy [Nombre]. Quiero cotizar un servicio eléctrico con NERIN.',
    whatsappCtaLabel: 'Hablar ahora',
  },
  hero: {
    badge: 'Contratista eléctrico para obras y mantenimiento',
    title: 'Contratista eléctrico para obras, comercios y consorcios en CABA',
    subtitle: 'Presupuesto en 24–48 h. Cumplimiento normativo. Experiencia real en obra.',
    backgroundImage:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
    caption: 'Tablero general edificio 4.000 m² · Ensayos y certificaciones completas.',
    primaryCta: { label: 'Quiero una visita técnica', href: '/contacto?motivo=Visita técnica' },
    secondaryCta: { label: 'Necesito presupuesto de obra', href: '/contacto?motivo=Presupuesto de obra' },
    tertiaryCta: { label: 'Pedir mantenimiento', href: '/contacto?motivo=Mantenimiento' },
    highlights: [
      {
        title: 'Experiencia en locales y edificios',
        description: 'KFC, Smart Fit, DIA, viviendas y consorcios.',
      },
      {
        title: 'Tiempos de respuesta claros',
        description: 'Presupuestos en 24–48 h y seguimiento semanal.',
      },
    ],
    stats: [
      {
        label: 'Coordinación sin fricciones',
        description: 'Equipo propio, seguros al día y reportes fotográficos.',
      },
      {
        label: 'Cumplimiento normativo',
        description: 'AEA 90364-7-771 con trazabilidad y documentación.',
      },
    ],
  },
  services: {
    title: 'Servicios eléctricos de punta a punta',
    description:
      'Intervenimos en obra nueva, adecuaciones y expansión. Documentación completa, planos as-built y soporte post entrega.',
    items: [
      {
        title: 'Instalaciones eléctricas completas',
        description: 'Proyecto ejecutivo, tableros, canalizaciones y puesta en marcha.',
      },
      {
        title: 'Tableros a medida',
        description: 'Montaje, ensayo y certificación de tableros generales, seccionales y CCM.',
      },
      {
        title: 'Puesta a tierra y descargas atmosféricas',
        description: 'Mallas, jabalinas, mediciones con informes certificados y adecuaciones AEA.',
      },
      {
        title: 'Canalizaciones y bandejas portacables',
        description: 'Tendidos prolijos, registro fotográfico y planimetría actualizada.',
      },
      {
        title: 'Datos, CCTV y audio profesional',
        description: 'Redes estructuradas, cámaras, audio distribuido y automatización lista para upgrades.',
      },
      {
        title: 'Aires acondicionados',
        description: 'Instalación integral con cañería de cobre, vacío, carga y alimentación eléctrica.',
      },
    ],
  },
  trust: {
    title: 'Confianza operativa para equipos exigentes',
    subtitle: 'Procesos claros, reportes y experiencia comprobada en obra.',
    experience: 'Experiencia en locales y edificios (KFC / Smart Fit / DIA / Viviendas)',
    metrics: [
      { value: '+X m²', label: 'instalados' },
      { value: '+X', label: 'tableros armados' },
      { value: '+X', label: 'proyectos' },
    ],
    testimonials: [
      {
        name: 'Mariana López',
        role: 'Administración de consorcios',
        quote: 'Equipo prolijo, reportes claros y tiempos de respuesta reales.',
      },
      {
        name: 'Juan Pérez',
        role: 'Facility Manager',
        quote: 'Cumplieron normativa y entregaron documentación lista para auditorías.',
      },
      {
        name: 'Lucía Gómez',
        role: 'Dirección de obra',
        quote: 'Coordinación ágil en obra y comunicación constante.',
      },
    ],
    gallery: [
      { title: 'Tableros certificados', description: 'Fotos y checklist por visita (placeholder).' },
      { title: 'Obra comercial', description: 'Canalizaciones prolijas y señalización (placeholder).' },
      { title: 'Puesta a tierra', description: 'Mediciones certificadas y reporte (placeholder).' },
      { title: 'Locales activos', description: 'Trabajos sin interrumpir operación (placeholder).' },
    ],
  },
  packs: {
    title: 'Packs eléctricos para viviendas y countries',
    description:
      'Packs 100% mano de obra especializada. Materiales a elección del cliente, sin sobreprecios ocultos.',
    ctaLabel: 'Configurar pack',
    ctaHref: '/presupuestador',
    note: 'Proyecto eléctrico se cotiza aparte (base $500.000).',
  },
  maintenance: {
    title: 'Planes de mantenimiento con SLAs reales',
    description:
      'Diseñados para oficinas, cadenas de retail y consorcios. Cantidades fijas inalterables, visitas programadas y reportes digitales.',
    cards: [
      {
        title: 'Visitas preventivas',
        description:
          'Revisión de tableros, medición de temperaturas, apriete de borneras y reposición de consumibles.',
      },
      {
        title: 'Soporte correctivo',
        description:
          'Atención de urgencias dentro de las 24 h hábiles. Priorizamos sistemas críticos definidos en SLA.',
      },
      {
        title: 'Reporte ejecutivo',
        description:
          'Informe mensual con hallazgos, fotos geolocalizadas y recomendaciones de inversión.',
      },
    ],
  },
  works: {
    title: 'Casos de éxito',
    description:
      'Resultados medibles y documentación lista para auditorías de seguros, ART y entes reguladores.',
    introTitle: 'Obras destacadas',
    introDescription:
      'Selección de proyectos donde NERIN lideró ingeniería eléctrica, montaje y certificaciones.',
  },
  blog: {
    title: 'Insights eléctricos y buenas prácticas',
    description:
      'Consejos prácticos para administradores, desarrolladores y equipos de facilities.',
    introTitle: 'Blog',
    introDescription:
      'Contenido editorial para acompañar decisiones técnicas y de gestión eléctrica.',
  },
  brands: {
    title: 'Marcas que trabajamos todos los días',
    note: 'Coordinamos materiales con Schneider Electric, Prysmian, Gimsa, Daisa, Genrock y más.',
  },
  faq: {
    title: 'Preguntas frecuentes',
    description:
      'Transparencia total: contratos claros, avances certificados y soporte técnico en menos de 24 h hábil.',
    items: [
      {
        question: '¿Los packs incluyen materiales?',
        answer:
          'No. Los packs son solo mano de obra certificada. Los materiales se cotizan aparte según elección de marcas.',
      },
      {
        question: '¿El proyecto eléctrico está incluido?',
        answer:
          'El proyecto eléctrico se cotiza aparte. Tiene un valor base configurable desde este panel.',
      },
      {
        question: '¿Trabajan bajo normativa AEA?',
        answer:
          'Sí. Las instalaciones cumplen AEA 90364-7-771 (2006) y reglamentaciones locales. Documentamos cada etapa.',
      },
      {
        question: '¿Cómo se paga el avance de obra?',
        answer:
          'Emitimos Certificados de Avance con porcentaje ejecutado. Podés abonarlos online vía Mercado Pago.',
      },
    ],
  },
  closingCta: {
    title: 'Listos para ejecutar tu obra eléctrica con excelencia',
    description:
      'Coordinamos visita técnica, entregamos presupuesto detallado y planificamos el cronograma completo.',
    primary: { label: 'Solicitar alta del plan', href: '/presupuesto?tipo=mantenimiento' },
    secondary: { label: 'Pedir presupuesto rápido', href: '/presupuesto' },
  },
  company: {
    introTitle: 'NERIN: ingeniería eléctrica con protocolos y trazabilidad',
    introDescription:
      'Equipo multidisciplinario con más de 15 años en obras eléctricas para retail, gimnasios, corporativos y viviendas premium.',
    protocolsTitle: 'Protocolos de trabajo',
    protocols: [
      'Ingreso de personal con ART Swiss Medical y certificado de aptitud.',
      'Checklist diario de seguridad y reportes fotográficos.',
      'Entrega de carpeta final con planos, memorias y certificados.',
    ],
    complianceTitle: 'Compliance y seguros',
    compliance: [
      'Seguro de RC hasta USD 2M.',
      'Contratos transparentes con pagos escalonados por certificados.',
      'Cumplimiento de normativa AEA 90364-7-771, NFPA 70 y reglamentos locales.',
    ],
    mission: 'Hacer que cada instalación eléctrica sea auditada, segura y preparada para crecer.',
    teamTitle: 'Equipo técnico',
  },
  contactPage: {
    introTitle: 'Coordinemos tu obra eléctrica',
    introDescription:
      'Completá el formulario y un técnico senior se contactará dentro de las próximas 24 horas hábiles.',
    highlightBullets: [
      'Equipo propio con ART y seguros vigentes.',
      'Certificados de avance con pago online vía Mercado Pago.',
      'Reportes fotográficos y checklist digital en cada visita.',
      'Trabajo bajo normativa AEA 90364-7-771 (2006).',
      'Separación transparente entre mano de obra y materiales.',
    ],
    typeformUrl: 'https://nerin.typeform.com/to/xxxxx',
  },
  packsPage: {
    introTitle: 'Packs eléctricos para viviendas exigentes',
    introDescription:
      'Mano de obra certificada. Materiales no incluidos para que elijas marcas según tu presupuesto.',
    note: 'Proyecto eléctrico se cotiza aparte (base $500.000).',
  },
  maintenancePage: {
    introTitle: 'Planes de mantenimiento eléctrico con respuesta garantizada',
    introDescription:
      'Supervisión programada, chequeos preventivos y atención de emergencias para edificios, oficinas y cadenas comerciales.',
    cards: [
      {
        title: 'Visitas preventivas',
        description:
          'Revisión de tableros, medición de temperaturas, apriete de borneras y reposición de consumibles.',
      },
      {
        title: 'Soporte correctivo',
        description:
          'Atención de urgencias dentro de las 24 h hábiles. Priorizamos bombas, tableros generales y sistemas críticos.',
      },
      {
        title: 'Reporte ejecutivo',
        description:
          'Informe mensual con hallazgos, fotos geolocalizadas y recomendaciones de inversión.',
      },
    ],
  },
  responsive: {
    headline: 'Experiencia optimizada para escritorio, iPad y iPhone',
    bulletPoints: [
      'Componentes responsive con breakpoints específicos para obra en campo.',
      'Formularios con teclado numérico y máscaras en móviles.',
      'Accesibilidad AA garantizada en contraste y navegación.',
    ],
  },
  seo: {
    metaTitle: 'NERIN · Ingeniería eléctrica certificada en CABA y GBA',
    metaDescription:
      'Instalaciones eléctricas premium, tableros, mantenimiento y proyectos llave en mano con documentación completa.',
    keywords: [
      'instalaciones eléctricas',
      'contratista eléctrico',
      'tableros eléctricos',
      'puesta a tierra',
      'consorcios',
      'obras eléctricas CABA',
    ],
  },
}

function getTypeDir(type: string) {
  const dir = path.join(getStorageDir(), type)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  return dir
}

function getItemFile(type: string, slug: string) {
  return path.join(getTypeDir(type), `${slug}.json`)
}

export function readSite() {
  const dir = getStorageDir()
  const file = path.join(dir, SITE_FILE)
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(SITE_DEFAULTS, null, 2))
    return SITE_DEFAULTS
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch {
    return SITE_DEFAULTS
  }
}

export function writeSite(data: unknown) {
  const dir = getStorageDir()
  const file = path.join(dir, SITE_FILE)
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
  return true
}

export function listItems(type: string) {
  const dir = getTypeDir(type)
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
    .sort()
}

export function readMarkdown(type: string, slug: string) {
  const file = getItemFile(type, slug)
  if (!fs.existsSync(file)) return null
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch {
    return null
  }
}

export function writeMarkdown(type: string, slug: string, data: unknown, content: string) {
  const file = getItemFile(type, slug)
  const payload = { data: data ?? {}, content: content ?? '' }
  fs.writeFileSync(file, JSON.stringify(payload, null, 2))
  return payload
}

export function deleteMarkdown(type: string, slug: string) {
  const file = getItemFile(type, slug)
  if (fs.existsSync(file)) fs.unlinkSync(file)
}
