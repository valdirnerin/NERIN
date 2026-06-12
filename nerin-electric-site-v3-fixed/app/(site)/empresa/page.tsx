import { CheckCircle2 } from 'lucide-react'
import { breadcrumbJsonLd, buildSeoMetadata } from '@/lib/seo'

const process = ['Relevamiento', 'Diagnóstico', 'Presupuesto claro', 'Ejecución prolija', 'Seguimiento y cierre']

export const metadata = buildSeoMetadata({
  title: 'Empresa de electricidad en CABA | NERIN',
  description: 'NERIN Electricidad trabaja en servicios electricos para hogares, comercios, edificios, empresas y obras en CABA/GBA con alcance claro.',
  path: '/empresa',
})

export default function EmpresaPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Inicio', path: '/' },
    { name: 'Empresa', path: '/empresa' },
  ])

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <section className="border-b border-slate-200 bg-slate-50 py-14">
        <div className="container max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Empresa</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950 sm:text-5xl">Electricidad profesional sin improvisar.</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            NERIN trabaja sobre trabajos chicos, refacciones electricas, servicios especiales y obras. La web esta preparada para cargar datos oficiales reales cuando correspondan, sin mostrar datos falsos.
          </p>
        </div>
      </section>
      <section className="container grid gap-8 py-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="text-3xl font-semibold text-slate-950">Como trabajamos</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            La prioridad es que entiendas el problema, el costo y el alcance antes de aprobar. Materiales y mano de obra se separan para evitar confusiones.
          </p>
        </div>
        <div className="grid gap-3">
          {process.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span className="font-semibold text-slate-900">{item}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

