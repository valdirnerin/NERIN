const tabs = ['Resumen', 'Avances', 'Certificados', 'Materiales', 'Jornales', 'Gastos', 'Adicionales', 'Cobros', 'Equipo', 'Cliente', 'Notas']

export default function AdminObrasPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-950">Obras</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Gestion de obras grandes, costos, avance, certificados y cobros.
        </p>
      </header>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {['Obras activas', 'Total certificado', 'Total cobrado', 'Saldo pendiente', 'Costos cargados', 'Resultado estimado'].map((item) => (
          <article key={item} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">0</p>
          </article>
        ))}
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Ficha de obra preparada</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <span key={tab} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
              {tab}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
