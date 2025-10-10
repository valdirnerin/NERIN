export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { ConfiguratorWizard } from '@/components/configurator/ConfiguratorWizard'

export const revalidate = 60

export default async function PresupuestadorPage({ searchParams }: { searchParams: { pack?: string } }) {
  const packs = await prisma.pack.findMany({ orderBy: { precioManoObraBase: 'asc' } })
  const adicionales = await prisma.additionalItem.findMany({ orderBy: { nombre: 'asc' } })
  const defaultPack = searchParams.pack
    ? packs.find((pack) => pack.slug === searchParams.pack)?.id
    : undefined

  const wizardPacks = packs.map((pack) => ({
    id: pack.id,
    slug: pack.slug,
    nombre: pack.nombre,
    descripcion: pack.descripcion,
    alcanceDetallado: pack.alcanceDetallado,
    bocasIncluidas: pack.bocasIncluidas,
    ambientesReferencia: pack.ambientesReferencia,
    precioManoObraBase: pack.precioManoObraBase,
  }))
  const wizardAdicionales = adicionales.map((item) => ({
    id: item.id,
    nombre: item.nombre,
    descripcion: item.descripcion,
    unidad: item.unidad,
    precioUnitarioManoObra: item.precioUnitarioManoObra,
    reglasCompatibilidad: item.reglasCompatibilidad,
    packId: item.packId,
  }))

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <Badge>Configurar pack</Badge>
        <h1>Configurador eléctrico guiado</h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Calculá tu inversión en mano de obra eléctrica en cuatro pasos. Te sugerimos el pack adecuado,
          adicionales críticos y generamos un PDF listo para compartir.
        </p>
      </header>
      <ConfiguratorWizard packs={wizardPacks} adicionales={wizardAdicionales} defaultPackId={defaultPack} />
    </div>
  )
}
