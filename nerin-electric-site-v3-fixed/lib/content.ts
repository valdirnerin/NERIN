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
  tagline: 'Trabajos electricos, refacciones y obras con presupuesto claro.',
  logo: {
    title: 'NERIN',
    subtitle: 'Ingeniería Eléctrica',
    imageUrl: '',
  },
  accent: '#f59e0b',
  socials: {
    instagram: 'https://www.instagram.com/nerin.electric',
    linkedin: 'https://www.linkedin.com/company/nerin-electric',
  },
  contact: {
    email: 'hola@nerin.com.ar',
    phone: '',
    secondaryPhones: [],
    address: 'CABA y GBA',
    schedule: 'Lunes a viernes de 08:00 a 18:00',
    serviceArea: 'Ciudad AutÃ³noma de Buenos Aires y GBA',
    whatsappNumber: '',
    whatsappMessage: 'Hola, quiero solicitar un trabajo electrico con NERIN.',
    whatsappCtaLabel: 'Hablar ahora',
  },
  hero: {
    badge: 'Trabajos chicos, refacciones y obras electricas',
    title: 'Contratista elÃ©ctrico para obras, comercios y consorcios en CABA',
    subtitle: 'Presupuesto en 24â€“48 h. Cumplimiento normativo. Experiencia real en obra.',
    backgroundImage:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
    caption: 'Tablero general edificio 4.000 mÂ² Â· Ensayos y certificaciones completas.',
    primaryCta: { label: 'Quiero una visita tÃ©cnica', href: '/contacto?motivo=Visita tÃ©cnica' },
    secondaryCta: { label: 'Necesito presupuesto de obra', href: '/contacto?motivo=Presupuesto de obra' },
    tertiaryCta: { label: 'Buscar trabajo electrico', href: '/trabajos-electricos' },
    highlights: [
      {
        title: 'Experiencia en locales y edificios',
        description: 'KFC, Smart Fit, DIA, viviendas y consorcios.',
      },
      {
        title: 'Tiempos de respuesta claros',
        description: 'Presupuestos en 24â€“48 h y seguimiento semanal.',
      },
    ],
    stats: [
      {
        label: 'CoordinaciÃ³n sin fricciones',
        description: 'Equipo propio, seguros al dÃ­a y reportes fotogrÃ¡ficos.',
      },
      {
        label: 'Cumplimiento normativo',
        description: 'AEA 90364-7-771 con trazabilidad y documentaciÃ³n.',
      },
    ],
  },
  services: {
    title: 'Servicios elÃ©ctricos de punta a punta',
    description:
      'Intervenimos en obra nueva, adecuaciones y expansiÃ³n. DocumentaciÃ³n completa, planos as-built y soporte post entrega.',
    items: [
      {
        title: 'Instalaciones elÃ©ctricas completas',
        description: 'Proyecto ejecutivo, tableros, canalizaciones y puesta en marcha.',
      },
      {
        title: 'Tableros a medida',
        description: 'Montaje, ensayo y certificaciÃ³n de tableros generales, seccionales y CCM.',
      },
      {
        title: 'Puesta a tierra y descargas atmosfÃ©ricas',
        description: 'Mallas, jabalinas, mediciones con informes certificados y adecuaciones AEA.',
      },
      {
        title: 'Canalizaciones y bandejas portacables',
        description: 'Tendidos prolijos, registro fotogrÃ¡fico y planimetrÃ­a actualizada.',
      },
      {
        title: 'Datos, CCTV y audio profesional',
        description: 'Redes estructuradas, cÃ¡maras, audio distribuido y automatizaciÃ³n lista para upgrades.',
      },
      {
        title: 'Aires acondicionados',
        description: 'InstalaciÃ³n integral con caÃ±erÃ­a de cobre, vacÃ­o, carga y alimentaciÃ³n elÃ©ctrica.',
      },
    ],
  },
  trust: {
    title: 'Confianza operativa para equipos exigentes',
    subtitle: 'Procesos claros, reportes y experiencia comprobada en obra.',
    experience: 'Experiencia en locales y edificios (KFC / Smart Fit / DIA / Viviendas)',
    metrics: [
      { value: '+X mÂ²', label: 'instalados' },
      { value: '+X', label: 'tableros armados' },
      { value: '+X', label: 'proyectos' },
    ],
    testimonials: [
      {
        name: 'Mariana LÃ³pez',
        role: 'AdministraciÃ³n de consorcios',
        quote: 'Equipo prolijo, reportes claros y tiempos de respuesta reales.',
      },
      {
        name: 'Juan PÃ©rez',
        role: 'Facility Manager',
        quote: 'Cumplieron normativa y entregaron documentaciÃ³n lista para auditorÃ­as.',
      },
      {
        name: 'LucÃ­a GÃ³mez',
        role: 'DirecciÃ³n de obra',
        quote: 'CoordinaciÃ³n Ã¡gil en obra y comunicaciÃ³n constante.',
      },
    ],
    gallery: [
      { title: 'Tableros certificados', description: 'Fotos y checklist por visita (placeholder).' },
      { title: 'Obra comercial', description: 'Canalizaciones prolijas y seÃ±alizaciÃ³n (placeholder).' },
      { title: 'Puesta a tierra', description: 'Mediciones certificadas y reporte (placeholder).' },
      { title: 'Locales activos', description: 'Trabajos sin interrumpir operaciÃ³n (placeholder).' },
    ],
  },
  packs: {
    title: 'Refacciones electricas y trabajos medianos',
    description:
      'Trabajos de mayor alcance que requieren relevamiento, fotos, alcance real y presupuesto por Valdir Nerin.',
    ctaLabel: 'Pedir relevamiento',
    ctaHref: '/presupuestador',
    note: 'Proyecto elÃ©ctrico se cotiza aparte (base $500.000).',
  },
  maintenance: {
    title: 'Servicios especiales con revision tecnica',
    description:
      'Diagnosticos, informes, revision de tablero, puesta a tierra y relevamientos para decidir sin calcular a ciegas.',
    cards: [
      {
        title: 'Visitas preventivas',
        description:
          'RevisiÃ³n de tableros, mediciÃ³n de temperaturas, apriete de borneras y reposiciÃ³n de consumibles.',
      },
      {
        title: 'Soporte correctivo',
        description:
          'AtenciÃ³n de urgencias dentro de las 24 h hÃ¡biles. Priorizamos sistemas crÃ­ticos definidos en SLA.',
      },
      {
        title: 'Reporte ejecutivo',
        description:
          'Informe mensual con hallazgos, fotos geolocalizadas y recomendaciones de inversiÃ³n.',
      },
    ],
  },
  works: {
    title: 'Casos de Ã©xito',
    description:
      'Resultados medibles y documentaciÃ³n lista para auditorÃ­as de seguros, ART y entes reguladores.',
    introTitle: 'Obras destacadas',
    introDescription:
      'SelecciÃ³n de proyectos donde NERIN liderÃ³ ingenierÃ­a elÃ©ctrica, montaje y certificaciones.',
  },
  blog: {
    title: 'Insights elÃ©ctricos y buenas prÃ¡cticas',
    description:
      'Consejos prÃ¡cticos para administradores, desarrolladores y equipos de facilities.',
    introTitle: 'Blog',
    introDescription:
      'Contenido editorial para acompaÃ±ar decisiones tÃ©cnicas y de gestiÃ³n elÃ©ctrica.',
  },
  brands: {
    title: 'Marcas que trabajamos todos los dÃ­as',
    note: 'Coordinamos materiales con Schneider Electric, Prysmian, Gimsa, Daisa, Genrock y mÃ¡s.',
  },
  faq: {
    title: 'Preguntas frecuentes',
    description:
      'Transparencia total: contratos claros, avances certificados y soporte tÃ©cnico en menos de 24 h hÃ¡bil.',
    items: [
      {
        question: 'Â¿Los packs incluyen materiales?',
        answer:
          'No. Los packs son solo mano de obra certificada. Los materiales se cotizan aparte segÃºn elecciÃ³n de marcas.',
      },
      {
        question: 'Â¿El proyecto elÃ©ctrico estÃ¡ incluido?',
        answer:
          'El proyecto elÃ©ctrico se cotiza aparte. Tiene un valor base configurable desde este panel.',
      },
      {
        question: 'Â¿Trabajan bajo normativa AEA?',
        answer:
          'SÃ­. Las instalaciones cumplen AEA 90364-7-771 (2006) y reglamentaciones locales. Documentamos cada etapa.',
      },
      {
        question: 'Â¿CÃ³mo se paga el avance de obra?',
        answer:
          'Emitimos Certificados de Avance con porcentaje ejecutado. PodÃ©s abonarlos online vÃ­a Mercado Pago.',
      },
    ],
  },
  closingCta: {
    title: 'Listos para ejecutar tu obra elÃ©ctrica con excelencia',
    description:
      'Coordinamos visita tÃ©cnica, entregamos presupuesto detallado y planificamos el cronograma completo.',
    primary: { label: 'Pedir trabajo electrico', href: '/presupuestador' },
    secondary: { label: 'Ver catalogo', href: '/trabajos-electricos' },
  },
  company: {
    introTitle: 'NERIN: ingenierÃ­a elÃ©ctrica con protocolos y trazabilidad',
    introDescription:
      'Equipo multidisciplinario con mÃ¡s de 15 aÃ±os en obras elÃ©ctricas para retail, gimnasios, corporativos y viviendas premium.',
    protocolsTitle: 'Protocolos de trabajo',
    protocols: [
      'Ingreso de personal con ART Swiss Medical y certificado de aptitud.',
      'Checklist diario de seguridad y reportes fotogrÃ¡ficos.',
      'Entrega de carpeta final con planos, memorias y certificados.',
    ],
    complianceTitle: 'Compliance y seguros',
    compliance: [
      'Seguro de RC hasta USD 2M.',
      'Contratos transparentes con pagos escalonados por certificados.',
      'Cumplimiento de normativa AEA 90364-7-771, NFPA 70 y reglamentos locales.',
    ],
    mission: 'Hacer que cada instalaciÃ³n elÃ©ctrica sea auditada, segura y preparada para crecer.',
    teamTitle: 'Equipo tÃ©cnico',
  },
  contactPage: {
    introTitle: 'Coordinemos tu obra elÃ©ctrica',
    introDescription:
      'CompletÃ¡ el formulario y un tÃ©cnico senior se contactarÃ¡ dentro de las prÃ³ximas 24 horas hÃ¡biles.',
    highlightBullets: [
      'Equipo propio con ART y seguros vigentes.',
      'Certificados de avance con pago online vÃ­a Mercado Pago.',
      'Reportes fotogrÃ¡ficos y checklist digital en cada visita.',
      'Trabajo bajo normativa AEA 90364-7-771 (2006).',
      'SeparaciÃ³n transparente entre mano de obra y materiales.',
    ],
    typeformUrl: 'https://nerin.typeform.com/to/xxxxx',
  },
  packsPage: {
    introTitle: 'Packs elÃ©ctricos para viviendas exigentes',
    introDescription:
      'Mano de obra certificada. Materiales no incluidos para que elijas marcas segÃºn tu presupuesto.',
    note: 'Proyecto elÃ©ctrico se cotiza aparte (base $500.000).',
  },
  maintenancePage: {
    introTitle: 'Servicios especiales con revision tecnica',
    introDescription:
      'Diagnosticos, informes y relevamientos para trabajos que no conviene presupuestar a ciegas.',
    cards: [
      {
        title: 'Visitas preventivas',
        description:
          'RevisiÃ³n de tableros, mediciÃ³n de temperaturas, apriete de borneras y reposiciÃ³n de consumibles.',
      },
      {
        title: 'Soporte correctivo',
        description:
          'AtenciÃ³n de urgencias dentro de las 24 h hÃ¡biles. Priorizamos bombas, tableros generales y sistemas crÃ­ticos.',
      },
      {
        title: 'Reporte ejecutivo',
        description:
          'Informe mensual con hallazgos, fotos geolocalizadas y recomendaciones de inversiÃ³n.',
      },
    ],
  },
  responsive: {
    headline: 'Experiencia optimizada para escritorio, iPad y iPhone',
    bulletPoints: [
      'Componentes responsive con breakpoints especÃ­ficos para obra en campo.',
      'Formularios con teclado numÃ©rico y mÃ¡scaras en mÃ³viles.',
      'Accesibilidad AA garantizada en contraste y navegaciÃ³n.',
    ],
  },
  seo: {
    metaTitle: 'NERIN · Ingeniería eléctrica certificada en CABA y GBA',
    metaDescription:
      'Trabajos electricos, refacciones, servicios especiales y obras con presupuesto claro.',
    keywords: [
      'instalaciones elÃ©ctricas',
      'contratista elÃ©ctrico',
      'tableros elÃ©ctricos',
      'puesta a tierra',
      'consorcios',
      'obras elÃ©ctricas CABA',
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

