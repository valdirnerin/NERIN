export const requestTypes = [
  'Trabajo chico',
  'Refaccion electrica',
  'Obra grande',
  'Servicio especial',
  'Otro',
] as const

export const coverageZones = [
  'CABA',
  'GBA Norte',
  'GBA Sur',
  'GBA Oeste',
  'Requiere confirmacion',
] as const

export const urgencyOptions = [
  'Hoy',
  'Esta semana',
  'Estoy comparando presupuestos',
  'Obra proxima a iniciar',
] as const

export const propertyTypes = [
  'Vivienda',
  'Departamento',
  'Casa',
  'Local comercial',
  'Oficina',
  'Edificio / consorcio',
  'Empresa',
  'Constructora',
  'Obra en curso',
] as const

export const safetyNotice =
  'NERIN puede cancelar, reprogramar o pasar a presupuesto manual cualquier trabajo si la instalacion presenta riesgo, falta de acceso, materiales incompatibles, humedad, recalentamiento, cableado deteriorado o condiciones inseguras.'

export const manualReviewMessage =
  'Tu solicitud requiere revision personalizada. La cotizacion sera evaluada por Valdir Nerin para darte un precio correcto y evitar presupuestos mal calculados.'

export const smallJobCategories = [
  'Tomas y teclas',
  'Tableros electricos',
  'Fallas electricas',
  'Iluminacion',
  'Aire acondicionado',
  'Circuitos dedicados',
  'Seguridad electrica',
  'Puesta a tierra',
  'Instalaciones menores',
  'Diagnostico',
] as const

export type PriceType = 'fijo' | 'desde' | 'a-presupuestar'

export type ServiceCatalogItem = {
  name: string
  slug: string
  category: (typeof smallJobCategories)[number]
  shortDescription: string
  longDescription: string
  priceFrom?: string
  priceType: PriceType
  estimatedLabor: string
  estimatedMaterials: string
  estimatedTravel: string
  estimatedDuration: string
  zone: string
  urgencyLevel: string
  includes: string[]
  excludes: string[]
  variants: string[]
  priceChanges: string[]
  manualReviewReasons: string[]
  safetyCancelReasons: string[]
}

