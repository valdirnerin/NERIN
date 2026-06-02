export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/db'
import { DB_ENABLED } from '@/lib/dbMode'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const pipeline = [
  'Nuevo',
  'Contactado',
  'Esperando fotos',
  'Presupuesto pendiente',
  'Presupuesto enviado',
  'Negociando',
  'Ganado',
  'Perdido',
]

const alerts = [
  'Revisar leads nuevos antes de terminar el dia.',
  'Separar siempre materiales de mano de obra en presupuestos.',
  'No publicar datos legales, matriculas o responsables hasta cargarlos oficialmente.',
]

function Stat({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
      {detail ? <p className="mt-1 text-sm text-slate-500">{detail}</p> : null}
    </article>
  )
}

export default async function AdminPage() {
  if (!DB_ENABLED) {
    return (
      <div className="space-y-4">
        <Badge>Panel administrativo</Badge>
        <h1 className="text-3xl font-semibold text-slate-950">Panel no configurado</h1>
        <p className="text-sm text-slate-600">La base de datos esta deshabilitada. Activala para gestionar contenido y leads.</p>
      </div>
    )
  }

  const [leads, packs, plans, projects, clients, certificates] = await Promise.all([
    prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }),
    prisma.pack.count(),
    prisma.maintenancePlan.count(),
    prisma.project.count(),
    prisma.opsClient.count().catch(() => 0),
    prisma.opsProgressCertificate.count().catch(() => 0),
  ])

  const currentMonth = new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <Badge>Centro de control NERIN Electricidad</Badge>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950">Dashboard comercial, operativo y financiero</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Admin interno para controlar leads, presupuestos, obras, certificados, mantenimiento, ingresos, gastos y contenido web.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild className="bg-slate-950 hover:bg-slate-800">
              <Link href="/admin/leads">Ver leads</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/packs">Servicios y packs</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Leads nuevos" value={leads.length} detail="ultimos registros visibles" />
        <Stat label="Presupuestos pendientes" value="0" detail="preparado para Quote" />
        <Stat label="Obras activas" value={projects} detail="proyectos actuales" />
        <Stat label="Mantenimientos activos" value={plans} detail="planes configurados" />
        <Stat label="Ingresos del mes" value="$0" detail={currentMonth} />
        <Stat label="Gastos del mes" value="$0" detail="categorias listas" />
        <Stat label="Clientes" value={clients} detail="base operativa" />
        <Stat label="Certificados" value={certificates} detail="avance y cobro" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Pipeline comercial</h2>
              <p className="mt-1 text-sm text-slate-500">Estados recomendados para convertir consultas en trabajos.</p>
            </div>
            <Link href="/admin/leads" className="text-sm font-semibold text-slate-950">
              Abrir leads
            </Link>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {pipeline.map((state) => (
              <div key={state} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-950">{state}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-400">0</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
          <h2 className="text-xl font-semibold text-white">Alertas criticas</h2>
          <div className="mt-4 space-y-3">
            {alerts.map((alert) => (
              <p key={alert} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
                {alert}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Ultimos leads</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="border-b border-slate-200 py-3">Cliente</th>
                <th className="border-b border-slate-200 py-3">Trabajo</th>
                <th className="border-b border-slate-200 py-3">Urgencia</th>
                <th className="border-b border-slate-200 py-3">Zona</th>
                <th className="border-b border-slate-200 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-100">
                  <td className="py-3 font-medium text-slate-950">{lead.name}</td>
                  <td className="py-3 text-slate-600">{lead.workType}</td>
                  <td className="py-3 text-slate-600">{lead.urgency}</td>
                  <td className="py-3 text-slate-600">{lead.location}</td>
                  <td className="py-3 text-slate-600">{lead.createdAt.toLocaleDateString('es-AR')}</td>
                </tr>
              ))}
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    Todavia no hay leads registrados.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
