'use client'

import { FormEvent, useMemo, useState } from 'react'
import { CheckCircle2, Loader2, MessageCircle } from 'lucide-react'
import {
  coverageZones,
  manualReviewMessage,
  propertyTypes,
  requestTypes,
  safetyNotice,
  urgencyOptions,
} from '@/lib/nerin-electricidad'
import { Button } from '@/components/ui/button'

type LeadWizardProps = {
  whatsappHref: string
  initialWorkType?: string
  initialRequestType?: string
  serviceName?: string
  servicePriceFrom?: string
  submitLabel?: string
  detailPlaceholder?: string
}

type LeadFormState = {
  requestType: string
  workType: string
  zone: string
  location: string
  propertyType: string
  urgency: string
  details: string
  phone: string
  name: string
  email: string
  preferredTime: string
  consent: boolean
  surfaceOrRooms: string
  hasExistingPanel: string
  needsCanalization: string
  hasPlansOrPhotos: string
  projectType: string
  projectStage: string
  projectSector: string
  projectScope: string
  estimatedStartDate: string
}

const smallJobUrgencies = ['Lo antes posible', 'Esta semana', 'Sin urgencia', 'Solo quiero consultar precio'] as const
const renovationUrgencies = ['Lo antes posible', 'Esta semana', 'Sin urgencia', 'Estoy evaluando alcance'] as const
const panelOptions = ['Si', 'No', 'No lo se'] as const
const canalizationOptions = ['Si', 'No', 'A confirmar'] as const
const plansOptions = ['Si, tengo planos/fotos', 'Tengo fotos', 'No tengo', 'Puedo enviarlos luego'] as const
const projectTypes = ['Obra nueva', 'Ampliacion', 'Remodelacion', 'Adecuacion electrica', 'Mantenimiento de obra'] as const
const projectStages = ['Idea / anteproyecto', 'Proyecto definido', 'Obra por iniciar', 'Obra en curso', 'Finalizacion / entrega'] as const
const projectSectors = ['Local', 'Edificio', 'Comercio', 'Vivienda', 'Oficina', 'Otro'] as const
const zoneOptions = coverageZones.map((zone) =>
  zone === 'Requiere confirmacion' ? 'Otra zona / consultar disponibilidad' : zone,
)

const zoneConfirmationMessage =
  'La zona requiere confirmacion de disponibilidad. Revisaremos el caso antes de confirmar visita o presupuesto.'
const priceClarification = 'Precio orientativo sujeto a revision segun fotos, zona y alcance.'

function getFlowType(requestType: string) {
  if (requestType === 'Refaccion electrica') return 'renovation'
  if (requestType === 'Obra grande') return 'major'
  return 'small'
}

function getUrgencyList(requestType: string) {
  if (requestType === 'Refaccion electrica') return [...renovationUrgencies]
  if (requestType === 'Obra grande') return [...urgencyOptions]
  return [...smallJobUrgencies]
}

function requiresZoneConfirmation(zone: string) {
  return zone === 'Otra zona / consultar disponibilidad' || zone === 'Requiere confirmacion'
}

function formatAnswer(label: string, value: string) {
  return value ? `${label}: ${value}` : null
}

