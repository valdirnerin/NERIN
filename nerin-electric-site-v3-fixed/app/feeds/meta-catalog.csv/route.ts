import { NextResponse } from 'next/server'
import { offers } from '@/data/offers'

export const dynamic = 'force-dynamic'

function escapeCsv(value: string | number) {
  const stringValue = String(value)
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

function buildAbsoluteUrl(siteUrl: string, path: string) {
  if (path.startsWith('http')) {
    return path
  }
  return `${siteUrl.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`
}

export async function GET() {
  const siteUrl = process.env.SITE_URL || 'https://nerin-1.onrender.com'
  const rows = offers.map((offer) => {
    const availability = offer.availability ?? 'in stock'
    const brand = offer.brand ?? 'NERIN'
    return {
      ...offer,
      availability,
      brand,
      link: buildAbsoluteUrl(siteUrl, offer.link),
      image_link: buildAbsoluteUrl(siteUrl, offer.image_link),
      price: `${offer.price} ARS`,
    }
  })

  const headers = ['id', 'title', 'description', 'link', 'image_link', 'availability', 'price', 'brand']
  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const value = row[header as keyof typeof row]
          return escapeCsv(value ?? '')
        })
        .join(','),
    ),
  ].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Cache-Control': 'public, max-age=900',
    },
  })
}
