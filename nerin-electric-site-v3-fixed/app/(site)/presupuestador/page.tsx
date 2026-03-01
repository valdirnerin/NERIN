export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getConfiguratorData } from '@/lib/marketing-data'
import { Badge } from '@/components/ui/badge'
import { ConfiguratorWizard } from '@/components/configurator/ConfiguratorWizard'
import { Button } from '@/components/ui/button'

export const revalidate = 60

export async function generateMetadata() {
  const siteUrl = process.env.SITE_URL || 'https://nerin-1.onrender.com'
  const title = 'Cotización NERIN | Servicio puntual, relevamiento o cotización técnica'
  const description =
    'Elegí el ingreso correcto: servicio puntual, relevamiento para obra o cotización técnica por plano/cantidades.'

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
    title: 'Servicio puntual',
    description: 'Para resolver una necesidad concreta con contratación directa.',
    href: '/presupuestador?mode=EXPRESS',
  },
  {
    title: 'Relevamiento / proyecto',
    description: 'Para obras o reformas que necesitan diagnóstico previo.',
    href: '/presupuesto?tipo=obra',
  },
  {
    title: 'Cotización técnica',
    description: 'Para profesionales que cotizan por plano o cantidades.',
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
        <Badge>Cotización y contratación</Badge>
        <h1>Entrá por la puerta correcta</h1>
        <p className="max-w-3xl text-lg text-slate-600">
          Cada tipo de trabajo requiere un proceso distinto. Elegí el canal adecuado y avanzamos con una propuesta clara.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {doors.map((door) => (
          <article key={door.title} className="rounded-2xl border border-border bg-white p-5">
            <h2 className="text-base font-semibold">{door.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{door.description}</p>
            <Button variant="ghost" className="mt-4 px-0" asChild>
              <a href={door.href}>Ingresar</a>
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
