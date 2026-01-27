import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getSiteContent } from '@/lib/site-content'

export const revalidate = 60

export async function generateMetadata() {
  const site = await getSiteContent()
  const siteUrl = process.env.SITE_URL || 'https://nerin-1.onrender.com'
  const title = 'Electricidad para comercios y oficinas | NERIN'
  const description =
    'Instalaciones y adecuaciones eléctricas para comercios y oficinas en CABA. Tableros, puesta a tierra y cumplimiento normativo.'

  return {
    title,
    description,
    alternates: {
      canonical: '/comercios-oficinas',
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/comercios-oficinas`,
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

export default function ComerciosOficinasPage() {
  return (
    <div className="space-y-16">
      <header className="space-y-4">
        <Badge>Comercios y oficinas</Badge>
        <h1>Instalaciones eléctricas listas para operar sin interrupciones</h1>
        <p className="max-w-3xl text-lg text-slate-600">
          Adecuaciones, tableros y puesta a tierra con mínima interferencia en la operación. Cumplimos normativa y
          entregamos documentación completa.
        </p>
        <Button asChild size="lg">
          <a href="/presupuesto?tipo=comercio" data-track="lead" data-content-name="Presupuesto comercio">Pedir presupuesto para comercio u oficina</a>
        </Button>
      </header>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <h2>Instalaciones y adecuaciones</h2>
          <p className="text-slate-600">
            Armado de tableros, cableado, puesta a tierra y adecuaciones para habilitaciones comerciales.
          </p>
        </div>
        <div className="space-y-3">
          <h2>Proceso claro</h2>
          <p className="text-slate-600">
            Relevamiento técnico, propuesta con alcance detallado y ejecución con reportes y checklist diario.
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'Tableros y protecciones',
            description: 'Diseño, montaje y certificación con materiales de primera línea.',
          },
          {
            title: 'Puesta a tierra',
            description: 'Medición, adecuación y reporte con normativa AEA.',
          },
          {
            title: 'Casos y continuidad',
            description: 'Experiencia en locales activos sin interrumpir la operación.',
          },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-border bg-white p-6 shadow-subtle">
            <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="text-sm text-slate-600">{item.description}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-border bg-muted/40 p-10 text-center">
        <h2>¿Listos para habilitar tu comercio u oficina?</h2>
        <p className="mt-3 text-slate-600">
          Coordinemos una visita técnica y diseñemos un plan de trabajo seguro y rápido.
        </p>
        <Button asChild size="lg" className="mt-6">
          <a href="/presupuesto?tipo=comercio" data-track="lead" data-content-name="Solicitar presupuesto comercio">Solicitar presupuesto</a>
        </Button>
      </section>
    </div>
  )
}
