import { FileCheck2, Milestone, PanelsTopLeft } from 'lucide-react'
import { getSiteContent, getWhatsappHref } from '@/lib/site-content'
import { majorWorks } from '@/lib/nerin-electricidad'
import { LeadWizard } from '@/components/LeadWizard'
import { breadcrumbJsonLd, buildSeoMetadata } from '@/lib/seo'

export const metadata = buildSeoMetadata({
  title: 'Obras e instalaciones electricas en CABA | NERIN',
  description:
    'Obra electrica para local comercial, edificios, oficinas y obras nuevas en CABA/GBA con planificacion por etapas, presupuesto formal y seguimiento.',
  path: '/obras-electricas',
})

const obraHighlights = [
  { icon: Milestone, title: 'Planificacion por etapas', text: 'Alcance ordenado para coordinar rubros, tiempos, materiales y prioridades de obra.' },
  { icon: FileCheck2, title: 'Presupuesto formal', text: 'Instalaciones completas, tableros, canalizaciones, iluminacion y fuerza motriz segun necesidad.' },
  { icon: PanelsTopLeft, title: 'Seguimiento y portal cliente', text: 'Avances, documentacion, certificados de avance y comunicacion de obra cuando corresponde.' },
] as const

export default async function ObrasElectricasPage() {
  const site = await getSiteContent()
  const whatsappHref = getWhatsappHref(site)
  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Inicio', path: '/' },
    { name: 'Obras electricas', path: '/obras-electricas' },
  ])

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <section className="border-b border-slate-200 bg-slate-950 py-14 text-white">
        <div className="container max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">Obras electricas</p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Instalaciones completas con planificacion, etapas y seguimiento formal.</h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Para locales comerciales, edificios, obras nuevas, tableros, canalizaciones, iluminacion, fuerza motriz,
            documentacion y certificados cuando corresponda.
          </p>
        </div>
      </section>
      <section className="container grid gap-4 py-8 md:grid-cols-3">
        {obraHighlights.map((item) => {
          const Icon = item.icon
          return (
            <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <Icon className="h-5 w-5 text-slate-950" />
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            </article>
          )
        })}
      </section>
      <section className="container grid gap-5 pb-14 md:grid-cols-2 lg:grid-cols-3">
        {majorWorks.map((item) => (
          <article key={item} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">{item}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Presupuesto por alcance, etapas, avances, adicionales, documentacion y certificados cuando corresponda.</p>
          </article>
        ))}
      </section>
      <section className="border-t border-slate-200 bg-slate-50 py-14">
        <div className="container grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <h2 className="text-3xl font-semibold text-slate-950">Solicitar reunion o presupuesto de obra</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Contanos ubicacion, tipo de obra, rubros electricos, etapa actual, documentacion disponible y fechas objetivo.
            </p>
          </div>
          <LeadWizard
            whatsappHref={whatsappHref}
            initialRequestType="Obra grande"
            submitLabel="Solicitar presupuesto de obra"
            detailPlaceholder="Describi la obra: local, edificio u obra nueva; tableros, canalizaciones, iluminacion, fuerza motriz, documentacion disponible y etapa actual."
          />
        </div>
      </section>
    </div>
  )
}
