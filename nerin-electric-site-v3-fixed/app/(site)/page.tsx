export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import { getMarketingHomeData } from '@/lib/marketing-data'
import { getSiteContent } from '@/lib/site-content'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionItem } from '@/components/ui/accordion'

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

export default async function HomePage() {
  const { packs, plans, caseStudies } = await getMarketingHomeData()
  const site = await getSiteContent()

  const technicalBadges = ['AEA', 'Ensayos', 'Certificación', 'SLA']
  const workSteps = [
    {
      title: 'Relevamiento técnico',
      description: 'Visita en sitio, diagnóstico eléctrico y toma de medidas para plano ejecutivo.',
    },
    {
      title: 'Ingeniería y planificación',
      description: 'Definición de alcance, cronograma y materiales con trazabilidad completa.',
    },
    {
      title: 'Ejecución en obra',
      description: 'Montaje, ensayos y coordinación con responsables de seguridad e higiene.',
    },
    {
      title: 'Entrega y certificación',
      description: 'Documentación final, informes fotográficos y soporte post obra.',
    },
  ]

  return (
    <div className="space-y-24">
      <section className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6">
          <Badge>{site.hero.badge}</Badge>
          <h1>{site.hero.title}</h1>
          <p className="max-w-xl text-lg text-muted-foreground">{site.hero.subtitle}</p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/presupuesto" data-track="lead" data-content-name="Hero presupuesto">Pedir presupuesto</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contacto?motivo=Visita%20t%C3%A9cnica" data-track="schedule" data-content-name="Hero visita técnica">Agendar visita técnica</Link>
            </Button>
            <Link
              href="/mantenimiento"
              className="inline-flex items-center text-sm font-semibold text-accent hover:underline"
            >
              Ver mantenimiento
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {technicalBadges.map((badge) => (
              <Badge key={badge}>{badge}</Badge>
            ))}
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

      <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[#0B0F14] py-16 text-white">
        <div className="container space-y-10">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#FBBF24]">Confianza operativa</p>
            <h2 className="text-white">{site.trust.title}</h2>
            <p className="text-slate-200">{site.trust.subtitle}</p>
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

      <section className="space-y-10">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">Cómo trabajamos</p>
          <h2>Cómo trabajamos</h2>
          <p>{site.company.introDescription}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {workSteps.map((step, index) => (
            <div key={step.title} className="border border-border p-5">
              <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius)] border border-border text-sm font-semibold text-foreground">
                0{index + 1}
              </div>
              <h3 className="text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">Servicios</p>
            <h2>{site.services.title}</h2>
            <p>{site.services.description}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {site.services.items.map((service) => (
              <div key={service.title} className="border-b border-border pb-4">
                <p className="text-sm font-semibold text-foreground">• {service.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">Packs</p>
            <h2>{site.packs.title}</h2>
            <p>{site.packs.description}</p>
          </div>
          <Button variant="secondary" asChild>
            <a href={site.packs.ctaHref} data-track="view_pack" data-content-name="Configurar pack home">{site.packs.ctaLabel}</a>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {packs.map((pack) => (
            <Card key={pack.id}>
              <CardHeader>
                <CardTitle>{pack.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>{pack.description}</p>
                <p>{pack.scope}</p>
                <p className="text-base font-semibold text-foreground">
                  Mano de obra base ${Number(pack.basePrice).toLocaleString('es-AR')}
                </p>
                {pack.advancePrice > 0 && (
                  <p>Anticipo sugerido ${Number(pack.advancePrice).toLocaleString('es-AR')}</p>
                )}
                <ul className="space-y-2">
                  {pack.features.slice(0, 5).map((item) => (
                    <li key={item} className="border-l-2 border-[#FBBF24] pl-3">
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="ghost" asChild>
                  <a href={`/packs#${pack.slug}`} data-track="view_pack" data-content-name={pack.name}>Ver alcance completo</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">{site.packs.note}</p>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">Mantenimiento</p>
            <h2>{site.maintenance.title}</h2>
            <p>{site.maintenance.description}</p>
          </div>
          <Button variant="secondary" asChild>
            <Link href="/mantenimiento">Ver planes completos</Link>
          </Button>
        </div>
        <div className="overflow-hidden rounded-[var(--radius)] border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-foreground">
              <tr>
                <th className="border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Plan
                </th>
                {plans.map((plan) => (
                  <th key={plan.id} className="border-b border-border px-4 py-3 text-sm font-semibold text-foreground">
                    {plan.nombre}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td className="border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Precio mensual
                </td>
                {plans.map((plan) => (
                  <td key={`${plan.id}-price`} className="border-b border-border px-4 py-3 font-semibold text-foreground">
                    ${Number(plan.precioMensual).toLocaleString('es-AR')} / mes
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Visitas mensuales
                </td>
                {plans.map((plan) => (
                  <td key={`${plan.id}-visitas`} className="border-b border-border px-4 py-3 text-muted-foreground">
                    {plan.visitasMes} visita(s) programadas
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Tareas fijas
                </td>
                {plans.map((plan) => (
                  <td key={`${plan.id}-tareas`} className="border-b border-border px-4 py-3 text-muted-foreground">
                    {plan.incluyeTareasFijas.join(', ')}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  SLA de respuesta
                </td>
                {plans.map((plan) => (
                  <td key={`${plan.id}-sla`} className="px-4 py-3 text-muted-foreground">
                    Según contrato operativo
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {caseStudies.length > 0 && (
        <section className="space-y-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">Casos</p>
              <h2>{site.works.title}</h2>
              <p>{site.works.description}</p>
            </div>
            <Button variant="secondary" asChild>
              <Link href="/obras">Ver todas las obras</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {caseStudies.map((cs) => {
              const timelineMetric =
                cs.metricas.find((metric) => metric.label.toLowerCase().includes('tiempo')) ?? cs.metricas[0]
              const caseImage = cs.fotos[0] ?? site.hero.backgroundImage
              return (
                <article key={cs.id} className="overflow-hidden rounded-[var(--radius)] border border-border bg-white">
                  <div className="relative h-48 w-full">
                    <Image src={caseImage} alt={cs.titulo} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14]/60 via-transparent to-transparent" />
                  </div>
                  <div className="space-y-4 p-5">
                    <h3 className="text-lg font-semibold text-foreground">{cs.titulo}</h3>
                    <p className="text-sm text-muted-foreground">{cs.resumen}</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>
                        <span className="font-semibold text-foreground">Alcance:</span> {cs.resumen}
                      </li>
                      <li>
                        <span className="font-semibold text-foreground">Plazo:</span>{' '}
                        {timelineMetric ? timelineMetric.value : 'Cronograma según obra'}
                      </li>
                      <li>
                        <span className="font-semibold text-foreground">Entregables:</span> Documentación, reportes y
                        certificaciones.
                      </li>
                    </ul>
                    <Button variant="ghost" asChild>
                      <a href={`/obras/${cs.slug}`}>Ver detalle</a>
                    </Button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      <section className="grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <h2>{site.faq.title}</h2>
          <p>{site.faq.description}</p>
        </div>
        <Accordion>
          {site.faq.items.map((faq) => (
            <AccordionItem key={faq.question} question={faq.question} answer={<p>{faq.answer}</p>} />
          ))}
        </Accordion>
      </section>

      <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[#0B0F14] py-16 text-white">
        <div className="container grid gap-6 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <h2 className="text-white">{site.closingCta.title}</h2>
            <p className="text-slate-200">{site.closingCta.description}</p>
          </div>
          <div className="flex flex-wrap gap-4 md:justify-end">
            <Button size="lg" variant="accent" asChild>
              <a href={site.closingCta.primary.href} data-track="lead" data-content-name="Solicitar alta del plan" data-plan-tier="mantenimiento">{site.closingCta.primary.label}</a>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <a href={site.closingCta.secondary.href} data-track="lead" data-content-name="Pedir presupuesto cierre">{site.closingCta.secondary.label}</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
