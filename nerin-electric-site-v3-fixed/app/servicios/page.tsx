import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchPublicJson } from '@/lib/public-api'
import { getSiteContent } from '@/lib/site-content'

type Service = {
  id?: string
  title: string
  description: string
}

export async function generateMetadata() {
  const site = await getSiteContent()
  const siteUrl = process.env.SITE_URL || 'https://nerin-1.onrender.com'
  const title = 'Servicios eléctricos | NERIN'
  const description = 'Servicios eléctricos de punta a punta para obras, comercios y consorcios en CABA.'

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
        <header className="space-y-4">
          <Badge>Servicios</Badge>
          <h1>{site.services.title}</h1>
          <p className="max-w-3xl text-lg text-slate-600">{site.services.description}</p>
        </header>
        <section className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <Card key={service.id ?? service.title} className="space-y-4">
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <p>{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </>
  )
}
