import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { maintenancePlans } from '@/lib/nerin-electricidad'

export const metadata = {
  title: 'Mantenimiento electrico mensual | NERIN',
  description: 'Planes BASIC, PRO y ENTERPRISE para locales, oficinas, edificios, comercios activos y clientes criticos.',
}

export default function MantenimientoPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50 py-14">
        <div className="container max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Mantenimiento mensual</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950 sm:text-5xl">Menos cortes, menos urgencias y mas control.</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Para comercios, edificios y empresas donde una falla electrica frena operacion, genera reclamos o termina saliendo mas cara.
          </p>
        </div>
      </section>
      <section className="container grid gap-5 py-14 lg:grid-cols-3">
        {maintenancePlans.map((plan) => (
          <article key={plan.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">{plan.name}</h2>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{plan.price}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{plan.fit}</p>
            <ul className="mt-5 space-y-2">
              {plan.bullets.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href={`/presupuestador?tipo=Mantenimiento ${plan.name}`} className="mt-6 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
              Solicitar plan
            </Link>
          </article>
        ))}
      </section>
    </div>
  )
}
