'use client'

import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { calculateTotals } from './calculations'
import { professionalCatalog, quoteServices } from './catalog'
import { WizardAdditional, WizardPack, WizardSummary } from './types'
import { getZoneBadgeClasses, getZoneTierLabel } from '@/lib/service-area'
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

type GeoSuggestion = {
  displayName: string
  lat: number
  lng: number
  zone: {
    tier: WizardSummary['zoneTier']
    label: string
    area: string
  }
}

const modeCards: Array<{ mode: WizardSummary['mode']; title: string; description: string }> = [
  {
    mode: 'EXPRESS',
    title: 'Servicio puntual',
    description: 'Para resolver un trabajo concreto y directo.',
  },
  {
    mode: 'PROJECT',
    title: 'Obra / reforma / instalación',
    description: 'Para trabajos de mayor alcance que requieren definición técnica.',
  },
]

const fallbackZones: Array<{ value: WizardSummary['zoneTier']; label: string }> = [
  { value: 'PRIORITY', label: 'Prioritaria' },
  { value: 'STANDARD', label: 'Estándar' },
  { value: 'EXTENDED', label: 'Extendida' },
  { value: 'REVIEW', label: 'Fuera de cobertura / revisión manual' },
]

type GeoStatus = 'idle' | 'searching' | 'success' | 'error'

