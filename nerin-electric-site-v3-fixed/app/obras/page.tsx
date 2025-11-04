export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { getCaseStudiesForMarketing } from '@/lib/marketing-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getSiteContent } from '@/lib/site-content'

export const revalidate = 60

export default async function ObrasPage() {
  const caseStudies = await getCaseStudiesForMarketing()
  const site = getSiteContent()

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <Badge>Obras destacadas</Badge>
        <h1>{site.works.introTitle}</h1>
        <p className="text-lg text-slate-600">{site.works.introDescription}</p>
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
