import { prisma } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { requireAdmin } from '@/lib/auth'
import { DB_ENABLED } from '@/lib/dbMode'
import { FormSection } from '@/components/admin/ui/FormSection'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type SearchParams = {
  tipo?: string
  urgencia?: string
  zona?: string
  estado?: string
}

const filters = [
  ['Todas', '/admin/consultas'],
  ['Nuevo', '/admin/consultas?estado=nuevo'],
  ['Revisado', '/admin/consultas?estado=revisado'],
  ['Esperando respuesta', '/admin/consultas?estado=esperando respuesta'],
  ['Presupuestado', '/admin/consultas?estado=presupuestado'],
  ['Ganado', '/admin/consultas?estado=ganado'],
  ['Perdido', '/admin/consultas?estado=perdido'],
  ['Descartado', '/admin/consultas?estado=descartado'],
  ['Urgentes', '/admin/consultas?urgencia=Lo antes posible'],
  ['Fuera de zona', '/admin/consultas?zona=fuera'],
] as const

const suggestedStates = ['nuevo', 'revisado', 'esperando respuesta', 'presupuestado', 'ganado', 'perdido', 'descartado']

function normalizeState(value?: string | null) {
  const normalized = String(value || 'nuevo').trim().toLowerCase()
  if (normalized === 'nueva') return 'nuevo'
  if (normalized === 'revision' || normalized === 'a revisar') return 'revisado'
  return suggestedStates.includes(normalized) ? normalized : normalized || 'nuevo'
}

function resolveOrigin(record: { utmSource?: string | null; landingPage?: string | null; referrer?: string | null }) {
  return record.utmSource || record.landingPage || record.referrer || 'Web'
}

function contactText(whatsapp?: string | null, email?: string | null) {
  return [whatsapp, email].filter(Boolean).join(' / ') || 'Sin contacto'
}

export default async function LeadsPage({ searchParams }: { searchParams?: SearchParams }) {
  if (!DB_ENABLED) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-950">Consultas</h1>
        <p className="text-sm text-slate-600">La base de datos esta deshabilitada. No hay consultas para mostrar.</p>
      </div>
    )
  }

  await requireAdmin()
  const leadType = searchParams?.tipo
  const urgency = searchParams?.urgencia
  const zoneFilter = searchParams?.zona
  const stateFilter = searchParams?.estado ? normalizeState(searchParams.estado) : null

  const [legacyLeads, serviceRequests] = await Promise.all([
    prisma.lead.findMany({
      include: { attachments: true },
      where: {
        ...(leadType ? { leadType } : {}),
        ...(urgency ? { urgency } : {}),
        ...(zoneFilter === 'fuera'
          ? {
              OR: [
                { location: { contains: 'Otra zona' } },
                { location: { contains: 'Requiere confirmacion' } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.serviceRequest.findMany({
      include: { customer: true, serviceItem: true },
      where: {
        ...(leadType ? { type: leadType } : {}),
        ...(urgency ? { urgency } : {}),
        ...(zoneFilter === 'fuera' ? { zone: { contains: 'fuera' } } : {}),
      },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const rows = [
    ...serviceRequests.map((request) => ({
      id: `service-${request.id}`,
      date: request.createdAt,
      name: request.customerName || request.customer?.name || 'Sin nombre',
      contact: contactText(request.whatsapp, request.email),
      type: request.type || request.serviceItem?.name || 'Consulta',
      zone: request.zone || 'Sin zona',
      urgency: request.urgency || 'Sin urgencia',
      origin: 'Presupuestador web',
      state: normalizeState(request.status),
      work: request.serviceItem?.name || request.selectedVariant || request.description || 'Sin detalle',
    })),
    ...legacyLeads.map((lead) => ({
      id: `lead-${lead.id}`,
      date: lead.createdAt,
      name: lead.name,
      contact: contactText(lead.phone, lead.email),
      type: lead.leadType || lead.workType || 'Consulta',
      zone: lead.location,
      urgency: lead.urgency,
      origin: resolveOrigin(lead),
      state: 'nuevo',
      work: lead.workType || lead.details || 'Sin detalle',
    })),
  ]
    .filter((row) => (stateFilter ? row.state === stateFilter : true))
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">Consultas</h1>
          <p className="text-sm text-slate-600">Leads entrantes ordenados por fecha, origen, urgencia y estado.</p>
        </div>
        <Button asChild className="bg-slate-950 hover:bg-slate-800">
          <a href="/presupuestador" target="_blank">Crear solicitud manual</a>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        {filters.map(([label, href]) => (
          <Button key={label} asChild variant="secondary" size="sm">
            <a href={href}>{label}</a>
          </Button>
        ))}
      </div>

      <FormSection title="Entradas recibidas" description="Cada fila muestra que pidio el cliente, por donde entro y en que estado esta.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="border-b border-slate-200 py-3">Fecha</th>
                <th className="border-b border-slate-200 py-3">Nombre</th>
                <th className="border-b border-slate-200 py-3">WhatsApp/email</th>
                <th className="border-b border-slate-200 py-3">Tipo</th>
                <th className="border-b border-slate-200 py-3">Zona</th>
                <th className="border-b border-slate-200 py-3">Urgencia</th>
                <th className="border-b border-slate-200 py-3">Origen</th>
                <th className="border-b border-slate-200 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 align-top">
                  <td className="py-3 text-slate-600">{row.date.toLocaleString('es-AR')}</td>
                  <td className="py-3">
                    <p className="font-semibold text-slate-950">{row.name}</p>
                    <p className="text-xs text-slate-500">{row.work}</p>
                  </td>
                  <td className="py-3 text-slate-600">{row.contact}</td>
                  <td className="py-3 text-slate-600">{row.type}</td>
                  <td className="py-3 text-slate-600">{row.zone}</td>
                  <td className="py-3 text-slate-600">{row.urgency}</td>
                  <td className="py-3 text-slate-600">{row.origin}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{row.state}</span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-sm text-slate-500">
                    Todavia no hay consultas con estos filtros. Cuando un cliente pida un trabajo desde la web, WhatsApp o carga manual, va a aparecer aca.
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
