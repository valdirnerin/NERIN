import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getSiteContent } from '@/lib/site-content'

export const revalidate = 60

export async function generateMetadata() {
  const site = await getSiteContent()
  return {
    title: 'Mantenimiento eléctrico para consorcios | NERIN',
    description:
      'Mantenimiento eléctrico para consorcios con SLAs reales, reportes y guardias. Respuesta rápida en CABA.',
    openGraph: {
      title: 'Mantenimiento eléctrico para consorcios | NERIN',
      description:
        'Mantenimiento eléctrico para consorcios con SLAs reales, reportes y guardias. Respuesta rápida en CABA.',
      siteName: site.name,
    },
    twitter: {
      title: 'Mantenimiento eléctrico para consorcios | NERIN',
      description:
        'Mantenimiento eléctrico para consorcios con SLAs reales, reportes y guardias. Respuesta rápida en CABA.',
    },
  }
}

export default function ConsorciosPage() {
  return (
    <div className="space-y-16">
      <header className="space-y-4">
        <Badge>Consorcios</Badge>
        <h1>Consorcios con instalaciones eléctricas seguras y documentadas</h1>
        <p className="max-w-3xl text-lg text-slate-600">
          Evitá cortes, inspecciones fallidas y reclamos. NERIN gestiona mantenimiento eléctrico con tiempos de respuesta
          claros, reportes y cumplimiento normativo.
        </p>
        <Button asChild size="lg">
          <a href="/presupuesto?tipo=consorcio">Solicitar presupuesto para consorcio</a>
        </Button>
      </header>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <h2>Problema</h2>
          <p className="text-slate-600">
            Cortes inesperados, tableros sin mantenimiento y falta de documentación complican la gestión del consorcio.
          </p>
        </div>
        <div className="space-y-3">
          <h2>Solución</h2>
          <p className="text-slate-600">
            Planes preventivos y correctivos con visitas programadas, checklist digital y reportes listos para auditoría.
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'Alcance claro',
            description: 'Tableros, iluminación, bombas, portones y puesta a tierra con prioridades definidas.',
          },
          {
            title: 'SLA y guardias',
            description: 'Tiempos de respuesta acordados y guardias técnicas para urgencias.',
          },
          {
            title: 'Reportes',
            description: 'Informe mensual con hallazgos, fotos y recomendaciones de inversión.',
          },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-border bg-white p-6 shadow-subtle">
            <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="text-sm text-slate-600">{item.description}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-border bg-muted/40 p-10 text-center">
        <h2>¿Necesitás respuesta rápida para tu consorcio?</h2>
        <p className="mt-3 text-slate-600">
          Coordinamos una visita técnica y armamos una propuesta con SLA y alcance operativo.
        </p>
        <Button asChild size="lg" className="mt-6">
          <a href="/presupuesto?tipo=consorcio">Pedir presupuesto</a>
        </Button>
      </section>
    </div>
  )
}
