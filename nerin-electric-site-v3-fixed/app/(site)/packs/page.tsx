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
  const title = 'Bases técnicas de mano de obra | NERIN'
  const description =
    'Referencia técnica de bases de mano de obra para instalación eléctrica. Para contratar, usar el hub de cotización.'

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
    <div className="space-y-12">
      <header className="space-y-5">
        <Badge>Referencia técnica</Badge>
        <h1>Bases de mano de obra (uso técnico)</h1>
        <p className="max-w-3xl text-lg text-slate-600">
          Este contenido es complementario para quienes quieren revisar bases prearmadas. La contratación principal de
          NERIN se organiza desde el hub de cotización por tipo de necesidad.
        </p>
        <Button asChild size="lg">
          <Link href="/presupuestador">Ir al hub de cotización</Link>
        </Button>
      </header>

      <section className="grid gap-6">
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
            <CardContent className="space-y-4 text-sm text-slate-600">
              <p>{pack.scope}</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {pack.features.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="rounded-2xl border border-border bg-muted/40 p-6">
        <p className="text-sm text-muted-foreground">
          ¿Querés avanzar con una propuesta comercial? Definí si necesitás servicio puntual, obra guiada o cotización
          profesional.
        </p>
        <Button className="mt-4" variant="secondary" asChild>
          <Link href="/presupuestador">Volver al presupuestador</Link>
        </Button>
      </section>
    </div>
  )
}
