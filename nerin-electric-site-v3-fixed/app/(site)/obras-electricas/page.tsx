import { getSiteContent, getWhatsappHref } from '@/lib/site-content'
import { majorWorks } from '@/lib/nerin-electricidad'
import { LeadWizard } from '@/components/LeadWizard'

export const metadata = {
  title: 'Obras electricas grandes | NERIN',
  description: 'Gestion de obras electricas, avances, certificados, materiales, jornales, cobros y seguimiento para clientes.',
}

export default async function ObrasElectricasPage() {
  const site = await getSiteContent()
  const whatsappHref = getWhatsappHref(site)

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-slate-950 py-14 text-white">
        <div className="container max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">Obras electricas</p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Obras grandes con alcance, avance, certificados y cobros controlados.</h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            En obras grandes trabajamos con presupuesto por alcance, seguimiento de avance y certificados por etapa.
          </p>
        </div>
      </section>
      <section className="container grid gap-5 py-14 md:grid-cols-2 lg:grid-cols-3">
        {majorWorks.map((item) => (
          <article key={item} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">{item}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Presupuesto por alcance, materiales separados, adicionales, certificados y control de cobros.</p>
          </article>
        ))}
      </section>
      <section className="border-t border-slate-200 bg-slate-50 py-14">
        <div className="container grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <h2 className="text-3xl font-semibold text-slate-950">Solicitar reunion o presupuesto de obra</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">No inventamos datos reales ni certificaciones. La obra se evalua por Valdir Nerin antes de presupuestar.</p>
          </div>
          <LeadWizard whatsappHref={whatsappHref} initialRequestType="Obra grande" />
        </div>
      </section>
    </div>
  )
}
