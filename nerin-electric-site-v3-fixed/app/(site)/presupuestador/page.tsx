export const dynamic = 'force-dynamic'

import { getConfiguratorData } from '@/lib/marketing-data'
import { Badge } from '@/components/ui/badge'
import { ConfiguratorWizard } from '@/components/configurator/ConfiguratorWizard'
import { Button } from '@/components/ui/button'

export const revalidate = 60

export async function generateMetadata() {
  const siteUrl = process.env.SITE_URL || 'https://nerin-1.onrender.com'
  const title = 'Presupuestador y solicitud de servicios | NERIN'
  const description =
    'Elegí tipo de trabajo, enviá solicitud y avanzá con una propuesta clara para hogar, comercio u obra.'

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
    title: 'Solicitud puntual',
    description: 'Para resolver tareas concretas en vivienda, comercio u oficina.',
    href: '/presupuestador?mode=EXPRESS',
  },
  {
    title: 'Proyecto / obra / reforma',
    description: 'Para trabajos de mayor escala con planificación y alcance definido.',
    href: '/presupuestador?mode=PROJECT',
  },
]

const howItWorks = [
  'Completás datos clave de forma simple.',
  'Definimos tipo de servicio y prioridad.',
  'Recibís propuesta y continuás por el canal más cómodo.',
]

export default async function PresupuestadorPage({
  searchParams,
}: {
  searchParams: { pack?: string; mode?: 'EXPRESS' | 'PROJECT' }
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
      <header className="space-y-4 rounded-3xl border border-border/70 bg-slate-950 p-6 text-white sm:p-8">
        <Badge className="w-fit border-cyan-300/50 bg-cyan-500/20 text-cyan-100">Presupuestador</Badge>
        <h1 className="text-3xl sm:text-4xl">Enviá solicitud y avanzá con una propuesta clara</h1>
        <p className="max-w-3xl text-base text-slate-200 sm:text-lg">
          Este flujo está pensado para que puedas resolver trabajos puntuales o proyectos de obra sin
          complicarte.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        {howItWorks.map((item) => (
          <article key={item} className="rounded-2xl border border-border bg-white p-4">
            <p className="text-sm text-slate-700">{item}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {doors.map((door) => (
          <article
            key={door.title}
            className="rounded-2xl border border-border bg-gradient-to-b from-white to-cyan-50/40 p-5"
          >
            <h2 className="text-base font-semibold text-slate-900">{door.title}</h2>
            <p className="mt-2 text-sm text-slate-700">{door.description}</p>
            <Button className="mt-4 w-full bg-cyan-700 hover:bg-cyan-800" asChild>
              <a href={door.href}>Elegir opción</a>
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
