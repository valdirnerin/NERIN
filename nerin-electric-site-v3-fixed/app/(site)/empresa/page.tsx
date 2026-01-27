export const dynamic = 'force-dynamic'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getTechniciansForMarketing } from '@/lib/marketing-data'
import { getSiteContent } from '@/lib/site-content'

export const revalidate = 60

export default async function EmpresaPage() {
  const technicians = await getTechniciansForMarketing()
  const site = await getSiteContent()

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <Badge>Empresa</Badge>
        <h1>{site.company.introTitle}</h1>
        <p className="max-w-3xl text-lg text-slate-600">{site.company.introDescription}</p>
        <p className="max-w-2xl text-sm text-slate-500">{site.company.mission}</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{site.company.protocolsTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>Planificamos cada obra con cronograma, responsables y controles de calidad.</p>
            <ul className="space-y-2">
              {site.company.protocols.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{site.company.complianceTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <ul className="space-y-2">
              {site.company.compliance.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">{site.company.teamTitle}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {technicians.map((tech) => (
            <Card key={tech.id} className="space-y-3">
              <CardHeader>
                <CardTitle>{tech.nombre}</CardTitle>
                <p className="text-sm text-slate-500">{tech.credenciales.join(' · ')}</p>
              </CardHeader>
              {tech.fotoUrl ? (
                <Image
                  src={tech.fotoUrl}
                  width={400}
                  height={300}
                  alt={`Técnico NERIN ${tech.nombre}`}
                  className="h-40 w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-40 items-center justify-center rounded-2xl bg-muted text-sm text-slate-500">
                  Foto pendiente
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
