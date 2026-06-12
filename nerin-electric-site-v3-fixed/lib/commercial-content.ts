import type {
  AdditionalCost,
  CommercialBarSettings,
  CommercialCard,
  CommercialImage,
  PricingRules,
  SiteExperience,
  SmallService,
} from '@/types/site'

export type CommercialSite = SiteExperience & {
  commercialBar: CommercialBarSettings
  hero: SiteExperience['hero'] & { benefits: Array<{ text: string }> }
  commercialCards: CommercialCard[]
  pricingRules: PricingRules
  smallServices: SmallService[]
  additionalCosts: AdditionalCost[]
  commercialImages: CommercialImage[]
}

export const commercialDefaults = {
  commercialBar: {
    enabled: true,
    messages: ['⚡ Mirá precios antes de consultar · Visita técnica desde $80.000 · Enviá fotos por WhatsApp · CABA y GBA'],
    optionalLinkHref: '/trabajos-electricos',
    optionalLinkLabel: 'Ver precios',
    displayMode: 'marquee-suave' as const,
    mobilePriority: true,
  },
  heroBenefits: [
    { text: 'Precios orientativos' },
    { text: 'Visita desde $80.000' },
    { text: 'Fotos por WhatsApp' },
    { text: 'Materiales separados' },
  ],
  hero: {
    badge: 'CABA y GBA · Hogares · Comercios · Obras',
    title: 'No adivines cuánto sale: mirá precios eléctricos orientativos',
    subtitle: 'Tomas, luces, tableros, fallas, refacciones y obras. Enviá fotos por WhatsApp y recibí una respuesta ordenada con criterio técnico.',
    backgroundImage: '',
    caption: 'Precio claro antes de empezar. Materiales separados cuando aplica.',
    primaryCta: { label: 'Ver trabajos con precios', href: '/trabajos-electricos' },
    secondaryCta: { label: 'Enviar fotos por WhatsApp', href: '/contacto?motivo=WhatsApp' },
  },
  commercialCards: [
    {
      title: 'Trabajo chico',
      description: 'Fallas, tomas, luces, tableros y pedidos simples con precios orientativos.',
      ctaLabel: 'Ver precios',
      href: '/trabajos-electricos',
      order: 10,
      active: true,
    },
    {
      title: 'Refacción eléctrica',
      description: 'Renovación eléctrica de departamentos, locales y espacios existentes.',
      ctaLabel: 'Pedir relevamiento',
      href: '/refacciones-electricas',
      order: 20,
      active: true,
    },
    {
      title: 'Obra eléctrica',
      description: 'Instalaciones para locales, edificios y proyectos con seguimiento por etapas.',
      ctaLabel: 'Consultar obra',
      href: '/obras-electricas',
      order: 30,
      active: true,
    },
  ],
  pricingRules: {
    technicalVisitFrom: 80000,
    currency: 'ARS',
    visitDiscountable: false,
    visitCommercialText: 'La visita técnica permite revisar zona, urgencia, estado de la instalación y alcance real antes de presupuestar.',
    urgencySurcharge: 'A confirmar segun horario, disponibilidad y riesgo.',
    zoneSurcharge: 'Puede aplicar fuera de cobertura principal o por traslado extendido.',
    minimumJob: 'A confirmar segun servicio y zona.',
    quoteValidity: '7 dias corridos salvo cambios de alcance o materiales.',
    priceDisclaimer:
      'Los precios son orientativos y pueden variar según zona, urgencia, estado de la instalación, materiales necesarios y alcance real del trabajo.',
  },
  smallServices: [
    service('Cambio de tomacorriente', 'cambio-de-tomacorriente', 'Tomas y teclas', 'Retiro del toma existente y colocacion de modulo compatible.', 35000, 10, true),
    service('Cambio de llave de luz', 'cambio-de-llave-de-luz', 'Tomas y teclas', 'Cambio de tecla simple, doble o combinada con revision basica.', 32000, 20, true),
    service('Revision de tablero electrico', 'revision-de-tablero-electrico', 'Tableros electricos', 'Chequeo visual y funcional de tablero, termicas, disyuntor y orden basico.', 55000, 30, true, true),
    service('Instalación de toma para aire acondicionado', 'instalacion-de-toma-para-aire-acondicionado', 'Aire acondicionado', 'Preparación eléctrica para equipo con consumo dedicado.', 95000, 40, false, true),
    service('Busqueda de falla electrica', 'busqueda-de-falla-electrica', 'Fallas electricas', 'Diagnostico de cortes, falsos contactos o disparos de protecciones.', 45000, 50, true, true),
    service('Instalación de luminaria', 'instalacion-de-luminaria', 'Iluminación', 'Instalación de artefacto, plafón, aplique o luminaria compatible.', 38000, 60),
    service('Revision de puesta a tierra', 'revision-de-puesta-a-tierra', 'Puesta a tierra', 'Revision inicial de seguridad electrica y protecciones asociadas.', 65000, 70, false, true),
    service('Diagnóstico eléctrico', 'diagnostico-electrico', 'Diagnóstico', 'Visita técnica para entender el problema y definir presupuesto correcto.', 80000, 80, true, true),
  ],
  additionalCosts: [
    cost('Urgencia', 'Atencion prioritaria o fuera de agenda habitual.', 'a-confirmar', 0, 'Cuando el cliente necesita resolucion inmediata o fuera de agenda.', 10),
    cost('Zona fuera de cobertura', 'Traslado adicional por distancia o acceso especial.', 'a-confirmar', 0, 'Cuando la direccion queda fuera de CABA y GBA principal.', 20),
    cost('Trabajo fuera de horario', 'Ejecucion nocturna, fines de semana o feriados.', 'a-confirmar', 0, 'Cuando el trabajo debe hacerse fuera del horario habitual.', 30),
    cost('Materiales', 'Materiales separados cuando aplica.', 'a-confirmar', 0, 'Cuando el servicio requiere modulos, cable, protecciones, artefactos o accesorios.', 40),
    cost('Diagnostico avanzado', 'Mediciones o busqueda profunda de fallas no visibles.', 'desde', 80000, 'Cuando el problema no se puede confirmar por fotos o revision basica.', 50),
    cost('Reparación de cañería', 'Corrección de canalizaciones existentes o dañadas.', 'a-confirmar', 0, 'Cuando hay cañerías tapadas, rotas o incompatibles con el alcance.', 60),
    cost('Cableado adicional', 'Tendido extra no incluido en el precio orientativo.', 'desde', 0, 'Cuando hay que agregar metros de cable, circuitos o recorridos.', 70),
  ],
  commercialImages: [
    image('Hero home', 'hero-home', 'Trabajo real de NERIN Electricidad'),
    image('Tarjetas de trabajos chicos', 'trabajos-chicos-cards', 'Detalle de trabajo electrico chico'),
    image('Refacciones', 'refacciones', 'Refacción eléctrica en espacio existente'),
    image('Obras', 'obras', 'Obra electrica con seguimiento por etapas'),
    image('Servicios individuales', 'servicios-individuales', 'Servicio electrico individual'),
    image('Casos reales', 'casos-reales', 'Caso real de trabajo electrico'),
    image('Portal cliente', 'portal-cliente', 'Seguimiento digital de solicitud electrica'),
    image('Empresa y equipo', 'empresa-equipo', 'Equipo NERIN Electricidad'),
  ],
}

