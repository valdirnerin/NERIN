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
  hero: {
    badge: string
    title: string
    subtitle: string
    backgroundImage: string
    caption: string
    primaryCta: { label: string; href: string }
    secondaryCta: { label: string; href: string }
    tertiaryCta: { label: string; href: string }
    highlights: Array<{ title: string; description: string }>
    stats: Array<{ label: string; description: string }>
  }
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
