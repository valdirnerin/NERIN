import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'

export const revalidate = 60

interface Props {
  params: { slug: string }
}

export default async function ObraDetallePage({ params }: Props) {
  const caseStudy = await prisma.caseStudy.findUnique({ where: { slug: params.slug } })
  if (!caseStudy) {
    notFound()
  }

  return (
    <article className="space-y-6">
      <Badge>Obra</Badge>
      <h1>{caseStudy.titulo}</h1>
      <p className="text-lg text-slate-600">{caseStudy.resumen}</p>
      <div className="space-y-4 text-base leading-relaxed text-slate-600">
        {caseStudy.contenido.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      {caseStudy.metricas && Array.isArray(caseStudy.metricas) && (
        <section className="grid gap-4 md:grid-cols-3">
          {(caseStudy.metricas as Array<{ label: string; value: string }>).map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-border bg-white p-4 shadow-subtle">
              <p className="text-sm text-slate-500">{metric.label}</p>
              <p className="text-lg font-semibold text-foreground">{metric.value}</p>
            </div>
          ))}
        </section>
      )}
    </article>
  )
}
