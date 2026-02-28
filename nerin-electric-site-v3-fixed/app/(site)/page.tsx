export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import { getMarketingHomeData } from '@/lib/marketing-data'
import { getSiteContent } from '@/lib/site-content'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const revalidate = 60

export async function generateMetadata() {
  const site = await getSiteContent()
  const siteUrl = process.env.SITE_URL || 'https://nerin-1.onrender.com'
  const title = 'Contratista eléctrico en CABA | Presupuestos en 24-48 h'
  const description =
    'Contratista eléctrico para obras, comercios y consorcios en CABA. Presupuesto en 24–48 h, cumplimiento normativo y experiencia real en obra.'

  return {
    title,
    description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
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

const mainPaths = [
  {
    title: 'Contratar servicio puntual',
    description: 'Resolvé trabajos directos como diagnóstico premium, artefactos o circuito dedicado para AA.',
    cta: 'Ir a servicio puntual',
    href: '/presupuestador?mode=EXPRESS',
  },
  {
    title: 'Cotizar instalación / obra',
    description: 'Para reformas, locales, oficinas o viviendas con definición técnica y relevamiento previo.',
    cta: 'Iniciar cotización guiada',
    href: '/presupuestador?mode=ASSISTED',
  },
  {
    title: 'Cotizador profesional',
    description: 'Carga manual para perfiles técnicos con cantidades por rubro y estimación de obra.',
    cta: 'Abrir cotizador profesional',
    href: '/presupuestador?mode=PROFESSIONAL',
  },
]

export default async function HomePage() {
  const { packs, caseStudies } = await getMarketingHomeData()
  const site = await getSiteContent()

  return (
    <div className="space-y-20">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6">
          <Badge>{site.hero.badge}</Badge>
          <h1>Instalaciones eléctricas con criterio comercial y ejecución profesional</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Elegí el camino correcto según tu necesidad: contratación directa, cotización de obra con relevamiento o
            carga técnica profesional. Sin confusión ni vueltas.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/presupuestador">Empezar cotización</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/presupuesto?tipo=obra">Solicitar relevamiento</Link>
            </Button>
          </div>
        </div>
        <div className="relative hidden overflow-hidden rounded-[var(--radius)] border border-border lg:block">
          <Image src={site.hero.backgroundImage} alt={site.hero.caption} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#0B0F14]/70 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 border border-white/30 bg-[#0B0F14]/80 p-4 text-xs text-slate-200">
            <p className="font-semibold text-white">{site.hero.caption}</p>
            <p>{site.contact.serviceArea}</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">Tres caminos claros</p>
          <h2>Elegí tu forma de contratación</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {mainPaths.map((path) => (
            <Card key={path.title}>
              <CardHeader>
                <CardTitle>{path.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-600">
                <p>{path.description}</p>
                <Button variant="secondary" asChild>
                  <a href={path.href}>{path.cta}</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">Servicios destacados</p>
          <h2>Servicios puntuales más solicitados</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            'Diagnóstico eléctrico premium',
            'Colocación de artefactos',
            'Circuito dedicado para aire acondicionado',
            'Adecuación básica de tablero',
            'Revisión eléctrica integral',
            'Mantenimiento puntual',
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-border bg-white p-4 text-sm text-slate-600">
              <p className="font-semibold text-foreground">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[#0B0F14] py-16 text-white">
        <div className="container space-y-8">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#FBBF24]">Cobertura premium</p>
            <h2 className="text-white">Atención técnica en zonas priorizadas</h2>
            <p className="text-slate-200">{site.contact.serviceArea}. Coordinamos visitas y ejecución con agenda comercial en 24–48 h.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {site.trust.gallery.slice(0, 3).map((item) => (
              <div key={item.title} className="border border-white/15 bg-white/5 p-5">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">Experiencia y confianza</p>
          <h2>Resultados en obra y ejecución real</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {caseStudies.slice(0, 2).map((cs) => (
            <article key={cs.id} className="overflow-hidden rounded-[var(--radius)] border border-border bg-white">
              <div className="relative h-48 w-full">
                <Image src={cs.fotos[0] ?? site.hero.backgroundImage} alt={cs.titulo} fill className="object-cover" />
              </div>
              <div className="space-y-3 p-5">
                <h3 className="text-lg font-semibold text-foreground">{cs.titulo}</h3>
                <p className="text-sm text-muted-foreground">{cs.resumen}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-muted/40 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Contenido técnico</p>
            <h3 className="text-xl font-semibold">Packs como referencia interna de alcance</h3>
            <p className="text-sm text-muted-foreground">
              Los packs siguen disponibles para clientes que quieren comparar bases de mano de obra, pero ya no son la
              puerta principal de contratación.
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/packs">Ver packs técnicos</Link>
          </Button>
        </div>
        {packs[0] && <p className="mt-4 text-sm text-muted-foreground">Referencia base actual: {packs[0].name}.</p>}
      </section>
    </div>
  )
}
