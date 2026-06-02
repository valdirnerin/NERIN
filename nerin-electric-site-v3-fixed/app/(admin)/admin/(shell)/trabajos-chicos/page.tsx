import { serviceCatalog } from '@/lib/nerin-electricidad'

export default function AdminTrabajosChicosPage() {
  return (
    <AdminSection
      title="Trabajos chicos"
      subtitle="Servicios puntuales, reparaciones, instalaciones menores y diagnosticos."
      tabs={['Solicitudes', 'Trabajos activos', 'Catalogo de trabajos', 'Precios y variantes', 'Zonas']}
      rows={serviceCatalog.map((item) => ({
        main: item.name,
        meta: item.category,
        detail: `${item.priceFrom ?? 'A presupuestar'} · ${item.estimatedDuration} · ${item.zone}`,
      }))}
    />
  )
}

function AdminSection({
  title,
  subtitle,
  tabs,
  rows,
}: {
  title: string
  subtitle: string
  tabs: string[]
  rows: Array<{ main: string; meta: string; detail: string }>
}) {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-950">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
      </header>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <span key={tab} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
            {tab}
          </span>
        ))}
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-3">
          {rows.map((row) => (
            <article key={row.main} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-950">{row.main}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{row.meta}</p>
              <p className="mt-2 text-sm text-slate-600">{row.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
