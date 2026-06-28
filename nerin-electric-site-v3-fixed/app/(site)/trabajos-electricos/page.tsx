import { SmallJobsExperience } from '@/components/electrical-services/SmallJobsExperience'
import { breadcrumbJsonLd, buildSeoMetadata } from '@/lib/seo'

export const metadata = buildSeoMetadata({
  title: 'Servicios eléctricos con alcance claro | NERIN Electricidad',
  description:
    'Catálogo de servicios rápidos, configurador de instalaciones, diagnóstico de fallas y solicitudes para comercios con valores orientativos sujetos a validación técnica.',
  path: '/trabajos-electricos',
})

export default function TrabajosElectricosPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Inicio', path: '/' },
    { name: 'Trabajos electricos', path: '/trabajos-electricos' },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <SmallJobsExperience />
    </>
  )
}
