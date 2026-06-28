'use client'

import { useMemo, useRef, useState } from 'react'
import { CheckCircle2, ClipboardList, Settings2, Store, Wrench, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  currency,
  diagnosticFaults,
  quickServices,
  type ElectricalService,
} from '@/data/electricalServices'
import { generateTechnicalSummary, type InstallationSelection } from './estimateRules'

function money(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

const pointTypes = [
  'toma común 10A',
  'toma 20A',
  'toma para aire acondicionado',
  'punto de iluminación',
  'llave de luz',
  'circuito dedicado',
  'tablero / protección',
]
const installationTypes = [
  'sobre punto existente',
  'sobre cañería existente',
  'exterior con caño/cablecanal',
  'embutida con canalización ya hecha',
  'embutida completa',
  'solo cableado y conexionado',
]
const distances = ['hasta 3 m', '3 a 6 m', '6 a 10 m', 'más de 10 m']
const propertyTypes = [
  'departamento',
  'casa',
  'local comercial',
  'oficina',
  'consorcio',
  'country / barrio privado',
]
const urgencies = ['normal', 'prioritaria', 'fuera de horario']

const entryCards = [
  {
    id: 'servicios-rapidos',
    title: 'Servicios rápidos',
    text: 'Reemplazos simples sobre puntos existentes.',
    Icon: Wrench,
  },
  {
    id: 'instalaciones-configurables',
    title: 'Instalaciones configurables',
    text: 'Nuevos puntos, recorridos, canalización o circuito.',
    Icon: Settings2,
  },
  {
    id: 'diagnostico-de-fallas',
    title: 'Diagnóstico de fallas',
    text: 'Búsqueda técnica de problemas eléctricos.',
    Icon: ClipboardList,
  },
  {
    id: 'comercios-consorcios',
    title: 'Comercios / consorcios / barrios privados',
    text: 'Pedidos repetitivos, acceso, horarios y autorizaciones.',
    Icon: Store,
  },
]

const commercialRequestServices = [
  {
    id: 'cambio-lamparas-comercio',
    title: 'Cambio de lámparas en comercio',
    description: 'Recambio de lámparas o tubos sobre luminarias existentes en espacios operativos.',
    quoteNeeds:
      'Cantidad de luminarias, altura aproximada, tipo de espacio, horario, materiales y fotos.',
    access:
      'Requiere ingreso autorizado, sector despejado y validación de escalera o medio de acceso.',
    configurable: true,
  },
  {
    id: 'mantenimiento-luminarias',
    title: 'Mantenimiento de luminarias',
    description:
      'Recambio, revisión y puesta en servicio de luminarias en local, oficina o áreas comunes.',
    quoteNeeds: 'Cantidad, altura, tipo de artefacto, fotos del espacio y horario disponible.',
    access: 'Requiere acceso autorizado, corte coordinado si corresponde y responsable presente.',
  },
  {
    id: 'revision-tablero-local',
    title: 'Revisión de tablero de local',
    description:
      'Control visual y funcional de protecciones, conexiones, recalentamientos y orden básico.',
    quoteNeeds:
      'Fotos del tablero abierto/cerrado, síntomas, potencia de equipos y horarios posibles.',
    access:
      'Puede requerir corte parcial, autorización del local/administración y sector despejado.',
  },
  {
    id: 'tomas-mostrador-equipos',
    title: 'Tomas para mostrador/equipos',
    description:
      'Solicitud para nuevos tomas o adecuación de puntos para equipos de atención o producción.',
    quoteNeeds: 'Cantidad, consumo de equipos, distancia al tablero, recorrido posible y fotos.',
    access: 'Se valida canalización, interferencias, horarios y permisos del inmueble.',
  },
  {
    id: 'urgencia-fuera-horario',
    title: 'Urgencia fuera de horario',
    description:
      'Atención prioritaria para comercios que no pueden frenar operación en horario normal.',
    quoteNeeds: 'Síntoma, criticidad, dirección, contacto responsable y fotos/videos si existen.',
    access:
      'Sujeto a disponibilidad, seguridad de acceso y aprobación previa del adicional horario.',
  },
  {
    id: 'preventivo-mensual',
    title: 'Mantenimiento preventivo mensual',
    description:
      'Rutina mensual para revisar luminarias, tableros, tomas críticos y puntos reportados.',
    quoteNeeds:
      'Superficie, cantidad de sectores, frecuencia, horarios y listado de equipos críticos.',
    access: 'Requiere referente operativo, permiso de ingreso y agenda recurrente aprobada.',
  },
  {
    id: 'trabajo-consorcio',
    title: 'Trabajo en consorcio',
    description:
      'Pedidos para espacios comunes, tableros, luminarias, bombas o sectores compartidos.',
    quoteNeeds: 'Autorización, alcance, fotos, ubicación de llaves/tableros y horario permitido.',
    access:
      'Debe coordinarse con administración, encargado o consejo; materiales no incluidos salvo acuerdo.',
  },
  {
    id: 'trabajo-country',
    title: 'Trabajo en country / barrio privado',
    description:
      'Solicitudes con ingreso controlado, autorización previa y coordinación de acceso.',
    quoteNeeds: 'Lote/unidad, autorización de ingreso, contacto de seguridad, fotos y alcance.',
    access: 'Sujeto a ingreso aprobado, documentación requerida, zona y ventana horaria.',
  },
]

const commercialSpaces = ['local', 'oficina', 'depósito', 'galería', 'consorcio', 'country']
const commercialSchedules = ['normal', 'fuera de horario']
const commercialMaterials = ['aporta cliente', 'cotiza NERIN']
const ladderOptions = ['sí', 'no', 'no sé']

type RequestItem = { id: string; title: string; quantity: number; labor: number; note: string }

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <label className="space-y-2 text-sm font-semibold text-slate-800">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{title}</p>
      <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  )
}

