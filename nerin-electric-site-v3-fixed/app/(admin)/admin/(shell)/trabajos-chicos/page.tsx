import { prisma } from '@/lib/db'
import { DB_ENABLED } from '@/lib/dbMode'
import { FormSection } from '@/components/admin/ui/FormSection'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function money(value: number) {
  return value > 0
    ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value)
    : 'A definir'
}

export default async function AdminTrabajosChicosPage() {
  if (!DB_ENABLED) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-950">Trabajos chicos</h1>
        <p className="text-sm text-slate-600">La base de datos esta deshabilitada. No hay trabajos para mostrar.</p>
      </div>
    )
  }

  const [jobs, catalog] = await Promise.all([
    prisma.smallJob.findMany({
      include: { customer: true, request: true, serviceItem: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.serviceCatalogItem.findMany({
      where: { visible: true },
      orderBy: { name: 'asc' },
      take: 12,
    }),
  ])

  const rows = jobs.length
    ? jobs.map((job) => ({
        id: job.id,
        service: job.title || job.serviceItem?.name || 'Trabajo chico',
        priceFrom: money(job.estimatedPrice || job.serviceItem?.priceFrom || 0),
        zone: job.request?.zone || job.serviceItem?.enabledZone || job.address || 'Sin zona',
        technician: job.technician || 'Sin asignar',
        status: job.status,
        payment: job.collectedAmount > 0 ? money(job.collectedAmount) : 'Pendiente',
        close: job.finalPrice > 0 && job.collectedAmount >= job.finalPrice ? 'Cerrado' : 'Abierto',
      }))
    : catalog.map((item) => ({
        id: item.id,
        service: item.name,
        priceFrom: money(item.priceFrom),
        zone: item.enabledZone,
        technician: 'Sin asignar',
        status: 'Disponible',
        payment: 'Sin cobro',
        close: 'Listo para vender',
      }))

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-950">Trabajos chicos</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Vista rapida de servicios simples, precio desde, zona, asignacion, estado, cobro y cierre.
        </p>
      </header>

      <FormSection title="Trabajos simples" description="Si todavia no hay trabajos activos, se muestra el catalogo vendible para operar rapido.">
        <div className="grid gap-3 md:hidden">
          {rows.map((row) => (
            <article key={row.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-950">{row.service}</p>
              <p className="mt-1 text-sm text-slate-600">{row.priceFrom} · {row.zone}</p>
              <p className="mt-2 text-xs text-slate-500">Asignado: {row.technician} · {row.status} · {row.payment}</p>
            </article>
          ))}
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="border-b border-slate-200 py-3">Servicio</th>
                <th className="border-b border-slate-200 py-3">Precio desde</th>
                <th className="border-b border-slate-200 py-3">Zona</th>
                <th className="border-b border-slate-200 py-3">Tecnico/asignado</th>
                <th className="border-b border-slate-200 py-3">Estado</th>
                <th className="border-b border-slate-200 py-3">Cobro</th>
                <th className="border-b border-slate-200 py-3">Cierre</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 align-top">
                  <td className="py-3 font-semibold text-slate-950">{row.service}</td>
                  <td className="py-3 text-slate-600">{row.priceFrom}</td>
                  <td className="py-3 text-slate-600">{row.zone}</td>
                  <td className="py-3 text-slate-600">{row.technician}</td>
                  <td className="py-3 text-slate-600">{row.status}</td>
                  <td className="py-3 text-slate-600">{row.payment}</td>
                  <td className="py-3 text-slate-600">{row.close}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormSection>
    </div>
  )
}
