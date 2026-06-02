import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { serviceCards, trustItems } from '@/lib/nerin-electricidad'

export const metadata = {
  title: 'Servicios electricos en CABA y GBA | NERIN',
  description: 'Fallas, tableros, instalaciones, comercios, edificios, mantenimiento y circuitos dedicados con precio desde.',
}

export default function ServiciosPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50 py-14">
        <div className="container max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Servicios</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950 sm:text-5xl">Resolucion electrica clara, sin esconder precios.</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Elegi el problema, revisa el precio desde y envia la solicitud. Si el alcance cambia, se presupuestan materiales,
            adicionales y obra antes de avanzar.
          </p>
        </div>
      </section>
      <section className="container py-14">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {serviceCards.map((service) => (
            <article key={service.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">{service.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
              <p className="mt-4 text-sm font-bold text-slate-950">{service.price}</p>
              <Link href={service.href} className="mt-4 inline-flex items-center text-sm font-semibold text-slate-950">
                Pedir presupuesto
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="border-t border-slate-200 bg-slate-50 py-14">
        <div className="container grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