export const serviceCatalog: ServiceCatalogItem[] = [
  {
    name: 'Cambio de tomacorriente',
    slug: 'cambio-de-tomacorriente',
    category: 'Tomas y teclas',
    shortDescription: 'Retiro del toma existente y colocacion de modulo compatible.',
    longDescription:
      'Servicio puntual para tomas flojos, quemados o deteriorados. Se revisa el estado visible de caja, modulo y conexion antes de avanzar.',
    priceFrom: '$35.000',
    priceType: 'desde',
    estimatedLabor: 'Mano de obra puntual',
    estimatedMaterials: 'Modulo y tapa se cotizan aparte si no los provee el cliente',
    estimatedTravel: 'Segun zona',
    estimatedDuration: '30 a 60 minutos',
    zone: 'CABA y GBA con confirmacion',
    urgencyLevel: 'Normal / urgente si hay olor o recalentamiento',
    includes: ['Retiro del toma existente', 'Colocacion de modulo compatible', 'Prueba basica de funcionamiento'],
    excludes: ['Cableado deteriorado', 'Caja danada', 'Canalizacion nueva', 'Materiales especiales'],
    variants: ['Toma simple', 'Toma doble', 'Toma quemado', 'Toma para mayor consumo'],
    priceChanges: ['Caja rota', 'Cableado viejo', 'Falta de acceso', 'Material no compatible'],
    manualReviewReasons: ['Olor a quemado', 'Recalentamiento', 'Instalacion vieja', 'Varios puntos afectados'],
    safetyCancelReasons: ['Humedad activa', 'Cableado carbonizado', 'Riesgo de contacto directo'],
  },
  {
    name: 'Cambio de tecla o llave de luz',
    slug: 'cambio-de-tecla-o-llave-de-luz',
    category: 'Tomas y teclas',
    shortDescription: 'Cambio de tecla simple, doble o combinada con revision basica.',
    longDescription:
      'Para teclas flojas, trabadas, quemadas o con falso contacto. Si hay falla de circuito, pasa a diagnostico.',
    priceFrom: '$32.000',
    priceType: 'desde',
    estimatedLabor: 'Mano de obra puntual',
    estimatedMaterials: 'Tecla y bastidor aparte',
    estimatedTravel: 'Segun zona',
    estimatedDuration: '30 a 60 minutos',
    zone: 'CABA y GBA con confirmacion',
    urgencyLevel: 'Normal',
    includes: ['Retiro de tecla existente', 'Colocacion de tecla compatible', 'Prueba de encendido'],
    excludes: ['Busqueda de falla oculta', 'Canalizacion', 'Cambio de cableado'],
    variants: ['Tecla simple', 'Tecla doble', 'Combinada', 'Pulsador'],
    priceChanges: ['Circuito mal identificado', 'Caja vieja', 'Modulos incompatibles'],
    manualReviewReasons: ['La luz no enciende aun con tecla nueva', 'Hay chispazos', 'Hay humedad'],
    safetyCancelReasons: ['Cable expuesto energizado', 'Humedad en caja', 'Recalentamiento visible'],
  },
  {
    name: 'Revision de tablero electrico',
    slug: 'revision-de-tablero-electrico',
    category: 'Tableros electricos',
    shortDescription: 'Chequeo visual y funcional de tablero, termicas, disyuntor y orden basico.',
    longDescription:
      'Revision para entender el estado del tablero y detectar riesgos, recalentamiento, protecciones incorrectas o necesidad de adecuacion.',
    priceFrom: '$55.000',
    priceType: 'desde',
    estimatedLabor: 'Diagnostico tecnico',
    estimatedMaterials: 'No incluye materiales',
    estimatedTravel: 'Segun zona',
    estimatedDuration: '60 a 90 minutos',
    zone: 'CABA y GBA con confirmacion',
    urgencyLevel: 'Alta si hay cortes, olor o termicas que disparan',
    includes: ['Revision visual', 'Chequeo de protecciones', 'Recomendacion de pasos siguientes'],
    excludes: ['Cambio de protecciones', 'Rearmado completo', 'Mediciones complejas'],
    variants: ['Tablero domiciliario', 'Tablero comercial', 'Tablero de edificio', 'Informe tecnico'],
    priceChanges: ['Cantidad de circuitos', 'Acceso al tablero', 'Necesidad de mediciones'],
    manualReviewReasons: ['Tablero con riesgo', 'Instalacion sin identificar', 'Pedido de informe formal'],
    safetyCancelReasons: ['Partes energizadas expuestas', 'Recalentamiento severo', 'Falta de corte seguro'],
  },
  {
    name: 'Reparacion de falla electrica',
    slug: 'reparacion-de-falla-electrica',
    category: 'Fallas electricas',
    shortDescription: 'Diagnostico y resolucion de cortes, falsos contactos o disparos de protecciones.',
    longDescription:
      'Las fallas pueden ser simples o complejas. Primero se diagnostica; si el caso excede una reparacion puntual, pasa a presupuesto manual.',
    priceFrom: '$45.000',
    priceType: 'desde',
    estimatedLabor: 'Diagnostico inicial',
    estimatedMaterials: 'Segun falla detectada',
    estimatedTravel: 'Segun zona',
    estimatedDuration: '1 a 2 horas iniciales',
    zone: 'CABA y GBA con confirmacion',
    urgencyLevel: 'Alta',
    includes: ['Diagnostico inicial', 'Busqueda de causa probable', 'Resolucion si es puntual'],
    excludes: ['Reemplazo masivo de cableado', 'Canalizaciones', 'Materiales no previstos'],
    variants: ['Salta termica', 'Salta disyuntor', 'Sector sin energia', 'Falso contacto'],
    priceChanges: ['Falla intermitente', 'Cableado oculto', 'Tablero desordenado', 'Multiples sectores afectados'],
    manualReviewReasons: ['Riesgo electrico', 'Falla extensa', 'Instalacion antigua', 'Necesidad de refaccion'],
    safetyCancelReasons: ['Olor a quemado persistente', 'Humedad', 'Cableado derretido', 'Riesgo para operar'],
  },
  {
    name: 'Instalacion de toma para aire acondicionado',
    slug: 'instalacion-de-toma-para-aire-acondicionado',
    category: 'Aire acondicionado',
    shortDescription: 'Preparacion electrica para equipo con consumo dedicado.',
    longDescription:
      'Servicio para dejar preparado un punto electrico adecuado para aire acondicionado. Puede requerir circuito dedicado segun consumo y tablero.',
    priceFrom: '$95.000',
    priceType: 'desde',
    estimatedLabor: 'Instalacion puntual o circuito dedicado',
    estimatedMaterials: 'Cable, proteccion y toma se cotizan aparte',
    estimatedTravel: 'Segun zona',
    estimatedDuration: '2 a 4 horas',
    zone: 'CABA y GBA con confirmacion',
    urgencyLevel: 'Normal',
    includes: ['Revision de tablero', 'Definicion de recorrido', 'Instalacion segun alcance aprobado'],
    excludes: ['Roturas complejas', 'Albanileria', 'Materiales especiales', 'Equipo de aire'],
    variants: ['Toma cercano', 'Circuito dedicado', 'Varios equipos', 'Local/oficina'],
    priceChanges: ['Distancia al tablero', 'Canalizacion necesaria', 'Cantidad de equipos'],
    manualReviewReasons: ['Varios aires', 'Tablero sin capacidad', 'Recorrido complejo'],
    safetyCancelReasons: ['Tablero inseguro', 'Cableado insuficiente', 'Falta de proteccion'],
  },
  {
    name: 'Colocacion de luminaria o plafon',
    slug: 'colocacion-de-luminaria-o-plafon',
    category: 'Iluminacion',
    shortDescription: 'Instalacion de artefacto, plafon, aplique o luminaria compatible.',
    longDescription:
      'Colocacion de luminarias en puntos existentes. Si hay que crear bocas, canalizar o reparar circuito, se cotiza aparte.',
    priceFrom: '$38.000',
    priceType: 'desde',
    estimatedLabor: 'Colocacion puntual',
    estimatedMaterials: 'Tornilleria especial o accesorios aparte',
    estimatedTravel: 'Segun zona',
    estimatedDuration: '30 a 90 minutos',
    zone: 'CABA y GBA con confirmacion',
    urgencyLevel: 'Normal',
    includes: ['Colocacion en punto existente', 'Conexion', 'Prueba de funcionamiento'],
    excludes: ['Nueva boca', 'Canalizacion', 'Artefactos pesados o especiales'],
    variants: ['Plafon', 'Aplique', 'Colgante', 'Ventilador de techo'],
    priceChanges: ['Altura', 'Peso del artefacto', 'Falta de punto electrico', 'Techo especial'],
    manualReviewReasons: ['Ventilador pesado', 'Altura compleja', 'Instalacion sin punto existente'],
    safetyCancelReasons: ['Soporte inseguro', 'Cableado deteriorado', 'Techo no apto'],
  },
  {
    name: 'Revision de puesta a tierra',
    slug: 'revision-de-puesta-a-tierra',
    category: 'Puesta a tierra',
    shortDescription: 'Revision inicial de seguridad electrica y protecciones asociadas.',
    longDescription:
      'Servicio para revisar condiciones de seguridad y definir si hace falta medicion, adecuacion o informe tecnico.',
    priceFrom: '$65.000',
    priceType: 'desde',
    estimatedLabor: 'Revision tecnica',
    estimatedMaterials: 'No incluye jabalina ni adecuaciones',
    estimatedTravel: 'Segun zona',
    estimatedDuration: '60 a 120 minutos',
    zone: 'CABA y GBA con confirmacion',
    urgencyLevel: 'Media / alta si hay descargas',
    includes: ['Revision inicial', 'Chequeo de protecciones', 'Recomendacion tecnica'],
    excludes: ['Informe certificado', 'Materiales', 'Adecuacion completa'],
    variants: ['Vivienda', 'Local', 'Consorcio', 'Informe tecnico'],
    priceChanges: ['Necesidad de medicion formal', 'Acceso a tablero', 'Estado de instalacion'],
    manualReviewReasons: ['Descargas', 'Consorcio', 'Informe formal', 'Instalacion insegura'],
    safetyCancelReasons: ['Riesgo de contacto', 'Humedad', 'Falta de corte seguro'],
  },
  {
    name: 'Diagnostico electrico',
    slug: 'diagnostico-electrico',
    category: 'Diagnostico',
    shortDescription: 'Visita tecnica para entender el problema y definir presupuesto correcto.',
    longDescription:
      'Ideal cuando el problema no encaja en un trabajo estandar. La cotizacion queda a revisar por Valdir Nerin.',
    priceFrom: '$45.000',
    priceType: 'desde',
    estimatedLabor: 'Visita tecnica',
    estimatedMaterials: 'No incluye materiales',
    estimatedTravel: 'Segun zona',
    estimatedDuration: '60 a 120 minutos',
    zone: 'CABA y GBA con confirmacion',
    urgencyLevel: 'Segun caso',
    includes: ['Revision inicial', 'Diagnostico', 'Siguiente paso recomendado'],
    excludes: ['Reparaciones extensas', 'Materiales', 'Informe formal si no se solicita'],
    variants: ['Falla', 'Sobreconsumo', 'Compra/alquiler', 'Tablero'],
    priceChanges: ['Complejidad', 'Cantidad de sectores', 'Necesidad de informe'],
    manualReviewReasons: ['Caso no catalogado', 'Riesgo', 'Fotos complejas', 'Fuera de zona'],
    safetyCancelReasons: ['Condicion insegura', 'Falta de acceso', 'Riesgo para operar'],
  },
]

