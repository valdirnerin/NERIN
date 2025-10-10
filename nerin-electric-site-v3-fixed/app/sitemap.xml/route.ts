export const dynamic = 'force-dynamic'
export const revalidate = 3600

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

function baseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://nerin-electric.com' // TODO: poné tu dominio real
}

export async function GET() {
  let items: { slug: string; updatedAt: Date }[] = []
  try {
    items = await prisma.caseStudy.findMany({ select: { slug: true, updatedAt: true } })
  } catch (e) {
    console.warn('sitemap: DB no disponible, devolviendo sitemap mínimo')
  }

  const urls = [
    { loc: '/', priority: 1.0 },
    { loc: '/empresa', priority: 0.8 },
    { loc: '/packs', priority: 0.8 },
    { loc: '/mantenimiento', priority: 0.8 },
    { loc: '/presupuestador', priority: 0.9 },
    ...items.map(i => ({ loc: `/obras/${i.slug}`, lastmod: i.updatedAt.toISOString(), priority: 0.6 })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(u => `
    <url>
      <loc>${baseUrl()}${u.loc}</loc>
      ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
      ${u.priority ? `<priority>${u.priority}</priority>` : ''}
    </url>`).join('')}
  </urlset>`

  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } })
}
