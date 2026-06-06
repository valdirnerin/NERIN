import type { Metadata } from 'next'
import type { RealCase } from '@/lib/real-cases'
import type { ServiceCatalogItem } from '@/lib/nerin-electricidad'

export const SITE_ORIGIN = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://nerin-1.onrender.com'
export const SITE_NAME = 'NERIN Electricidad'
export const OG_IMAGE = '/nerin/og-cover.png'

export const initialKeywords = [
  'electricista en CABA',
  'trabajos electricos en CABA',
  'instalaciones electricas CABA',
  'cambio de tomacorriente CABA',
  'revision de tablero electrico CABA',
  'reparacion de falla electrica CABA',
  'instalacion de toma para aire acondicionado CABA',
  'refaccion electrica de departamento CABA',
  'obra electrica para local comercial',
  'instalaciones electricas para edificios en CABA',
]

type SeoMetadataInput = {
  title: string
  description: string
  path?: string
  type?: 'website' | 'article'
}

export function absoluteUrl(path = '/') {
  return new URL(path, SITE_ORIGIN).toString()
}

export function buildSeoMetadata({ title, description, path = '/', type = 'website' }: SeoMetadataInput): Metadata {
  return {
    title,
    description,
    keywords: initialKeywords,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      locale: 'es_AR',
      type,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE],
    },
  }
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_ORIGIN}/#localbusiness`,
    name: SITE_NAME,
    url: SITE_ORIGIN,
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Ciudad Autonoma de Buenos Aires' },
      { '@type': 'AdministrativeArea', name: 'Gran Buenos Aires' },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ciudad Autonoma de Buenos Aires',
      addressRegion: 'CABA',
      addressCountry: 'AR',
    },
    makesOffer: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Trabajos electricos en CABA' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Refacciones electricas' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Obras electricas' } },
    ],
  }
}

export function serviceJsonLd(service: ServiceCatalogItem) {
  const price = parsePrice(service.priceFrom)
  const offer: Record<string, unknown> = {
    '@type': 'Offer',
    name: service.name,
    priceCurrency: 'ARS',
    availability: 'https://schema.org/InStock',
    areaServed: 'CABA y GBA con confirmacion',
    description: service.priceFrom ? `Precio orientativo desde ${service.priceFrom}` : 'Precio a confirmar segun alcance',
    url: absoluteUrl(`/trabajos-chicos/${service.slug}`),
  }

  if (price) offer.price = price

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.longDescription,
    serviceType: service.category,
    areaServed: 'CABA y GBA con confirmacion',
    provider: { '@type': 'LocalBusiness', name: SITE_NAME, url: SITE_ORIGIN },
    offers: offer,
  }
}

export function caseStudyJsonLd(caseItem: RealCase) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: caseItem.title,
    description: caseItem.scope,
    about: caseItem.workType,
    areaServed: caseItem.approximateLocation,
    url: absoluteUrl(`/obras/${caseItem.slug}`),
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_ORIGIN },
  }
}

function parsePrice(value?: string) {
  if (!value) return null
  const digits = value.replace(/[^0-9]/g, '')
  return digits ? Number(digits) : null
}
