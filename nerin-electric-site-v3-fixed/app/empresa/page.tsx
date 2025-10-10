export const dynamic = 'force-dynamic'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

export default async function EmpresaPage() {
  const technicians = await prisma.technician.findMany({
    where: { activo: true },
    include: { user: true },
  })

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <Badge>Empresa</Badge>
        <h1>NERIN: ingeniería eléctrica con protocolos y trazabilidad</h1>
        <p className="max-w-3xl text-lg text-slate-600">
          Somos un equipo multidisciplinario con más de 15 años en obras eléctricas para retail, gimnasios,
          corporativos y viviendas premium. Operamos con mano de obra propia, ART al día y seguros de RC.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Protocolos de trabajo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>Planificamos cada obra con cronograma, responsables y controles de calidad.</p>
            <ul className="space-y-2">
              <li>• Ingreso de personal con ART Swiss Medical y certificado de aptitud.</li>
              <li>• Checklist diario de seguridad y reportes fotográficos.</li>
              <li>• Entrega de carpeta final con planos, memorias y certificados.</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Compliance y seguros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <ul className="space-y-2">
              <li>• Seguro de RC hasta USD 2M.</li>
              <li>• Contratos transparentes, pagos escalonados por certificados.</li>
              <li>• Cumplimiento de normativa AEA 90364-7-771, NFPA 70 y reglamentos locales.</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Equipo técnico</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {technicians.map((tech) => (
            <Card key={tech.id} className="space-y-3">
              <CardHeader>
                <CardTitle>{tech.user?.name}</CardTitle>
                <p className="text-sm text-slate-500">{tech.credenciales.join(' · ')}</p>
              </CardHeader>
              {tech.fotoUrl ? (
                <Image
                  src={tech.fotoUrl}
                  width={400}
                  height={300}
                  alt={`Técnico NERIN ${tech.user?.name}`}
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
