export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const revalidate = 60

export default async function MantenimientoPage() {
  const plans = await prisma.maintenancePlan.findMany({ orderBy: { precioMensual: 'asc' } })

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <Badge>Mantenimiento</Badge>
        <h1>Planes de mantenimiento eléctrico con respuesta garantizada</h1>
        <p className="max-w-3xl text-lg text-slate-600">
          Supervisión programada, chequeos preventivos y atención de emergencias para edificios, oficinas y cadenas
          comerciales. Cantidades fijas, sin sorpresas ni letra chica.
        </p>
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
                  <Link href={`/api/mantenimiento/checkout?plan=${plan.slug}`}>Contratar plan</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/contacto">Hablar con un asesor</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="rounded-3xl border border-border bg-white p-10 shadow-subtle">
        <h2 className="text-2xl font-semibold text-foreground">Alcance operativo</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Visitas preventivas</h3>
            <p className="text-sm text-slate-600">
              Revisión de tableros, medición de temperaturas, apriete de borneras, reposición de consumibles y
              chequeo de iluminación LED (ej.: 10 lámparas incluidas en BASIC).
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Soporte correctivo</h3>
            <p className="text-sm text-slate-600">
              Atención de urgencias dentro de las 24 h hábiles. Priorizamos bombas, tableros generales y sistemas
              críticos definidos en SLA.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Reporte ejecutivo</h3>
            <p className="text-sm text-slate-600">
              Informe mensual con hallazgos, fotos geolocalizadas y recomendaciones de inversión para directorios o
              administraciones.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
