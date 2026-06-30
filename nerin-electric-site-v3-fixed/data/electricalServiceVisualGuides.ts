export type ServiceVisualCallout = {
  number: number
  label: string
}

export type RelatedVisualGuideService = {
  label: string
  targetServiceId: string
}

export type ElectricalServiceVisualGuide = {
  serviceId: string
  visualGuide: {
    imageSrc: string
    imageAlt: string
    diagramTitle: string
    diagramSubtitle: string
    callouts: ServiceVisualCallout[]
    appliesIf: string[]
    doesNotApplyIf: string[]
    usualMaterialsShort: string
    durationLabel: string
    relatedIfNotApplies: RelatedVisualGuideService[]
  }
}

const imageBase = '/images/service-guides'

export const electricalServiceVisualGuides: ElectricalServiceVisualGuide[] = [
  {
    serviceId: 'cambio-tomacorriente-existente',
    visualGuide: {
      imageSrc: `${imageBase}/cambio-tomacorriente-existente.png`,
      imageAlt:
        'Guía técnica de un tomacorriente existente con tapa, módulo, bastidor, caja y cableado señalados.',
      diagramTitle: 'Tomacorriente existente',
      diagramSubtitle: 'Reemplazo sobre caja y cableado ya instalados.',
      callouts: [
        { number: 1, label: 'tapa' },
        { number: 2, label: 'módulo' },
        { number: 3, label: 'bastidor' },
        { number: 4, label: 'caja existente' },
        { number: 5, label: 'cableado existente' },
      ],
      appliesIf: [
        'ya existe el tomacorriente',
        'querés reemplazarlo',
        'no hay que crear un punto nuevo',
      ],
      doesNotApplyIf: [
        'querés un toma nuevo donde no hay',
        'hay que romper pared o hacer recorrido',
        'el problema es general del circuito',
      ],
      usualMaterialsShort: 'módulo, bastidor, tapa',
      durationLabel: '30 a 60 min',
      relatedIfNotApplies: [
        { label: 'Necesito un punto nuevo', targetServiceId: 'nuevo-punto-toma' },
      ],
    },
  },
  {
    serviceId: 'cambio-llave-luz',
    visualGuide: {
      imageSrc: `${imageBase}/cambio-llave-luz.png`,
      imageAlt:
        'Guía técnica de una llave de luz existente con tapa, mecanismo, bastidor, caja y cableado señalados.',
      diagramTitle: 'Llave de luz existente',
      diagramSubtitle: 'Recambio de mecanismo sin crear un comando nuevo.',
      callouts: [
        { number: 1, label: 'tapa' },
        { number: 2, label: 'mecanismo' },
        { number: 3, label: 'bastidor' },
        { number: 4, label: 'caja existente' },
        { number: 5, label: 'cableado existente' },
      ],
      appliesIf: [
        'ya existe la llave de luz',
        'querés reemplazarla',
        'no hay que crear un punto nuevo',
      ],
      doesNotApplyIf: [
        'querés agregar una llave nueva',
        'hay que hacer recorrido o canalización',
        'el problema es general del circuito',
      ],
      usualMaterialsShort: 'mecanismo, bastidor, tapa',
      durationLabel: '30 a 60 min',
      relatedIfNotApplies: [
        { label: 'Necesito agregar una llave nueva', targetServiceId: 'nuevo-punto-iluminacion' },
      ],
    },
  },
  {
    serviceId: 'instalacion-luminaria-punto-existente',
    visualGuide: {
      imageSrc: `${imageBase}/instalacion-luminaria-punto-existente.png`,
      imageAlt:
        'Guía técnica de instalación de luminaria sobre boca existente con soporte, cableado y techo o pared señalados.',
      diagramTitle: 'Luminaria sobre punto existente',
      diagramSubtitle: 'Montaje y conexión donde ya hay boca de iluminación.',
      callouts: [
        { number: 1, label: 'luminaria' },
        { number: 2, label: 'soporte' },
        { number: 3, label: 'boca existente' },
        { number: 4, label: 'cableado existente' },
        { number: 5, label: 'techo o pared' },
      ],
      appliesIf: [
        'ya existe la boca de iluminación',
        'solo hay que montar y conectar',
        'no hay que crear un punto nuevo',
      ],
      doesNotApplyIf: [
        'hay que crear un punto nuevo',
        'se requiere recorrido o canalización',
        'la instalación necesita refuerzo especial no previsto',
      ],
      usualMaterialsShort: 'soporte, tornillería, conectores',
      durationLabel: '45 a 90 min',
      relatedIfNotApplies: [
        {
          label: 'Necesito un punto de iluminación nuevo',
          targetServiceId: 'nuevo-punto-iluminacion',
        },
      ],
    },
  },
  {
    serviceId: 'cambio-termica',
    visualGuide: {
      imageSrc: `${imageBase}/cambio-termica.png`,
      imageAlt: 'Guía técnica de tablero con térmica, riel DIN, borneado y cableado señalados.',
      diagramTitle: 'Térmica en tablero',
      diagramSubtitle: 'Recambio de protección existente compatible.',
      callouts: [
        { number: 1, label: 'tablero' },
        { number: 2, label: 'térmica' },
        { number: 3, label: 'riel DIN' },
        { number: 4, label: 'borneado' },
        { number: 5, label: 'cableado existente' },
      ],
      appliesIf: [
        'la térmica ya existe en el tablero',
        'querés reemplazarla por falla o actualización',
        'el tablero permite el recambio',
      ],
      doesNotApplyIf: [
        'hay que armar un tablero nuevo',
        'la falla requiere diagnóstico previo',
        'hay daños generales en el tablero',
      ],
      usualMaterialsShort: 'térmica, peines o puentes según caso',
      durationLabel: '45 a 90 min',
      relatedIfNotApplies: [
        { label: 'Necesito diagnóstico de tablero', targetServiceId: 'diagnostico-salta-termica' },
      ],
    },
  },
  {
    serviceId: 'cambio-disyuntor',
    visualGuide: {
      imageSrc: `${imageBase}/cambio-disyuntor.png`,
      imageAlt: 'Guía técnica de tablero con disyuntor, riel DIN, borneado y cableado señalados.',
      diagramTitle: 'Disyuntor en tablero',
      diagramSubtitle: 'Recambio de diferencial existente compatible.',
      callouts: [
        { number: 1, label: 'tablero' },
        { number: 2, label: 'disyuntor' },
        { number: 3, label: 'riel DIN' },
        { number: 4, label: 'borneado' },
        { number: 5, label: 'cableado existente' },
      ],
      appliesIf: [
        'el disyuntor ya existe en el tablero',
        'querés reemplazarlo por falla o actualización',
        'el tablero permite el recambio',
      ],
      doesNotApplyIf: [
        'hay que armar un tablero nuevo',
        'la falla requiere diagnóstico previo',
        'hay daños generales en el tablero',
      ],
      usualMaterialsShort: 'disyuntor, peines o puentes según caso',
      durationLabel: '45 a 90 min',
      relatedIfNotApplies: [
        { label: 'Me salta el disyuntor', targetServiceId: 'diagnostico-salta-disyuntor' },
      ],
    },
  },
  {
    serviceId: 'revision-simple-tablero',
    visualGuide: {
      imageSrc: `${imageBase}/revision-simple-tablero.png`,
      imageAlt:
        'Guía técnica de revisión de tablero con térmicas, disyuntor, cableado y tapa señalados.',
      diagramTitle: 'Revisión simple de tablero',
      diagramSubtitle: 'Control visual y funcional de un tablero existente.',
      callouts: [
        { number: 1, label: 'tablero' },
        { number: 2, label: 'térmicas' },
        { number: 3, label: 'disyuntor' },
        { number: 4, label: 'cableado' },
        { number: 5, label: 'frente o tapa' },
      ],
      appliesIf: [
        'querés una revisión básica del tablero',
        'hay dudas sobre orden o estado general',
        'necesitás detectar mejoras simples',
      ],
      doesNotApplyIf: [
        'hay una falla compleja o intermitente',
        'se requiere diagnóstico profundo',
        'hay que rehacer el tablero completo',
      ],
      usualMaterialsShort: 'no incluye materiales de recambio',
      durationLabel: '30 a 60 min',
      relatedIfNotApplies: [
        { label: 'Necesito diagnóstico de falla', targetServiceId: 'diagnostico-1' },
      ],
    },
  },
]

export const visualGuidesByServiceId = Object.fromEntries(
  electricalServiceVisualGuides.map((entry) => [entry.serviceId, entry.visualGuide]),
)
