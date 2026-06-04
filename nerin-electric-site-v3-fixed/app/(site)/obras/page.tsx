import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { featuredExperience } from '@/lib/nerin-electricidad'

export const metadata = {
  title: 'Obras electricas y experiencia | NERIN',
  description: 'Experiencia en locales comerciales, gimnasios, supermercados y edificios residenciales sin inventar datos especificos.',
}

export default function ObrasPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-slate-950 py-14 text-white">
        <div className="container max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">Obras y experiencia</p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Instalaciones electricas para obra, comercio y edificios.</h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Experiencia en espacios comerciales, gimnasios, supermercados y edificios residenciales, con alcance definido por relevamiento.
          </p>
        </div>
      </section>
      <section className="container grid gap-5 py-14 md:grid-cols-2">
        {featuredExperience.map((name) => (
          <article key={name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">{name}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Experiencia en instalaciones electricas para locales comerciales, gimnasios, supermercados y edificios residenciales.
            </p>
          </article>
        ))}
      </section>
      <section className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="container flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Tenes una obra proxima a iniciar?</h2>
            <p className="mt-1 text-sm text-slate-600">Pedi una visita tecnica y ordena alcance, etapas, materiales y certificados.</p>
          </div>
          <Link href="/presupuestador?tipo=Obra electrica" className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
            Iniciar solicitud
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
