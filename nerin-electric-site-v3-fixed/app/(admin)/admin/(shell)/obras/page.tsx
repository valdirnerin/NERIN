import { prisma } from '@/lib/db'
import { DB_ENABLED } from '@/lib/dbMode'
import { FormSection } from '@/components/admin/ui/FormSection'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function money(value: number | bigint) {
  const asNumber = typeof value === 'bigint' ? Number(value) : value
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(asNumber)
}

export default async function AdminObrasPage() {
  if (!DB_ENABLED) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-950">Obras</h1>
        <p className="text-sm text-slate-600">La base de datos esta deshabilitada. No hay obras para mostrar.</p>
      </div>
    )
  }

  const [opsProjects, legacyProjects] = await Promise.all([
    prisma.opsProject.findMany({
      include: { client: true, certificates: true, additionals: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.project.findMany({
      include: { client: { include: { user: true } }, progressCertificates: true, invoices: true, projectPayments: true },
      orderBy: { updatedAt: 'desc' },
    }),
  ])

  const rows = [
    ...opsProjects.map((project) => ({
      id: `ops-${project.id}`,
      name: `${project.client.name} / ${project.title}`,
      stage: project.status,
      progress: `${project.progressPercent}%`,
      certificates: `${project.certificates.length} certificados`,
      docs: project.additionals.length ? `${project.additionals.length} adicionales` : 'Documentacion pendiente',
      payments: money(project.certificates.reduce((sum, item) => sum + (item.paidAt ? item.amount : 0n), 0n)),
      next: project.notes || 'Definir proximo hito',
    })),
    ...legacyProjects.map((project) => ({
      id: `legacy-${project.id}`,
      name: `${project.client.user.name || project.client.user.email} / ${project.nombre}`,
      stage: project.estado,
      progress: `${project.avanceCertificado}% certificado`,
      certificates: `${project.progressCertificates.length} certificados`,
      docs: project.invoices.length ? `${project.invoices.length} comprobantes` : 'Documentacion pendiente',
      payments: money(project.projectPayments.reduce((sum, item) => sum + item.amount, 0)),
      next: project.fechaFinEstimada ? `Hito estimado: ${project.fechaFinEstimada.toLocaleDateString('es-AR')}` : 'Definir proximo hito',
    })),
  ]

  const activeCount = rows.length

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-950">Obras</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Proyectos grandes con etapa, avance, certificados, documentacion, pagos y proximos hitos.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Obras activas</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{activeCount}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Con certificados</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{rows.filter((row) => !row.certificates.startsWith('0')).length}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Hitos a revisar</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{rows.filter((row) => row.next.includes('Definir')).length}</p>
        </article>
      </section>

      <FormSection title="Proyectos grandes" description="Para seguimiento de obra, certificacion y pagos sin mezclar trabajos chicos.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="border-b border-slate-200 py-3">Cliente/proyecto</th>
                <th className="border-b border-slate-200 py-3">Etapa</th>
                <th className="border-b border-slate-200 py-3">Avance</th>
                <th className="border-b border-slate-200 py-3">Certificados</th>
                <th className="border-b border-slate-200 py-3">Documentacion</th>
                <th className="border-b border-slate-200 py-3">Pagos</th>
                <th className="border-b border-slate-200 py-3">Proximos hitos</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 align-top">
                  <td className="py-3 font-semibold text-slate-950">{row.name}</td>
                  <td className="py-3 text-slate-600">{row.stage}</td>
                  <td className="py-3 text-slate-600">{row.progress}</td>
                  <td className="py-3 text-slate-600">{row.certificates}</td>
                  <td className="py-3 text-slate-600">{row.docs}</td>
                  <td className="py-3 text-slate-600">{row.payments}</td>
                  <td className="py-3 text-slate-600">{row.next}</td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-slate-500">
                    Todavia no hay obras cargadas.
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
