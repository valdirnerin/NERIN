export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const revalidate = 60

export default async function PacksPage() {
  const packs = await prisma.pack.findMany({
    include: {
      additionalItems: true,
    },
    orderBy: { precioManoObraBase: 'asc' },
  })

  return (
    <div className="space-y-16">
      <header className="space-y-6">
        <Badge>Packs de mano de obra</Badge>
        <h1>Packs eléctricos para viviendas exigentes</h1>
        <p className="text-lg text-slate-600">
          Mano de obra certificada. Materiales no incluidos para que elijas marcas (Schneider, Prysmian, Gimsa,
          Daisa, Genrock) según tu presupuesto. Proyecto eléctrico se cotiza aparte (base $500.000).
        </p>
        <Button asChild size="pill">
          <Link href="/presupuestador">Configurar pack online</Link>
        </Button>
      </header>

      <section className="space-y-8">
        {packs.map((pack) => (
          <Card key={pack.id} id={pack.slug} className="scroll-mt-32">
            <CardHeader>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>{pack.nombre}</CardTitle>
                  <p className="text-sm text-slate-500">{pack.descripcion}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm uppercase tracking-wide text-slate-400">Mano de obra base</p>
                  <p className="text-2xl font-semibold text-foreground">
                    ${Number(pack.precioManoObraBase).toLocaleString('es-AR')}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-[2fr_1fr]">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Alcance completo</h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {pack.alcanceDetallado.map((item) => (
                    <li key={item} className="text-sm text-slate-600">
                      • {item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-slate-500">
                  Incluye {pack.bocasIncluidas} bocas estimadas para {pack.ambientesReferencia} ambientes de referencia.
                  Si necesitás más, configurá el pack y ajustá las bocas o elegí un pack superior.
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Adicionales frecuentes</h4>
                  <ul className="mt-2 space-y-2 text-sm text-slate-600">
                    {pack.additionalItems.slice(0, 6).map((item) => (
                      <li key={item.id}>
                        {item.nombre} · ${Number(item.precioUnitarioManoObra).toLocaleString('es-AR')} {item.unidad}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button variant="secondary" asChild>
                  <Link href={`/presupuestador?pack=${pack.slug}`}>Elegir este pack</Link>
                </Button>
                <p className="text-xs text-slate-500">
                  Proyecto eléctrico se cobra aparte (base $500.000). Materiales y artefactos los compra el cliente
                  según marcas preferidas.
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
