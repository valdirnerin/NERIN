import { prisma } from '@/lib/db'
import { DB_ENABLED } from '@/lib/dbMode'
import { FormSection } from '@/components/admin/ui/FormSection'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function money(value: number | bigint) {
  const asNumber = typeof value === 'bigint' ? Number(value) : value
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(asNumber)
}

export default async function AdminDineroPage() {
  if (!DB_ENABLED) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-950">Dinero</h1>
        <p className="text-sm text-slate-600">La base de datos esta deshabilitada. No hay datos de dinero para mostrar.</p>
      </div>
    )
  }

  const [quotes, incomes, expenses, projectPayments, certificates] = await Promise.all([
    prisma.quote.findMany({ include: { customer: true }, orderBy: { updatedAt: 'desc' } }),
    prisma.income.findMany({ include: { customer: true, quote: true, job: true }, orderBy: { date: 'desc' } }),
    prisma.expense.findMany({ orderBy: { date: 'desc' } }),
    prisma.projectPayment.findMany(),
    prisma.opsProgressCertificate.findMany(),
  ])

  const acceptedQuotes = quotes.filter((quote) => quote.status.toLowerCase() === 'aceptado')
  const estimatedIncome = acceptedQuotes.reduce((sum, quote) => sum + quote.totalAmount, 0)
  const isPaid = (status: string) => status.toLowerCase() === 'cobrado' || status.toLowerCase() === 'pagado'
  const collectedIncome =
    incomes.filter((income) => isPaid(income.status)).reduce((sum, income) => sum + income.amount, 0) +
    projectPayments.filter((payment) => isPaid(payment.status)).reduce((sum, payment) => sum + payment.amount, 0) +
    Number(certificates.filter((certificate) => certificate.paidAt).reduce((sum, certificate) => sum + certificate.amount, 0n))
  const pendingAcceptedQuotes = acceptedQuotes.reduce((sum, quote) => {
    const collectedForQuote = incomes
      .filter((income) => income.quoteId === quote.id && isPaid(income.status))
      .reduce((subtotal, income) => subtotal + income.amount, 0)
    return sum + Math.max(quote.totalAmount - collectedForQuote, 0)
  }, 0)
  const pendingIncome =
    incomes.filter((income) => !isPaid(income.status) && !income.quoteId).reduce((sum, income) => sum + income.amount, 0) +
    pendingAcceptedQuotes
  const expenseTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  const recentItems = [
    ...acceptedQuotes.slice(0, 4).map((quote) => ({
      id: `quote-${quote.id}`,
      concept: `Presupuesto aceptado · ${quote.customer?.name || 'Sin cliente'}`,
      amount: quote.totalAmount,
      status: quote.status,
    })),
    ...incomes.slice(0, 4).map((income) => ({
      id: `income-${income.id}`,
      concept: income.concept,
      amount: income.amount,
      status: income.status,
    })),
  ].slice(0, 6)

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-950">Dinero</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Control basico de ingresos estimados, cobrados, presupuestos aceptados, pendientes y egresos existentes.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ['Ingresos estimados', money(estimatedIncome)],
          ['Ingresos cobrados', money(collectedIncome)],
          ['Presupuestos aceptados', String(acceptedQuotes.length)],
          ['Pendientes de cobro', money(pendingIncome)],
          ['Egresos', money(expenseTotal)],
        ].map(([label, value]) => (
          <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
            <p className="mt-3 text-2xl font-semibold text-slate-950">{value}</p>
          </article>
        ))}
      </section>

      <FormSection title="Movimientos para revisar" description="MVP financiero: suficiente para decidir sin armar una contabilidad completa.">
        <div className="space-y-3">
          {recentItems.map((item) => (
            <article key={item.id} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-950">{item.concept}</p>
                <p className="text-sm text-slate-600">{item.status}</p>
              </div>
              <p className="text-lg font-semibold text-slate-950">{money(item.amount)}</p>
            </article>
          ))}
          {recentItems.length === 0 ? <p className="text-sm text-slate-500">Todavia no hay movimientos para revisar.</p> : null}
        </div>
      </FormSection>
    </div>
  )
}
