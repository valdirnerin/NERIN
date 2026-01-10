import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchPublicJson } from '@/lib/public-api'
import { getSiteContent } from '@/lib/site-content'

type Service = {
  id?: string
  title: string
  description: string
}

export default async function ServiciosPage() {
  const site = await getSiteContent()
  let services: Service[] = []
  try {
    services = await fetchPublicJson<Service[]>('/api/public/services')
  } catch (error) {
    services = site.services.items.map((item) => ({
      title: item.title,
      description: item.description,
    }))
  }

  return (
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
  )
}
