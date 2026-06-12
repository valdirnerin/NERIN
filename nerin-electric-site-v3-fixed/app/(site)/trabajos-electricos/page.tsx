import Link from 'next/link'
import type { Route } from 'next'
import { ArrowRight, Camera, Search } from 'lucide-react'
import { getSiteContent } from '@/lib/site-content'
import { resolveCommercialSite } from '@/lib/commercial-content'
import { breadcrumbJsonLd, buildSeoMetadata } from '@/lib/seo'

export const metadata = buildSeoMetadata({
  title: 'Trabajos electricos chicos con precios orientativos | NERIN',
  description:
    'Cambio de tomacorriente, llave de luz, revision de tablero, fallas, luminarias y diagnostico electrico en CABA y GBA con precio desde y cotizacion por fotos.',
  path: '/trabajos-electricos',
})

function money(value: number, currency: string) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
}

function priceLabel(service: { showPrice: boolean; priceFrom: number }, currency: string) {
  if (!service.showPrice || !service.priceFrom) return 'A confirmar'
  return `Desde ${money(service.priceFrom, currency)}`
}

export default async function TrabajosElectricosPage() {
  const site = resolveCommercialSite(await getSiteContent())
  const services = site.smallServices.filter((service) => service.active).sort((a, b) => a.order - b.order)
  const categories = Array.from(new Set(services.map((service) => service.category)))
  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Inicio', path: '/' },
    { name: 'Trabajos electricos', path: '/trabajos-electricos' },
  ])

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <section className="border-b border-slate-200 bg-slate-50 py-10">
        <div className="container max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Trabajos chicos con precios</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950 sm:text-5xl">Pedi un trabajo electrico simple sin vueltas.</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Tomas, llaves de luz, fallas, tableros, luminarias, puesta a tierra y diagnosticos. Si el trabajo es simple,
            te mostramos un precio orientativo. Si es complejo, lo revisamos antes de presupuestar.
          </p>
          <div className="mt-6 grid gap-3 rounded-lg border border-amber-200 bg-white p-4 sm:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Visita técnica</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">
                Desde {money(site.pricingRules.technicalVisitFrom, site.pricingRules.currency)}
              </p>
            </div>
            <p className="text-sm leading-6 text-slate-600">{site.pricingRules.priceDisclaimer}</p>
          </div>
          <div className="mt-5 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-500">
            <Search className="h-5 w-5" />
            <span className="text-sm">Buscá por categoría o elegí la ficha más parecida a tu pedido y enviá fotos.</span>
          </div>
        </div>
      </section>

      <section className="container py-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <a key={category} href={`#${category.toLowerCase().replace(/\s+/g, '-')}`} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:border-slate-950">
              {category}
            </a>
          ))}
        </div>
      </section>

      <section className="container grid gap-4 pb-12 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <article key={service.slug} id={service.category.toLowerCase().replace(/\s+/g, '-')} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{service.category}</p>
              {service.featured ? <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-800">Destacado</span> : null}
            </div>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">{service.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{service.shortDescription}</p>
            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              <p><strong className="text-slate-950">Precio:</strong> {priceLabel(service, site.pricingRules.currency)}</p>
              <p><strong className="text-slate-950">Incluye:</strong> {service.includes.slice(0, 2).join(', ')}</p>
              <p><strong className="text-slate-950">No incluye:</strong> {service.excludes.slice(0, 2).join(', ')}</p>
              <p><strong className="text-slate-950">Puede cambiar por:</strong> {service.priceChanges.slice(0, 2).join(', ')}</p>
              <p><strong className="text-slate-950">Zona:</strong> {service.coverageZone}</p>
              <p><strong className="text-slate-950">Duracion:</strong> {service.estimatedDuration}</p>
              <p><strong className="text-slate-950">Visita técnica:</strong> {service.requiresVisit ? 'Requerida' : 'No siempre es necesaria'}</p>
              <p><strong className="text-slate-950">Cotización por fotos:</strong> {service.quoteByPhotos ? 'Disponible' : 'Requiere revisión previa'}</p>
            </div>
            <Link href={`/trabajos-electricos/${service.slug}` as Route} className="mt-5 inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
              <Camera className="mr-2 h-4 w-4" />
              {service.customCta || 'Enviar fotos para cotizar'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </article>
        ))}
      </section>

      <section className="border-y border-slate-200 bg-slate-950 py-10 text-white">
        <div className="container grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">Costos adicionales</p>
            <h2 className="mt-2 text-3xl font-semibold">Lo que puede modificar el precio</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {site.additionalCosts
              .filter((cost) => cost.active)
              .sort((a, b) => a.order - b.order)
              .slice(0, 6)
              .map((cost) => (
                <div key={cost.name} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">{cost.name}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">{cost.description}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-amber-200">{cost.appliesWhen}</p>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}

