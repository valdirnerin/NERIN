export const dynamic = 'force-dynamic'
export const revalidate = 3600

import { NextResponse } from 'next/server'

type UrlItem = { loc: string; priority?: number; lastmod?: string }

function baseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://nerin-electric.com'
}

export async function GET() {
  const urls: UrlItem[] = [
    { loc: '/', priority: 1.0 },
    { loc: '/presupuesto', priority: 0.95 },
    { loc: '/consorcios', priority: 0.85 },
    { loc: '/comercios-oficinas', priority: 0.85 },
    { loc: '/empresa', priority: 0.8 },
    { loc: '/packs', priority: 0.8 },
    { loc: '/mantenimiento', priority: 0.8 },
    { loc: '/presupuestador', priority: 0.9 },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map((u) => `
    <url>
      <loc>${baseUrl()}${u.loc}</loc>
      ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
      ${u.priority !== undefined ? `<priority>${u.priority}</priority>` : ''}
    </url>`).join('')}
  </urlset>`

  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } })
}
