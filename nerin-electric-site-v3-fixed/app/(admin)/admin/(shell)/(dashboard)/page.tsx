export const dynamic = 'force-dynamic'

import Link from 'next/link'
import type { Route } from 'next'
import { prisma } from '@/lib/db'
import { DB_ENABLED } from '@/lib/dbMode'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const todayCards: Array<{ label: string; value: string; href: Route }> = [
  { label: 'Solicitudes nuevas', value: '0', href: '/admin/solicitudes' as Route },
  { label: 'Trabajos por presupuestar', value: '0', href: '/admin/presupuestos' as Route },
  { label: 'Trabajos en curso', value: '0', href: '/admin/trabajos-chicos' as Route },
  { label: 'Obras activas', value: '0', href: '/admin/obras' as Route },
  { label: 'Cobros pendientes', value: '$0', href: '/admin/dinero' as Route },
  { label: 'Gastos del mes', value: '$0', href: '/admin/dinero' as Route },
  { label: 'Alertas de gestion', value: '0', href: '/admin/dinero' as Route },
]

const reviewItems = [
  'Solicitudes nuevas sin responder.',
  'Pedidos fuera de zona o con riesgo electrico.',
  'Trabajos terminados sin registrar cobro.',
  'Refacciones sin presupuesto enviado.',
  'Obras sin avance o certificado reciente.',
  'Gastos cargados sin asociar a trabajo u obra.',
]

export default async function AdminPage() {
  if (!DB_ENABLED) {
    return (
      <div className="space-y-4">
        <Badge>Panel de NERIN</Badge>
        <h1 className="text-3xl font-semibold text-slate-950">Panel de NERIN</h1>
        <p className="text-sm text-slate-600">Activá la base de datos para ver solicitudes, trabajos, obras y dinero.</p>
      </div>
    )
  }

  const [leads, projects, clients, certificates] = await Promise.all([
    prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 6 }),
    prisma.project.count(),
    prisma.opsClient.count().catch(() => 0),
    prisma.opsProgressCertificate.count().catch(() => 0),
  ])

  const cards = todayCards.map((card) =>
    card.label === 'Solicitudes nuevas'
      ? { ...card, value: String(leads.length) }
      : card.label === 'Obras activas'
        ? { ...card, value: String(projects) }
        : card,
  )

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <Badge>Inicio</Badge>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950">Panel de NERIN</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Solicitudes, trabajos, obras, presupuestos, cobros y gastos en un solo lugar.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild className="bg-slate-950 hover:bg-slate-800">
              <Link href="/admin/solicitudes">Ver solicitudes</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/catalogo-web">Editar catalogo</Link>
            </Button>
          </div>
        </div>
      </header>

      <section>
        <h2 className="text-xl font-semibold text-slate-950">Que tenes que resolver hoy</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <Link key={card.label} href={card.href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-950">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{card.label}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{card.value}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Ultimas solicitudes</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.16em] text-slate-500">
                <tr>
                  <th className="border-b border-slate-200 py-3">Cliente</th>
                  <th className="border-b border-slate-200 py-3">Tipo</th>
                  <th className="border-b border-slate-200 py-3">Servicio/trabajo</th>
                  <th className="border-b border-slate-200 py-3">Zona</th>
                  <th className="border-b border-slate-200 py-3">Urgencia</th>
                  <th className="border-b border-slate-200 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-100">
                    <td className="py-3 font-medium text-slate-950">{lead.name}</td>
                    <td className="py-3 text-slate-600">{lead.leadType ?? 'Solicitud'}</td>
                    <td className="py-3 text-slate-600">{lead.workType}</td>
                    <td className="py-3 text-slate-600">{lead.location}</td>
                    <td className="py-3 text-slate-600">{lead.urgency}</td>
                    <td className="py-3 text-slate-600">{lead.createdAt.toLocaleDateString('es-AR')}</td>
                  </tr>
                ))}
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-500">
                      Todavia no hay solicitudes. Cuando un cliente pida un trabajo desde la web, va a aparecer aca. Tambien podes cargar una solicitud manual recibida por WhatsApp.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
          <h2 className="text-xl font-semibold text-white">Que revisar hoy</h2>
          <div className="mt-4 space-y-3">
            {reviewItems.map((item) => (
              <p key={item} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
                {item}
              </p>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-300">
            <span>Clientes: {clients}</span>
            <span>Certificados: {certificates}</span>
          </div>
        </div>
      </section>
    </div>
  )
}
