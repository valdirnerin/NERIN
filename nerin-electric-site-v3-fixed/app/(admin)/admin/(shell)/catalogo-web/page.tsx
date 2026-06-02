import { serviceCatalog, smallJobCategories, specialServices } from '@/lib/nerin-electricidad'

export default function AdminCatalogoWebPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-950">Catalogo web</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Trabajos chicos, variantes, precios, categorias, refacciones, obras, servicios especiales, FAQs, zonas y textos de seguridad.
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-3xl font-semibold text-slate-950">{serviceCatalog.length}</p>
          <p className="text-sm text-slate-600">Trabajos chicos publicados</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-3xl font-semibold text-slate-950">{smallJobCategories.length}</p>
          <p className="text-sm text-slate-600">Categorias</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-3xl font-semibold text-slate-950">{specialServices.length}</p>
          <p className="text-sm text-slate-600">Servicios especiales</p>
        </article>
      </section>
    </div>
  )
}
