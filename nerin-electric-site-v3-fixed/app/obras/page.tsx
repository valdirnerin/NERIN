import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const revalidate = 60

export default async function ObrasPage() {
  const caseStudies = await prisma.caseStudy.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <Badge>Obras destacadas</Badge>
        <h1>Casos de éxito y obras supervisadas</h1>
        <p className="text-lg text-slate-600">
          Selección de proyectos donde NERIN lideró la ingeniería eléctrica, montaje y certificaciones. Cada caso
          documenta desafío, solución y normativa aplicada.
        </p>
      </header>
      <section className="grid gap-6 md:grid-cols-2">
        {caseStudies.map((cs) => (
          <Card key={cs.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{cs.titulo}</CardTitle>
              <p className="text-sm text-slate-500">{cs.resumen}</p>
            </CardHeader>
            <CardContent className="mt-auto space-y-3 text-sm text-slate-600">
              <p>{cs.contenido.slice(0, 220)}...</p>
              <Link className="text-accent" href={`/obras/${cs.slug}`}>
                Ver ficha completa →
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
