import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getSiteContent } from '@/lib/site-content'

export const revalidate = 60

export function generateMetadata() {
  const site = getSiteContent()
  return {
    title: 'Electricidad para comercios y oficinas | NERIN',
    description:
      'Instalaciones y adecuaciones eléctricas para comercios y oficinas en CABA. Tableros, puesta a tierra y cumplimiento normativo.',
    openGraph: {
      title: 'Electricidad para comercios y oficinas | NERIN',
      description:
        'Instalaciones y adecuaciones eléctricas para comercios y oficinas en CABA. Tableros, puesta a tierra y cumplimiento normativo.',
      siteName: site.name,
    },
    twitter: {
      title: 'Electricidad para comercios y oficinas | NERIN',
      description:
        'Instalaciones y adecuaciones eléctricas para comercios y oficinas en CABA. Tableros, puesta a tierra y cumplimiento normativo.',
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
        <Button asChild size="pill">
          <a href="/presupuesto?tipo=comercio">Pedir presupuesto para comercio u oficina</a>
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
        <Button asChild size="pill" className="mt-6">
          <a href="/presupuesto?tipo=comercio">Solicitar presupuesto</a>
        </Button>
      </section>
    </div>
  )
}