export const renovationCards = [
  {
    title: 'Refaccion electrica de departamento',
    description: 'Reforma parcial o completa por ambientes, bocas, tablero y circuitos.',
  },
  {
    title: 'Reforma electrica de local u oficina',
    description: 'Preparacion para actividad comercial, iluminacion, tomas, tablero y seguridad.',
  },
  {
    title: 'Renovacion de tablero y circuitos',
    description: 'Separacion de circuitos, protecciones y adecuacion de instalaciones antiguas.',
  },
  {
    title: 'Ampliacion electrica',
    description: 'Nuevas bocas, nuevos consumos, cocina, aires o remodelaciones puntuales.',
  },
] as const

export const majorWorks = [
  'Edificios',
  'Locales comerciales',
  'Oficinas grandes',
  'Gimnasios',
  'Supermercados',
  'Obras para constructoras',
  'Instalaciones integrales',
] as const

export const specialServices = [
  {
    title: 'Diagnostico electrico preventivo',
    price: 'Desde $45.000',
    description: 'Revision para detectar riesgos antes de que aparezca una falla costosa.',
  },
  {
    title: 'Informe tecnico de tablero',
    price: 'A presupuestar',
    description: 'Evaluacion de tablero, protecciones y recomendaciones para hogares, comercios o consorcios.',
  },
  {
    title: 'Revision antes de comprar o alquilar',
    price: 'Desde $65.000',
    description: 'Chequeo previo para no heredar una instalacion cara de corregir.',
  },
  {
    title: 'Revision por cortes frecuentes',
    price: 'Desde $55.000',
    description: 'Diagnostico de disparos, falsos contactos, sobrecargas y sectores inestables.',
  },
  {
    title: 'Relevamiento electrico para obra',
    price: 'A presupuestar',
    description: 'Base tecnica para presupuestar una refaccion u obra sin calcular a ciegas.',
  },
  {
    title: 'Correccion de instalacion insegura',
    price: 'Revision por Valdir Nerin',
    description: 'Casos con riesgo, humedad, recalentamiento, cableado viejo o protecciones incorrectas.',
  },
] as const

export const featuredExperience = [
  'KFC',
  'Smart Fit',
  'Supermercados DIA',
  'Edificios residenciales',
] as const

export const trustItems = [
  'Precios orientativos donde corresponde',
  'Presupuestacion manual para casos complejos',
  'Materiales separados de la mano de obra',
  'Seguimiento real por solicitud, trabajo u obra',
  'Control de costos, cobros y gastos',
  'Certificados de avance en obras grandes',
  'Criterio de seguridad antes de ejecutar',
  'Imagen profesional para hogares, comercios y empresas',
] as const

export function getServiceBySlug(slug: string) {
  return serviceCatalog.find((item) => item.slug === slug)
}

export function moneyLabel(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}
