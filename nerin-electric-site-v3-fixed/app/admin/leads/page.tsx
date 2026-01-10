import { prisma } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { requireAdmin } from '@/lib/auth'
import { DB_ENABLED } from '@/lib/dbMode'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type SearchParams = {
  tipo?: string
  urgencia?: string
}

export default async function LeadsPage({ searchParams }: { searchParams?: SearchParams }) {
  if (!DB_ENABLED) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">Leads</h1>
        <p className="text-sm text-slate-600">La base de datos está deshabilitada. No hay leads para mostrar.</p>
      </div>
    )
  }

  await requireAdmin()
  const leadType = searchParams?.tipo
  const urgency = searchParams?.urgencia

  const leads = await prisma.lead.findMany({
    where: {
      ...(leadType ? { leadType } : {}),
      ...(urgency ? { urgency } : {}),
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Leads</h1>
          <p className="text-sm text-slate-600">Listado de solicitudes recibidas desde /presupuesto.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Button asChild variant="secondary" size="sm">
            <a href="/admin/leads">Todos</a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <a href="/admin/leads?tipo=mantenimiento">Mantenimiento</a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <a href="/admin/leads?tipo=consorcio">Consorcios</a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <a href="/admin/leads?tipo=comercio">Comercios/Oficinas</a>
          </Button>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-white p-6 shadow-subtle">
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span>Filtro urgencia:</span>
          <a className="underline" href="/admin/leads?urgencia=hoy">
            hoy
          </a>
          <a className="underline" href="/admin/leads?urgencia=24-48h">
            24-48h
          </a>
          <a className="underline" href="/admin/leads?urgencia=esta-semana">
            esta semana
          </a>
          <a className="underline" href="/admin/leads?urgencia=sin-apuro">
            sin apuro
          </a>
        </div>

        <div className="mt-6 space-y-4">
          {leads.length === 0 && <p className="text-sm text-slate-500">No hay leads para los filtros actuales.</p>}
          {leads.map((lead) => (
            <div key={lead.id} className="rounded-2xl border border-border/60 p-4 text-sm text-slate-600">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{lead.name}</p>
                  <p>{lead.email}</p>
                  <p>{lead.phone}</p>
                </div>
                <div className="text-xs text-slate-500">
                  <p>ID: {lead.id}</p>
                  <p>{new Date(lead.createdAt).toLocaleString('es-AR')}</p>
                </div>
              </div>
              <div className="mt-3 grid gap-2 text-xs text-slate-500 md:grid-cols-3">
                <div>
                  <p className="font-semibold text-foreground">Cliente</p>
                  <p>{lead.clientType}</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Trabajo</p>
                  <p>{lead.workType}</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Urgencia</p>
                  <p>{lead.urgency}</p>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-500">
                <p className="font-semibold text-foreground">Ubicación</p>
                <p>
                  {lead.location}
                  {lead.address ? ` · ${lead.address}` : ''}
                </p>
              </div>
              <div className="mt-3 text-xs text-slate-500">
                <p className="font-semibold text-foreground">Detalle</p>
                <p>{lead.details}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                <span>Origen: {lead.leadType ?? '-'}</span>
                <span>Plan: {lead.plan ?? '-'}</span>
                <span>Adjuntos: {lead.hasFiles ? 'Sí' : 'No'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
