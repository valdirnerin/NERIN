import { prisma } from '@/lib/db'
import { DB_ENABLED } from '@/lib/dbMode'
import { FormSection } from '@/components/admin/ui/FormSection'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const states = ['borrador', 'enviado', 'aceptado', 'rechazado', 'vencido']

function money(value: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value)
}

export default async function AdminPresupuestosPage() {
  if (!DB_ENABLED) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-950">Presupuestos</h1>
        <p className="text-sm text-slate-600">La base de datos esta deshabilitada. No hay presupuestos para mostrar.</p>
      </div>
    )
  }

  const quotes = await prisma.quote.findMany({
    include: { customer: true, jobs: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-950">Presupuestos</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Control simple de presupuestos por cliente, tipo, monto, estado, fecha y trabajo asociado.
        </p>
      </header>

      <section className="flex flex-wrap gap-2">
        {states.map((state) => (
          <span key={state} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
            {state}
          </span>
        ))}
      </section>

      <FormSection title="Presupuestos cargados" description="Estados usados: borrador, enviado, aceptado, rechazado y vencido.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="border-b border-slate-200 py-3">Cliente</th>
                <th className="border-b border-slate-200 py-3">Tipo</th>
                <th className="border-b border-slate-200 py-3">Monto</th>
                <th className="border-b border-slate-200 py-3">Estado</th>
                <th className="border-b border-slate-200 py-3">Fecha</th>
                <th className="border-b border-slate-200 py-3">Trabajo asociado</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr key={quote.id} className="border-b border-slate-100 align-top">
                  <td className="py-3 font-semibold text-slate-950">{quote.customer?.name || 'Sin cliente'}</td>
                  <td className="py-3 text-slate-600">{quote.serviceType}</td>
                  <td className="py-3 text-slate-600">{money(quote.totalAmount)}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{quote.status}</span>
                  </td>
                  <td className="py-3 text-slate-600">{quote.createdAt.toLocaleDateString('es-AR')}</td>
                  <td className="py-3 text-slate-600">{quote.jobs[0]?.title || 'Sin trabajo creado'}</td>
                </tr>
              ))}
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-slate-500">
                    Todavia no hay presupuestos cargados.
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
