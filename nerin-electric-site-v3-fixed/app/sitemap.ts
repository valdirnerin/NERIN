import type { MetadataRoute } from 'next'
import { serviceCatalog } from '@/lib/nerin-electricidad'
import { realCases } from '@/lib/real-cases'
import { SITE_ORIGIN } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const publicRoutes = [
    '/',
    '/trabajos-chicos',
    '/refacciones-electricas',
    '/obras-electricas',
    '/servicios-especiales',
    '/obras',
    '/empresa',
    '/contacto',
  ]

  const serviceRoutes = serviceCatalog.map((service) => `/trabajos-chicos/${service.slug}`)
  const caseRoutes = realCases.map((caseItem) => `/obras/${caseItem.slug}`)

  return [...publicRoutes, ...serviceRoutes, ...caseRoutes].map((route) => ({
    url: new URL(route, SITE_ORIGIN).toString(),
    lastModified: now,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : route.includes('/trabajos-chicos/') ? 0.7 : 0.8,
  }))
}
