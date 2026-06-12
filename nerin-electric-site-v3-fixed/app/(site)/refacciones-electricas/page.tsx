import { ClipboardList, Images } from 'lucide-react'
import { getSiteContent, getWhatsappHref } from '@/lib/site-content'
import { renovationCards } from '@/lib/nerin-electricidad'
import { LeadWizard } from '@/components/LeadWizard'
import { breadcrumbJsonLd, buildSeoMetadata } from '@/lib/seo'

export const metadata = buildSeoMetadata({
  title: 'Refacción eléctrica de departamento en CABA | NERIN',
  description:
    'Refacciones electricas de departamentos, casas, locales y oficinas en CABA/GBA con relevamiento, fotos, alcance claro y presupuesto por caso.',
  path: '/refacciones-electricas',
})

export default async function RefaccionesElectricasPage() {
  const site = await getSiteContent()
  const whatsappHref = getWhatsappHref(site)
  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Inicio', path: '/' },
    { name: 'Refacciones electricas', path: '/refacciones-electricas' },
  ])

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <section className="border-b border-slate-200 bg-slate-50 py-14">
        <div className="container max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Refacciones electricas</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950 sm:text-5xl">Trabajos medianos que necesitan alcance, relevamiento y presupuesto.</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            En refacciones, el precio depende del estado existente, cantidad de bocas, tablero, canalizaciones y alcance real.
            Por eso no prometemos precio cerrado automatico.
          </p>
        </div>
      </section>
      <section className="container grid gap-4 py-8 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <ClipboardList className="h-5 w-5 text-slate-950" />
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">Pedir relevamiento</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Para departamentos, locales, oficinas, reformas parciales, renovacion de tablero y ampliaciones.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Images className="h-5 w-5 text-slate-950" />
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">Enviar fotos y alcance</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Fotos del tablero, ambientes, canalizaciones existentes y una descripcion de lo que queres modificar.
          </p>
        </div>
      </section>
      <section className="container grid gap-5 pb-14 md:grid-cols-2">
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
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Carga tipo de propiedad, zona, ambientes, alcance real, estado existente y fotos si tenes.
            </p>
          </div>
          <LeadWizard
            whatsappHref={whatsappHref}
            initialRequestType="Refaccion electrica"
            submitLabel="Enviar fotos y alcance"
            detailPlaceholder="Describi el alcance: ambientes, cantidad aproximada de bocas, estado del tablero, canalizaciones existentes y que parte queres renovar o ampliar."
          />
        </div>
      </section>
    </div>
  )
}

