export const dynamic = 'force-dynamic'
import { getConfiguratorData } from '@/lib/marketing-data'
import { Badge } from '@/components/ui/badge'
import { ConfiguratorWizard } from '@/components/configurator/ConfiguratorWizard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const revalidate = 60

export async function generateMetadata() {
  const siteUrl = process.env.SITE_URL || 'https://nerin-1.onrender.com'
  const title = 'Presupuestador eléctrico | Servicio puntual, obra o profesional'
  const description =
    'Elegí tu modo de cotización en NERIN: servicio puntual, cotización guiada para obra o cotizador profesional por ítems.'

  return {
    title,
    description,
    alternates: {
      canonical: '/presupuestador',
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/presupuestador`,
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

export default async function PresupuestadorPage({
  searchParams,
}: {
  searchParams: { pack?: string; mode?: 'EXPRESS' | 'ASSISTED' | 'PROFESSIONAL' }
}) {
  const { packs, adicionales } = await getConfiguratorData()
  const defaultPack = searchParams.pack ? packs.find((pack) => pack.slug === searchParams.pack)?.id : undefined

  const wizardPacks = packs.map((pack) => ({
    id: pack.id,
    slug: pack.slug,
    name: pack.name,
    description: pack.description,
    scope: pack.scope,
    features: pack.features,
    basePrice: pack.basePrice,
    advancePrice: pack.advancePrice,
  }))
  const wizardAdicionales = adicionales.map((item) => ({
    id: item.id,
    nombre: item.nombre,
    descripcion: item.descripcion,
    unidad: item.unidad,
    precioUnitarioManoObra: item.precioUnitarioManoObra,
    reglasCompatibilidad: item.reglasCompatibilidad ?? null,
    packId: item.packId,
  }))

  return (
    <div className="space-y-8 sm:space-y-10">
      <header className="space-y-4 sm:space-y-5">
        <Badge>Hub de cotización</Badge>
        <h1>Elegí cómo querés cotizar tu trabajo eléctrico</h1>
        <p className="max-w-3xl text-lg text-slate-600">
          No todos los proyectos se cotizan igual. Si querés resolver algo puntual, contratar una obra con guía o cargar
          cantidades técnicas, empezá por el camino correcto desde el inicio.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" asChild>
            <Link href="/presupuesto?tipo=obra">Solicitar relevamiento</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/packs">Ver bases técnicas (packs)</Link>
          </Button>
        </div>
      </header>

      <ConfiguratorWizard
        packs={wizardPacks}
        adicionales={wizardAdicionales}
        defaultPackId={defaultPack}
        initialMode={searchParams.mode}
      />
    </div>
  )
}
