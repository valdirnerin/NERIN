export type ElectricalServiceType = 'quick_service' | 'configurable' | 'diagnostic' | 'commercial'

export interface ElectricalService {
  id: string
  category: string
  type: ElectricalServiceType
  title: string
  description: string
  baseLaborPrice: number
  materialPolicy: string
  materialEstimateMin: number | null
  materialEstimateMax: number | null
  durationMin: number
  durationMax: number
  requiresVisit: boolean | 'segun_caso'
  photoRequired: boolean
  includes: string[]
  excludes: string[]
  usualMaterials: string[]
  priceModifiers: string[]
  appliesWhen: string
  doesNotApplyWhen: string
  relatedServices: string[]
  approvalRequired: true
}

export interface DiagnosticFault {
  id: string
  faultName: string
  initialPrice: number
  includedMinutes: number
  possibleCauses: string[]
  usualTests: string[]
  possibleSolutions: string[]
  advancedRequiredWhen: string[]
  extraHourPolicy: string
  disclaimer: string
  approvalRequired: true
}

export const currency = 'ARS'
export const additionalHourPrice = 30000

const quickBase = {
  type: 'quick_service' as const,
  category: 'Servicios rápidos',
  approvalRequired: true as const,
  photoRequired: true,
  materialPolicy: 'Materiales no incluidos salvo indicación expresa.',
  materialEstimateMin: null,
  materialEstimateMax: null,
}

export const quickServices: ElectricalService[] = [
  {
    ...quickBase,
    id: 'cambio-tomacorriente-existente',
    title: 'Cambio de tomacorriente existente',
    description: 'Reemplazo de toma sobre un punto eléctrico ya existente.',
    baseLaborPrice: 35000,
    materialPolicy: 'No incluidos. Estimado habitual: módulo, bastidor y tapa según línea elegida.',
    durationMin: 30,
    durationMax: 60,
    requiresVisit: false,
    includes: [
      'retiro del toma existente',
      'colocación del nuevo módulo',
      'conexión',
      'ajuste',
      'prueba de funcionamiento',
    ],
    excludes: [
      'canalización nueva',
      'cableado nuevo',
      'albañilería',
      'pintura',
      'reparación de caja dañada',
      'agregado de puesta a tierra si no existe',
    ],
    usualMaterials: ['módulo toma 10A o 20A', 'bastidor', 'tapa', 'tornillería menor'],
    priceModifiers: [
      'caja rota',
      'cables quemados o cortos',
      'falta de puesta a tierra',
      'cañería tapada',
      'urgencia',
      'zona fuera de cobertura principal',
    ],
    appliesWhen: 'Ya existe el punto eléctrico y solo hay que reemplazar el mecanismo.',
    doesNotApplyWhen: 'Querés crear un toma nuevo donde no hay instalación previa.',
    relatedServices: ['nuevo-punto-toma'],
  },
  {
    ...quickBase,
    id: 'cambio-llave-luz',
    title: 'Cambio de llave de luz',
    description: 'Reemplazo de tecla o llave sobre caja existente, con prueba de encendido.',
    baseLaborPrice: 32000,
    durationMin: 30,
    durationMax: 60,
    requiresVisit: false,
    includes: [
      'retiro de tecla existente',
      'conexión de módulo nuevo',
      'ajuste de bastidor y tapa',
      'prueba de funcionamiento',
    ],
    excludes: [
      'nuevo punto de comando',
      'cableado adicional',
      'reparación de caja o cañería',
      'cambios de circuito',
    ],
    usualMaterials: ['módulo tecla', 'bastidor', 'tapa', 'tornillería menor'],
    priceModifiers: [
      'cables cortos',
      'falso contacto previo',
      'caja floja',
      'combinación o escalera',
      'urgencia',
    ],
    appliesWhen: 'La llave ya existe y solo se reemplaza el mecanismo.',
    doesNotApplyWhen: 'Hay que crear una llave nueva, agregar retorno o modificar recorridos.',
    relatedServices: ['nuevo-punto-iluminacion'],
  },
  {
    ...quickBase,
    id: 'instalacion-luminaria-punto-existente',
    title: 'Instalación de luminaria sobre punto existente',
    description: 'Colocación de artefacto provisto sobre boca o punto de iluminación existente.',
    baseLaborPrice: 42000,
    durationMin: 45,
    durationMax: 90,
    requiresVisit: 'segun_caso',
    includes: [
      'desembalaje básico',
      'fijación en punto existente',
      'conexionado',
      'prueba de encendido',
    ],
    excludes: [
      'armado complejo',
      'altura mayor a 3 m',
      'nuevo cableado',
      'refuerzo de cielorraso',
      'materiales especiales',
    ],
    usualMaterials: ['tarugos', 'tornillos', 'conectores', 'lámparas si corresponde'],
    priceModifiers: [
      'altura',
      'peso del artefacto',
      'techo delicado',
      'cantidad de piezas',
      'fuera de horario',
    ],
    appliesWhen: 'Existe una boca eléctrica funcional donde se colocará la luminaria.',
    doesNotApplyWhen: 'No hay punto de iluminación o se requiere canalización/cableado nuevo.',
    relatedServices: ['nuevo-punto-iluminacion'],
  },
  {
    ...quickBase,
    id: 'cambio-termica',
    title: 'Cambio de térmica',
    description: 'Reemplazo de interruptor termomagnético existente compatible con el tablero.',
    baseLaborPrice: 45000,
    durationMin: 45,
    durationMax: 90,
    requiresVisit: 'segun_caso',
    includes: [
      'corte seguro',
      'retiro de protección existente',
      'colocación de nueva térmica',
      'ajuste y prueba',
    ],
    excludes: [
      'rediseño de tablero',
      'normalización completa',
      'cableado nuevo',
      'detección de fallas del circuito',
    ],
    usualMaterials: [
      'interruptor termomagnético',
      'peines o puentes si corresponden',
      'terminales',
    ],
    priceModifiers: [
      'tablero saturado',
      'cables recalentados',
      'protección incompatible',
      'falla aguas abajo',
      'urgencia',
    ],
    appliesWhen:
      'La protección existente debe reemplazarse por una equivalente y el tablero lo permite.',
    doesNotApplyWhen:
      'La térmica salta por una falla sin diagnosticar o el tablero requiere reforma.',
    relatedServices: ['diagnostico-salta-termica'],
  },
  {
    ...quickBase,
    id: 'cambio-disyuntor',
    title: 'Cambio de disyuntor',
    description: 'Reemplazo de interruptor diferencial existente con verificación básica.',
    baseLaborPrice: 52000,
    durationMin: 60,
    durationMax: 120,
    requiresVisit: 'segun_caso',
    includes: [
      'retiro de diferencial existente',
      'colocación del nuevo',
      'ajuste de conductores',
      'prueba de disparo',
    ],
    excludes: [
      'búsqueda de fuga',
      'separación de circuitos',
      'normalización de tablero',
      'puesta a tierra nueva',
    ],
    usualMaterials: ['interruptor diferencial', 'terminales', 'puentes si corresponden'],
    priceModifiers: [
      'fuga persistente',
      'neutros mezclados',
      'tablero sin espacio',
      'instalación antigua',
      'urgencia',
    ],
    appliesWhen: 'El diferencial está dañado o debe cambiarse por uno compatible.',
    doesNotApplyWhen: 'El disyuntor salta por fuga o falla no identificada.',
    relatedServices: ['diagnostico-salta-disyuntor'],
  },
  {
    ...quickBase,
    id: 'revision-simple-tablero',
    title: 'Revisión simple de tablero',
    description:
      'Control visual y funcional básico de tablero existente para orientar próximos pasos.',
    baseLaborPrice: 40000,
    durationMin: 45,
    durationMax: 90,
    requiresVisit: true,
    includes: [
      'revisión visual',
      'ajustes menores accesibles',
      'pruebas básicas',
      'recomendación de próximos pasos',
    ],
    excludes: [
      'normalización completa',
      'mediciones certificadas',
      'materiales',
      'reparaciones extensas',
    ],
    usualMaterials: ['terminales menores', 'precintos', 'rotulación básica'],
    priceModifiers: [
      'tablero muy deteriorado',
      'falta de espacio',
      'riesgo visible',
      'más de un tablero',
      'fuera de cobertura',
    ],
    appliesWhen: 'Se necesita una revisión inicial de un tablero accesible y acotado.',
    doesNotApplyWhen: 'Hay fallas activas, olor a quemado o necesidad de reforma completa.',
    relatedServices: ['ampliacion-tablero'],
  },
]

