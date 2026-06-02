export const whatsappFallbackNumber = '54911'

export const serviceCards = [
  {
    title: 'Fallas electricas',
    description: 'Cortes, termicas que saltan, falsos contactos, sectores sin energia y diagnostico rapido.',
    price: 'Visita tecnica desde $45.000',
    href: '/presupuestador?tipo=falla-electrica',
  },
  {
    title: 'Tableros electricos',
    description: 'Ordenamiento, protecciones, termicas, disyuntores, circuitos y adecuaciones.',
    price: 'Revision desde $55.000',
    href: '/presupuestador?tipo=tablero-electrico',
  },
  {
    title: 'Instalaciones para viviendas',
    description: 'Instalaciones nuevas, reformas, ampliaciones, tomas, iluminacion y circuitos dedicados.',
    price: 'Mano de obra desde $180.000',
    href: '/packs',
  },
  {
    title: 'Locales y oficinas',
    description: 'Puesta en marcha, reformas comerciales, iluminacion, tableros y mantenimiento preventivo.',
    price: 'Diagnostico comercial desde $65.000',
    href: '/servicios',
  },
  {
    title: 'Edificios y consorcios',
    description: 'Tableros, espacios comunes, bombas, iluminacion, urgencias y mantenimiento mensual.',
    price: 'Relevamiento desde $85.000',
    href: '/mantenimiento',
  },
  {
    title: 'Mantenimiento electrico',
    description: 'Planes mensuales para prevenir cortes, ordenar reclamos y bajar riesgos operativos.',
    price: 'Planes desde $180.000/mes',
    href: '/mantenimiento',
  },
  {
    title: 'Aires y circuitos dedicados',
    description: 'Lineas independientes, protecciones correctas y preparacion para equipos de consumo alto.',
    price: 'Circuito desde $95.000',
    href: '/presupuestador?tipo=aire-circuito',
  },
  {
    title: 'Puesta a tierra y protecciones',
    description: 'Revision de seguridad, protecciones diferenciales y mejoras para instalaciones existentes.',
    price: 'Revision desde $55.000',
    href: '/presupuestador?tipo=protecciones',
  },
] as const

export const packs = [
  {
    name: 'Vivienda Estandar',
    price: 'Desde $1.850.000',
    description: 'Base de mano de obra para una vivienda tipo con circuitos, bocas y tablero definidos.',
    bullets: ['Instalacion ordenada por ambientes', 'Tablero y protecciones definidos', 'Avance por etapas'],
  },
  {
    name: 'Casa Country 1',
    price: 'Desde $3.950.000',
    description: 'Para casas medianas con mayor cantidad de bocas, exteriores y circuitos especiales.',
    bullets: ['Circuitos por uso', 'Prevision para exteriores', 'Coordinacion con obra'],
  },
  {
    name: 'Casa Country 2',
    price: 'Desde $6.800.000',
    description: 'Para obras grandes con mas ambientes, mayor criticidad y seguimiento tecnico.',
    bullets: ['Plan por etapas', 'Certificados de avance', 'Control de adicionales'],
  },
] as const

export const maintenancePlans = [
  {
    name: 'BASIC',
    price: 'Desde $180.000/mes',
    fit: 'Locales chicos, oficinas pequenas y departamentos grandes.',
    bullets: ['Revision mensual', 'Prioridad ante fallas', 'Reporte basico por WhatsApp'],
  },
  {
    name: 'PRO',
    price: 'Desde $320.000/mes',
    fit: 'Edificios, oficinas medianas y comercios activos.',
    bullets: ['Visitas programadas', 'Checklist preventivo', 'Seguimiento de pendientes'],
  },
  {
    name: 'ENTERPRISE',
    price: 'A medida',
    fit: 'Cadenas, edificios grandes y clientes con alta criticidad.',
    bullets: ['SLA acordado', 'Plan por sedes', 'Reportes y certificados'],
  },
] as const

export const featuredExperience = [
  'KFC',
  'Smart Fit',
  'Supermercados DIA',
  'Edificios residenciales',
] as const

export const trustItems = [
  'Presupuesto claro',
  'Mano de obra prolija',
  'Seguimiento por WhatsApp',
  'Materiales separados',
  'Documentacion tecnica',
  'Certificados de avance',
  'Experiencia en obra',
  'Atencion para hogares, comercios y empresas',
] as const

export const leadWorkTypes = [
  'Falla electrica',
  'Tablero electrico',
  'Instalacion electrica vivienda',
  'Local / oficina',
  'Edificio / consorcio',
  'Aire acondicionado / circuito dedicado',
  'Mantenimiento mensual',
  'Otro',
] as const

export const urgencyOptions = [
  'Hoy',
  'Esta semana',
  'Estoy comparando presupuestos',
  'Obra proxima a iniciar',
] as const

export const propertyTypes = [
  'Vivienda',
  'Local comercial',
  'Oficina',
  'Edificio / consorcio',
  'Empresa',
  'Obra en curso',
] as const

export function moneyLabel(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}
