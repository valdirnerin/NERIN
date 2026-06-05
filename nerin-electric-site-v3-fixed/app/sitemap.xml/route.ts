export const dynamic = 'force-dynamic'
export const revalidate = 3600

import { NextResponse } from 'next/server'
import { getCaseStudiesForMarketing } from '@/lib/marketing-data'

type UrlItem = { loc: string; priority?: number; lastmod?: string }

function baseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    process.env.SITE_URL?.replace(/\/$/, '') ||
    'https://www.nerin.com.ar'
  )
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const caseStudies = await getCaseStudiesForMarketing()
  const urls: UrlItem[] = [
    { loc: '/', priority: 1.0 },
    { loc: '/trabajos-electricos', priority: 0.95 },
    { loc: '/refacciones-electricas', priority: 0.9 },
    { loc: '/obras-electricas', priority: 0.9 },
    { loc: '/servicios-especiales', priority: 0.85 },
    { loc: '/presupuestador', priority: 0.9 },
    { loc: '/obras', priority: 0.8 },
    ...caseStudies.map((caseStudy) => ({
      loc: `/obras/${caseStudy.slug}`,
      priority: 0.7,
    })),
    { loc: '/empresa', priority: 0.8 },
    { loc: '/contacto', priority: 0.85 },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map((u) => `
    <url>
      <loc>${escapeXml(`${baseUrl()}${u.loc}`)}</loc>
      ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
      ${u.priority !== undefined ? `<priority>${u.priority}</priority>` : ''}
    </url>`).join('')}
  </urlset>`

  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } })
}
