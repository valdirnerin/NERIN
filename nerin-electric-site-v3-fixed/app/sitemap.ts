import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [packs, caseStudies, blog] = await Promise.all([
    prisma.pack.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.caseStudy.findMany({ select: { slug: true, updatedAt: true } }),
    Promise.resolve([]),
  ])

  const baseUrl = 'https://www.nerin.com.ar'

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/packs',
    '/presupuestador',
    '/mantenimiento',
    '/servicios',
    '/obras',
    '/empresa',
    '/contacto',
    '/faq',
    '/blog',
  ].map((path) => ({ url: `${baseUrl}${path}` }))

  const packRoutes = packs.map((pack) => ({
    url: `${baseUrl}/packs#${pack.slug}`,
    lastModified: pack.updatedAt,
  }))
  const caseRoutes = caseStudies.map((cs) => ({
    url: `${baseUrl}/obras/${cs.slug}`,
    lastModified: cs.updatedAt,
  }))

  return [...staticRoutes, ...packRoutes, ...caseRoutes]
}
