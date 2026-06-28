import { SmallJobsExperience } from '@/components/electrical-services/SmallJobsExperience'
import { breadcrumbJsonLd, buildSeoMetadata } from '@/lib/seo'

export const metadata = buildSeoMetadata({
  title: 'Servicios eléctricos con alcance claro | NERIN Electricidad',
  description:
    'Sistema guiado para configurar trabajos eléctricos, instalaciones, diagnósticos y solicitudes comerciales con alcance técnico antes de enviar.',
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
