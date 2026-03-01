export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getPacksForMarketing } from '@/lib/marketing-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getSiteContent } from '@/lib/site-content'

export const revalidate = 60

export async function generateMetadata() {
  const site = await getSiteContent()
  const siteUrl = process.env.SITE_URL || 'https://nerin-1.onrender.com'
  const title = 'Packs técnicos | NERIN'
  const description = 'Referencia de bases de mano de obra.'

  return {
    title,
    description,
    alternates: {
      canonical: '/packs',
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/packs`,
      siteName: site.name,
      images: [{ url: '/nerin/og-cover.png', width: 1200, height: 630, alt: 'NERIN Electric' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/nerin/og-cover.png'],
    },
  }
}

export default async function PacksPage() {
  const packs = await getPacksForMarketing()

  return (
    <div className="space-y-10">
      <header className="space-y-4 rounded-2xl border border-border bg-muted/20 p-6">
        <Badge>Packs técnicos</Badge>
        <h1>Bases de mano de obra</h1>
        <p className="max-w-3xl text-base text-slate-600">Esta página es una referencia técnica.</p>
        <Button asChild>
          <Link href="/presupuestador">Iniciar cotización</Link>
        </Button>
      </header>

      <section className="grid gap-5">
        {packs.map((pack) => (
          <Card key={pack.id} id={pack.slug} className="scroll-mt-32">
            <CardHeader>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>{pack.name}</CardTitle>
                  <p className="text-sm text-slate-500">{pack.description}</p>
                </div>
                <p className="text-xl font-semibold text-foreground">
                  Base ${Number(pack.basePrice).toLocaleString('es-AR')}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>{pack.scope}</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {pack.features.slice(0, 4).map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
