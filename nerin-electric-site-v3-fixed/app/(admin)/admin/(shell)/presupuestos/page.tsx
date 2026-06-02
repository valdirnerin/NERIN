const states = ['Borrador', 'Enviado', 'Esperando respuesta', 'Aceptado', 'Rechazado', 'Vencido']

export default function AdminPresupuestosPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-950">Presupuestos</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Presupuestos para trabajos chicos, refacciones y obras con mano de obra, materiales, viaticos, adicionales y validez.
        </p>
      </header>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Estados</h2>
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
