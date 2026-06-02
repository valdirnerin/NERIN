import { getSiteContent, getWhatsappHref } from '@/lib/site-content'
import { renovationCards } from '@/lib/nerin-electricidad'
import { LeadWizard } from '@/components/LeadWizard'

export const metadata = {
  title: 'Refacciones electricas y trabajos medianos | NERIN',
  description: 'Refacciones de departamentos, casas, locales y oficinas con relevamiento, fotos y presupuesto por Valdir Nerin.',
}

export default async function RefaccionesElectricasPage() {
  const site = await getSiteContent()
  const whatsappHref = getWhatsappHref(site)

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50 py-14">
        <div className="container max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Refacciones electricas</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950 sm:text-5xl">Trabajos medianos que necesitan relevamiento y presupuesto bien calculado.</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Este tipo de trabajo no tiene precio unico porque depende del estado de la instalacion, cantidad de bocas, tablero, materiales, canalizacion y alcance real.
          </p>
        </div>
      </section>
      <section className="container grid gap-5 py-14 md:grid-cols-2">
        {renovationCards.map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
          </article>
        ))}
      </section>
      <section className="border-t border-slate-200 bg-slate-50 py-14">
        <div className="container grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <h2 className="text-3xl font-semibold text-slate-950">Pedir relevamiento o enviar fotos</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Carga tipo de propiedad, zona, ambientes, alcance, urgencia y fotos si tenes.</p>
          </div>
          <LeadWizard whatsappHref={whatsappHref} initialRequestType="Refaccion electrica" />
        </div>
      </section>
    </div>
  )
}
