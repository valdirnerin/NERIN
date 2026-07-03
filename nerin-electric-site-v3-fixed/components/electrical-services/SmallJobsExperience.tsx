'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  ImagePlus,
  Info,
  Pencil,
  Settings2,
  Store,
  Wrench,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  currency,
  diagnosticFaults,
  quickServices,
  type ElectricalService,
} from '@/data/electricalServices'
import {
  visualGuidesByServiceId,
  type ElectricalServiceVisualGuide,
} from '@/data/electricalServiceVisualGuides'
import type { ElectricalAdminContent } from '@/lib/electrical-admin-content'
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

const commercialSpaces = [
  'local',
  'oficina',
  'depósito',
  'galería',
  'consorcio',
  'country',
  'barrio privado',
]
const commercialSchedules = [
  'horario comercial',
  'antes de apertura',
  'después del cierre',
  'fuera de horario',
]
const commercialMaterials = ['aporta cliente', 'cotiza NERIN', 'a definir']
const ladderOptions = ['sí', 'no', 'no sé']

type RequestKind = 'quick' | 'installation' | 'diagnostic' | 'commercial'
type ConfigQuestion = { label: string; options?: string[]; multiline?: boolean }
type WizardDraft = {
  kind: RequestKind
  sourceId: string
  title: string
  labor: number
  quantity: number
  questions: ConfigQuestion[]
  answers: Record<string, string>
  alert?: string
}
type RequestItem = {
  id: string
  title: string
  quantity: number
  labor: number
  note: string
  kind: RequestKind
  details: string[]
  materials: string
  photos: string
  validation: string
  alert?: string
  sourceId?: string
}

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

function RadioGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value?: string
  onChange?: (value: string) => void
}) {
  return (
    <fieldset className="rounded-2xl border border-slate-200 bg-white p-4">
      <legend className="px-1 text-sm font-bold text-slate-950">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option, index) => (
          <label
            key={option}
            className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 has-[:checked]:border-slate-950 has-[:checked]:bg-slate-950 has-[:checked]:text-white"
          >
            <input
              type="radio"
              name={label}
              checked={(value ?? options[0]) === option}
              onChange={() => onChange?.(option)}
              className="sr-only"
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function getQuickQuestions(service: ElectricalService): ConfigQuestion[] {
  if (service.id === 'cambio-tomacorriente-existente')
    return [
      { label: '¿El punto eléctrico ya existe?', options: ['sí', 'no', 'no sé'] },
      {
        label: '¿Qué querés hacer?',
        options: ['reemplazo por estética', 'toma flojo', 'toma quemado', 'falso contacto', 'otro'],
      },
      {
        label: '¿Hay daño visible?',
        options: ['no', 'caja rota', 'cables quemados', 'tapa rota', 'no sé'],
      },
      {
        label: '¿Qué material querés?',
        options: ['lo aporta el cliente', 'cotiza NERIN', 'a definir'],
      },
      { label: '¿Tenés foto del toma y del tablero?', options: ['sí', 'no', 'puedo sacarla'] },
      { label: 'Observaciones del punto', multiline: true },
    ]
  if (service.id === 'cambio-llave-luz')
    return [
      { label: '¿La llave ya existe?', options: ['sí', 'no', 'no sé'] },
      {
        label: '¿Es simple, combinación, escalera o no sabés?',
        options: ['simple', 'combinación', 'escalera', 'no sé'],
      },
      {
        label: '¿El problema es estético, falso contacto o no enciende?',
        options: ['estético', 'falso contacto', 'no enciende', 'otro'],
      },
      {
        label: 'Material cliente / cotiza NERIN / a definir',
        options: ['cliente', 'cotiza NERIN', 'a definir'],
      },
      { label: 'Foto del punto y tablero', options: ['sí', 'no', 'puedo sacarla'] },
    ]
  if (service.id === 'instalacion-luminaria-punto-existente')
    return [
      { label: '¿Ya existe boca de iluminación?', options: ['sí', 'no', 'no sé'] },
      { label: 'Altura aproximada', options: ['hasta 3 m', '3 a 5 m', 'más de 5 m', 'no sé'] },
      { label: '¿La luminaria la aporta el cliente?', options: ['sí', 'no', 'a definir'] },
      { label: '¿Es pesada o común?', options: ['común', 'pesada', 'no sé'] },
      { label: '¿Requiere armado?', options: ['sí', 'no', 'no sé'] },
      {
        label: 'Techo de losa, durlock, madera u otro',
        options: ['losa', 'durlock', 'madera', 'otro', 'no sé'],
      },
      { label: 'Foto del punto', options: ['sí', 'no', 'puedo sacarla'] },
    ]
  if (service.id === 'cambio-termica' || service.id === 'cambio-disyuntor')
    return [
      { label: '¿La protección ya existe en tablero?', options: ['sí', 'no', 'no sé'] },
      {
        label: '¿Querés reemplazo por falla o por actualización?',
        options: ['falla', 'actualización', 'no sé'],
      },
      {
        label: '¿La térmica/disyuntor salta actualmente?',
        options: ['sí', 'no', 'a veces', 'no sé'],
      },
      {
        label: '¿Hay olor, calor, cables recalentados o daño visible?',
        options: ['no', 'olor', 'calor', 'cables recalentados', 'daño visible', 'no sé'],
      },
      { label: '¿Tenés foto del tablero abierto/cerrado?', options: ['sí', 'no', 'puedo sacarla'] },
    ]
  return [
    { label: '¿El punto o tablero ya existe?', options: ['sí', 'no', 'no sé'] },
    { label: 'Motivo del pedido', options: ['reemplazo', 'falla', 'mejora', 'revisión', 'otro'] },
    { label: 'Materiales', options: ['cliente', 'cotiza NERIN', 'a definir'] },
    { label: 'Fotos disponibles', options: ['sí', 'no', 'puedo sacarlas'] },
    { label: 'Observaciones', multiline: true },
  ]
}

function getDiagnosticQuestions(faultName: string): ConfigQuestion[] {
  return [
    { label: '¿Qué problema ocurre?', options: [faultName, 'otro síntoma relacionado'] },
    {
      label: '¿Qué protección salta?',
      options: ['disyuntor', 'térmica', 'ambas', 'ninguna', 'no sé'],
    },
    {
      label: '¿Cuándo ocurre?',
      options: [
        'siempre',
        'a veces',
        'al prender algo',
        'con lluvia o humedad',
        'sin patrón',
        'no sé',
      ],
    },
    { label: '¿Es permanente o intermitente?', options: ['permanente', 'intermitente', 'no sé'] },
    { label: '¿Ya vino otro electricista?', options: ['sí', 'no'] },
    {
      label: '¿Hay olor a quemado, chispas, calor o ruido?',
      options: ['no', 'olor', 'chispas', 'calor', 'ruido', 'no sé'],
    },
    { label: '¿Qué sectores afecta?', multiline: true },
    { label: '¿Tenés foto/video del problema?', options: ['sí', 'no', 'puedo sacarlo'] },
  ]
}

function getCommercialQuestions(title: string): ConfigQuestion[] {
  if (title === 'Cambio de lámparas en comercio')
    return [
      { label: 'Cantidad de luminarias', multiline: true },
      {
        label: 'Tipo de luminaria si lo sabe',
        options: ['LED', 'tubo', 'spot', 'campana', 'no sé', 'otro'],
      },
      { label: 'Altura', options: ['hasta 3 m', '3 a 5 m', 'más de 5 m', 'no sé'] },
      { label: 'Tipo de espacio', options: commercialSpaces },
      { label: 'Horario de trabajo', options: commercialSchedules },
      { label: 'Materiales: cliente / cotiza NERIN / a definir', options: commercialMaterials },
      { label: 'Requiere escalera especial', options: ['sí', 'no', 'no sé'] },
      {
        label: 'Requiere autorización de administración/seguridad/encargado',
        options: ['sí', 'no', 'no sé'],
      },
      { label: 'Fecha tentativa', multiline: true },
      { label: 'Observaciones', multiline: true },
    ]
  if (title.includes('country') || title.includes('barrio privado'))
    return [
      { label: 'Barrio/zona', multiline: true },
      { label: 'Acceso por seguridad', options: ['sí', 'no', 'no sé'] },
      { label: 'Requiere autorización previa', options: ['sí', 'no', 'no sé'] },
      { label: 'Horarios permitidos', multiline: true },
      { label: 'Datos de lote/unidad si querés ponerlo', multiline: true },
      { label: 'Tipo de trabajo', multiline: true },
      { label: 'Hay reglamento/condiciones de ingreso', options: ['sí', 'no', 'no sé'] },
    ]
  return [
    { label: 'Tipo de trabajo', multiline: true },
    { label: 'Cantidad o alcance estimado', multiline: true },
    { label: 'Tipo de espacio', options: commercialSpaces },
    { label: 'Horario de trabajo', options: commercialSchedules },
    { label: 'Materiales', options: commercialMaterials },
    {
      label: 'Requiere autorización de administración/seguridad/encargado',
      options: ['sí', 'no', 'no sé'],
    },
    { label: 'Fecha tentativa', multiline: true },
    { label: 'Observaciones', multiline: true },
  ]
}

function RequestStep({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{eyebrow}</p>
      <h3 className="mt-1 text-xl font-semibold text-slate-950">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  )
}

const wizardGroupOrder = ['Alcance', 'Estado del punto', 'Materiales y fotos', 'Observaciones']

function getWizardQuestionGroup(question: ConfigQuestion) {
  const label = question.label.toLowerCase()
  if (label.includes('observaciones') || label.includes('fecha tentativa')) return 'Observaciones'
  if (
    label.includes('material') ||
    label.includes('foto') ||
    label.includes('luminaria la aporta') ||
    label.includes('archivo')
  ) {
    return 'Materiales y fotos'
  }
  if (
    label.includes('existe') ||
    label.includes('daño') ||
    label.includes('falla') ||
    label.includes('salta') ||
    label.includes('olor') ||
    label.includes('calor') ||
    label.includes('protección') ||
    label.includes('problema') ||
    label.includes('permanente') ||
    label.includes('intermitente') ||
    label.includes('techo') ||
    label.includes('pesada') ||
    label.includes('armado')
  ) {
    return 'Estado del punto'
  }
  return 'Alcance'
}

function getWizardQuestionGroups(questions: ConfigQuestion[]) {
  return wizardGroupOrder
    .map((title) => ({
      title,
      questions: questions.filter((question) => getWizardQuestionGroup(question) === title),
    }))
    .filter((group) => group.questions.length > 0)
}

type VisualGuide = ElectricalServiceVisualGuide['visualGuide']

function ServiceGuideImage({
  guide,
  title,
  large = false,
}: {
  guide?: VisualGuide
  title: string
  large?: boolean
}) {
  const [failed, setFailed] = useState(false)
  const showImage = guide?.imageSrc && !failed

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/60 ${large ? 'min-h-[280px]' : 'min-h-[210px]'}`}
    >
      {showImage ? (
        <img
          src={guide.imageSrc}
          alt={guide.imageAlt}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="flex min-h-[inherit] flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-blue-100 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-900 shadow-sm">
              NERIN guía visual
            </span>
            <span className="rounded-full bg-slate-950 p-2 text-white">
              <Info className="h-4 w-4" />
            </span>
          </div>
          <div className="mx-auto my-4 w-full max-w-[260px] rounded-2xl border border-slate-300 bg-white/75 p-5 shadow-sm">
            <div className="h-24 rounded-2xl border-2 border-dashed border-blue-200 bg-[linear-gradient(135deg,rgba(37,99,235,0.10)_25%,transparent_25%,transparent_50%,rgba(37,99,235,0.10)_50%,rgba(37,99,235,0.10)_75%,transparent_75%,transparent)] bg-[length:22px_22px]" />
            <div className="mt-4 flex items-center gap-3 text-slate-500">
              <span className="h-px flex-1 bg-slate-300" />
              <span className="h-3 w-3 rounded-full border border-slate-400" />
              <span className="h-px flex-1 bg-slate-300" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">{title}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Guía visual en preparación
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function AppliesNotApplies({
  appliesIf,
  doesNotApplyIf,
}: {
  appliesIf: string[]
  doesNotApplyIf: string[]
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-900">Aplica si</p>
        <ul className="mt-2 space-y-1 text-sm leading-5 text-emerald-950">
          {appliesIf.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-3">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-rose-900">No aplica si</p>
        <ul className="mt-2 space-y-1 text-sm leading-5 text-rose-950">
          {doesNotApplyIf.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function ServiceVisualCard({
  service,
  guide,
  isOpen,
  onToggleDetail,
  onChoose,
  onOpenGuide,
}: {
  service: ElectricalService
  guide?: VisualGuide
  isOpen: boolean
  onToggleDetail: () => void
  onChoose: () => void
  onOpenGuide: () => void
}) {
  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:p-4">
      <ServiceGuideImage guide={guide} title={service.title} />
      <div className="mt-4 px-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-900">
              Guía rápida
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">{service.title}</h3>
          </div>
          <div className="shrink-0 rounded-2xl bg-slate-50 px-3 py-2 text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
              Mano de obra
            </p>
            <p className="text-sm font-semibold text-slate-950">{money(service.baseLaborPrice)}</p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {guide?.diagramSubtitle ?? service.description}
        </p>
        <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <p className="rounded-2xl bg-slate-50 p-3">
            <Clock3 className="mb-2 h-4 w-4 text-blue-900" />
            <b className="text-slate-950">Duración estimada</b>
            <br />
            {guide?.durationLabel ?? `${service.durationMin} a ${service.durationMax} min`}
          </p>
          <p className="rounded-2xl bg-slate-50 p-3">
            <b className="text-slate-950">Materiales habituales</b>
            <br />
            {guide?.usualMaterialsShort ?? service.usualMaterials.join(', ')}
          </p>
        </div>
        {guide ? (
          <div className="mt-4">
            <AppliesNotApplies appliesIf={guide.appliesIf} doesNotApplyIf={guide.doesNotApplyIf} />
          </div>
        ) : null}
        <details
          className="mt-4 rounded-2xl border border-slate-200 bg-white p-4"
          open={isOpen}
          onToggle={(event) => {
            if (event.currentTarget.open && !isOpen) onToggleDetail()
          }}
        >
          <summary className="cursor-pointer text-sm font-semibold text-slate-950">
            Detalle técnico
          </summary>
          <div className="mt-5 grid gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2">
            <DetailList title="Qué incluye" items={service.includes} />
            <DetailList title="Qué no incluye" items={service.excludes} />
            <DetailList
              title="Callouts de la guía"
              items={guide?.callouts.map((item) => `${item.number}. ${item.label}`) ?? []}
            />
            <DetailList title="Cuándo cambia el precio" items={service.priceModifiers} />
          </div>
        </details>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Button onClick={onChoose} className="min-h-12 w-full">
            Elegir este servicio
          </Button>
          <Button type="button" variant="outline" onClick={onOpenGuide} className="min-h-12 w-full">
            Ver guía visual
          </Button>
        </div>
      </div>
    </article>
  )
}

function ServiceGuideModal({
  service,
  guide,
  onClose,
  onChoose,
}: {
  service: ElectricalService
  guide?: VisualGuide
  onClose: () => void
  onChoose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/55 p-3 pt-[calc(0.75rem_+_env(safe-area-inset-top))] backdrop-blur-sm sm:p-4 sm:pt-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-title"
    >
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-900">
              Guía visual NERIN
            </p>
            <h2 id="guide-title" className="mt-2 text-2xl font-semibold text-slate-950">
              {guide?.diagramTitle ?? service.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
            aria-label="Cerrar guía visual"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1.1fr_0.9fr]">
          <ServiceGuideImage guide={guide} title={service.title} large />
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Partes señaladas
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {guide?.callouts.map((item) => (
                  <span
                    key={item.number}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700"
                  >
                    {item.number}. {item.label}
                  </span>
                ))}
              </div>
            </div>
            {guide ? (
              <AppliesNotApplies
                appliesIf={guide.appliesIf}
                doesNotApplyIf={guide.doesNotApplyIf}
              />
            ) : null}
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-3">
                <dt className="font-bold text-slate-950">Materiales</dt>
                <dd className="mt-1 text-slate-600">{guide?.usualMaterialsShort}</dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <dt className="font-bold text-slate-950">Duración</dt>
                <dd className="mt-1 text-slate-600">{guide?.durationLabel}</dd>
              </div>
            </dl>
            {guide?.relatedIfNotApplies.length ? (
              <p className="rounded-2xl border border-blue-100 bg-blue-50 p-3 text-sm font-semibold text-blue-950">
                Si no aplica: {guide.relatedIfNotApplies.map((item) => item.label).join(' · ')}
              </p>
            ) : null}
          </div>
        </div>
        <div className="grid gap-3 border-t border-slate-200 bg-white/95 p-4 sm:grid-cols-2 sm:p-5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="min-h-12 w-full rounded-full"
          >
            Cerrar guía
          </Button>
          <Button type="button" onClick={onChoose} className="min-h-12 w-full rounded-full">
            Elegir este servicio
          </Button>
        </div>
      </div>
    </div>
  )
}

export function SmallJobsExperience({ content }: { content?: ElectricalAdminContent } = {}) {
  const quickServicesData = content?.quickServices ?? quickServices
  const diagnosticFaultsData = content?.diagnosticFaults ?? diagnosticFaults
  const visualGuidesData = content?.visualGuides?.length
    ? (Object.fromEntries(
        content.visualGuides.map((guide) => [guide.serviceId, guide.visualGuide]),
      ) as typeof visualGuidesByServiceId)
    : visualGuidesByServiceId
  const commercialRequestServicesData = content?.commercialServices?.length
    ? (content.commercialServices as typeof commercialRequestServices)
    : commercialRequestServices
  const [activeMode, setActiveMode] = useState(entryCards[0].id)
  const [openService, setOpenService] = useState<string | null>(quickServicesData[0]?.id ?? null)
  const [guideService, setGuideService] = useState<ElectricalService | null>(null)
  const [addedLabel, setAddedLabel] = useState<string | null>(null)
  const [lastAddedId, setLastAddedId] = useState<string | null>(null)
  const solicitudRef = useRef<HTMLElement | null>(null)
  const [items, setItems] = useState<RequestItem[]>([])
  const [sent, setSent] = useState(false)
  const [wizard, setWizard] = useState<WizardDraft | null>(null)
  const [photoCount, setPhotoCount] = useState(0)
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
  const hasQuotedItems = items.some((item) => item.labor === 0)
  const wizardPreview = wizard
    ? wizard.questions.map((question) => {
        const answer = wizard.answers[question.label]?.trim() || 'sin informar'
        return `${question.label.replace(/^¿|\?$/g, '')}: ${answer}`
      })
    : []
  const wizardPreviewMaterials =
    wizardPreview.find((item) => item.toLowerCase().includes('material')) ?? 'Materiales: a definir'
  const wizardPreviewPhotos =
    wizardPreview.find((item) => item.toLowerCase().includes('foto')) ??
    'Fotos requeridas: tablero, punto o zona de trabajo'

  useEffect(() => {
    if (!lastAddedId) return
    const timeout = window.setTimeout(() => setLastAddedId(null), 4500)
    return () => window.clearTimeout(timeout)
  }, [lastAddedId])

  function openWizard(draft: Omit<WizardDraft, 'answers'>) {
    setWizard({
      ...draft,
      answers: Object.fromEntries(
        draft.questions.map((question) => [question.label, question.options?.[0] ?? '']),
      ),
    })
  }

  function addService(service: ElectricalService) {
    openWizard({
      kind: 'quick',
      sourceId: service.id,
      title: service.title,
      labor: service.baseLaborPrice,
      quantity: 1,
      questions: getQuickQuestions(service),
      alert:
        service.id === 'cambio-termica' || service.id === 'cambio-disyuntor'
          ? 'Si salta por falla, puede corresponder diagnóstico, no reemplazo directo.'
          : undefined,
    })
  }

  function addRequestItem(item: Omit<RequestItem, 'id'>, prefix: string) {
    const id = `${prefix}-${Date.now()}`
    setItems((current) => [...current, { ...item, id }])
    setAddedLabel(item.title)
    setLastAddedId(id)
    setSent(false)
  }

  function confirmWizard() {
    if (!wizard) return
    const configured = wizard.questions.map((question) => {
      const answer = wizard.answers[question.label]?.trim() || 'sin informar'
      return `${question.label.replace(/^¿|\?$/g, '')}: ${answer}`
    })
    const material =
      configured.find((item) => item.toLowerCase().includes('material')) ?? 'Materiales: a definir'
    const photos =
      configured.find((item) => item.toLowerCase().includes('foto')) ??
      'Fotos requeridas: tablero, punto o zona de trabajo'
    addRequestItem(
      {
        title: wizard.title,
        quantity: wizard.quantity,
        labor: wizard.labor,
        note: configured.slice(0, 3).join(' · '),
        kind: wizard.kind,
        details: configured,
        materials: material,
        photos,
        validation: 'Pendiente de validación técnica',
        alert: wizard.alert,
        sourceId: wizard.sourceId,
      },
      wizard.sourceId,
    )
    setWizard(null)
  }

  function editConfiguredItem(item: RequestItem) {
    const questions = item.details.map((detail) => ({
      label: detail.split(':')[0],
      multiline: true,
    }))
    setItems((current) => current.filter((entry) => entry.id !== item.id))
    setWizard({
      kind: item.kind,
      sourceId: item.sourceId ?? item.id,
      title: item.title,
      labor: item.labor,
      quantity: item.quantity,
      questions,
      answers: Object.fromEntries(
        item.details.map((detail) => {
          const [label, ...rest] = detail.split(':')
          return [label, rest.join(':').trim()]
        }),
      ),
      alert: item.alert,
    })
  }

  function openSolicitud() {
    solicitudRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function scrollToOptions() {
    document.getElementById(activeMode)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function getCategoryLabel(kind: RequestKind) {
    if (kind === 'quick') return 'Servicio rápido'
    if (kind === 'installation') return 'Instalación configurable'
    if (kind === 'diagnostic') return 'Diagnóstico de fallas'
    return 'Comercio / consorcio / barrio privado'
  }

  function addConfigurable() {
    addRequestItem(
      {
        title: estimate.workType,
        quantity: 1,
        labor: estimate.labor,
        note: `${selection.quantity} punto(s) · ${selection.distance} · ${selection.installationType}`,
        kind: 'installation',
        details: [
          `Tipo de punto: ${selection.pointType}`,
          `Cantidad: ${selection.quantity}`,
          `Recorrido estimado: ${selection.distance}`,
          `Tipo de instalación: ${selection.installationType}`,
          `Requiere cableado: ${selection.installationType.includes('cableado') || !selection.installationType.includes('punto existente') ? 'sí / a validar' : 'según estado existente'}`,
          `Requiere canalización: ${selection.installationType.includes('exterior') || selection.installationType.includes('embutida') ? 'sí' : 'a validar'}`,
          `Tablero/circuito dedicado: a validar según carga y protecciones`,
          `Riesgo de visita previa: ${estimate.requiresVisit ? 'alto' : 'según fotos'}`,
        ],
        materials: `Materiales habituales: ${estimate.materials.join(', ')}`,
        photos: 'Fotos necesarias: tablero, recorrido posible, punto o zona de trabajo',
        validation: 'Pendiente de validación técnica',
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
        kind: 'commercial',
        details: [
          `Cantidad de luminarias: ${commercialConfig.quantity}`,
          `Altura: ${commercialConfig.height}`,
          `Tipo de espacio: ${commercialConfig.spaceType}`,
          `Horario de trabajo: ${commercialConfig.schedule}`,
          `Requiere escalera especial: ${commercialConfig.ladder}`,
          `Autorización administración/seguridad/encargado: a validar`,
          `Fecha tentativa: a coordinar`,
        ],
        materials: `Materiales: ${commercialConfig.materials}`,
        photos: 'Fotos requeridas: luminarias, espacio, acceso y tablero si corresponde',
        validation: 'Pendiente de cotización y validación técnica',
      },
      'comercial-lamparas',
    )
  }

  return (
    <div className="bg-white pb-44 lg:pb-0">
      <style>{`a[data-content-name='WhatsApp flotante'] { display: none; }`}</style>

      {wizard ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/55 p-3 pt-[calc(0.75rem_+_env(safe-area-inset-top))] backdrop-blur-sm sm:p-4 sm:pt-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wizard-title"
        >
          <div className="flex max-h-[calc(100dvh_-_1.5rem_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom))] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="shrink-0 border-b border-slate-100 bg-white p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    Configurar solicitud
                  </p>
                  <h2 id="wizard-title" className="mt-2 text-2xl font-semibold text-slate-950">
                    {wizard.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Completá el alcance mínimo para armar una ficha técnica antes de agregarlo a
                    Solicitud. Revisá el resumen técnico y confirmá cuando esté listo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setWizard(null)}
                  className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
                  aria-label="Cerrar configurador"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {wizard.alert ? (
                <p className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-950">
                  {wizard.alert}
                </p>
              ) : null}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 pb-32 sm:px-6 sm:pb-36">
              <div className="space-y-5">
                {getWizardQuestionGroups(wizard.questions).map((group) => (
                  <section
                    key={group.title}
                    className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                      {group.title}
                    </p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {group.questions.map((question) =>
                        question.options ? (
                          <RadioGroup
                            key={question.label}
                            label={question.label}
                            options={question.options}
                            value={wizard.answers[question.label]}
                            onChange={(value) =>
                              setWizard({
                                ...wizard,
                                answers: { ...wizard.answers, [question.label]: value },
                              })
                            }
                          />
                        ) : (
                          <label
                            key={question.label}
                            className="space-y-2 text-sm font-semibold text-slate-800 sm:col-span-2"
                          >
                            <span>{question.label}</span>
                            {question.multiline ? (
                              <Textarea
                                className="min-h-24 bg-white"
                                value={wizard.answers[question.label] ?? ''}
                                onChange={(event) =>
                                  setWizard({
                                    ...wizard,
                                    answers: {
                                      ...wizard.answers,
                                      [question.label]: event.target.value,
                                    },
                                  })
                                }
                              />
                            ) : (
                              <Input
                                className="h-12 bg-white"
                                value={wizard.answers[question.label] ?? ''}
                                onChange={(event) =>
                                  setWizard({
                                    ...wizard,
                                    answers: {
                                      ...wizard.answers,
                                      [question.label]: event.target.value,
                                    },
                                  })
                                }
                              />
                            )}
                          </label>
                        ),
                      )}
                    </div>
                  </section>
                ))}

                <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                    Se agregará a Solicitud
                  </p>
                  <div className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                    <div>
                      <p className="font-semibold text-slate-950">{wizard.title}</p>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                        {getCategoryLabel(wizard.kind)}
                      </p>
                    </div>
                    <dl className="grid gap-2 text-xs leading-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <dt className="font-bold text-slate-950">Respuestas principales</dt>
                        <dd>{wizardPreview.slice(0, 5).join(' · ')}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-slate-950">Materiales</dt>
                        <dd>{wizardPreviewMaterials}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-slate-950">Fotos requeridas</dt>
                        <dd>{wizardPreviewPhotos}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-slate-950">Precio base</dt>
                        <dd>{wizard.labor ? money(wizard.labor) : 'A cotizar'}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-slate-950">Estado</dt>
                        <dd>Pendiente de validación técnica</dd>
                      </div>
                    </dl>
                  </div>
                </section>
              </div>
            </div>

            <div className="sticky bottom-0 shrink-0 border-t border-slate-200 bg-white/95 p-4 pb-[calc(1rem_+_env(safe-area-inset-bottom))] shadow-[0_-18px_45px_rgba(15,23,42,0.10)] backdrop-blur sm:p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setWizard(null)}
                  className="min-h-12 w-full rounded-full"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={confirmWizard}
                  className="min-h-12 w-full rounded-full"
                >
                  Confirmar y agregar a Solicitud
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {guideService ? (
        <ServiceGuideModal
          service={guideService}
          guide={visualGuidesData[guideService.id]}
          onClose={() => setGuideService(null)}
          onChoose={() => {
            setGuideService(null)
            addService(guideService)
          }}
        />
      ) : null}
      {addedLabel ? (
        <div
          className="fixed inset-x-3 bottom-[calc(5.75rem_+_env(safe-area-inset-bottom))] z-50 rounded-3xl border border-emerald-200 bg-white p-4 text-sm shadow-2xl lg:left-1/2 lg:right-auto lg:bottom-8 lg:w-full lg:max-w-xl lg:-translate-x-1/2"
          role="status"
          aria-live="polite"
        >
          <p className="font-semibold text-slate-950">{addedLabel} agregado a Solicitud</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button
              type="button"
              onClick={() => {
                openSolicitud()
                setAddedLabel(null)
              }}
              className="min-h-10"
            >
              Ver solicitud
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setAddedLabel(null)
                scrollToOptions()
              }}
              className="min-h-10"
            >
              Seguir agregando
            </Button>
          </div>
        </div>
      ) : null}
      <button
        type="button"
        onClick={items.length ? openSolicitud : scrollToOptions}
        className="fixed inset-x-3 bottom-[env(safe-area-inset-bottom)] z-40 flex min-h-16 items-center justify-between gap-3 rounded-t-3xl border border-slate-200 bg-slate-950 px-4 py-3 pb-[calc(0.75rem_+_env(safe-area-inset-bottom))] text-sm font-semibold text-white shadow-2xl lg:hidden"
      >
        <span>
          Solicitud ·{' '}
          {items.length === 0
            ? 'sin servicios'
            : items.length === 1
              ? '1 servicio'
              : `${items.length} servicios`}
        </span>
        <span className="shrink-0 rounded-full bg-white px-3 py-2 text-slate-950">
          {items.length === 0
            ? 'Elegir servicio'
            : subtotal
              ? money(subtotal)
              : hasQuotedItems
                ? 'A cotizar'
                : 'Ver solicitud'}
        </span>
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
                Sistema guiado
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">Servicios rápidos</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500">
              Cada servicio se configura antes de entrar a la solicitud técnica.
            </p>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {quickServicesData.map((service) => (
              <ServiceVisualCard
                key={service.id}
                service={service}
                guide={visualGuidesData[service.id]}
                isOpen={openService === service.id}
                onToggleDetail={() =>
                  setOpenService(openService === service.id ? null : service.id)
                }
                onChoose={() => addService(service)}
                onOpenGuide={() => setGuideService(service)}
              />
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
                Agregar instalación configurada a solicitud
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
            {diagnosticFaultsData.map((fault) => (
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
                    openWizard({
                      kind: 'diagnostic',
                      sourceId: fault.id,
                      title: `Diagnóstico: ${fault.faultName}`,
                      labor: fault.initialPrice,
                      quantity: 1,
                      questions: getDiagnosticQuestions(fault.faultName),
                      alert:
                        'Si hay olor a quemado, chispas, calor o ruido, no manipules la instalación.',
                    })
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
              {commercialRequestServicesData.map((service) => (
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
                    <StatusPill>Configurable</StatusPill>
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
                  {true ? (
                    <Button
                      type="button"
                      onClick={() =>
                        openWizard({
                          kind: 'commercial',
                          sourceId: service.id,
                          title: service.title,
                          labor: 0,
                          quantity: 1,
                          questions: getCommercialQuestions(service.title),
                        })
                      }
                      className="mt-4 min-h-12 w-full"
                    >
                      Configurar servicio
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
                <div
                  key={item.id}
                  className={`rounded-2xl border p-3 transition ${
                    item.id === lastAddedId
                      ? 'border-emerald-300 bg-emerald-50 shadow-sm ring-2 ring-emerald-100'
                      : 'border-transparent bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                        {getCategoryLabel(item.kind)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => editConfiguredItem(item)}
                        aria-label="Editar"
                        className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-white hover:text-slate-950"
                      >
                        <Pencil className="h-4 w-4" />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => setItems(items.filter((entry) => entry.id !== item.id))}
                        aria-label="Eliminar"
                        className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-white hover:text-slate-950"
                      >
                        <X className="h-4 w-4" />
                        Eliminar
                      </button>
                    </div>
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
                  <dl className="mt-3 grid gap-2 text-xs leading-5 text-slate-600">
                    <div>
                      <dt className="font-bold text-slate-950">
                        Respuestas principales del wizard
                      </dt>
                      <dd>{item.details.join(' · ')}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-slate-950">Materiales</dt>
                      <dd>{item.materials}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-slate-950">Fotos requeridas</dt>
                      <dd>{item.photos}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-slate-950">Estado</dt>
                      <dd>{item.validation}</dd>
                    </div>
                  </dl>
                  {item.alert ? (
                    <p className="mt-2 rounded-xl bg-amber-50 p-2 text-xs font-semibold leading-5 text-amber-950">
                      {item.alert}
                    </p>
                  ) : null}
                </div>
              ))}
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-lg font-semibold text-slate-950">
                  Subtotal estimado: {subtotal ? money(subtotal) : 'A cotizar'}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Materiales: no incluidos o estimados según ficha. Estado: pendiente de validación
                  técnica. Sujeto a aprobación por zona, fotos, agenda y alcance real.
                </p>
              </div>
            </div>
          )}
        </aside>
        {items.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Solicitud guiada
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Todavía no agregaste servicios.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Elegí un servicio rápido, configurá una instalación, solicitá diagnóstico o armá una
              solicitud comercial. Después vas a poder cargar tus datos y enviar el pedido para
              revisión.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {entryCards.map((card) => (
                <Button
                  key={card.id}
                  type="button"
                  variant={card.id === activeMode ? 'primary' : 'outline'}
                  onClick={() => {
                    setActiveMode(card.id)
                    document
                      .getElementById(card.id)
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className="min-h-12 justify-start"
                >
                  {card.id === 'servicios-rapidos'
                    ? 'Ver servicios rápidos'
                    : card.id === 'instalaciones-configurables'
                      ? 'Configurar instalación'
                      : card.id === 'diagnostico-de-fallas'
                        ? 'Pedir diagnóstico'
                        : 'Servicio comercial / consorcio'}
                </Button>
              ))}
            </div>
            <p className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-950">
              Primero agregá al menos un servicio a la solicitud.
            </p>
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault()
              if (items.length === 0) return
              setSent(true)
            }}
            className="space-y-5 rounded-3xl border border-slate-200 bg-slate-50 p-5"
          >
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">
                Enviar solicitud para revisión
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Completá los datos por bloques. NERIN revisa zona, fotos, agenda, acceso, estado
                real y alcance antes de confirmar.
              </p>
            </div>

            <RequestStep eyebrow="Paso 1" title="Servicios solicitados">
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-2xl border p-3 transition ${
                      item.id === lastAddedId
                        ? 'border-emerald-300 bg-emerald-50 shadow-sm ring-2 ring-emerald-100'
                        : 'border-transparent bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                          {getCategoryLabel(item.kind)}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {item.labor
                            ? `${money(item.labor)} mano de obra base`
                            : 'A cotizar según alcance'}{' '}
                          · {item.note}
                        </p>
                        <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-600">
                          {item.details.map((detail) => (
                            <li key={detail}>{detail}</li>
                          ))}
                        </ul>
                        <p className="mt-2 text-xs font-semibold text-slate-700">
                          {item.materials} · {item.photos} · {item.validation}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => editConfiguredItem(item)}
                          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-white hover:text-slate-950"
                          aria-label="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => setItems(items.filter((entry) => entry.id !== item.id))}
                          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-white hover:text-slate-950"
                          aria-label="Eliminar"
                        >
                          <X className="h-4 w-4" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-[120px_1fr]">
                      <Input
                        className="h-11"
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          setItems(
                            items.map((entry) =>
                              entry.id === item.id
                                ? { ...entry, quantity: Number(e.target.value) || 1 }
                                : entry,
                            ),
                          )
                        }
                      />
                      <Input className="h-11" placeholder="Aclaraciones sobre este servicio" />
                    </div>
                  </div>
                ))}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
                  <b className="text-slate-950">Subtotal estimado:</b>{' '}
                  {subtotal ? money(subtotal) : 'a cotizar'} · Materiales no incluidos o a definir ·{' '}
                  <b>Pendiente de validación técnica</b>.
                </div>
              </div>
            </RequestStep>

            <RequestStep eyebrow="Paso 2" title="Datos del lugar">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input className="h-12" required placeholder="Dirección / zona" />
                <SelectField
                  label="Tipo de propiedad"
                  value={selection.propertyType}
                  options={propertyTypes}
                  onChange={(propertyType) => setSelection({ ...selection, propertyType })}
                />
                <SelectField
                  label="Acceso"
                  value="libre"
                  options={['libre', 'con autorización', 'con coordinación previa', 'no sé']}
                  onChange={() => {}}
                />
                <Input className="h-12" placeholder="Disponibilidad horaria" />
              </div>
            </RequestStep>

            <RequestStep eyebrow="Paso 3" title="Datos de contacto">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input className="h-12" required placeholder="Nombre" />
                <Input className="h-12" required placeholder="Teléfono" />
                <Input className="h-12 sm:col-span-2" type="email" placeholder="Email opcional" />
              </div>
            </RequestStep>

            <RequestStep eyebrow="Paso 4" title="Fotos y detalles">
              <div className="space-y-4">
                <label className="block cursor-pointer rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center transition hover:border-slate-950 hover:bg-white">
                  <ImagePlus className="mx-auto h-7 w-7 text-slate-950" />
                  <span className="mt-3 block text-base font-semibold text-slate-950">
                    Fotos del trabajo
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-slate-600">
                    Subí fotos del tablero, punto eléctrico, luminaria, falla o zona de trabajo.
                  </span>
                  <span className="mt-4 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white">
                    Agregar fotos
                  </span>
                  <span className="mt-3 block text-xs leading-5 text-slate-500">
                    {photoCount === 0
                      ? 'Sin archivos seleccionados'
                      : `${photoCount} archivo(s) seleccionado(s)`}
                  </span>
                  <input
                    type="file"
                    multiple
                    className="sr-only"
                    onChange={(event) => setPhotoCount(event.target.files?.length ?? 0)}
                  />
                </label>
                <div className="grid gap-3">
                  <Textarea className="min-h-28" placeholder="Observaciones finales" />
                </div>
              </div>
            </RequestStep>

            <Button className="min-h-12 w-full" size="lg">
              Enviar solicitud para revisión
            </Button>
            {sent ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
                <CheckCircle2 className="mb-2 h-5 w-5" />
                <b>Solicitud enviada. Pendiente de aprobación por NERIN.</b>
              </div>
            ) : null}
          </form>
        )}
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
