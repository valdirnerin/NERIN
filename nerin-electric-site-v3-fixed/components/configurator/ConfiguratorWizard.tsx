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

const modeCards: Array<{ mode: WizardSummary['mode']; title: string; description: string; pitch: string }> = [
  {
    mode: 'EXPRESS',
    title: 'Servicio puntual',
    description: 'Ideal para resolver necesidades concretas de forma rápida y ordenada.',
    pitch: 'Resolución directa con propuesta comercial inmediata.',
  },
  {
    mode: 'PROJECT',
    title: 'Proyecto / obra / reforma',
    description: 'Para trabajos de mayor escala con etapas, planificación y seguimiento técnico.',
    pitch: 'Definición integral para avanzar con control de alcance.',
  },
]

const fallbackZones: Array<{ value: WizardSummary['zoneTier']; label: string }> = [
  { value: 'PRIORITY', label: 'Prioritaria' },
  { value: 'STANDARD', label: 'Estándar' },
  { value: 'EXTENDED', label: 'Extendida' },
  { value: 'REVIEW', label: 'Fuera de cobertura / revisión manual' },
]

type GeoStatus = 'idle' | 'searching' | 'success' | 'error'


const singleUnitServiceIds = new Set(['diagnostico-electrico', 'reparacion-falla', 'revision-general', 'visita-tecnica'])

const failureOptions = [
  { id: 'termica-salta', label: 'Salta térmica general', extra: 0 },
  { id: 'corte-sector', label: 'Corte en sector puntual', extra: 22000 },
  { id: 'fuga-neutro', label: 'Fuga / falso contacto complejo', extra: 38000 },
  { id: 'falla-intermitente', label: 'Falla intermitente a relevar', extra: 30000 },
]

const artefactOptions = [
  { id: 'colgante', label: 'Lámpara colgante', extra: 18000 },
  { id: 'dicroica', label: 'Spot / dicroica', extra: 9000 },
  { id: 'aplique', label: 'Aplique mural', extra: 12000 },
  { id: 'plafon', label: 'Plafón / luminaria de superficie', extra: 10000 },
  { id: 'ventilador', label: 'Ventilador de techo', extra: 26000 },
]

