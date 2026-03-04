import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchPublicJson } from '@/lib/public-api'
import { getSiteContent } from '@/lib/site-content'

type Service = {
  id?: string
  title: string
  description: string
}

const serviceSystem = [
  {
    title: 'Solicitud simple',
    description: 'Podés arrancar por WhatsApp o formulario según tu caso.',
  },
  {
    title: 'Definición clara',
    description: 'Ordenamos alcance y prioridad para que sepas cómo seguimos.',
  },
  {
    title: 'Ejecución y seguimiento',
    description: 'Coordinamos y cerramos el trabajo con comunicación ordenada.',
  },
]

export async function generateMetadata() {
  const site = await getSiteContent()
  const siteUrl = process.env.SITE_URL || 'https://nerin-1.onrender.com'
  const title = 'Servicios eléctricos en CABA y GBA | NERIN'
  const description =
    'Servicios para hogares, comercios y obras con solicitud simple, respuesta rápida y ejecución prolija.'

  return {
    title,
    description,
    alternates: {
      canonical: '/servicios',
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/servicios`,
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

export default async function ServiciosPage() {
  const site = await getSiteContent()
  const siteUrl = process.env.SITE_URL || 'https://nerin-1.onrender.com'
  let services: Service[] = []
  try {
    services = await fetchPublicJson<Service[]>('/api/public/services')
  } catch (error) {
    services = site.services.items.map((item) => ({
      title: item.title,
      description: item.description,
    }))
  }

  const servicesSchema = {
    '@context': 'https://schema.org',
    '@graph': services.map((service) => ({
      '@type': 'Service',
      name: service.title,
      description: service.description,
      provider: {
        '@type': 'LocalBusiness',
        name: site.name,
        url: siteUrl,
      },
      areaServed: site.contact.serviceArea,
      serviceType: service.title,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }} />
      <div className="space-y-10">
        <header className="space-y-5 rounded-3xl border border-border/70 bg-slate-950 p-6 text-white sm:p-8">
          <Badge className="w-fit border-cyan-300/50 bg-cyan-500/20 text-cyan-100">Servicios</Badge>
          <h1 className="text-3xl font-semibold leading-tight sm:text-5xl">
            Servicios eléctricos para clientes que valoran rapidez, orden y tranquilidad
          </h1>
          <p className="max-w-3xl text-base text-slate-200 sm:text-lg">
            Desde trabajos puntuales en vivienda hasta proyectos de obra. El objetivo es uno: que
            avances rápido y sepas siempre qué sigue.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-[#25D366] font-bold text-black hover:bg-[#1ebe5a]" asChild>
              <Link href="/presupuestador">Enviar solicitud</Link>
            </Button>
            <Button className="bg-red-600 font-bold hover:bg-red-700" asChild>
              <Link href="/presupuestador?mode=PROJECT">Cotización para obra</Link>
            </Button>
          </div>
        </header>

        <section className="space-y-4 rounded-2xl border border-border bg-white p-5 sm:p-6">
          <h2 className="text-2xl font-semibold text-slate-900">Sistema de trabajo</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {serviceSystem.map((item) => (
              <article key={item.title} className="rounded-xl border border-border bg-muted/20 p-4">
                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <Card
              key={service.id ?? service.title}
              className="space-y-4 border-cyan-100 bg-gradient-to-b from-white to-cyan-50/30"
            >
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                <p>{service.description}</p>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                  Solicitud clara + ejecución prolija + seguimiento
                </p>
                <Button variant="secondary" asChild className="w-full">
                  <Link href="/presupuestador">Solicitar este servicio</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </>
  )
}