function StatusPill({ children }: { children: string }) {
  return (
    <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-amber-900">
      {children}
    </span>
  )
}

export function SmallJobsExperience() {
  const [activeMode, setActiveMode] = useState(entryCards[0].id)
  const [openService, setOpenService] = useState<string | null>(quickServices[0]?.id ?? null)
  const [addedLabel, setAddedLabel] = useState<string | null>(null)
  const solicitudRef = useRef<HTMLElement | null>(null)
  const [items, setItems] = useState<RequestItem[]>([])
  const [sent, setSent] = useState(false)
  const [selection, setSelection] = useState<InstallationSelection>({
    pointType: pointTypes[0],
    quantity: 1,
    installationType: installationTypes[1],
    distance: distances[0],
    propertyType: propertyTypes[0],
    urgency: urgencies[0],
  })
  const [commercialConfig, setCommercialConfig] = useState({
    quantity: 4,
    height: 'hasta 3 m',
    spaceType: commercialSpaces[0],
    schedule: commercialSchedules[0],
    materials: commercialMaterials[0],
    ladder: ladderOptions[2],
    observations: '',
  })
  const estimate = useMemo(() => generateTechnicalSummary(selection), [selection])
  const subtotal = items.reduce((acc, item) => acc + item.labor * item.quantity, 0)

  function addService(service: ElectricalService) {
    setItems((current) => [
      ...current,
      {
        id: `${service.id}-${Date.now()}`,
        title: service.title,
        quantity: 1,
        labor: service.baseLaborPrice,
        note: service.materialPolicy,
      },
    ])
    setAddedLabel(service.title)
    setSent(false)
  }

  function addRequestItem(item: Omit<RequestItem, 'id'>, prefix: string) {
    setItems((current) => [...current, { ...item, id: `${prefix}-${Date.now()}` }])
    setAddedLabel(item.title)
    setSent(false)
  }

  function openSolicitud() {
    solicitudRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function addConfigurable() {
    addRequestItem(
      {
        title: estimate.workType,
        quantity: 1,
        labor: estimate.labor,
        note: 'Instalación configurable · estimado pendiente de validación técnica',
      },
      'config',
    )
  }

  function addCommercialLampConfig() {
    addRequestItem(
      {
        title: 'Cambio de lámparas en comercio',
        quantity: Number(commercialConfig.quantity) || 1,
        labor: 0,
        note: `Cotizar: ${commercialConfig.height}, ${commercialConfig.spaceType}, ${commercialConfig.schedule}, materiales: ${commercialConfig.materials}, escalera especial: ${commercialConfig.ladder}. ${commercialConfig.observations}`.trim(),
      },
      'comercial-lamparas',
    )
  }

  return (
    <div className="bg-white pb-20 lg:pb-0">
      <button
        type="button"
        onClick={openSolicitud}
        className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-2xl lg:hidden"
      >
        <span>Solicitud · {items.length} servicios</span>
        <span>{subtotal ? money(subtotal) : 'Ver resumen'}</span>
      </button>

      <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50 via-white to-white py-9 sm:py-14">
        <div className="container max-w-6xl">
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
              NERIN Electricidad · Solicitud técnica
            </p>
            <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Pedí un servicio eléctrico con alcance claro.
            </h1>
            <p className="mt-5 max-w-3xl text-pretty text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Elegí un trabajo estándar, configurá una instalación o solicitá diagnóstico. Te
              mostramos mano de obra, materiales habituales, tiempos estimados y condiciones antes
              de enviar la solicitud.
            </p>
          </div>

          <div className="mt-6 grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Materiales
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-950">
                No incluidos salvo aclaración.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Estado</p>
              <p className="mt-1 text-sm font-semibold text-slate-950">
                Pendiente de validación técnica.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Validación
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-950">
                Zona, fotos, agenda y alcance real.
              </p>
            </div>
          </div>

          <p className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-sm leading-6 text-slate-700">
            Los valores publicados corresponden a mano de obra base o estimaciones para alcances
            estándar. No incluyen materiales salvo que se indique lo contrario. Toda solicitud queda
            sujeta a validación por zona, fotos, disponibilidad y estado real de la instalación.
          </p>

          <div
            className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            role="tablist"
            aria-label="Elegir tipo de solicitud"
          >
            {entryCards.map(({ id, title, text, Icon }) => {
              const active = activeMode === id
              return (
                <button
                  type="button"
                  key={title}
                  onClick={() => setActiveMode(id)}
                  className={`group rounded-3xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 sm:p-5 ${active ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-950 hover:border-slate-300 hover:shadow-md'}`}
                  role="tab"
                  aria-selected={active}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-2xl p-2 ${active ? 'bg-white text-slate-950' : 'bg-slate-950 text-white'}`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="font-semibold leading-snug">{title}</p>
                  </div>
                  <p
                    className={`mt-3 text-sm leading-6 ${active ? 'text-slate-200' : 'text-slate-600'}`}
                  >
                    {text}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 py-3 backdrop-blur">
        <div className="container flex max-w-6xl gap-2 overflow-x-auto">
          {entryCards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => setActiveMode(card.id)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold ${activeMode === card.id ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-700'}`}
            >
              {card.title}
            </button>
          ))}
        </div>
      </div>

      {addedLabel ? (
        <div className="container max-w-6xl pt-5">
          <div className="flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950 sm:flex-row sm:items-center sm:justify-between">
            <b>Agregado a solicitud: {addedLabel}</b>
            <Button type="button" onClick={openSolicitud} className="min-h-11">
              Ver solicitud
            </Button>
          </div>
        </div>
      ) : null}

      {activeMode === 'servicios-rapidos' ? (
        <section id="servicios-rapidos" className="container max-w-6xl py-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                Catálogo
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">Servicios rápidos</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500">
              Primero ves alcance, mano de obra, duración y materiales. El detalle queda
              desplegable.
            </p>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {quickServices.map((service) => (
              <article
                key={service.id}
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                      {service.category}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-950">{service.title}</h3>
                  </div>
                  <div className="shrink-0 rounded-2xl bg-slate-50 px-3 py-2 text-right">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                      Mano de obra
                    </p>
                    <p className="text-sm font-semibold text-slate-950">
                      {money(service.baseLaborPrice)}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{service.description}</p>
                <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
                  <p className="rounded-2xl bg-slate-50 p-3">
                    <b className="text-slate-950">Duración</b>
                    <br />
                    {service.durationMin} a {service.durationMax} min
                  </p>
                  <p className="rounded-2xl bg-slate-50 p-3 sm:col-span-2">
                    <b className="text-slate-950">Materiales</b>
                    <br />
                    {service.materialPolicy}
                  </p>
                </div>
                <details
                  className="mt-4 rounded-2xl border border-slate-200 bg-white p-4"
                  open={openService === service.id}
                  onToggle={(event) => {
                    if (event.currentTarget.open) setOpenService(service.id)
                  }}
                >
                  <summary className="cursor-pointer text-sm font-semibold text-slate-950">
                    Ver detalle
                  </summary>
                  <div className="mt-5 grid gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2">
                    <DetailList title="Qué incluye" items={service.includes} />
                    <DetailList title="Qué no incluye" items={service.excludes} />
                    <DetailList title="Materiales habituales" items={service.usualMaterials} />
                    <DetailList title="Cuándo cambia el precio" items={service.priceModifiers} />
                    <p className="text-sm leading-6 text-slate-600">
                      <b>Aplica si:</b> {service.appliesWhen}
                    </p>
                    <p className="text-sm leading-6 text-slate-600">
                      <b>NO aplica si:</b> {service.doesNotApplyWhen}
                    </p>
                  </div>
                </details>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Button onClick={() => addService(service)} className="min-h-12 w-full">
                    Agregar a solicitud
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenService(openService === service.id ? null : service.id)}
                    className="min-h-12 w-full"
                  >
                    Ver detalle
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeMode === 'instalaciones-configurables' ? (
        <section
          id="instalaciones-configurables"
          className="border-y border-slate-200 bg-slate-50 py-10"
        >
          <div className="container grid max-w-6xl gap-6 lg:grid-cols-[1fr_0.85fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                Configurador básico
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                Configurá tu instalación
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Es una herramienta de estimación inicial. No promete cálculo exacto: ayuda a ordenar
                el pedido antes de revisión técnica.
              </p>
              <div className="mt-6 space-y-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <fieldset>
                  <legend className="text-sm font-bold text-slate-950">1. Qué necesitás</legend>
                  <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_140px]">
                    <SelectField
                      label="Tipo de punto"
                      value={selection.pointType}
                      options={pointTypes}
                      onChange={(pointType) => setSelection({ ...selection, pointType })}
                    />
                    <label className="space-y-2 text-sm font-semibold text-slate-800">
                      <span>Cantidad</span>
                      <Input
                        className="h-12"
                        type="number"
                        min={1}
                        value={selection.quantity}
                        onChange={(e) =>
                          setSelection({ ...selection, quantity: Number(e.target.value) })
                        }
                      />
                    </label>
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="text-sm font-bold text-slate-950">
                    2. Alcance y recorrido
                  </legend>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <SelectField
                      label="Tipo de instalación"
                      value={selection.installationType}
                      options={installationTypes}
                      onChange={(installationType) =>
                        setSelection({ ...selection, installationType })
                      }
                    />
                    <SelectField
                      label="Distancia aproximada"
                      value={selection.distance}
                      options={distances}
                      onChange={(distance) => setSelection({ ...selection, distance })}
                    />
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="text-sm font-bold text-slate-950">
                    3. Contexto operativo
                  </legend>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <SelectField
                      label="Tipo de propiedad"
                      value={selection.propertyType}
                      options={propertyTypes}
                      onChange={(propertyType) => setSelection({ ...selection, propertyType })}
                    />
                    <SelectField
                      label="Urgencia"
                      value={selection.urgency}
                      options={urgencies}
                      onChange={(urgency) => setSelection({ ...selection, urgency })}
                    />
                  </div>
                </fieldset>
              </div>
            </div>
            <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:self-start">
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill>Estimado</StatusPill>
                <StatusPill>Pendiente de validación técnica</StatusPill>
              </div>
              <h3 className="mt-4 text-3xl font-semibold text-slate-950">
                {money(estimate.labor)}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {estimate.quantity} punto(s) · {estimate.workType}
              </p>
              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <DetailList title="Materiales habituales" items={estimate.materials} />
              </div>
              <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-1">
                <p>
                  <b>Duración:</b> {estimate.duration}
                </p>
                <p>
                  <b>Puede requerir visita:</b>{' '}
                  {estimate.requiresVisit ? 'sí' : 'según fotos y alcance'}
                </p>
                <p>
                  <b>Fotos:</b> sí, para validar recorrido y estado existente.
                </p>
              </div>
              <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm leading-6 text-amber-950">
                Estimación para alcances estándar. Puede ajustarse por zona, acceso, estado real,
                materiales, recorrido o disponibilidad.
              </p>
              <Button onClick={addConfigurable} className="mt-4 min-h-12 w-full">
                Agregar a solicitud
              </Button>
            </aside>
          </div>
        </section>
      ) : null}

      {activeMode === 'diagnostico-de-fallas' ? (
        <section id="diagnostico-de-fallas" className="container max-w-6xl py-10">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
              Diagnóstico de fallas
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">
              Tiempo técnico para encontrar el problema.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              El diagnóstico ordena síntomas, pruebas y próximos pasos. Cobra el tiempo técnico de
              revisión; no promete una solución definitiva si la falla es oculta o intermitente.
            </p>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <b>Diagnóstico básico</b>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Incluye hasta 90 minutos de revisión inicial. Si la falla se detecta y la reparación
                es simple, se informa el costo antes de avanzar. Si requiere más tiempo, se solicita
                aprobación previa.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <b>Diagnóstico avanzado</b>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Pensado para fallas ocultas, intermitentes, instalaciones desordenadas o casos donde
                ya revisaron otros técnicos. Incluye una primera etapa de búsqueda técnica y
                propuesta de próximos pasos.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
              <b>Horas adicionales</b>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Las horas adicionales nunca se continúan sin aprobación del cliente.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            {diagnosticFaults.map((fault) => (
              <details key={fault.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-950 sm:text-base">
                  {fault.faultName} · diagnóstico inicial {money(fault.initialPrice)}
                </summary>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <DetailList title="Posibles causas" items={fault.possibleCauses} />
                  <DetailList title="Pruebas habituales" items={fault.usualTests} />
                  <DetailList title="Soluciones posibles" items={fault.possibleSolutions} />
                  <DetailList
                    title="Puede requerir más tiempo"
                    items={fault.advancedRequiredWhen}
                  />
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Incluye {fault.includedMinutes} minutos. {fault.extraHourPolicy}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{fault.disclaimer}</p>
                <Button
                  onClick={() =>
                    addRequestItem(
                      {
                        title: `Diagnóstico: ${fault.faultName}`,
                        quantity: 1,
                        labor: fault.initialPrice,
                        note: 'Diagnóstico inicial con aprobación previa para adicionales',
                      },
                      fault.id,
                    )
                  }
                  className="mt-4 min-h-12 w-full sm:w-auto"
                >
                  Pedir revisión técnica
                </Button>
              </details>
            ))}
          </div>
          <p className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            El valor del diagnóstico corresponde al tiempo técnico de revisión y a las pruebas
            realizadas. Si no se logra confirmar una solución definitiva en el tiempo contratado, se
            entrega un resumen con sectores revisados, hipótesis probable y próximos pasos
            recomendados.
          </p>
        </section>
      ) : null}

      {activeMode === 'comercios-consorcios' ? (
        <section
          id="comercios-consorcios"
          className="border-y border-slate-200 bg-slate-950 py-10 text-white"
        >
          <div className="container max-w-6xl">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                  Comercios, consorcios y barrios privados
                </p>
                <h2 className="mt-2 text-3xl font-semibold">
                  Pedidos con acceso, horarios y coordinación.
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Para locales, oficinas, depósitos, galerías, consorcios y barrios privados donde
                  importan cantidad, altura, autorizaciones, materiales y horarios fuera de
                  atención.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                  <b>Qué se necesita para cotizar</b>
                  <p className="mt-2 leading-6">
                    Fotos, cantidades, horarios posibles, responsable de acceso y autorización del
                    lugar.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                  <b>Condiciones</b>
                  <p className="mt-2 leading-6">
                    Materiales no incluidos salvo acuerdo. Todo queda sujeto a zona, agenda, alcance
                    y permisos.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {commercialRequestServices.map((service) => (
                <article
                  key={service.id}
                  className="rounded-3xl border border-white/10 bg-white p-5 text-slate-950 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                        Servicio comercial
                      </p>
                      <h3 className="mt-2 text-xl font-semibold">{service.title}</h3>
                    </div>
                    {service.configurable ? <StatusPill>Configurable</StatusPill> : null}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{service.description}</p>
                  <div className="mt-4 grid gap-3 text-sm text-slate-600">
                    <p className="rounded-2xl bg-slate-50 p-3">
                      <b className="text-slate-950">Qué se necesita para cotizar:</b>
                      <br />
                      {service.quoteNeeds}
                    </p>
                    <p className="rounded-2xl bg-slate-50 p-3">
                      <b className="text-slate-950">Acceso / autorización:</b>
                      <br />
                      {service.access}
                    </p>
                    <p className="rounded-2xl bg-slate-50 p-3">
                      <b className="text-slate-950">Materiales:</b>
                      <br />
                      No incluidos salvo acuerdo previo.
                    </p>
                  </div>
                  {!service.configurable ? (
                    <Button
                      type="button"
                      onClick={() =>
                        addRequestItem(
                          {
                            title: service.title,
                            quantity: 1,
                            labor: 0,
                            note: `${service.quoteNeeds} Materiales no incluidos salvo acuerdo.`,
                          },
                          service.id,
                        )
                      }
                      className="mt-4 min-h-12 w-full"
                    >
                      Agregar a solicitud
                    </Button>
                  ) : null}
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-3xl bg-white p-5 text-slate-950">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                    Mini configurador comercial
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">Cambio de lámparas en comercio</h3>
                </div>
                <StatusPill>Pendiente de cotización</StatusPill>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <label className="space-y-2 text-sm font-semibold text-slate-800">
                  <span>Cantidad de luminarias</span>
                  <Input
                    className="h-12"
                    type="number"
                    min={1}
                    value={commercialConfig.quantity}
                    onChange={(e) =>
                      setCommercialConfig({ ...commercialConfig, quantity: Number(e.target.value) })
                    }
                  />
                </label>
                <SelectField
                  label="Altura aproximada"
                  value={commercialConfig.height}
                  options={['hasta 3 m', '3 a 5 m', 'más de 5 m', 'no sé']}
                  onChange={(height) => setCommercialConfig({ ...commercialConfig, height })}
                />
                <SelectField
                  label="Tipo de espacio"
                  value={commercialConfig.spaceType}
                  options={commercialSpaces}
                  onChange={(spaceType) => setCommercialConfig({ ...commercialConfig, spaceType })}
                />
                <SelectField
                  label="Horario"
                  value={commercialConfig.schedule}
                  options={commercialSchedules}
                  onChange={(schedule) => setCommercialConfig({ ...commercialConfig, schedule })}
                />
                <SelectField
                  label="Materiales"
                  value={commercialConfig.materials}
                  options={commercialMaterials}
                  onChange={(materials) => setCommercialConfig({ ...commercialConfig, materials })}
                />
                <SelectField
                  label="Requiere escalera especial"
                  value={commercialConfig.ladder}
                  options={ladderOptions}
                  onChange={(ladder) => setCommercialConfig({ ...commercialConfig, ladder })}
                />
                <Textarea
                  className="min-h-24 sm:col-span-2 lg:col-span-3"
                  placeholder="Observaciones"
                  value={commercialConfig.observations}
                  onChange={(e) =>
                    setCommercialConfig({ ...commercialConfig, observations: e.target.value })
                  }
                />
              </div>
              <Button
                type="button"
                onClick={addCommercialLampConfig}
                className="mt-5 min-h-12 w-full sm:w-auto"
              >
                Agregar configuración a solicitud
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      <section
        ref={solicitudRef}
        id="solicitud"
        className="container grid max-w-6xl gap-6 py-10 lg:grid-cols-[0.9fr_1.1fr]"
      >
        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Resumen
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">Solicitud</h2>
            </div>
            <StatusPill>Pendiente</StatusPill>
          </div>
          {items.length === 0 ? (
            <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">
              Agregá servicios para ver el subtotal estimado y preparar el pedido.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-2xl bg-slate-50 p-3">
                  <div className="flex justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                    <button
                      type="button"
                      onClick={() => setItems(items.filter((entry) => entry.id !== item.id))}
                      aria-label="Eliminar"
                      className="rounded-full p-1 text-slate-500 hover:bg-white hover:text-slate-950"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Input
                      className="h-10 w-20"
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        setItems(
                          items.map((entry) =>
                            entry.id === item.id
                              ? { ...entry, quantity: Number(e.target.value) }
                              : entry,
                          ),
                        )
                      }
                    />
                    <span className="text-sm text-slate-600">
                      {item.labor
                        ? `${money(item.labor)} mano de obra base`
                        : 'A cotizar según alcance'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{item.note}</p>
                </div>
              ))}
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-lg font-semibold text-slate-950">
                  Subtotal estimado: {money(subtotal)}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Materiales: no incluidos o estimados según ficha. Estado: pendiente de validación
                  técnica. Sujeto a aprobación por zona, fotos, agenda y alcance real.
                </p>
              </div>
            </div>
          )}
        </aside>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setSent(true)
          }}
          className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
        >
          <h2 className="text-2xl font-semibold text-slate-950">Enviar solicitud</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            NERIN Instalaciones Eléctricas revisa zona, fotos, disponibilidad, alcance y estado de
            la instalación antes de confirmar.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Input className="h-12" required placeholder="Nombre" />
            <Input className="h-12" required placeholder="Teléfono" />
            <Input className="h-12" type="email" placeholder="Email opcional" />
            <Input className="h-12" required placeholder="Dirección / zona" />
            <SelectField
              label="Tipo de propiedad"
              value={selection.propertyType}
              options={propertyTypes}
              onChange={(propertyType) => setSelection({ ...selection, propertyType })}
            />
            <Input className="h-12" placeholder="Disponibilidad horaria" />
            <Input type="file" multiple className="h-12 pt-3 sm:col-span-2" />
            <Textarea className="min-h-28 sm:col-span-2" placeholder="Observaciones" />
          </div>
          <Button className="mt-5 min-h-12 w-full" size="lg" disabled={items.length === 0}>
            Enviar solicitud
          </Button>
          {sent ? (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
              <CheckCircle2 className="mb-2 h-5 w-5" />
              <b>Solicitud enviada. Pendiente de aprobación por NERIN.</b>
              <p>
                Vamos a revisar zona, fotos, disponibilidad, alcance y estado de la instalación.
                Luego confirmamos si el servicio puede realizarse con el valor estimado, si requiere
                ajuste o si corresponde una visita técnica previa.
              </p>
            </div>
          ) : null}
          <a
            className="mt-4 inline-flex text-sm font-semibold text-slate-950"
            href={`https://wa.me/?text=${encodeURIComponent(`Solicitud NERIN Instalaciones Eléctricas\nSubtotal estimado: ${money(subtotal)}\n${items.map((item) => `- ${item.title} x${item.quantity}`).join('\n')}`)}`}
          >
            Generar resumen para WhatsApp
          </a>
        </form>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-8">
        <div className="container max-w-6xl space-y-3 text-sm leading-6 text-slate-600">
          <p>
            Todos los valores son orientativos o base para alcances estándar. No incluyen materiales
            salvo indicación expresa. La solicitud no implica confirmación automática del servicio.
            NERIN puede confirmar, ajustar o rechazar la solicitud según zona, agenda, fotos
            recibidas, condiciones de acceso, estado de la instalación y alcance real.
          </p>
          <p className="font-semibold text-slate-950">
            Nunca se realizan trabajos adicionales ni se continúan horas extra sin aprobación previa
            del cliente.
          </p>
        </div>
      </section>
    </div>
  )
}