const tomaOptions = [
  { id: 'toma-simple', label: 'Toma simple', extra: 7000 },
  { id: 'toma-doble', label: 'Toma doble', extra: 9000 },
  { id: 'tecla-simple', label: 'Tecla simple', extra: 6500 },
  { id: 'tecla-doble', label: 'Tecla doble', extra: 8000 },
  { id: 'llave-conmutada', label: 'Llave conmutada', extra: 11000 },
]


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
  const [previewServiceId, setPreviewServiceId] = useState<string | null>(null)
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null)
  const [selectedFailureId, setSelectedFailureId] = useState(failureOptions[0]?.id ?? '')
  const [selectedArtefactId, setSelectedArtefactId] = useState(artefactOptions[0]?.id ?? '')
  const [artefactQty, setArtefactQty] = useState(1)
  const [includeAACanalizacion, setIncludeAACanalizacion] = useState(false)
  const [tableroBocas, setTableroBocas] = useState(0)
  const [tableroCircuitosEspeciales, setTableroCircuitosEspeciales] = useState(0)
  const [selectedTomaId, setSelectedTomaId] = useState(tomaOptions[0]?.id ?? '')
  const [tomaQty, setTomaQty] = useState(1)
  const [isIluminacionCanalizada, setIsIluminacionCanalizada] = useState(false)
  const [detalleTrabajo, setDetalleTrabajo] = useState('')
  const [attachments, setAttachments] = useState<Array<{ originalName: string; publicUrl: string; size: number }>>([])
  const [attachmentError, setAttachmentError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
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

  const selectedModeCard = modeCards.find((card) => card.mode === summary.mode)

  const previewService = quoteServices.find((service) => service.id === (previewServiceId ?? summary.serviceId)) ?? selectedService

  const servicePreviewHighlights = previewService
    ? [
        previewService.includes?.[0],
        previewService.includes?.[1],
        previewService.flow === 'SURVEY'
          ? 'Requiere definición técnica inicial en sitio.'
          : 'Puede avanzar con definición comercial directa.',
      ].filter(Boolean) as string[]
    : []

  const selectedFailure = failureOptions.find((item) => item.id === selectedFailureId)
  const selectedArtefact = artefactOptions.find((item) => item.id === selectedArtefactId)
  const selectedToma = tomaOptions.find((item) => item.id === selectedTomaId)

  const isSingleUnitService = selectedService ? singleUnitServiceIds.has(selectedService.id) : false

  const tableroThermalSuggestion = Math.max(1, Math.ceil(tableroBocas / 30))

  const serviceDynamicExtra = useMemo(() => {
    if (!selectedService) return 0

    if (selectedService.id === 'reparacion-falla') {
      return selectedFailure?.extra ?? 0
    }

    if (selectedService.id === 'colocacion-artefactos') {
      return (selectedArtefact?.extra ?? 0) * Math.max(1, artefactQty)
    }

    if (selectedService.id === 'circuito-dedicado-aa') {
      return includeAACanalizacion ? 65000 : 0
    }

    if (selectedService.id === 'adecuacion-tablero') {
      return Math.max(0, tableroThermalSuggestion - 1) * 18000 + tableroCircuitosEspeciales * 22000
    }

    if (selectedService.id === 'cambio-tomas') {
      return (selectedToma?.extra ?? 0) * Math.max(1, tomaQty)
    }

    if (selectedService.id === 'iluminacion-interior-exterior') {
      return isIluminacionCanalizada ? 45000 : 0
    }

    return 0
  }, [
    artefactQty,
    includeAACanalizacion,
    isIluminacionCanalizada,
    selectedArtefact,
    selectedFailure,
    selectedService,
    selectedToma,
    tableroCircuitosEspeciales,
    tableroThermalSuggestion,
    tomaQty,
  ])

  const estimatedTotalWithConfig = totals.totalManoObra + serviceDynamicExtra

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


  useEffect(() => {
    setPreviewServiceId(summary.serviceId)
  }, [summary.serviceId])

  useEffect(() => {
    if (!selectedService) return

    if (singleUnitServiceIds.has(selectedService.id) && summary.serviceUnits !== 1) {
      setSummary((prev) => ({ ...prev, serviceUnits: 1 }))
    }
  }, [selectedService, summary.serviceUnits])

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

  const uploadAttachments = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setAttachmentError(null)
    setIsUploading(true)

    try {
      const formData = new FormData()
      Array.from(files).forEach((file) => formData.append('files', file))

      const response = await fetch('/api/configurator/upload', {
        method: 'POST',
        body: formData,
      })

      const payload = (await response.json()) as {
        files?: Array<{ originalName: string; publicUrl: string; size: number }>
        error?: string
      }

      if (!response.ok) throw new Error(payload.error || 'No se pudieron subir los archivos.')

      setAttachments((prev) => [...prev, ...(payload.files ?? [])])
    } catch (error) {
      setAttachmentError(error instanceof Error ? error.message : 'No se pudieron subir los archivos.')
    } finally {
      setIsUploading(false)
    }
  }

  const removeAttachment = (url: string) => {
    setAttachments((prev) => prev.filter((item) => item.publicUrl !== url))
  }

  const buildServiceSpecificNotes = () => {
    if (!selectedService) return ''

    const lines: string[] = []

    if (selectedService.id === 'reparacion-falla' && selectedFailure) {
      lines.push(`Tipo de falla a atender: ${selectedFailure.label}.`)
    }

    if (selectedService.id === 'colocacion-artefactos' && selectedArtefact) {
      lines.push(`Artefacto principal: ${selectedArtefact.label}. Cantidad: ${artefactQty}.`)
    }

    if (selectedService.id === 'circuito-dedicado-aa') {
      lines.push(`Canalización para aire acondicionado: ${includeAACanalizacion ? 'Sí' : 'No'}.`)
    }

    if (selectedService.id === 'adecuacion-tablero') {
      lines.push(
        `Bocas declaradas: ${tableroBocas}. Térmicas sugeridas iluminación: ${tableroThermalSuggestion}. Circuitos especiales: ${tableroCircuitosEspeciales}.`,
      )
    }

    if (selectedService.id === 'revision-general') {
      lines.push('Solicitud orientada a visita de revisión general y armado de presupuesto técnico.')
    }

    if (selectedService.id === 'diagnostico-electrico') {
      lines.push('Servicio solicitado como diagnóstico y visita única de evaluación.')
    }

    if (selectedService.id === 'cambio-tomas' && selectedToma) {
      lines.push(`Elemento a cambiar: ${selectedToma.label}. Cantidad: ${tomaQty}.`)
    }

    if (selectedService.id === 'iluminacion-interior-exterior') {
      lines.push(`Iluminación con canalización adicional: ${isIluminacionCanalizada ? 'Sí' : 'No'}.`)
    }

    return lines.join(' ')
  }

  const submitQuote = () => {
    const serviceNotes = buildServiceSpecificNotes()

    const attachmentsNotes = attachments.length
      ? `Adjuntos: ${attachments.map((item) => `${item.originalName} (${item.publicUrl})`).join(' | ')}`
      : ''

    const mergedComments = [summary.comentarios, detalleTrabajo, serviceNotes, attachmentsNotes]
      .filter(Boolean)
      .join('\n\n')

    startTransition(async () => {
      const result = await createConfiguratorQuote({
        ...summary,
        comentarios: mergedComments || undefined,
        attachments,
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
    <div className="space-y-10 sm:space-y-12">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Flujo de cotización</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {[
            '1. Modalidad',
            '2. Vista previa',
            '3. Solicitud y reserva',
          ].map((step, index) => (
            <div
              key={step}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                index === 0
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Paso 1</p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Elegí cómo querés resolverlo</h2>
          <p className="mt-2 text-base text-slate-600">Seleccioná la modalidad para filtrar servicios y ver una propuesta ajustada.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {modeCards.map((card) => (
            <button
              key={card.mode}
              type="button"
              onClick={() => updateMode(card.mode)}
              className={`rounded-3xl border p-6 text-left transition-all ${
                summary.mode === card.mode
                  ? 'border-slate-900 bg-slate-50 shadow-[0_8px_24px_rgba(15,23,42,0.08)]'
                  : 'border-border bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <p className="text-xl font-semibold text-foreground">{card.title}</p>
              <p className="mt-2 text-base leading-relaxed text-slate-600">{card.description}</p>
              <p className="mt-4 inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600">
                {card.pitch}
              </p>
            </button>
          ))}
        </div>
      </section>

      {previewService && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-slate-900">
          <p className="mb-3 text-sm text-slate-600">Revisá esta ficha antes de completar tus datos.</p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Paso 2 · Confirmá lo que incluye tu servicio</p>
              <h3 className="mt-1 text-2xl font-semibold sm:text-3xl">{previewService.name}</h3>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-600">{previewService.description}</p>
            </div>
            <span className="inline-flex h-12 min-w-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-2xl" aria-hidden="true">
              {previewService.visualIcon ?? '⚡'}
            </span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {servicePreviewHighlights.map((item) => (
              <p key={item} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                {item}
              </p>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-sm font-semibold text-emerald-700">
              Desde ${previewService.basePrice.toLocaleString('es-AR')}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-600">
              Propuesta estimada sujeta a validación técnica
            </span>
          </div>
          <p className="mt-5 text-sm text-slate-500">{selectedModeCard?.pitch}</p>
        </section>
      )}

      <section className="grid gap-5 lg:grid-cols-[1.35fr_0.9fr] xl:gap-6">
        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader className="space-y-2 border-b border-slate-100 pb-4">
            <CardTitle className="text-2xl leading-tight">Paso 3 · Elegí el servicio exacto y completá tu solicitud</CardTitle>
            <p className="text-base leading-relaxed text-slate-600">
              Completá estos datos para que podamos ordenar tu caso y darte una propuesta clara.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="grid gap-3">
                {visibleServices.map((service) => {
                  const isSelected = summary.serviceId === service.id
                  const isExpanded = expandedServiceId === service.id
                  return (
                    <article
                      key={service.id}
                      onMouseEnter={() => setPreviewServiceId(service.id)}
                      className={`rounded-2xl border p-5 text-left transition-all ${isSelected ? 'border-slate-900 bg-slate-50 shadow-[inset_4px_0_0_0_rgba(15,23,42,1)]' : 'border-border bg-white hover:border-slate-300 hover:shadow-sm'}`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSummary((prev) => ({ ...prev, serviceId: service.id }))
                          setPreviewServiceId(service.id)
                        }}
                        className="w-full text-left"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-lg font-semibold text-foreground">{service.name}</p>
                            <p className="mt-1 text-base leading-relaxed text-slate-600">{service.description}</p>
                            {isSelected && (
                              <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-slate-700">Servicio elegido para cotizar</p>
                            )}
                          </div>
                          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted/40 text-sm" aria-hidden="true">
                            {service.visualIcon ?? '•'}
                          </span>
                        </div>
                      </button>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {service.categoryLabel && (
                          <p className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-slate-600">{service.categoryLabel}</p>
                        )}
                        <button
                          type="button"
                          onClick={() => setExpandedServiceId((prev) => (prev === service.id ? null : service.id))}
                          className="text-xs font-semibold text-slate-700 underline-offset-2 hover:underline"
                        >
                          {isExpanded ? 'Ocultar detalle' : 'Ver detalle rápido'}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="mt-3 grid gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
                          <p><span className="font-semibold">Incluye:</span> {service.includes.join(', ')}.</p>
                          <p><span className="font-semibold">No incluye:</span> {service.excludes.join(', ')}.</p>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>

              {previewService && (
                <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:sticky xl:top-24">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Preview interactiva</p>
                  <h4 className="mt-2 text-lg font-semibold text-slate-900">{previewService.name}</h4>
                  <p className="mt-1 text-sm text-slate-600">{previewService.description}</p>
                  <p className="mt-3 text-sm font-semibold text-slate-900">Desde ${previewService.basePrice.toLocaleString('es-AR')}</p>
                  <div className="mt-3 space-y-2 text-sm text-slate-700">
                    {previewService.includes.slice(0, 3).map((item) => (
                      <p key={item} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">{item}</p>
                    ))}
                  </div>
                </aside>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Unidades (estimación rápida)</Label>
                <Input
                  type="number"
                  min={1}
                  max={isSingleUnitService ? 1 : 20}
                  disabled={isSingleUnitService}
                  value={summary.serviceUnits}
                  onChange={(event) => setSummary((prev) => ({ ...prev, serviceUnits: Number(event.target.value) || 1 }))}
                />
                {isSingleUnitService && (
                  <p className="mt-1 text-xs text-slate-500">Este servicio se cotiza por visita/unidad única.</p>
                )}
              </div>
              <div>
                <Label>Prioridad</Label>
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

            {selectedService?.id === 'reparacion-falla' && (
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                <Label>Mapa de falla a resolver</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {failureOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedFailureId(option.id)}
                      className={`rounded-xl border px-3 py-2 text-left text-sm ${selectedFailureId === option.id ? 'border-slate-900 bg-slate-50 font-semibold' : 'border-slate-200'}`}
                    >
                      <span className="block">{option.label}</span>
                      <span className="text-xs text-slate-500">{option.extra > 0 ? `+ $${option.extra.toLocaleString('es-AR')}` : 'Incluido'}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedService?.id === 'colocacion-artefactos' && (
              <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-2">
                <div>
                  <Label>Tipo de artefacto principal</Label>
                  <select
                    className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm"
                    value={selectedArtefactId}
                    onChange={(event) => setSelectedArtefactId(event.target.value)}
                  >
                    {artefactOptions.map((option) => (
                      <option key={option.id} value={option.id}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Cantidad estimada</Label>
                  <Input type="number" min={1} value={artefactQty} onChange={(event) => setArtefactQty(Number(event.target.value) || 1)} />
                </div>
              </div>
            )}

            {selectedService?.id === 'circuito-dedicado-aa' && (
              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                <input type="checkbox" className="mt-1" checked={includeAACanalizacion} onChange={(event) => setIncludeAACanalizacion(event.target.checked)} />
                <span>Incluir canalización completa del aire acondicionado (+$65.000 estimado).</span>
              </label>
            )}

            {selectedService?.id === 'adecuacion-tablero' && (
              <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-3">
                <div>
                  <Label>Bocas de iluminación</Label>
                  <Input type="number" min={0} value={tableroBocas} onChange={(event) => setTableroBocas(Number(event.target.value) || 0)} />
                </div>
                <div>
                  <Label>Circuitos especiales</Label>
                  <Input type="number" min={0} value={tableroCircuitosEspeciales} onChange={(event) => setTableroCircuitosEspeciales(Number(event.target.value) || 0)} />
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  <p className="font-semibold">Térmicas sugeridas iluminación</p>
                  <p className="text-xl font-semibold">{tableroThermalSuggestion}</p>
                  <p className="text-xs text-slate-500">Base: 1 cada 30 bocas.</p>
                </div>
              </div>
            )}

            {selectedService?.id === 'cambio-tomas' && (
              <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-2">
                <div>
                  <Label>Tipo de toma / tecla / llave</Label>
                  <select
                    className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm"
                    value={selectedTomaId}
                    onChange={(event) => setSelectedTomaId(event.target.value)}
                  >
                    {tomaOptions.map((option) => (
                      <option key={option.id} value={option.id}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Cantidad de puntos</Label>
                  <Input type="number" min={1} value={tomaQty} onChange={(event) => setTomaQty(Number(event.target.value) || 1)} />
                </div>
              </div>
            )}

            {selectedService?.id === 'iluminacion-interior-exterior' && (
              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                <input type="checkbox" className="mt-1" checked={isIluminacionCanalizada} onChange={(event) => setIsIluminacionCanalizada(event.target.checked)} />
                <span>Incluir canalización adicional para trazado nuevo (+$45.000 estimado).</span>
              </label>
            )}

            {selectedService && serviceDynamicExtra > 0 && (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                Ajuste estimado por configuración elegida: +${serviceDynamicExtra.toLocaleString('es-AR')}.
              </p>
            )}

            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
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

            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
              <Label>Detalle del trabajo (descripción clara)</Label>
              <Textarea
                value={detalleTrabajo}
                onChange={(event) => setDetalleTrabajo(event.target.value)}
                placeholder="Ejemplo: Se corta la luz del living al encender aire + microondas. Necesito diagnóstico y propuesta de corrección."
              />

              <div className="space-y-2">
                <Label>Adjuntar imágenes / archivos de referencia</Label>
                <Input type="file" multiple accept="image/*,.pdf" onChange={(event) => void uploadAttachments(event.target.files)} />
                {isUploading && <p className="text-xs text-slate-500">Subiendo archivos...</p>}
                {attachmentError && <p className="text-xs text-rose-600">{attachmentError}</p>}
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((item) => (
                      <div key={item.publicUrl} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
                        <a href={item.publicUrl} target="_blank" rel="noreferrer" className="font-medium text-slate-700 hover:underline">{item.originalName}</a>
                        <button type="button" onClick={() => removeAttachment(item.publicUrl)} className="text-slate-500 hover:text-slate-800">Quitar</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit rounded-3xl border-slate-200 shadow-sm lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="text-2xl">Tu resumen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed">
            <p>
              Servicio: <b>{selectedService?.name}</b>
            </p>
            <p>
              Modalidad: <b>{totals.requiresSurvey ? 'Con definición técnica previa' : 'Resolución directa'}</b>
            </p>
            <p>
              Cobertura: <b>{getZoneTierLabel(summary.zoneTier)}</b>
            </p>
            <p className="text-2xl font-semibold">Total estimado: ${estimatedTotalWithConfig.toLocaleString('es-AR')}</p>
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
              <Button onClick={submitQuote} disabled={isPending} className="h-12 w-full rounded-xl bg-slate-900 text-base font-semibold text-white hover:bg-slate-800">
                {isPending ? 'Generando propuesta...' : 'Generar propuesta y reservar'}
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
