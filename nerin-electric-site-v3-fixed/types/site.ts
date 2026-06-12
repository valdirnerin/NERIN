export type CommercialBarDisplayMode = 'estatica' | 'rotativa' | 'marquee-suave'

export interface CommercialBarSettings {
  enabled: boolean
  messages: string[]
  optionalLinkHref: string
  optionalLinkLabel: string
  displayMode: CommercialBarDisplayMode
  mobilePriority: boolean
}

export interface HeroBenefit {
  text: string
}

export interface CommercialImage {
  title: string
  url: string
  alt: string
  location: string
  active: boolean
}

export interface CommercialCard {
  title: string
  description: string
  ctaLabel: string
  href: string
  order?: number
  active?: boolean
}

export interface PricingRules {
  technicalVisitFrom: number
  currency: string
  visitDiscountable: boolean
  visitCommercialText: string
  urgencySurcharge: string
  zoneSurcharge: string
  minimumJob: string
  quoteValidity: string
  priceDisclaimer: string
}

export interface SmallService {
  active: boolean
  featured: boolean
  category: string
  name: string
  slug: string
  shortDescription: string
  priceFrom: number
  showPrice: boolean
  requiresVisit: boolean
  quoteByPhotos: boolean
  includes: string[]
  excludes: string[]
  priceChanges: string[]
  estimatedDuration: string
  coverageZone: string
  imageUrl: string
  imageAlt: string
  customCta: string
  order: number
}

export interface AdditionalCost {
  name: string
  description: string
  type: 'fijo' | 'desde' | 'porcentaje' | 'a-confirmar'
  amount: number
  active: boolean
  appliesWhen: string
  order: number
}

export interface SiteExperience {
  name: string
  tagline: string
  logo: {
    title: string
    subtitle: string
    imageUrl: string
  }
  accent: string
  socials: {
    instagram: string
    linkedin: string
  }
  contact: {
    email: string
    phone: string
    secondaryPhones: string[]
    address: string
    schedule: string
    serviceArea: string
    whatsappNumber: string
    whatsappMessage: string
    whatsappCtaLabel: string
  }
  commercialBar?: CommercialBarSettings
  hero: {
    badge: string
    title: string
    subtitle: string
    backgroundImage: string
    caption: string
    primaryCta: { label: string; href: string }
    secondaryCta: { label: string; href: string }
    tertiaryCta: { label: string; href: string }
    benefits?: HeroBenefit[]
    highlights: Array<{ title: string; description: string }>
    stats: Array<{ label: string; description: string }>
  }
  commercialCards?: CommercialCard[]
  pricingRules?: PricingRules
  smallServices?: SmallService[]
  additionalCosts?: AdditionalCost[]
  commercialImages?: CommercialImage[]
  services: {
    title: string
    description: string
    items: Array<{ title: string; description: string }>
  }
  trust: {
    title: string
    subtitle: string
    experience: string
    metrics: Array<{ label: string; value: string }>
    testimonials: Array<{ name: string; role: string; quote: string }>
    gallery: Array<{ title: string; description: string }>
  }
  packs: {
    title: string
    description: string
    ctaLabel: string
    ctaHref: string
    note: string
  }
  maintenance: {
    title: string
    description: string
    cards: Array<{ title: string; description: string }>
  }
  works: {
    title: string
    description: string
    introTitle: string
    introDescription: string
  }
  blog: {
    title: string
    description: string
    introTitle: string
    introDescription: string
  }
  brands: {
    title: string
    note: string
  }
  faq: {
    title: string
    description: string
    items: Array<{ question: string; answer: string }>
  }
  closingCta: {
    title: string
    description: string
    primary: { label: string; href: string }
    secondary: { label: string; href: string }
  }
  company: {
    introTitle: string
    introDescription: string
    protocolsTitle: string
    protocols: string[]
    complianceTitle: string
    compliance: string[]
    mission: string
    teamTitle: string
  }
  contactPage: {
    introTitle: string
    introDescription: string
    highlightBullets: string[]
    typeformUrl: string
  }
  packsPage: {
    introTitle: string
    introDescription: string
    note: string
  }
  maintenancePage: {
    introTitle: string
    introDescription: string
    cards: Array<{ title: string; description: string }>
  }
  responsive: {
    headline: string
    bulletPoints: string[]
  }
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
}