export const diagnosticFaults: DiagnosticFault[] = [
  'Salta el disyuntor.|Fuga a tierra, humedad, artefacto defectuoso, neutros mezclados.',
  'Salta la térmica.|Sobrecarga, cortocircuito, térmica dañada, cable recalentado.',
  'No funciona un sector.|Conexión floja, térmica baja, empalme abierto, cable cortado.',
  'Falso contacto.|Bornes flojos, módulo dañado, cable corto, caja deteriorada.',
  'Olor a quemado.|Recalentamiento, falso contacto, sobrecarga, material dañado.',
  'Luces que parpadean.|Falso contacto, baja tensión, neutro flojo, carga variable.',
  'Falla intermitente.|Humedad, vibración, empalme flojo, artefacto con defecto eventual.',
  'Ya vinieron otros electricistas y no encontraron la falla.|Instalación desordenada, falla oculta, recorridos no identificados, evento intermitente.',
].map((item, index) => {
  const [faultName, causes] = item.split('|')
  return {
    id: `diagnostico-${index + 1}`,
    faultName,
    initialPrice: index === 7 ? 85000 : 65000,
    includedMinutes: 90,
    possibleCauses: causes.split(', '),
    usualTests: [
      'entrevista sobre síntomas',
      'inspección visual',
      'pruebas por sectores',
      'verificación de protecciones',
      'aislamiento progresivo de cargas',
    ],
    possibleSolutions: [
      'ajuste o reemplazo puntual',
      'separación de sector afectado',
      'reparación simple con aprobación',
      'propuesta de visita avanzada',
    ],
    advancedRequiredWhen: [
      'la falla no aparece durante la visita',
      'hay sectores ocultos',
      'la instalación está desordenada',
      'se requiere desmontaje o más tiempo',
    ],
    extraHourPolicy: `Hora adicional editable: ${additionalHourPrice.toLocaleString('es-AR')} ARS. Las horas adicionales nunca se continúan sin aprobación del cliente.`,
    disclaimer:
      'No se garantiza detección total de fallas ocultas o intermitentes en una única visita.',
    approvalRequired: true as const,
  }
})

export const commercialServices = [
  'Cambio de lámparas en comercio',
  'Mantenimiento de luminarias',
  'Revisión de tablero de local',
  'Tomas para equipos comerciales',
  'Electricidad para mostradores y cajas',
  'Urgencias fuera de horario',
  'Mantenimiento preventivo mensual',
  'Trabajos en consorcios',
  'Trabajos en countries / barrios privados',
]
