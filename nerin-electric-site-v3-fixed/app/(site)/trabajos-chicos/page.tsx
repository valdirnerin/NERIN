import Link from 'next/link'
import { ArrowRight, Camera, Search } from 'lucide-react'
import { serviceCatalog, smallJobCategories } from '@/lib/nerin-electricidad'

export const metadata = {
  title: 'Trabajos chicos electricos con precios orientativos | NERIN',
  description: 'Pedidos electricos simples en CABA/GBA con precio desde, incluye, no incluye, duracion, zona y fotos para cotizar.',
}

export default function TrabajosChicosPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50 py-14">
        <div className="container max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Trabajos chicos</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950 sm:text-5xl">Pedidos simples, claros y cotizables con fotos.</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Cambio de tomacorriente, llave de luz, revision de tablero, falla electrica, toma para aire acondicionado,
            luminarias y pequenas reparaciones. Cada ficha muestra precio desde cuando existe, alcance y que puede cambiar el valor.
          </p>
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-500">
            <Search className="h-5 w-5" />
            <span className="text-sm">Elegi el servicio que mas se parezca a tu pedido y envia fotos para cotizar mejor.</span>
          </div>
        </div>
      </section>

      <section className="container py-8">
        <div className="flex flex-wrap gap-2">
          {smallJobCategories.map((category) => (
            <span key={category} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
              {category}
            </span>
          ))}
        </div>
      </section>

      <section className="container grid gap-4 pb-14 md:grid-cols-2 xl:grid-cols-3">
        {serviceCatalog.map((service) => (
          <article key={service.slug} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{service.category}</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">{service.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{service.shortDescription}</p>
            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              <p><strong className="text-slate-950">Precio desde:</strong> {service.priceFrom ?? 'A presupuestar'}</p>
              <p><strong className="text-slate-950">Incluye:</strong> {service.includes.slice(0, 2).join(', ')}</p>
              <p><strong className="text-slate-950">No incluye:</strong> {service.excludes.slice(0, 2).join(', ')}</p>
              <p><strong className="text-slate-950">Puede cambiar por:</strong> {service.priceChanges.slice(0, 2).join(', ')}</p>
              <p><strong className="text-slate-950">Zona:</strong> {service.zone}</p>
              <p><strong className="text-slate-950">Duracion:</strong> {service.estimatedDuration}</p>
            </div>
            <Link href={`/trabajos-chicos/${service.slug}`} className="mt-5 inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
              <Camera className="mr-2 h-4 w-4" />
              Enviar fotos para cotizar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </article>
        ))}
      </section>
    </div>
  )
}
