'use client'

import { useMemo, useState, useTransition } from 'react'
import { calculateTotals } from './calculations'
import { professionalCatalog, quoteServices } from './catalog'
import { WizardAdditional, WizardPack, WizardSummary } from './types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createConfiguratorQuote } from './actions'

interface Props {
  packs: WizardPack[]
  adicionales: WizardAdditional[]
  defaultPackId?: string
  initialMode?: WizardSummary['mode']
}

const modeCards: Array<{ mode: WizardSummary['mode']; title: string; description: string }> = [
  {
    mode: 'EXPRESS',
    title: '1) Resolver algo puntual',
    description: 'Para contratar rápido con alcance definido.',
  },
  {
    mode: 'ASSISTED',
    title: '2) Relevamiento / proyecto',
    description: 'Para obra o reforma con acompañamiento.',
  },
  {
    mode: 'PROFESSIONAL',
    title: '3) Cotización profesional',
    description: 'Para carga técnica por cantidades.',
  },
]

export function ConfiguratorWizard({ packs, adicionales, defaultPackId, initialMode = 'EXPRESS' }: Props) {
  const defaultServiceByMode = {
    EXPRESS: quoteServices.find((service) => service.path === 'PUNTUAL')?.id ?? quoteServices[0]?.id ?? '',
    ASSISTED: quoteServices.find((service) => service.path === 'OBRA')?.id ?? quoteServices[0]?.id ?? '',
    PROFESSIONAL: quoteServices.find((service) => service.path === 'OBRA')?.id ?? quoteServices[0]?.id ?? '',
  }

  const [summary, setSummary] = useState<WizardSummary>({
    mode: initialMode,
    serviceId: defaultServiceByMode[initialMode],
    serviceUnits: 1,
    zoneTier: 'PRIORITY',
    urgencyMultiplier: 1,
    difficultyMultiplier: 1,
    packId: defaultPackId && packs.some((pack) => pack.id === defaultPackId) ? defaultPackId : packs[0]?.id ?? '',
    ambientes: 4,
    bocasExtra: 0,
    adicionales: [],
    professionalItems: professionalCatalog
      .filter((item) => item.suggestedQty)
      .map((item) => ({ id: item.id, cantidad: item.suggestedQty ?? 0 })),
    comentarios: '',
  })

  const [contacto, setContacto] = useState({ nombre: '', email: '' })
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const selectedPack = useMemo(
    () => packs.find((pack) => pack.id === summary.packId) ?? packs[0] ?? null,
    [packs, summary.packId],
  )

  const totals = useMemo(
    () =>
      calculateTotals({
        pack: selectedPack,
        adicionales,
        summary,
        services: quoteServices,
        catalog: professionalCatalog,
      }),
    [selectedPack, adicionales, summary],
  )

  const visibleServices = quoteServices.filter((service) => {
    if (summary.mode === 'EXPRESS') return service.path === 'PUNTUAL'
    return service.path === 'OBRA'
  })

  const selectedService = quoteServices.find((service) => service.id === summary.serviceId)

  const updateMode = (mode: WizardSummary['mode']) => {
    setSummary((prev) => ({
      ...prev,
      mode,
      serviceId: defaultServiceByMode[mode],
      serviceUnits: 1,
    }))
    setPdfUrl(null)
  }

  const updateItems = (id: string, cantidad: number, key: 'adicionales' | 'professionalItems') => {
    setSummary((prev) => {
      const filtered = prev[key].filter((item) => item.id !== id)
      if (cantidad <= 0) return { ...prev, [key]: filtered }
      return { ...prev, [key]: [...filtered, { id, cantidad }] }
    })
  }

  const submitQuote = () => {
    startTransition(async () => {
      const result = await createConfiguratorQuote({
        ...summary,
        nombre: contacto.nombre || undefined,
        email: contacto.email || undefined,
      })
      setPdfUrl(result.pdfUrl)
    })
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {modeCards.map((card) => (
          <button
            key={card.mode}
            type="button"
            onClick={() => updateMode(card.mode)}
            className={`rounded-2xl border p-4 text-left transition ${
              summary.mode === card.mode ? 'border-accent bg-accent/5' : 'border-border bg-white'
            }`}
          >
            <p className="text-base font-semibold text-foreground">{card.title}</p>
            <p className="mt-2 text-sm text-slate-600">{card.description}</p>
          </button>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.35fr_0.9fr] xl:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurá tu solicitud</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3">
              {visibleServices.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setSummary((prev) => ({ ...prev, serviceId: service.id }))}
                  className={`rounded-xl border p-4 text-left ${summary.serviceId === service.id ? 'border-accent bg-accent/5' : 'border-border'}`}
                >
                  <p className="font-semibold text-foreground">{service.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{service.description}</p>
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Unidades</Label>
                <Input
                  type="number"
                  min={1}
                  value={summary.serviceUnits}
                  onChange={(event) => setSummary((prev) => ({ ...prev, serviceUnits: Number(event.target.value) || 1 }))}
                />
              </div>
              <div>
                <Label>Zona</Label>
                <select
                  className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm"
                  value={summary.zoneTier}
                  onChange={(event) =>
                    setSummary((prev) => ({
                      ...prev,
                      zoneTier: event.target.value as WizardSummary['zoneTier'],
                    }))
                  }
                >
                  <option value="PRIORITY">Prioritaria</option>
                  <option value="STANDARD">Estándar</option>
                  <option value="EXTENDED">Extendida</option>
                </select>
              </div>
              <div>
                <Label>Urgencia</Label>
                <select
                  className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm"
                  value={summary.urgencyMultiplier}
                  onChange={(event) =>
                    setSummary((prev) => ({ ...prev, urgencyMultiplier: Number(event.target.value) || 1 }))
                  }
                >
                  <option value={1}>Normal</option>
                  <option value={1.1}>72 h</option>
                  <option value={1.2}>24 h</option>
                </select>
              </div>
            </div>

            {summary.mode === 'ASSISTED' && (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label>Ambientes</Label>
                    <Input
                      type="number"
                      min={1}
                      value={summary.ambientes}
                      onChange={(event) => setSummary((prev) => ({ ...prev, ambientes: Number(event.target.value) || 1 }))}
                    />
                  </div>
                  <div>
                    <Label>Bocas extra</Label>
                    <Input
                      type="number"
                      min={0}
                      value={summary.bocasExtra}
                      onChange={(event) => setSummary((prev) => ({ ...prev, bocasExtra: Number(event.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label>Base técnica</Label>
                    <select
                      className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm"
                      value={summary.packId}
                      onChange={(event) => setSummary((prev) => ({ ...prev, packId: event.target.value }))}
                    >
                      {packs.map((pack) => (
                        <option key={pack.id} value={pack.id}>
                          {pack.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid gap-3 lg:grid-cols-2">
                  {adicionales.slice(0, 6).map((item) => (
                    <div key={item.id} className="grid grid-cols-[1fr_90px] gap-3 rounded-xl border border-border/70 p-3 items-center">
                      <span className="text-sm text-slate-600">{item.nombre}</span>
                      <Input
                        type="number"
                        min={0}
                        value={summary.adicionales.find((it) => it.id === item.id)?.cantidad ?? 0}
                        onChange={(event) => updateItems(item.id, Number(event.target.value) || 0, 'adicionales')}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {summary.mode === 'PROFESSIONAL' && (
              <div className="grid gap-3 lg:grid-cols-2">
                {professionalCatalog.map((item) => (
                  <div key={item.id} className="grid grid-cols-[1fr_90px] gap-3 rounded-xl border border-border/70 p-3 items-center">
                    <span className="text-sm text-slate-600">{item.name}</span>
                    <Input
                      type="number"
                      min={0}
                      value={summary.professionalItems.find((it) => it.id === item.id)?.cantidad ?? 0}
                      onChange={(event) => updateItems(item.id, Number(event.target.value) || 0, 'professionalItems')}
                    />
                  </div>
                ))}
              </div>
            )}

            <div>
              <Label>Contexto del trabajo</Label>
              <Textarea
                value={summary.comentarios}
                onChange={(event) => setSummary((prev) => ({ ...prev, comentarios: event.target.value }))}
                placeholder="Contanos qué buscás resolver."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle>Resumen comercial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              Servicio: <b>{selectedService?.name}</b>
            </p>
            <p>
              Modalidad: <b>{totals.requiresSurvey ? 'Relevamiento técnico previo' : 'Contratación directa'}</b>
            </p>
            <p className="text-lg font-semibold">Total estimado: ${totals.totalManoObra.toLocaleString('es-AR')}</p>
            {totals.warning && <p className="text-amber-600">{totals.warning}</p>}

            <div className="space-y-3 border-t border-border pt-3">
              <Input
                placeholder="Nombre"
                value={contacto.nombre}
                onChange={(event) => setContacto((prev) => ({ ...prev, nombre: event.target.value }))}
              />
              <Input
                placeholder="Email"
                type="email"
                value={contacto.email}
                onChange={(event) => setContacto((prev) => ({ ...prev, email: event.target.value }))}
              />
              <Button onClick={submitQuote} disabled={isPending} className="w-full">
                {isPending ? 'Guardando...' : 'Guardar cotización'}
              </Button>
              {pdfUrl && (
                <a className="text-sm font-semibold text-accent hover:underline" href={pdfUrl} target="_blank" rel="noreferrer">
                  Descargar PDF
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
