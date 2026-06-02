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
}

const filters = [
  ['Todas', '/admin/solicitudes'],
  ['Nuevas', '/admin/solicitudes?estado=nueva'],
  ['Trabajos chicos', '/admin/solicitudes?tipo=Trabajo chico'],
  ['Refacciones', '/admin/solicitudes?tipo=Refaccion electrica'],
  ['Obras', '/admin/solicitudes?tipo=Obra grande'],
  ['Servicios especiales', '/admin/solicitudes?tipo=Servicio especial'],
  ['Urgentes', '/admin/solicitudes?urgencia=Hoy'],
  ['A revisar por Valdir Nerin', '/admin/solicitudes?estado=revision'],
  ['Fuera de zona', '/admin/solicitudes?zona=fuera'],
] as const

export default async function LeadsPage({ searchParams }: { searchParams?: SearchParams }) {
  if (!DB_ENABLED) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-950">Solicitudes</h1>
        <p className="text-sm text-slate-600">La base de datos esta deshabilitada. No hay solicitudes para mostrar.</p>
      </div>
    )
  }

  await requireAdmin()
  const leadType = searchParams?.tipo
  const urgency = searchParams?.urgencia

  const leads = await prisma.lead.findMany({
    include: { attachments: true },
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
          <h1 className="text-3xl font-semibold text-slate-950">Solicitudes</h1>
          <p className="text-sm text-slate-600">Pedidos recibidos desde la web, WhatsApp o carga manual.</p>
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

      <FormSection title="Tabla de solicitudes" description="Prioriza urgentes, fuera de zona y pedidos a revisar por Valdir Nerin.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="border-b border-slate-200 py-3">Cliente</th>
                <th className="border-b border-slate-200 py-3">Tipo</th>
                <th className="border-b border-slate-200 py-3">Servicio/trabajo</th>
                <th className="border-b border-slate-200 py-3">Zona</th>
                <th className="border-b border-slate-200 py-3">Urgencia</th>
                <th className="border-b border-slate-200 py-3">Estado</th>
                <th className="border-b border-slate-200 py-3">Fecha</th>
                <th className="border-b border-slate-200 py-3">Accion</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-100 align-top">
                  <td className="py-3">
                    <p className="font-semibold text-slate-950">{lead.name}</p>
                    <p className="text-xs text-slate-500">{lead.phone}</p>
                  </td>
                  <td className="py-3 text-slate-600">{lead.leadType ?? 'Solicitud'}</td>
                  <td className="py-3 text-slate-600">{lead.workType}</td>
                  <td className="py-3 text-slate-600">{lead.location}</td>
                  <td className="py-3 text-slate-600">{lead.urgency}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Nueva</span>
                  </td>
                  <td className="py-3 text-slate-600">{new Date(lead.createdAt).toLocaleString('es-AR')}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline">Responder</Button>
                      <Button size="sm" variant="outline">Pedir fotos</Button>
                      <Button size="sm" className="bg-slate-950 hover:bg-slate-800">Crear presupuesto</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-sm text-slate-500">
                    Todavia no hay solicitudes. Cuando un cliente pida un trabajo desde la web, va a aparecer aca. Tambien podes cargar una solicitud manual recibida por WhatsApp.
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