export function ConfiguratorWizard({ packs, adicionales, defaultPackId, initialMode = 'EXPRESS' }: Props) {
  const defaultServiceByMode = {
    EXPRESS: quoteServices.find((service) => service.path === 'PUNTUAL')?.id ?? quoteServices[0]?.id ?? '',
    PROJECT: quoteServices.find((service) => service.path === 'OBRA')?.id ?? quoteServices[0]?.id ?? '',
  }

  const [summary, setSummary] = useState<WizardSummary>({
    mode: initialMode,
    serviceId: defaultServiceByMode[initialMode],
    serviceUnits: 1,
    zoneTier: 'PRIORITY',
    address: '',
    zoneLabel: 'Ingresá la dirección para detectar la zona automáticamente.',
    urgencyMultiplier: 1,
    difficultyMultiplier: 1,
    packId: defaultPackId && packs.some((pack) => pack.id === defaultPackId) ? defaultPackId : packs[0]?.id ?? '',
    ambientes: 4,
    bocasExtra: 0,
    hasPlan: false,
    adicionales: [],
    professionalItems: professionalCatalog
      .filter((item) => item.suggestedQty)
      .map((item) => ({ id: item.id, cantidad: item.suggestedQty ?? 0 })),
    comentarios: '',
  })

  const [contacto, setContacto] = useState({ nombre: '', email: '' })
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([])
  const [isGeoLoading, setIsGeoLoading] = useState(false)
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('idle')
  const [geoError, setGeoError] = useState<string | null>(null)
  const [showManualZone, setShowManualZone] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
      hasPlan: mode === 'PROJECT' ? prev.hasPlan : false,
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

  const fetchAddressSuggestions = async (query: string) => {
    if (query.trim().length < 5) {
      setSuggestions([])
      setGeoStatus('idle')
      setGeoError(null)
      setShowManualZone(false)
      return
    }

    setIsGeoLoading(true)
    setGeoStatus('searching')
    setGeoError(null)
    setShowManualZone(false)

    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`, { cache: 'no-store' })
      const payload = (await response.json()) as { candidates?: GeoSuggestion[]; error?: string }
      if (!response.ok) throw new Error(payload.error || 'No pudimos buscar esa dirección ahora.')

      const candidates = payload.candidates ?? []
      setSuggestions(candidates)
      if (candidates.length === 0) {
        setGeoStatus('error')
        setGeoError('No encontramos coincidencias para esa dirección. Revisá calle, altura y localidad.')
        setShowManualZone(true)
      }
    } catch (error) {
      console.error(error)
      setGeoStatus('error')
      setGeoError('No pudimos ubicar la dirección automáticamente. Podés seleccionar una zona manualmente.')
      setSuggestions([])
      setShowManualZone(true)
    } finally {
      setIsGeoLoading(false)
    }
  }

  const applySuggestion = (item: GeoSuggestion) => {
    setSummary((prev) => ({
      ...prev,
      address: item.displayName,
      zoneTier: item.zone.tier,
      zoneLabel: item.zone.label,
      zoneLat: item.lat,
      zoneLng: item.lng,
    }))
    setSuggestions([])
    setGeoError(null)
    setGeoStatus('success')
    setShowManualZone(false)
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

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

  const mapSrc = summary.zoneLat && summary.zoneLng
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${summary.zoneLng - 0.06},${summary.zoneLat - 0.04},${summary.zoneLng + 0.06},${summary.zoneLat + 0.04}&layer=mapnik&marker=${summary.zoneLat},${summary.zoneLng}`
    : 'https://www.openstreetmap.org/export/embed.html?bbox=-58.90,-34.96,-58.12,-34.36&layer=mapnik'

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="grid gap-3 sm:grid-cols-2">
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
            <CardTitle>Completá tu solicitud</CardTitle>
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

            <div className="grid gap-4 md:grid-cols-2">
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

            <div className="space-y-3 rounded-xl border border-border p-4">
              <Label htmlFor="address">Dirección del trabajo</Label>
              <Input
                id="address"
                value={summary.address}
                placeholder="Ej: Av. Cabildo 2450, CABA"
                onChange={(event) => {
                  const value = event.target.value
                  setSummary((prev) => ({ ...prev, address: value }))
                  setGeoStatus(value.trim().length >= 5 ? 'searching' : 'idle')
                  setSuggestions([])

                  if (debounceRef.current) clearTimeout(debounceRef.current)
                  debounceRef.current = setTimeout(() => {
                    void fetchAddressSuggestions(value)
                  }, 700)
                }}
              />
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => void fetchAddressSuggestions(summary.address)}>
                  Detectar zona
                </Button>
                {isGeoLoading && <p className="text-xs text-slate-500">Buscando dirección...</p>}
              </div>
              {geoError && <p className="text-xs text-amber-600">{geoError}</p>}
              {suggestions.length > 0 && (
                <div className="rounded-lg border border-border bg-white">
                  {suggestions.map((item) => (
                    <button
                      key={`${item.lat}-${item.lng}`}
                      type="button"
                      onClick={() => applySuggestion(item)}
                      className="block w-full border-b border-border px-3 py-2 text-left text-sm last:border-b-0 hover:bg-muted/30"
                    >
                      <span className="block">{item.displayName}</span>
                      <span className="text-xs text-slate-500">{item.zone.label}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="rounded-lg bg-muted/40 p-3 text-sm">
                <p className="text-xs text-slate-500">
                  {geoStatus === 'idle' && 'Ingresá una dirección y presioná “Detectar zona”.'}
                  {geoStatus === 'searching' && 'Buscando coincidencias de dirección...'}
                  {geoStatus === 'error' && 'No se pudo resolver automáticamente.'}
                  {geoStatus === 'success' && 'Dirección validada y zona detectada automáticamente.'}
                </p>
                <span className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getZoneBadgeClasses(summary.zoneTier)}`}>
                  {summary.zoneLabel ?? getZoneTierLabel(summary.zoneTier)}
                </span>
              </div>

              <iframe
                title="Mapa de cobertura CABA y GBA"
                src={mapSrc}
                className="h-52 w-full rounded-xl border border-border"
                loading="lazy"
              />

              {geoStatus === 'error' && (
                <div className="text-xs text-slate-600">
                  Si la dirección no aparece, podés usar fallback manual.
                  <button
                    type="button"
                    className="ml-1 font-semibold text-accent"
                    onClick={() => setShowManualZone((prev) => !prev)}
                  >
                    {showManualZone ? 'Ocultar fallback' : 'Mostrar fallback'}
                  </button>
                </div>
              )}

              {showManualZone && (
                <select
                  className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm"
                  value={summary.zoneTier}
                  onChange={(event) =>
                    setSummary((prev) => ({
                      ...prev,
                      zoneTier: event.target.value as WizardSummary['zoneTier'],
                      zoneLabel: getZoneTierLabel(event.target.value as WizardSummary['zoneTier']),
                    }))
                  }
                >
                  {fallbackZones.map((zone) => (
                    <option key={zone.value} value={zone.value}>
                      {zone.label}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {summary.mode === 'PROJECT' && (
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

                <label className="flex items-start gap-3 rounded-xl border border-border p-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={summary.hasPlan}
                    onChange={(event) => setSummary((prev) => ({ ...prev, hasPlan: event.target.checked }))}
                    className="mt-1"
                  />
                  <span>
                    <strong>Tengo plano o cantidades.</strong> Activá esta opción para cargar una variante técnica más detallada.
                  </span>
                </label>

                {!summary.hasPlan && (
                  <div className="grid gap-3 lg:grid-cols-2">
                    {adicionales.slice(0, 8).map((item) => (
                      <div key={item.id} className="grid grid-cols-[1fr_90px] items-center gap-3 rounded-xl border border-border/70 p-3">
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
                )}

                {summary.hasPlan && (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600">Cargá cantidades estimadas para preparar la cotización técnica preliminar.</p>
                    <div className="grid gap-3 lg:grid-cols-2">
                      {professionalCatalog.map((item) => (
                        <div key={item.id} className="grid grid-cols-[1fr_90px] items-center gap-3 rounded-xl border border-border/70 p-3">
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
                  </div>
                )}
              </>
            )}

            <div>
              <Label>Detalle del trabajo</Label>
              <Textarea
                value={summary.comentarios}
                onChange={(event) => setSummary((prev) => ({ ...prev, comentarios: event.target.value }))}
                placeholder="Contanos brevemente qué necesitás resolver."
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
              Modalidad: <b>{totals.requiresSurvey ? 'Con definición técnica previa' : 'Resolución directa'}</b>
            </p>
            <p>
              Cobertura: <b>{getZoneTierLabel(summary.zoneTier)}</b>
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
