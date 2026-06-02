import { renovationCards } from '@/lib/nerin-electricidad'

const states = [
  'Nueva solicitud',
  'Relevamiento pendiente',
  'Faltan datos',
  'Presupuestando',
  'Presupuesto enviado',
  'Aceptado',
  'Coordinado',
  'En curso',
  'Terminado',
  'Cobrada',
  'Cerrada',
  'Cancelada',
]

export default function AdminRefaccionesPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-950">Refacciones</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Trabajos medianos, reformas parciales, ampliaciones e instalaciones electricas por ambiente.
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        {renovationCards.map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
          </article>
        ))}
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Estados de refaccion</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {states.map((state) => (
            <span key={state} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
              {state}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
