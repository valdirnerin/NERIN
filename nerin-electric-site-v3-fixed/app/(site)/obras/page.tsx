import Link from 'next/link'
import { ArrowRight, CheckCircle2, ClipboardCheck, FileText, LockKeyhole, MapPin } from 'lucide-react'
import { realCases, workMethodSteps } from '@/lib/real-cases'

export const metadata = {
  title: 'Casos reales y obras electricas | NERIN',
  description:
    'Casos tecnicos minimos de NERIN Electricidad para locales, gimnasios, retail y edificios, con informacion prudente y sin uso de marcas no autorizadas.',
}

export default function ObrasPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-slate-950 py-14 text-white">
        <div className="container max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">Casos reales</p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
            Obras electricas presentadas con criterio tecnico y prudencia comercial.
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Referencias de trabajos realizados o participaciones tecnicas, sin inventar permisos de marca, logos, testimonios ni imagenes que no esten confirmadas.
          </p>
        </div>
      </section>

      <section className="container py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Obras realizadas / casos reales</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950">Evidencia tecnica minima, sin name-dropping vacio.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Cuando no hay permiso explicito para usar una marca, el caso se comunica por rubro, alcance y resultado. Cada ficha puede ampliarse luego con fotos, documentacion y detalles autorizados.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {realCases.map((caseItem) => (
            <article key={caseItem.slug} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex min-h-36 items-center justify-center border-b border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#eef2f7_48%,#fff7ed_100%)] p-6 text-center">
                <div>
                  <FileText className="mx-auto h-7 w-7 text-slate-500" />
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Caso en actualizacion</p>
                  <p className="mt-1 text-sm text-slate-600">Imagenes disponibles solo cuando exista autorizacion.</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  <span>{caseItem.clientType}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span>{caseItem.workType}</span>
                </div>
                <h3 className="mt-3 text-2xl font-semibold text-slate-950">{caseItem.title}</h3>
                <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold text-slate-950">Alcance</dt>
                    <dd className="mt-1 leading-6 text-slate-600">{caseItem.scope}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-950">Resultado</dt>
                    <dd className="mt-1 leading-6 text-slate-600">{caseItem.result}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-950">Estado</dt>
                    <dd className="mt-1 leading-6 text-slate-600">{caseItem.status}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-950">Periodo</dt>
                    <dd className="mt-1 leading-6 text-slate-600">{caseItem.period ?? 'No publicado'}</dd>
                  </div>
                </dl>
                <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
                  {caseItem.approximateLocation ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      {caseItem.approximateLocation}
                    </span>
                  ) : null}
                  {caseItem.confidentialityNote ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-amber-900">
                      <LockKeyhole className="h-4 w-4" />
                      Datos reservados
                    </span>
                  ) : null}
                </div>
                {caseItem.confidentialityNote ? (
                  <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                    {caseItem.confidentialityNote}
                  </p>
                ) : null}
                <Link href={`/obras/${caseItem.slug}`} className="mt-6 inline-flex items-center text-sm font-semibold text-slate-950">
                  Ver ficha tecnica
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-14">
        <div className="container grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Como trabaja NERIN</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Proceso claro para obra, refaccion y mantenimiento.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              El objetivo es reducir improvisacion: entender el problema, ordenar alcance, ejecutar por etapas y dejar registro cuando corresponde.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {workMethodSteps.map((step, index) => (
              <div key={step} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-600">Paso {index + 1}</p>
                <div className="mt-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <p className="text-sm font-semibold text-slate-950">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-14">
        <div className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-sm md:p-8">
          <div className="grid gap-6 md:grid-cols-[0.7fr_1.3fr] md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">Portal cliente</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Seguimiento privado para obras y refacciones.</h2>
            </div>
            <div>
              <p className="text-base leading-7 text-slate-300">
                En obras y refacciones, NERIN puede entregar un portal privado para consultar avances, certificados, documentacion y estado del proyecto.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {['Avances por etapa', 'Certificados y archivos', 'Estado del proyecto', 'Historial de documentacion'].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold text-white">
                    <ClipboardCheck className="h-4 w-4 text-amber-300" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="container flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Tenes una obra proxima a iniciar?</h2>
            <p className="mt-1 text-sm text-slate-600">Pedi una visita tecnica y ordena alcance, etapas, materiales y certificados.</p>
          </div>
          <Link href="/presupuestador?tipo=Obra electrica" className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
            Iniciar solicitud
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
