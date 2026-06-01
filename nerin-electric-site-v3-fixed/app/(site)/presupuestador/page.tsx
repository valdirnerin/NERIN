import { getSiteContent, getWhatsappHref } from '@/lib/site-content'
import { LeadWizard } from '@/components/LeadWizard'

export const metadata = {
  title: 'Presupuestador electrico simple | NERIN',
  description: 'Solicita presupuesto electrico en 4 pasos: necesidad, zona, urgencia, detalle y fotos.',
}

export default async function PresupuestadorPage({ searchParams }: { searchParams: { tipo?: string } }) {
  const site = await getSiteContent()
  const whatsappHref = getWhatsappHref(site)

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white py-14">
        <div className="container max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Presupuestador</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950 sm:text-5xl">Cuatro pasos y una solicitud clara.</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            No es una herramienta tecnica pesada. Es una forma rapida de entender que necesitas, donde es, que urgencia tiene y como contactarte.
          </p>
        </div>
      </section>
      <section className="container py-14">
        <LeadWizard whatsappHref={whatsappHref} initialWorkType={searchParams.tipo} />
      </section>
    </div>
  )
}
