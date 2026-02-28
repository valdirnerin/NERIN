import { Badge } from '@/components/ui/badge'
import { getSiteContent } from '@/lib/site-content'
import { PresupuestoForm } from './PresupuestoForm'

export const revalidate = 60

export async function generateMetadata() {
  const site = await getSiteContent()
  const siteUrl = process.env.SITE_URL || 'https://nerin-1.onrender.com'
  const title = 'Relevamiento y presupuesto de obra eléctrica | NERIN'
  const description =
    'Solicitá relevamiento para instalaciones, reformas y obras eléctricas. Definimos alcance y propuesta en 24–48 h.'

  return {
    title,
    description,
    alternates: {
      canonical: '/presupuesto',
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/presupuesto`,
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

export default async function PresupuestoPage({
  searchParams,
}: {
  searchParams?: { tipo?: string; plan?: string }
}) {
  const site = await getSiteContent()
  const leadType = searchParams?.tipo
  const plan = searchParams?.plan

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
      <div className="space-y-6 sm:space-y-8">
        <Badge>Relevamiento técnico</Badge>
        <h1>Cotización para instalación, obra o reforma</h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Esta solicitud está pensada para proyectos que requieren relevamiento previo. Si necesitás contratar un
          servicio puntual, usá el modo express del presupuestador.
        </p>
        <PresupuestoForm whatsappNumber={site.contact.whatsappNumber} leadType={leadType} plan={plan} />
      </div>
      <aside className="space-y-5 rounded-3xl border border-border bg-white p-5 shadow-subtle sm:p-7 lg:sticky lg:top-24">
        <h2>Qué validamos en el relevamiento</h2>
        <ul className="space-y-3 text-sm text-slate-600">
          <li>• Estado general de tablero, alimentaciones y protecciones.</li>
          <li>• Alcance real de la obra y prioridades comerciales.</li>
          <li>• Cronograma preliminar y etapas de ejecución.</li>
          <li>• Recomendaciones normativas y documentación.</li>
        </ul>
        <div className="rounded-2xl bg-muted p-6 text-sm text-slate-600">
          <p className="font-semibold text-foreground">Contacto directo</p>
          <p>{site.contact.whatsappNumber}</p>
          <p className="mt-3 font-semibold text-foreground">Correo</p>
          <p>{site.contact.email}</p>
          <p className="mt-3 font-semibold text-foreground">Área de cobertura</p>
          <p>{site.contact.serviceArea}</p>
        </div>
      </aside>
    </div>
  )
}
