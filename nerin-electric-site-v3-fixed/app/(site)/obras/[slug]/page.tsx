import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, FileText, ImageIcon, LockKeyhole, MapPin } from 'lucide-react'
import { getRealCaseBySlug, realCases } from '@/lib/real-cases'
import { Badge } from '@/components/ui/badge'

export const revalidate = 60

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return realCases.map((caseItem) => ({ slug: caseItem.slug }))
}

export function generateMetadata({ params }: Props) {
  const caseItem = getRealCaseBySlug(params.slug)
  if (!caseItem) {
    return {
      title: 'Caso real | NERIN',
    }
  }

  return {
    title: `${caseItem.title} | Caso real NERIN`,
    description: `${caseItem.clientType}. ${caseItem.scope}`,
  }
}

export default function ObraDetallePage({ params }: Props) {
  const caseItem = getRealCaseBySlug(params.slug)
  if (!caseItem) {
    notFound()
  }

  return (
    <article className="bg-white">
      <section className="border-b border-slate-200 bg-slate-950 py-12 text-white">
        <div className="container max-w-5xl">
          <Link href="/obras" className="inline-flex items-center text-sm font-semibold text-slate-300 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a obras
          </Link>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge>Obra</Badge>
            <Badge variant="secondary">{caseItem.clientType}</Badge>
          </div>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">{caseItem.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{caseItem.scope}</p>
        </div>
      </section>

      <section className="container grid gap-8 py-12 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Ficha minima</p>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-slate-950">Tipo de cliente</dt>
                <dd className="mt-1 text-slate-600">{caseItem.clientType}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-950">Tipo de trabajo</dt>
                <dd className="mt-1 text-slate-600">{caseItem.workType}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-950">Estado</dt>
                <dd className="mt-1 text-slate-600">{caseItem.status}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-950">Periodo</dt>
                <dd className="mt-1 text-slate-600">{caseItem.period ?? 'No publicado'}</dd>
              </div>
              {caseItem.approximateLocation ? (
                <div>
                  <dt className="font-semibold text-slate-950">Ubicacion aproximada</dt>
                  <dd className="mt-1 inline-flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    {caseItem.approximateLocation}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          {caseItem.confidentialityNote ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-950">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <LockKeyhole className="h-4 w-4" />
                Nota de confidencialidad
              </div>
              <p className="mt-3 text-sm leading-6">{caseItem.confidentialityNote}</p>
            </div>
          ) : null}
        </aside>

        <div className="space-y-8">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Resultado</p>
            <p className="mt-3 text-base leading-7 text-slate-700">{caseItem.result}</p>
          </section>

          <div className="grid gap-5 md:grid-cols-2">
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">Problema / reto</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{caseItem.challenge ?? 'Informacion en revision para completar la ficha tecnica.'}</p>
            </section>
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">Solucion</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{caseItem.solution ?? 'Informacion en revision para completar la ficha tecnica.'}</p>
            </section>
          </div>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Alcance tecnico</h2>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-600 sm:grid-cols-2">
              {caseItem.technicalScope.map((item) => (
                <li key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Galeria</h2>
            {caseItem.gallery.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {caseItem.gallery.map((image) => (
                  <img key={image} src={image} alt={caseItem.title} className="aspect-video rounded-lg border border-slate-200 object-cover" />
                ))}
              </div>
            ) : (
              <div className="mt-4 flex min-h-32 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <div>
                  <ImageIcon className="mx-auto h-6 w-6 text-slate-500" />
                  <p className="mt-2 text-sm font-semibold text-slate-950">Caso en actualizacion</p>
                  <p className="mt-1 text-sm text-slate-600">Se agregaran imagenes solo si existen y estan autorizadas.</p>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Documentacion relacionada</h2>
            {caseItem.relatedDocumentation.length > 0 ? (
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {caseItem.relatedDocumentation.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-500" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                Documentacion no publicada. Puede incorporarse a futuro si corresponde y cuenta con autorizacion.
              </p>
            )}
          </section>
        </div>
      </section>
    </article>
  )
}
