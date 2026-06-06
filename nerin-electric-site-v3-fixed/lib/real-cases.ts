export type RealCase = {
  slug: string
  title: string
  clientType: string
  workType: string
  scope: string
  status: string
  result: string
  approximateLocation?: string
  period?: string
  images: string[]
  confidentialityNote?: string
  challenge?: string
  solution?: string
  technicalScope: string[]
  gallery: string[]
  relatedDocumentation: string[]
}

export const realCases: RealCase[] = [
  {
    slug: 'local-gastronomico-cadena',
    title: 'Local gastronomico de cadena',
    clientType: 'Comercio gastronomico',
    workType: 'Participacion en instalacion electrica comercial',
    scope:
      'Relevamiento de necesidades electricas, canalizaciones, tendido de circuitos, apoyo en tablero e instalacion para areas de atencion y servicio.',
    status: 'Obra finalizada / informacion publica limitada',
    result:
      'Instalacion preparada para operacion comercial, con criterios de orden, seguridad y continuidad de servicio segun alcance confirmado.',
    approximateLocation: 'CABA / GBA, ubicacion no publicada',
    period: 'Periodo no publicado',
    images: [],
    confidentialityNote:
      'Sin permiso explicito para uso de marca. Se describe el tipo de obra sin presentar a la marca como cliente directo.',
    challenge:
      'Coordinar una instalacion comercial con tiempos ajustados, consumos diferenciados y necesidad de dejar sectores listos para puesta en marcha.',
    solution:
      'Trabajo por etapas, separacion de circuitos, orden de tablero y pruebas funcionales sobre los puntos intervenidos.',
    technicalScope: [
      'Canalizaciones y tendido de lineas segun requerimiento del local',
      'Circuitos para iluminacion, tomas y consumos especificos',
      'Apoyo en tablero y protecciones segun alcance de obra',
      'Pruebas basicas de funcionamiento y revision final',
    ],
    gallery: [],
    relatedDocumentation: [],
  },
  {
    slug: 'gimnasio-comercial',
    title: 'Gimnasio comercial',
    clientType: 'Espacio comercial de alto uso',
    workType: 'Instalacion electrica y adecuaciones por sectores',
    scope:
      'Intervencion sobre circuitos de iluminacion, tomas, sectores tecnicos y necesidades electricas asociadas a equipamiento de uso intensivo.',
    status: 'Obra finalizada / datos sensibles reservados',
    result:
      'Sectores electricos ordenados para uso comercial continuo, con revisiones y correcciones segun necesidades detectadas en obra.',
    approximateLocation: 'CABA / GBA, ubicacion aproximada bajo reserva',
    period: 'Periodo no publicado',
    images: [],
    confidentialityNote:
      'Sin autorizacion de marca o logo. El caso se comunica por rubro y alcance tecnico minimo.',
    challenge:
      'Resolver consumos distribuidos, horarios de trabajo y sectores con alta exigencia operativa sin afectar el avance general.',
    solution:
      'Planificacion por areas, circuitos diferenciados y control de terminaciones antes del cierre de cada etapa.',
    technicalScope: [
      'Distribucion electrica para areas de entrenamiento y apoyo',
      'Iluminacion y tomas de uso comercial',
      'Revision de tablero y derivaciones segun alcance',
      'Control visual y funcional de los puntos ejecutados',
    ],
    gallery: [],
    relatedDocumentation: [],
  },
  {
    slug: 'supermercado-local-retail',
    title: 'Supermercado / local de retail',
    clientType: 'Retail y atencion al publico',
    workType: 'Participacion en instalacion electrica comercial',
    scope:
      'Trabajos electricos para local con circulacion de publico, puntos de consumo comercial, iluminacion y apoyo operativo.',
    status: 'Obra finalizada / marcas no publicadas',
    result:
      'Instalacion ejecutada por sectores, con criterios de seguridad, orden de cableado y continuidad operativa segun alcance acordado.',
    approximateLocation: 'Area metropolitana de Buenos Aires',
    period: 'Periodo no publicado',
    images: [],
    confidentialityNote:
      'No se mencionan nombres comerciales por falta de permiso explicito o confirmacion contractual publica.',
    challenge:
      'Organizar trabajos en un entorno comercial con multiples consumos, sectores de servicio y necesidad de coordinacion con otros rubros.',
    solution:
      'Ejecucion por etapas, priorizacion de circuitos criticos y control de avance para entregar sectores utilizables.',
    technicalScope: [
      'Alimentacion de puntos de consumo comercial',
      'Tendido y ordenamiento de circuitos por sectores',
      'Iluminacion funcional y puntos de apoyo',
      'Pruebas de funcionamiento y correcciones finales',
    ],
    gallery: [],
    relatedDocumentation: [],
  },
  {
    slug: 'edificio-residencial',
    title: 'Edificio residencial',
    clientType: 'Consorcio / edificio de viviendas',
    workType: 'Adecuaciones electricas y mantenimiento por sectores comunes',
    scope:
      'Revision e intervenciones sobre tableros, circuitos comunes, iluminacion y necesidades puntuales de seguridad electrica.',
    status: 'Trabajos realizados / documentacion interna',
    result:
      'Mejoras puntuales para ordenar la instalacion comun, reducir riesgos visibles y dejar recomendaciones para futuras etapas.',
    approximateLocation: 'CABA / GBA',
    period: 'Periodo no publicado',
    images: [],
    confidentialityNote:
      'Se resguarda la direccion y datos del consorcio. El caso se presenta como referencia tecnica general.',
    challenge:
      'Intervenir instalaciones existentes con acceso compartido, uso diario del edificio y posibles condiciones antiguas.',
    solution:
      'Diagnostico inicial, priorizacion de riesgos, ejecucion por sectores y cierre con observaciones tecnicas.',
    technicalScope: [
      'Revision de tableros y circuitos comunes',
      'Correcciones puntuales en iluminacion o puntos existentes',
      'Identificacion de riesgos visibles',
      'Recomendaciones para mantenimiento o adecuacion futura',
    ],
    gallery: [],
    relatedDocumentation: [],
  },
]

export const workMethodSteps = [
  'Diagnostico',
  'Presupuesto',
  'Planificacion',
  'Ejecucion',
  'Control',
  'Documentacion',
  'Cierre y resena',
] as const

export function getRealCaseBySlug(slug: string) {
  return realCases.find((item) => item.slug === slug)
}