export function resolveCommercialSite(site: SiteExperience): CommercialSite {
  const migrated = Boolean(site.commercialBar || site.pricingRules || site.smallServices?.length)
  const hero = migrated ? site.hero : { ...site.hero, ...commercialDefaults.hero }

  return {
    ...site,
    commercialBar: site.commercialBar ?? commercialDefaults.commercialBar,
    hero: {
      ...hero,
      ...commercialDefaults.hero,
      ...hero,
      primaryCta: hero.primaryCta?.href && migrated ? hero.primaryCta : commercialDefaults.hero.primaryCta,
      secondaryCta: hero.secondaryCta?.href && migrated ? hero.secondaryCta : commercialDefaults.hero.secondaryCta,
      benefits: hero.benefits?.length ? hero.benefits : commercialDefaults.heroBenefits,
    },
    commercialCards: (site.commercialCards?.length ? site.commercialCards : commercialDefaults.commercialCards).map((card, index) => ({
      ...card,
      order: card.order ?? (index + 1) * 10,
      active: card.active ?? true,
    })),
    pricingRules: site.pricingRules ?? commercialDefaults.pricingRules,
    smallServices: site.smallServices?.length ? site.smallServices : commercialDefaults.smallServices,
    additionalCosts: site.additionalCosts?.length ? site.additionalCosts : commercialDefaults.additionalCosts,
    commercialImages: site.commercialImages?.length ? site.commercialImages : commercialDefaults.commercialImages,
  }
}

function service(
  name: string,
  slug: string,
  category: string,
  shortDescription: string,
  priceFrom: number,
  order: number,
  featured = false,
  requiresVisit = false,
): SmallService {
  return {
    active: true,
    featured,
    category,
    name,
    slug,
    shortDescription,
    priceFrom,
    showPrice: true,
    requiresVisit,
    quoteByPhotos: true,
    includes: ['Revision inicial', 'Ejecucion del alcance simple aprobado', 'Prueba basica de funcionamiento'],
    excludes: ['Materiales', 'Reparaciones ocultas', 'Trabajos fuera del alcance acordado'],
    priceChanges: ['Estado de la instalacion', 'Zona', 'Urgencia', 'Materiales necesarios'],
    estimatedDuration: requiresVisit ? '60 a 120 minutos' : '30 a 90 minutos',
    coverageZone: 'CABA y GBA con confirmacion',
    imageUrl: '',
    imageAlt: name,
    customCta: 'Enviar fotos para cotizar',
    order,
  }
}

function cost(name: string, description: string, type: AdditionalCost['type'], amount: number, appliesWhen: string, order: number): AdditionalCost {
  return { name, description, type, amount, active: true, appliesWhen, order }
}

function image(title: string, location: string, alt: string, url = ''): CommercialImage {
  return { title, url, alt, location, active: true }
}

