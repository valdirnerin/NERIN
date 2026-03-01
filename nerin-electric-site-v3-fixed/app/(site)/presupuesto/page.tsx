import { Badge } from '@/components/ui/badge'
import { getSiteContent } from '@/lib/site-content'
import { PresupuestoForm } from './PresupuestoForm'

export const revalidate = 60

export async function generateMetadata() {
  const site = await getSiteContent()
  const siteUrl = process.env.SITE_URL || 'https://nerin-1.onrender.com'
  const title = 'Relevamiento | NERIN'
  const description = 'Formulario para relevamiento y presupuesto de obra.'

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
        <Badge>Relevamiento</Badge>
        <h1>Contanos el trabajo</h1>
        <p className="max-w-2xl text-lg text-slate-600">Completá el formulario y te enviamos una propuesta.</p>
        <PresupuestoForm whatsappNumber={site.contact.whatsappNumber} leadType={leadType} plan={plan} />
      </div>

      <aside className="space-y-5 rounded-3xl border border-border bg-white p-5 shadow-subtle sm:p-7 lg:sticky lg:top-24">
        <h2>Qué revisamos</h2>
        <ul className="space-y-3 text-sm text-slate-600">
          <li>• Estado de la instalación.</li>
          <li>• Alcance del trabajo.</li>
          <li>• Forma de ejecución.</li>
        </ul>
        <div className="rounded-2xl bg-muted p-6 text-sm text-slate-600">
          <p className="font-semibold text-foreground">Contacto</p>
          <p>{site.contact.whatsappNumber}</p>
          <p className="mt-3 font-semibold text-foreground">Correo</p>
          <p>{site.contact.email}</p>
          <p className="mt-3 font-semibold text-foreground">Zona</p>
          <p>{site.contact.serviceArea}</p>
        </div>
      </aside>
    </div>
  )
}
