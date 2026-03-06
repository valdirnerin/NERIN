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

const howItWorks = [
  'Paso 1 · Elegí modalidad y tipo de trabajo en segundos.',
  'Paso 2 · Revisá alcance, precio estimado y cobertura en la misma pantalla.',
  'Paso 3 · Enviá datos y reservá el avance comercial sin fricción.',
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
    <div className="space-y-10 bg-slate-50/80 p-1 sm:space-y-12">
      <header className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:grid-cols-[1.25fr_0.75fr] sm:p-10">
        <div className="space-y-6">
          <Badge className="w-fit border-slate-300 bg-slate-100 text-slate-700">Configurador NERIN</Badge>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Cotizalo
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-slate-600 sm:text-xl">
              Elegí servicio, completá datos y recibí una propuesta clara para avanzar.
            </p>
          </div>
          <Button asChild className="h-12 bg-slate-900 px-7 text-base font-semibold text-white hover:bg-slate-800">
            <a href="#configurador-nerin">Comenzar ahora</a>
          </Button>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Qué vas a definir</p>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <p className="rounded-xl border border-slate-200 bg-white px-3 py-2">Modalidad del trabajo (puntual u obra).</p>
            <p className="rounded-xl border border-slate-200 bg-white px-3 py-2">Servicio exacto con vista previa de alcance.</p>
            <p className="rounded-xl border border-slate-200 bg-white px-3 py-2">Prioridad, cobertura y datos para reservar.</p>
          </div>
          <div className="mt-4 grid gap-2 text-xs font-medium text-slate-600">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-center">Decisión guiada</span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-center">Precio estimado visible</span>
          </div>
        </aside>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {howItWorks.map((item) => (
          <article key={item} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-base font-medium text-slate-700">{item}</p>
          </article>
        ))}
      </section>

      <div id="configurador-nerin">
        <ConfiguratorWizard
          packs={wizardPacks}
          adicionales={wizardAdicionales}
          defaultPackId={defaultPack}
          initialMode={searchParams.mode}
        />
      </div>
    </div>
  )
}
