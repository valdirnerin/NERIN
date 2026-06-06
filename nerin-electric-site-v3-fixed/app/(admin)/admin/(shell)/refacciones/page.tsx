import { prisma } from '@/lib/db'
import { DB_ENABLED } from '@/lib/dbMode'
import { FormSection } from '@/components/admin/ui/FormSection'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function money(value: number) {
  return value > 0
    ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value)
    : 'Pendiente'
}

export default async function AdminRefaccionesPage() {
  if (!DB_ENABLED) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-950">Refacciones</h1>
        <p className="text-sm text-slate-600">La base de datos esta deshabilitada. No hay refacciones para mostrar.</p>
      </div>
    )
  }

  const jobs = await prisma.renovationJob.findMany({
    include: { customer: true, request: true },
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-950">Refacciones</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Trabajos medianos: cliente, propiedad, alcance, relevamiento, presupuesto, estado y proximos pasos.
        </p>
      </header>

      <FormSection title="Trabajos medianos" description="Separado de trabajos chicos y obras grandes para priorizar mejor.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="border-b border-slate-200 py-3">Cliente</th>
                <th className="border-b border-slate-200 py-3">Propiedad</th>
                <th className="border-b border-slate-200 py-3">Alcance</th>
                <th className="border-b border-slate-200 py-3">Relevamiento</th>
                <th className="border-b border-slate-200 py-3">Presupuesto</th>
                <th className="border-b border-slate-200 py-3">Estado</th>
                <th className="border-b border-slate-200 py-3">Proximos pasos</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b border-slate-100 align-top">
                  <td className="py-3 font-semibold text-slate-950">{job.customer?.name || job.request?.customerName || 'Sin cliente'}</td>
                  <td className="py-3 text-slate-600">{job.propertyType || job.address || 'Sin propiedad'}</td>
                  <td className="py-3 text-slate-600">{job.scope || `${job.rooms} ambientes · ${job.estimatedPoints} puntos`}</td>
                  <td className="py-3 text-slate-600">{job.currentInstallationState || 'Pendiente'}</td>
                  <td className="py-3 text-slate-600">{job.quoteStatus} · {money(job.estimatedLabor + job.estimatedMaterials)}</td>
                  <td className="py-3 text-slate-600">{job.jobStatus}</td>
                  <td className="py-3 text-slate-600">{job.notes || 'Definir visita, fotos o cierre comercial'}</td>
                </tr>
              ))}
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-slate-500">
                    Todavia no hay refacciones cargadas.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </FormSection>
    </div>
  )
}
