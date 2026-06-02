import { notFound } from 'next/navigation'
import { getSiteContent, getWhatsappHref } from '@/lib/site-content'
import { getServiceBySlug, manualReviewMessage, safetyNotice, serviceCatalog } from '@/lib/nerin-electricidad'
import { LeadWizard } from '@/components/LeadWizard'

export function generateStaticParams() {
  return serviceCatalog.map((service) => ({ slug: service.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug)
  if (!service) return {}
  return {
    title: `${service.name} en CABA y GBA | NERIN`,
    description: `${service.shortDescription} Precio ${service.priceFrom ?? 'a presupuestar'}.`,
  }
}

export default async function TrabajoElectricoPage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug)
  if (!service) notFound()

  const site = await getSiteContent()
  const whatsappHref = getWhatsappHref(site)

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50 py-14">
        <div className="container grid gap-8 lg:grid-cols-[0.85fr_0.55fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">{service.category}</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-950 sm:text-5xl">{service.name} en CABA y GBA</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">{service.longDescription}</p>
          </div>
          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Precio</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{service.priceFrom ?? 'A presupuestar'}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Tipo de precio: {service.priceType === 'a-presupuestar' ? 'a presupuestar' : service.priceType}.
            </p>
          </aside>
        </div>
      </section>

      <section className="container grid gap-8 py-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <InfoBlock title="Que incluye" items={service.includes} />
          <InfoBlock title="Que no incluye" items={service.excludes} />
          <InfoBlock title="Variantes" items={service.variants} />
          <InfoBlock title="Que puede cambiar el precio" items={service.priceChanges} />
          <InfoBlock title="Motivos de revision manual" items={service.manualReviewReasons} />
          <InfoBlock title="Motivos de cancelacion por seguridad" items={service.safetyCancelReasons} />
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-xl font-semibold text-slate-950">Materiales, viatico y zona</h2>
            <div className="mt-3 grid gap-2 text-sm text-slate-700">
              <p><strong>Materiales:</strong> {service.estimatedMaterials}</p>
              <p><strong>Viatico:</strong> {service.estimatedTravel}</p>
              <p><strong>Duracion:</strong> {service.estimatedDuration}</p>
              <p><strong>Zonas:</strong> {service.zone}</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">{manualReviewMessage}</p>
            <p className="mt-2 text-xs leading-5 text-slate-600">{safetyNotice}</p>
          </div>
          <LeadWizard
            whatsappHref={whatsappHref}
            initialRequestType="Trabajo chico"
            initialWorkType={service.name}
            serviceName={service.name}
          />
        </div>
      </section>
    </div>
  )
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </section>
  )
}
