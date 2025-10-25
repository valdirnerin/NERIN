'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { calculateTotals } from './calculations'
import { WizardAdditional, WizardPack, WizardSummary } from './types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { createConfiguratorQuote } from './actions'

const steps = ['Pack base', 'Ambientes y bocas', 'Adicionales', 'Resumen']

interface Props {
  packs: WizardPack[]
  adicionales: WizardAdditional[]
  defaultPackId?: string
}

export function ConfiguratorWizard({ packs, adicionales, defaultPackId }: Props) {
  const [step, setStep] = useState(0)
  const [summary, setSummary] = useState<WizardSummary>({
    packId: defaultPackId && packs.some((pack) => pack.id === defaultPackId)
      ? defaultPackId
      : packs[0]?.id ?? '',
    ambientes: 4,
    bocasExtra: 0,
    adicionales: [],
    comentarios: '',
  })
  const [contacto, setContacto] = useState({ nombre: '', email: '' })
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const selectedPack = useMemo(() => packs.find((pack) => pack.id === summary.packId) ?? packs[0], [
    packs,
    summary.packId,
  ])

  const totals = useMemo(() => {
    if (!selectedPack) {
      return null
    }
    return calculateTotals({ pack: selectedPack, adicionales, summary })
  }, [selectedPack, adicionales, summary])

  if (!selectedPack || !totals) {
    return <p className="text-sm text-slate-500">No hay packs configurados. Cargalos desde el panel de admin.</p>
  }

  const additionalWithQty = new Map(summary.adicionales.map((item) => [item.id, item.cantidad]))

  const next = () => setStep((prev) => Math.min(prev + 1, steps.length - 1))
  const back = () => setStep((prev) => Math.max(prev - 1, 0))

  const handleAdicionalChange = (id: string, cantidad: number) => {
    setSummary((prev) => {
      const filtered = prev.adicionales.filter((item) => item.id !== id)
      if (cantidad <= 0) {
        return { ...prev, adicionales: filtered }
      }
      return { ...prev, adicionales: [...filtered, { id, cantidad }] }
    })
  }

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await createConfiguratorQuote({
        ...summary,
        nombre: contacto.nombre || undefined,
        email: contacto.email || undefined,
      })
      setPdfUrl(result.pdfUrl)
      setStep(3)
    })
  }

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Paso {step + 1} de {steps.length}
          </p>
          <p className="text-sm text-slate-500">{steps[step]}</p>
        </div>
        <Progress value={((step + 1) / steps.length) * 100} />
      </div>

      {step === 0 && (
        <section className="grid gap-6 md:grid-cols-2">
          {packs.map((pack) => (
            <Card
              key={pack.id}
              className={`cursor-pointer transition ${
                pack.id === selectedPack.id ? 'border-accent ring-2 ring-accent/40' : ''
              }`}
              onClick={() => setSummary((prev) => ({ ...prev, packId: pack.id }))}
              role="button"
              aria-pressed={pack.id === selectedPack.id}
            >
              <CardHeader>
                <CardTitle>{pack.name}</CardTitle>
                <p className="text-sm text-slate-500">{pack.description}</p>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <p>{pack.scope || 'Definí el alcance en el panel de admin.'}</p>
                <p>Mano de obra base ${Number(pack.basePrice).toLocaleString('es-AR')}</p>
                {pack.advancePrice > 0 && (
                  <p>Anticipo sugerido ${Number(pack.advancePrice).toLocaleString('es-AR')}</p>
                )}
                <ul className="space-y-1">
                  {pack.features.slice(0, 4).map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {step === 1 && (
        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Ambientes y bocas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ambientes">Cantidad de ambientes</Label>
                <Input
                  id="ambientes"
                  type="number"
                  min={1}
                  max={30}
                  value={summary.ambientes}
                  onChange={(event) =>
                    setSummary((prev) => ({ ...prev, ambientes: Number(event.target.value) || 0 }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="bocasExtra">Bocas adicionales estimadas</Label>
                <Input
                  id="bocasExtra"
                  type="number"
                  min={0}
                  max={500}
                  value={summary.bocasExtra}
                  onChange={(event) =>
                    setSummary((prev) => ({ ...prev, bocasExtra: Number(event.target.value) || 0 }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="comentarios">Comentarios o ambientes especiales</Label>
                <Textarea
                  id="comentarios"
                  value={summary.comentarios}
                  onChange={(event) =>
                    setSummary((prev) => ({ ...prev, comentarios: event.target.value }))
                  }
                  placeholder="Ej: agregar circuito exclusivo para sala de servidores."
                />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle>Resumen parcial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>Pack seleccionado: {selectedPack.name}</p>
              <p>Alcance recomendado: {selectedPack.scope}</p>
              <p>Bocas adicionales estimadas: {summary.bocasExtra}</p>
              <p>Ambientes estimados: {summary.ambientes}</p>
            </CardContent>
          </Card>
        </section>
      )}

      {step === 2 && (
        <section className="grid gap-6 md:grid-cols-2">
          {adicionales.map((adicional) => (
            <Card key={adicional.id}>
              <CardHeader>
                <CardTitle>{adicional.nombre}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <p>{adicional.descripcion}</p>
                <p>
                  Valor unitario ${Number(adicional.precioUnitarioManoObra).toLocaleString('es-AR')} / {adicional.unidad}
                </p>
                <Input
                  type="number"
                  min={0}
                  max={50}
                  value={additionalWithQty.get(adicional.id) ?? 0}
                  onChange={(event) => handleAdicionalChange(adicional.id, Number(event.target.value) || 0)}
                  aria-label={`Cantidad para ${adicional.nombre}`}
                />
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {step === 3 && (
        <section className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de cotización</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>Pack base: {selectedPack.name}</p>
              <p>Alcance: {selectedPack.scope}</p>
              {selectedPack.advancePrice > 0 && (
                <p>
                  Anticipo sugerido: ${Number(selectedPack.advancePrice).toLocaleString('es-AR')}
                </p>
              )}
              <p>Mano de obra base: ${totals.subtotalPack.toLocaleString('es-AR')}</p>
              <ul className="space-y-2">
                {totals.adicionales.map((item) => (
                  <li key={item.id}>
                    {item.nombre} · {item.cantidad} × ${item.precioUnitario.toLocaleString('es-AR')} = $
                    {item.subtotal.toLocaleString('es-AR')}
                  </li>
                ))}
              </ul>
              <p className="text-lg font-semibold text-foreground">
                Total mano de obra: ${totals.totalManoObra.toLocaleString('es-AR')}
              </p>
              <p>Proyecto eléctrico se cobra aparte: $500.000</p>
              <p className="text-xs text-slate-500">
                Los materiales no están incluidos. Podés elegir marcas como Schneider, Prysmian, Gimsa, Daisa o Genrock y las
                compramos con tu aprobación.
              </p>
              {pdfUrl ? (
                <Button asChild>
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                    Descargar PDF de cotización
                  </a>
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isPending}>
                  {isPending ? 'Generando PDF...' : 'Guardar cotización y generar PDF'}
                </Button>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Datos de contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <div>
                <Label htmlFor="nombre">Nombre y empresa</Label>
                <Input
                  id="nombre"
                  value={contacto.nombre}
                  onChange={(event) => setContacto((prev) => ({ ...prev, nombre: event.target.value }))}
                  placeholder="Ej: Ana Torres · Consorcio San Telmo"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={contacto.email}
                  onChange={(event) => setContacto((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="correo@empresa.com"
                />
              </div>
              <p className="text-xs text-slate-500">
                Te enviaremos la cotización y un enlace para solicitar la visita técnica o pagar la seña de obra vía Mercado Pago.
              </p>
            </CardContent>
          </Card>
        </section>
      )}

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={back} disabled={step === 0}>
          Volver
        </Button>
        {step < steps.length - 1 && (
          <Button onClick={next}>Continuar</Button>
        )}
      </div>
    </div>
  )
}
