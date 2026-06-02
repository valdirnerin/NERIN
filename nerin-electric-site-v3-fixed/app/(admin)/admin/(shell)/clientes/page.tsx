export default function AdminClientesPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-950">Clientes</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Particulares, comercios, oficinas, consorcios, empresas y constructoras.
        </p>
      </header>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
        Todavia no hay clientes en esta vista. Cuando una solicitud se convierta en trabajo, refaccion u obra, la ficha del cliente va a mostrar datos, solicitudes, presupuestos, ingresos, cobros pendientes y notas internas.
      </section>
    </div>
  )
}
