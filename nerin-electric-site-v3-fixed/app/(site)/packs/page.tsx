import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { packs } from '@/lib/nerin-electricidad'

export const metadata = {
  title: 'Packs electricos con precios desde | NERIN',
  description: 'Packs de mano de obra para vivienda estandar, casa country 1 y casa country 2.',
}

export default function PacksPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-slate-950 py-14 text-white">
        <div className="container max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">Packs electricos</p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Mano de obra con precio desde, alcance y condiciones claras.</h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Valores orientativos de mano de obra. Materiales, artefactos y proyecto electrico se cotizan por separado.
          </p>
        </div>
      </section>
      <section className="container grid gap-5 py-14 lg:grid-cols-3">
        {packs.map((pack) => (
          <article key={pack.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">{pack.name}</h2>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{pack.price}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{pack.description}</p>
            <ul className="mt-5 space-y-2">
              {pack.bullets.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href={`/presupuestador?tipo=${encodeURIComponent(pack.name)}`} className="mt-6 inline-flex items-center text-sm font-semibold text-slate-950">
              Cotizar pack
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </article>
        ))}
      </section>
    </div>
  )
}