export function LeadWizard({
  whatsappHref,
  initialWorkType,
  initialRequestType,
  serviceName,
  servicePriceFrom,
  submitLabel = 'Enviar solicitud',
  detailPlaceholder = 'Contanos que pasa, que queres hacer, si hay riesgo, cortes, fotos o datos de la instalacion.',
}: LeadWizardProps) {
  const hasPreselectedService = Boolean(initialWorkType || serviceName)
  const [form, setForm] = useState<LeadFormState>({
    requestType: initialRequestType || requestTypes[0],
    workType: initialWorkType || serviceName || '',
    zone: zoneOptions[0],
    location: '',
    propertyType: propertyTypes[0],
    urgency: getUrgencyList(initialRequestType || requestTypes[0])[0],
    details: '',
    phone: '',
    name: '',
    email: '',
    preferredTime: '',
    consent: true,
    surfaceOrRooms: '',
    hasExistingPanel: panelOptions[2],
    needsCanalization: canalizationOptions[2],
    hasPlansOrPhotos: plansOptions[3],
    projectType: projectTypes[0],
    projectStage: projectStages[0],
    projectSector: projectSectors[0],
    projectScope: '',
    estimatedStartDate: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const isWhatsappExternal = whatsappHref.startsWith('http')
  const flowType = getFlowType(form.requestType)
  const urgencyList = getUrgencyList(form.requestType)
  const zoneNeedsConfirmation = requiresZoneConfirmation(form.zone)

  const summary = useMemo(
    () =>
      [
        form.requestType,
        form.workType || 'servicio a definir',
        form.zone,
        form.location || 'localidad a confirmar',
        form.urgency,
      ].join(' - '),
    [form.location, form.requestType, form.urgency, form.workType, form.zone],
  )

  const update = (key: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const updateRequestType = (value: string) => {
    const nextUrgencies = getUrgencyList(value)
    setForm((prev) => ({
      ...prev,
      requestType: value,
      urgency: nextUrgencies.includes(prev.urgency) ? prev.urgency : nextUrgencies[0],
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')

    const formData = new FormData(event.currentTarget)
    const structuredDetails = [
      `Origen del formulario: ${typeof window !== 'undefined' ? window.location.pathname : 'web'}`,
      formatAnswer('Tipo de solicitud', form.requestType),
      formatAnswer('Categoria', flowType === 'renovation' ? 'Refaccion' : flowType === 'major' ? 'Obra' : 'Trabajo chico'),
      formatAnswer('Servicio preseleccionado', hasPreselectedService ? form.workType : ''),
      formatAnswer('Precio desde visible', servicePriceFrom || ''),
      formatAnswer('Zona', form.zone),
      zoneNeedsConfirmation ? zoneConfirmationMessage : null,
      flowType === 'renovation' ? formatAnswer('Tipo de propiedad', form.propertyType) : null,
      flowType === 'renovation' ? formatAnswer('Superficie o ambientes', form.surfaceOrRooms) : null,
      flowType === 'renovation' ? formatAnswer('Tablero existente', form.hasExistingPanel) : null,
      flowType === 'renovation' ? formatAnswer('Necesita cambiar canalizacion', form.needsCanalization) : null,
      flowType === 'renovation' ? formatAnswer('Planos/fotos', form.hasPlansOrPhotos) : null,
      flowType === 'major' ? formatAnswer('Tipo de obra', form.projectType) : null,
      flowType === 'major' ? formatAnswer('Etapa de obra', form.projectStage) : null,
      flowType === 'major' ? formatAnswer('Planos disponibles', form.hasPlansOrPhotos) : null,
      flowType === 'major' ? formatAnswer('Rubro', form.projectSector) : null,
      flowType === 'major' ? formatAnswer('Alcance buscado', form.projectScope) : null,
      flowType === 'major' ? formatAnswer('Fecha estimada de inicio', form.estimatedStartDate) : null,
      formatAnswer('Descripcion', form.details),
      form.preferredTime ? formatAnswer('Horario preferido', form.preferredTime) : null,
    ]
      .filter(Boolean)
      .join('\n')

    formData.set('clientType', flowType === 'major' ? form.projectSector : form.propertyType)
    formData.set('location', `${form.zone} - ${form.location}`)
    formData.set('address', form.location)
    formData.set('leadType', form.requestType)
    formData.set('workType', form.workType || form.requestType)
    formData.set('reason', form.urgency)
    formData.set('details', structuredDetails)
    formData.set('consent', form.consent ? 'true' : 'false')
    formData.set('landingPage', typeof window !== 'undefined' ? window.location.pathname : '')
    formData.set('referrer', typeof document !== 'undefined' ? document.referrer : '')

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        body: formData,
      })
      const payload = (await response.json().catch(() => ({}))) as { error?: string }
      if (!response.ok) throw new Error(payload.error || 'No pudimos enviar la solicitud.')
      setStatus('success')
      setMessage('Solicitud recibida. Si el caso es especial, riesgoso o fuera de zona, pasa a revision por Valdir Nerin.')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'No pudimos enviar la solicitud.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Solicitud</p>
        <p className="mt-1 text-lg font-semibold text-slate-950">{form.workType || form.requestType}</p>
        {servicePriceFrom ? <p className="mt-1 text-sm font-bold text-slate-950">Precio desde {servicePriceFrom}</p> : null}
        <p className="mt-2 text-xs leading-5 text-slate-600">{priceClarification}</p>
      </div>

      {!hasPreselectedService ? (
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">1. Tipo de solicitud</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {requestTypes.map((item) => (
              <label key={item} className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 has-[:checked]:border-slate-950 has-[:checked]:bg-slate-950 has-[:checked]:text-white">
                <input
                  className="sr-only"
                  type="radio"
                  name="requestType"
                  value={item}
                  checked={form.requestType === item}
                  onChange={(event) => updateRequestType(event.target.value)}
                />
                {item}
              </label>
            ))}
          </div>
          <input
            name="workType"
            value={form.workType}
            onChange={(event) => update('workType', event.target.value)}
            placeholder="Servicio o trabajo elegido"
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-950"
          />
        </fieldset>
      ) : (
        <input type="hidden" name="workType" value={form.workType} />
      )}

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{hasPreselectedService ? '1' : '2'}. Zona</legend>
        <div className="grid gap-3 lg:grid-cols-2">
          <select
            name="zone"
            value={form.zone}
            onChange={(event) => update('zone', event.target.value)}
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-950"
          >
            {zoneOptions.map((zone) => (
              <option key={zone}>{zone}</option>
            ))}
          </select>
          <input
            name="locationInput"
            value={form.location}
            onChange={(event) => update('location', event.target.value)}
            placeholder={flowType === 'major' ? 'Ubicacion de la obra' : 'Barrio o localidad'}
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-950"
            required
          />
        </div>
        {zoneNeedsConfirmation ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{zoneConfirmationMessage}</p>
        ) : null}
      </fieldset>

      {flowType === 'renovation' ? (
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Datos de refaccion</legend>
          <div className="grid gap-3 lg:grid-cols-2">
            <select
              name="propertyType"
              value={form.propertyType}
              onChange={(event) => update('propertyType', event.target.value)}
              className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-950"
            >
              {propertyTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <input
              name="surfaceOrRooms"
              value={form.surfaceOrRooms}
              onChange={(event) => update('surfaceOrRooms', event.target.value)}
              placeholder="Superficie aproximada o cantidad de ambientes"
              className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-950"
              required
            />
            <SelectField name="hasExistingPanel" label="Tablero existente" value={form.hasExistingPanel} options={panelOptions} onChange={(value) => update('hasExistingPanel', value)} />
            <SelectField name="needsCanalization" label="Cambiar canalizacion" value={form.needsCanalization} options={canalizationOptions} onChange={(value) => update('needsCanalization', value)} />
            <SelectField name="hasPlansOrPhotos" label="Planos o fotos" value={form.hasPlansOrPhotos} options={plansOptions} onChange={(value) => update('hasPlansOrPhotos', value)} />
          </div>
        </fieldset>
      ) : null}

      {flowType === 'major' ? (
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Datos de obra</legend>
          <div className="grid gap-3 lg:grid-cols-2">
            <SelectField name="projectType" label="Tipo de obra" value={form.projectType} options={projectTypes} onChange={(value) => update('projectType', value)} />
            <SelectField name="projectStage" label="Etapa de obra" value={form.projectStage} options={projectStages} onChange={(value) => update('projectStage', value)} />
            <SelectField name="hasPlansOrPhotos" label="Planos disponibles" value={form.hasPlansOrPhotos} options={plansOptions} onChange={(value) => update('hasPlansOrPhotos', value)} />
            <SelectField name="projectSector" label="Rubro" value={form.projectSector} options={projectSectors} onChange={(value) => update('projectSector', value)} />
            <input
              name="estimatedStartDate"
              value={form.estimatedStartDate}
              onChange={(event) => update('estimatedStartDate', event.target.value)}
              placeholder="Fecha estimada de inicio"
              className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-950"
            />
            <textarea
              name="projectScope"
              value={form.projectScope}
              onChange={(event) => update('projectScope', event.target.value)}
              placeholder="Alcance buscado"
              className="min-h-24 rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-slate-950 lg:col-span-2"
              required
            />
          </div>
        </fieldset>
      ) : null}

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{hasPreselectedService ? '2' : '3'}. Urgencia</legend>
        <div className="grid gap-2 sm:grid-cols-4">
          {urgencyList.map((item) => (
            <label key={item} className="flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 px-3 py-2 text-center text-sm font-semibold has-[:checked]:border-amber-400 has-[:checked]:bg-amber-50">
              <input
                className="sr-only"
                type="radio"
                name="urgency"
                value={item}
                checked={form.urgency === item}
                onChange={(event) => update('urgency', event.target.value)}
              />
              {item}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{hasPreselectedService ? '3' : '4'}. Fotos y descripcion</legend>
        <div className="grid gap-3">
          <textarea
            name="details"
            value={form.details}
            onChange={(event) => update('details', event.target.value)}
            placeholder={flowType === 'small' ? 'Contanos que pasa o que necesitas.' : detailPlaceholder}
            className="min-h-28 rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-slate-950"
            required
          />
          <input
            name="adjuntos"
            type="file"
            multiple
            accept="image/*,.pdf"
            className="h-11 rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{hasPreselectedService ? '4' : '5'}. Contacto</legend>
        <div className="grid gap-3 lg:grid-cols-2">
          <input
            name="name"
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
            placeholder="Nombre"
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-950"
            required
          />
          <input
            name="phone"
            value={form.phone}
            onChange={(event) => update('phone', event.target.value)}
            placeholder="WhatsApp"
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-950"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
            placeholder="Email opcional"
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-950"
          />
          <input
            name="preferredTime"
            value={form.preferredTime}
            onChange={(event) => update('preferredTime', event.target.value)}
            placeholder="Horario preferido"
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-950"
          />
        </div>
      </fieldset>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-slate-950">Resumen: {summary}</p>
        <p className="mt-1 text-sm text-slate-700">{zoneNeedsConfirmation ? zoneConfirmationMessage : manualReviewMessage}</p>
        <p className="mt-2 text-xs leading-5 text-slate-600">{safetyNotice}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <label className="flex items-start gap-2 text-xs text-slate-500">
          <input
            name="consent"
            type="checkbox"
            checked={form.consent}
            onChange={(event) => update('consent', event.target.checked)}
            className="mt-1"
            required
          />
          Acepto que NERIN me contacte por esta solicitud.
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" disabled={status === 'submitting'} className="bg-slate-950 hover:bg-slate-800">
            {status === 'submitting' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
            {submitLabel}
          </Button>
          <Button asChild className="bg-[#25D366] text-black hover:bg-[#1ebe5a]">
            <a href={whatsappHref} target={isWhatsappExternal ? '_blank' : undefined} rel={isWhatsappExternal ? 'noopener noreferrer' : undefined}>
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </a>
          </Button>
        </div>
      </div>

      {message ? (
        <p className={status === 'error' ? 'text-sm font-medium text-red-700' : 'text-sm font-medium text-emerald-700'}>
          {message}
        </p>
      ) : null}
    </form>
  )
}

function SelectField({
  name,
  label,
  value,
  options,
  onChange,
}: {
  name: string
  label: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
}) {
  return (
    <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
      {label}
      <select
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-xl border border-slate-200 px-3 text-sm font-normal normal-case tracking-normal text-slate-950 outline-none focus:border-slate-950"
      >
        {options.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </label>
  )
}
