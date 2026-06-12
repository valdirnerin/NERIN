import { getSiteContent, getWhatsappHref } from '@/lib/site-content'
import { specialServices } from '@/lib/nerin-electricidad'
import { LeadWizard } from '@/components/LeadWizard'
import { breadcrumbJsonLd, buildSeoMetadata } from '@/lib/seo'

export const metadata = buildSeoMetadata({
  title: 'Servicios electricos especiales en CABA | NERIN',
  description:
    'Diagnóstico eléctrico, informes, revisión de tablero, puesta a tierra, cortes frecuentes y relevamientos en CABA/GBA con revisión técnica.',
  path: '/servicios-especiales',
})

export default async function ServiciosEspecialesPage() {
  const site = await getSiteContent()
  const whatsappHref = getWhatsappHref(site)
  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Inicio', path: '/' },
    { name: 'Servicios especiales', path: '/servicios-especiales' },
  ])

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <section className="border-b border-slate-200 bg-slate-50 py-14">
        <div className="container max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Servicios especiales</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950 sm:text-5xl">Servicios que ayudan a decidir antes de gastar mal.</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Diagnosticos, informes, revisiones de seguridad y relevamientos para casos donde un precio estandar seria poco serio.
          </p>
        </div>
      </section>
      <section className="container grid gap-5 py-14 md:grid-cols-2 lg:grid-cols-3">
        {specialServices.map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
            <p className="mt-2 text-sm font-bold text-slate-950">{item.price}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
          </article>
        ))}
      </section>
      <section className="border-t border-slate-200 bg-slate-50 py-14">
        <div className="container grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <h2 className="text-3xl font-semibold text-slate-950">Pedir revision por Valdir Nerin</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Los servicios especiales pueden tener precio desde, precio fijo o pasar a presupuesto manual.</p>
          </div>
          <LeadWizard whatsappHref={whatsappHref} initialRequestType="Servicio especial" />
        </div>
      </section>
    </div>
  )
}

