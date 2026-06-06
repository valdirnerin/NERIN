import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { DB_ENABLED } from '@/lib/dbMode'
import { Button } from '@/components/ui/button'
import { FormSection } from '@/components/admin/ui/FormSection'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const CAPACITY_KEY = 'admin_capacity_status'

const options = [
  {
    value: 'verde',
    label: 'Verde',
    meaning: 'Se puede tomar mas trabajo.',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  },
  {
    value: 'amarillo',
    label: 'Amarillo',
    meaning: 'Filtrar por zona, ticket o urgencia.',
    className: 'border-amber-200 bg-amber-50 text-amber-800',
  },
  {
    value: 'rojo',
    label: 'Rojo',
    meaning: 'Solo urgencias rentables u obras estrategicas.',
    className: 'border-rose-200 bg-rose-50 text-rose-800',
  },
] as const

async function saveCapacity(formData: FormData) {
  'use server'

  if (!DB_ENABLED) return

  const status = String(formData.get('status') || 'verde')
  const note = String(formData.get('note') || '').trim()
  const safeStatus = options.some((option) => option.value === status) ? status : 'verde'

  await prisma.websiteContent.upsert({
    where: { key: CAPACITY_KEY },
    update: {
      title: 'Capacidad operativa',
      content: JSON.stringify({ status: safeStatus, note }),
      visible: false,
    },
    create: {
      key: CAPACITY_KEY,
      title: 'Capacidad operativa',
      content: JSON.stringify({ status: safeStatus, note }),
      visible: false,
    },
  })

  revalidatePath('/admin/capacidad')
}

function parseContent(content?: string | null) {
  try {
    const parsed = JSON.parse(content || '{}') as { status?: string; note?: string }
    return {
      status: options.some((option) => option.value === parsed.status) ? parsed.status || 'verde' : 'verde',
      note: parsed.note || '',
    }
  } catch {
    return { status: 'verde', note: '' }
  }
}

export default async function AdminCapacidadPage() {
  if (!DB_ENABLED) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-950">Capacidad</h1>
        <p className="text-sm text-slate-600">La base de datos esta deshabilitada. No se puede guardar el semaforo.</p>
      </div>
    )
  }

  const record = await prisma.websiteContent.findUnique({ where: { key: CAPACITY_KEY } })
  const current = parseContent(record?.content)
  const selected = options.find((option) => option.value === current.status) || options[0]

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-950">Capacidad</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Semaforo operativo para decidir que trabajos tomar esta semana.
        </p>
      </header>

      <section className={`rounded-2xl border p-5 shadow-sm ${selected.className}`}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em]">Estado actual</p>
        <h2 className="mt-2 text-3xl font-semibold">{selected.label}</h2>
        <p className="mt-2 text-sm">{selected.meaning}</p>
        <p className="mt-4 text-xs">
          Actualizado: {record?.updatedAt ? record.updatedAt.toLocaleString('es-AR') : 'sin actualizacion guardada'}
        </p>
      </section>

      <FormSection title="Definir capacidad" description="Este dato es interno y no se publica en el sitio.">
        <form action={saveCapacity} className="space-y-5">
          <div className="grid gap-3 md:grid-cols-3">
            {options.map((option) => (
              <label key={option.value} className={`cursor-pointer rounded-2xl border p-4 ${option.className}`}>
                <input
                  type="radio"
                  name="status"
                  value={option.value}
                  defaultChecked={option.value === current.status}
                  className="mr-2"
                />
                <span className="font-semibold">{option.label}</span>
                <p className="mt-2 text-sm">{option.meaning}</p>
              </label>
            ))}
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">Nota interna</span>
            <textarea
              name="note"
              defaultValue={current.note}
              rows={4}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
              placeholder="Ej: dos obras activas, tomar solo CABA norte y urgencias con ticket alto."
            />
          </label>

          <Button type="submit" className="bg-slate-950 hover:bg-slate-800">Guardar capacidad</Button>
        </form>
      </FormSection>
    </div>
  )
}
