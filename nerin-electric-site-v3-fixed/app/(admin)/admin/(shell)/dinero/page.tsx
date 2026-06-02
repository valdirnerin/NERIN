const alerts = [
  'Trabajos terminados sin cobrar.',
  'Obras con costos altos.',
  'Obras sin certificado reciente.',
  'Clientes con deuda.',
  'Gastos del mes altos.',
  'Presupuestos aceptados sin inicio.',
  'Solicitudes sin responder.',
  'Trabajos fuera de zona pendientes de revision.',
]

export default function AdminDineroPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-950">Dinero</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Ingresos, gastos, cobros pendientes, resultado mensual y rentabilidad estimada por trabajo, refaccion u obra.
        </p>
      </header>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {['Ingresos del mes', 'Gastos del mes', 'Resultado estimado', 'Cobros pendientes'].map((item) => (
          <article key={item} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">$0</p>
          </article>
        ))}
      </section>
      <section className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
        <h2 className="text-xl font-semibold text-white">Alertas financieras</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {alerts.map((alert) => (
            <p key={alert} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">{alert}</p>
          ))}
        </div>
      </section>
    </div>
  )
}
