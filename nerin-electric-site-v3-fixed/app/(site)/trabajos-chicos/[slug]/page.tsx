import { redirect } from 'next/navigation'

export default function TrabajoChicoLegacyPage({ params }: { params: { slug: string } }) {
  redirect(`/trabajos-electricos/${params.slug}`)
}
