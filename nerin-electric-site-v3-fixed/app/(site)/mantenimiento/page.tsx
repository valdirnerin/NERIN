export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { getMaintenancePlansForMarketing } from '@/lib/marketing-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getSiteContent } from '@/lib/site-content'

export const revalidate = 60

export async function generateMetadata() {
  const site = await getSiteContent()
  const siteUrl = process.env.SITE_URL || 'https://nerin-1.onrender.com'
  const title = 'Planes de mantenimiento eléctrico | NERIN'
  const description = 'Planes de mantenimiento eléctrico con visitas programadas, SLAs y reportes mensuales.'

  return {
    title,
    description,
    alternates: {
      canonical: '/mantenimiento',
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/mantenimiento`,
      siteName: site.name,
      images: [{ url: '/nerin/og-cover.png', width: 1200, height: 630, alt: 'NERIN Electric' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/nerin/og-cover.png'],
    },
  }
}

export default async function MantenimientoPage() {
  const plans = await getMaintenancePlansForMarketing()
  const site = await getSiteContent()

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <Badge>Mantenimiento</Badge>
        <h1>{site.maintenancePage.introTitle}</h1>
        <p className="max-w-3xl text-lg text-slate-600">{site.maintenancePage.introDescription}</p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-col justify-between">
            <CardHeader>
              <Badge className="bg-muted text-slate-500">{plan.slug.toUpperCase()}</Badge>
              <CardTitle>{plan.nombre}</CardTitle>
              <p className="text-sm text-slate-500">${Number(plan.precioMensual).toLocaleString('es-AR')} / mes</p>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <p className="font-medium text-foreground">Incluye tareas fijas:</p>
              <ul className="space-y-2">
                {plan.incluyeTareasFijas.map((task) => (
                  <li key={task}>• {task}</li>
                ))}
              </ul>
              <p>{plan.visitasMes} visita(s) técnica(s) mensual(es) con checklist digital y reporte fotográfico.</p>
              <p className="text-xs text-slate-500">
                Cantidades inalterables: aseguramos tiempos de respuesta y disponibilidad de técnicos senior.
              </p>
              <div className="flex flex-col gap-2">
                <Button asChild>
                  <Link href={`/presupuesto?tipo=mantenimiento&plan=${plan.slug}`} data-track="lead" data-content-name={plan.nombre} data-plan-tier={plan.slug} data-value={Number(plan.precioMensual)} data-currency="ARS">Solicitar alta del plan</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/presupuesto?tipo=mantenimiento" data-track="lead" data-content-name="Hablar con un asesor">Hablar con un asesor</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="rounded-3xl border border-border bg-white p-10 shadow-subtle">
        <h2 className="text-2xl font-semibold text-foreground">Alcance operativo</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {site.maintenancePage.cards.map((card) => (
            <div key={card.title}>
              <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
              <p className="text-sm text-slate-600">{card.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
