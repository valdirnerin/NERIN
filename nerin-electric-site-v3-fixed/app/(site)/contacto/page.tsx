import { getSiteContent, getWhatsappHref } from '@/lib/site-content'
import { LeadWizard } from '@/components/LeadWizard'

export const metadata = {
  title: 'Contacto y presupuesto electrico | NERIN',
  description: 'Solicita presupuesto para fallas, tableros, instalaciones, mantenimiento y obras electricas en CABA/GBA.',
}

export default async function ContactoPage() {
  const site = await getSiteContent()
  const whatsappHref = getWhatsappHref(site)

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white py-14">
        <div className="container max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Contacto</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950 sm:text-5xl">Pedi presupuesto claro para resolver bien.</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Envia tipo de trabajo, zona, urgencia y fotos si tenes. Si el problema puede escalar, conviene pedir visita tecnica.
          </p>
        </div>
      </section>
      <section className="container grid gap-8 py-14 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Que priorizamos</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li>Fallas con corte total o parcial.</li>
            <li>Tableros con olor, temperatura, chispazos o disparos frecuentes.</li>
            <li>Locales, oficinas y edificios con operacion afectada.</li>
            <li>Obras proximas a iniciar con alcance definido.</li>
          </ul>
        </aside>
        <LeadWizard whatsappHref={whatsappHref} />
      </section>
    </div>
  )
}
