export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { getPacksForMarketing } from '@/lib/marketing-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getSiteContent } from '@/lib/site-content'

export const revalidate = 60

export default async function PacksPage() {
  const packs = await getPacksForMarketing()
  const site = await getSiteContent()

  return (
    <div className="space-y-16">
      <header className="space-y-6">
        <Badge>Packs de mano de obra</Badge>
        <h1>{site.packsPage.introTitle}</h1>
        <p className="text-lg text-slate-600">{site.packsPage.introDescription}</p>
        <Button asChild size="pill">
          <Link href="/presupuestador">Configurar pack online</Link>
        </Button>
        <p className="text-sm text-slate-500">{site.packsPage.note}</p>
      </header>

      <section className="space-y-8">
        {packs.map((pack) => (
          <Card key={pack.id} id={pack.slug} className="scroll-mt-32">
            <CardHeader>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>{pack.name}</CardTitle>
                  <p className="text-sm text-slate-500">{pack.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm uppercase tracking-wide text-slate-400">Mano de obra base</p>
                  <p className="text-2xl font-semibold text-foreground">
                    ${Number(pack.basePrice).toLocaleString('es-AR')}
                  </p>
                  {pack.advancePrice > 0 && (
                    <p className="text-xs text-slate-500">
                      Anticipo sugerido ${Number(pack.advancePrice).toLocaleString('es-AR')}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-[2fr_1fr]">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Alcance completo</h3>
                <p className="text-sm text-slate-600">{pack.scope}</p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {pack.features.map((item) => (
                    <li key={item} className="text-sm text-slate-600">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <div className="rounded border border-dashed border-slate-200 p-4 text-sm text-slate-600">
                  <p>Materiales, artefactos y tablero final se cotizan aparte según marcas preferidas.</p>
                  <p className="mt-2">Podés sumar adicionales críticos desde el configurador online.</p>
                </div>
                <Button variant="secondary" asChild>
                  <Link href={`/presupuestador?pack=${pack.slug}`}>Elegir este pack</Link>
                </Button>
                <p className="text-xs text-slate-500">
                  Proyecto eléctrico se cobra aparte (base $500.000). Coordinamos marcas como Schneider, Prysmian, Gimsa,
                  Daisa o Genrock según tu presupuesto.
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
