import { notFound } from 'next/navigation'
import { Camera } from 'lucide-react'
import { getSiteContent, getWhatsappHref } from '@/lib/site-content'
import { resolveCommercialSite } from '@/lib/commercial-content'
import { LeadWizard } from '@/components/LeadWizard'
import { breadcrumbJsonLd, buildSeoMetadata } from '@/lib/seo'

export async function generateStaticParams() {
  const site = resolveCommercialSite(await getSiteContent())
  return site.smallServices.filter((service) => service.active).map((service) => ({ slug: service.slug }))
}

function money(value: number, currency: string) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const site = resolveCommercialSite(await getSiteContent())
  const service = site.smallServices.find((item) => item.slug === params.slug && item.active)
  if (!service) return {}

  return buildSeoMetadata({
    title: `${service.name} en CABA y GBA | NERIN`,
    description: `${service.shortDescription} Precio orientativo desde ${
      service.showPrice ? money(service.priceFrom, site.pricingRules.currency) : 'a confirmar'
    }. Enviá fotos para cotizar el trabajo eléctrico.`,
    path: `/trabajos-electricos/${service.slug}`,
  })
}

export default async function TrabajoElectricoPage({ params }: { params: { slug: string } }) {
  const site = resolveCommercialSite(await getSiteContent())
  const service = site.smallServices.find((item) => item.slug === params.slug && item.active)
  if (!service) notFound()

  const whatsappHref = getWhatsappHref(site)
  const price = service.showPrice ? money(service.priceFrom, site.pricingRules.currency) : 'A confirmar'
  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Inicio', path: '/' },
    { name: 'Trabajos electricos', path: '/trabajos-electricos' },
    { name: service.name, path: `/trabajos-electricos/${service.slug}` },
  ])

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <section className="border-b border-slate-200 bg-slate-50 py-12">
        <div className="container grid gap-8 lg:grid-cols-[0.85fr_0.55fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Trabajos electricos / {service.category}</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-950 sm:text-5xl">{service.name}</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">{service.shortDescription}</p>
          </div>
          <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Precio orientativo</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{service.showPrice ? `Desde ${price}` : price}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{site.pricingRules.priceDisclaimer}</p>
          </aside>
        </div>
      </section>

      <section className="container grid gap-8 py-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <InfoBlock title="Que incluye" items={service.includes} />
          <InfoBlock title="Que no incluye" items={service.excludes} />
          <InfoBlock title="Que puede cambiar el precio" items={service.priceChanges} />
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Condiciones comerciales</h2>
            <div className="mt-3 grid gap-2 text-sm text-slate-700">
              <p><strong className="text-slate-950">Visita técnica:</strong> desde {money(site.pricingRules.technicalVisitFrom, site.pricingRules.currency)}</p>
              <p><strong className="text-slate-950">Requiere visita:</strong> {service.requiresVisit ? 'Si' : 'No siempre'}</p>
              <p><strong className="text-slate-950">Cotizacion por fotos:</strong> {service.quoteByPhotos ? 'Si' : 'A confirmar'}</p>
              <p><strong className="text-slate-950">Zona:</strong> {service.coverageZone}</p>
              <p><strong className="text-slate-950">Duracion estimada:</strong> {service.estimatedDuration}</p>
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
            <h2 className="flex items-center text-xl font-semibold text-slate-950">
              <Camera className="mr-2 h-5 w-5" />
              Enviá fotos y evitá visitas innecesarias
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Mostranos el punto, tablero, toma, llave, luminaria o falla. Si hay olor, recalentamiento, humedad o corte,
              avisalo antes de coordinar.
            </p>
          </div>
          <LeadWizard
            whatsappHref={whatsappHref}
            initialRequestType="Trabajo chico"
            initialWorkType={service.name}
            serviceName={service.name}
            servicePriceFrom={price}
            submitLabel={service.customCta || 'Enviar fotos para cotizar'}
            detailPlaceholder="Contanos que pasa y adjunta fotos del punto, tablero, toma, llave, luminaria o falla."
          />
        </div>
      </section>
    </div>
  )
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </section>
  )
}

