import { getSiteContent, getWhatsappHref } from '@/lib/site-content'
import { LeadWizard } from '@/components/LeadWizard'

export const metadata = {
  title: 'Solicitud de trabajo electrico | NERIN',
  description: 'Carga una solicitud para trabajo chico, refaccion electrica, obra grande o servicio especial.',
}

export default async function PresupuestadorPage({
  searchParams,
}: {
  searchParams: { tipo?: string; solicitud?: string }
}) {
  const site = await getSiteContent()
  const whatsappHref = getWhatsappHref(site)

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white py-14">
        <div className="container max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Solicitud</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950 sm:text-5xl">Pedi un trabajo electrico sin calcular a ciegas.</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Elegi si es trabajo chico, refaccion, obra o servicio especial. Todo lo complejo pasa a revision manual por Valdir Nerin.
          </p>
        </div>
      </section>
      <section className="container py-14">
        <LeadWizard
          whatsappHref={whatsappHref}
          initialWorkType={searchParams.tipo}
          initialRequestType={searchParams.solicitud}
        />
      </section>
    </div>
  )
}
