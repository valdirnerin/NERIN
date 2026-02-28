export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getConfiguratorData } from '@/lib/marketing-data'
import { Badge } from '@/components/ui/badge'
import { ConfiguratorWizard } from '@/components/configurator/ConfiguratorWizard'
import { Button } from '@/components/ui/button'

export const revalidate = 60

export async function generateMetadata() {
  const siteUrl = process.env.SITE_URL || 'https://nerin-1.onrender.com'
  const title = 'Contratación NERIN | Servicio puntual, relevamiento o cotización profesional'
  const description =
    'Ingresá por una de las 3 puertas de NERIN: resolver algo puntual, pedir relevamiento o cotizar por plano/cantidades.'

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

const doors = [
  {
    title: 'Resolver algo puntual',
    description: 'Para necesidades inmediatas con alcance claro.',
    href: '/presupuestador?mode=EXPRESS',
  },
  {
    title: 'Pedir relevamiento/proyecto',
    description: 'Para obras y reformas con definición técnica.',
    href: '/presupuesto?tipo=obra',
  },
  {
    title: 'Cotización profesional',
    description: 'Para perfiles técnicos con plano y cantidades.',
    href: '/presupuestador?mode=PROFESSIONAL',
  },
]

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
      <header className="space-y-4">
        <Badge>Sistema comercial NERIN</Badge>
        <h1>Una contratación clara en 3 puertas</h1>
        <p className="max-w-3xl text-lg text-slate-600">
          Elegí el contexto correcto y avanzá con una propuesta ordenada. Sin calculadoras confusas ni desvíos.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {doors.map((door) => (
          <article key={door.title} className="rounded-2xl border border-border bg-white p-5">
            <h2 className="text-base font-semibold">{door.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{door.description}</p>
            <Button variant="ghost" className="mt-4 px-0" asChild>
              <a href={door.href}>Entrar</a>
            </Button>
          </article>
        ))}
      </section>

      <ConfiguratorWizard
        packs={wizardPacks}
        adicionales={wizardAdicionales}
        defaultPackId={defaultPack}
        initialMode={searchParams.mode}
      />
    </div>
  )
}
