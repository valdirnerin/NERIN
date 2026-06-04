import { redirect } from 'next/navigation'
import { serviceCatalog } from '@/lib/nerin-electricidad'

export function generateStaticParams() {
  return serviceCatalog.map((service) => ({ slug: service.slug }))
}

export default function TrabajoElectricoLegacyPage({ params }: { params: { slug: string } }) {
  redirect(`/trabajos-chicos/${params.slug}`)
}
