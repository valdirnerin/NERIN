import { Badge } from '@/components/ui/badge'
import { getSiteContent } from '@/lib/site-content'
import { PresupuestoForm } from './PresupuestoForm'

export const revalidate = 60

export async function generateMetadata() {
  const site = await getSiteContent()
  const siteUrl = process.env.SITE_URL || 'https://nerin-1.onrender.com'
  const title = 'Presupuesto eléctrico rápido | NERIN'
  const description =
    'Completá el formulario y recibí un presupuesto eléctrico en 24–48 h. Respuesta rápida para obras, comercios y consorcios.'

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
    <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-8">
        <Badge>Presupuesto</Badge>
        <h1>Presupuesto eléctrico en 24–48 h</h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Contanos tu proyecto o mantenimiento. Un técnico senior te contacta con una propuesta clara y tiempos de
          ejecución realistas.
        </p>
        <PresupuestoForm whatsappNumber={site.contact.whatsappNumber} leadType={leadType} plan={plan} />
      </div>
      <aside className="space-y-6 rounded-3xl border border-border bg-white p-8 shadow-subtle">
        <h2>¿Qué recibís?</h2>
        <ul className="space-y-3 text-sm text-slate-600">
          <li>• Presupuesto detallado en 24–48 h.</li>
          <li>• Alcance claro, con materiales separados.</li>
          <li>• Cronograma y tiempos de respuesta.</li>
          <li>• Documentación y cumplimiento normativo.</li>
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
