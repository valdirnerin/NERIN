'use client'

import type { ChangeEvent, FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AttributionFields } from '@/components/tracking/AttributionFields'
import { readAttribution, trackEvent } from '@/lib/tracking'

const clientTypes = [
  { value: 'consorcio', label: 'Consorcio' },
  { value: 'empresa', label: 'Empresa' },
  { value: 'obra', label: 'Obra' },
  { value: 'vivienda', label: 'Vivienda' },
] as const

const workTypes = [
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'obra-nueva', label: 'Obra nueva' },
  { value: 'reforma', label: 'Reforma eléctrica' },
  { value: 'adecuacion', label: 'Adecuación' },
  { value: 'tablero', label: 'Tablero' },
  { value: 'puesta-a-tierra', label: 'Puesta a tierra' },
  { value: 'otro', label: 'Otro' },
] as const

const urgencies = [
  { value: 'hoy', label: 'Hoy' },
  { value: '24-48h', label: '24-48 h' },
  { value: 'esta-semana', label: 'Esta semana' },
  { value: 'sin-apuro', label: 'Sin apuro' },
] as const

type PresupuestoFormProps = {
  whatsappNumber: string
  leadType?: string
  plan?: string
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function PresupuestoForm({ whatsappNumber, leadType, plan }: PresupuestoFormProps) {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [leadId, setLeadId] = useState<string | null>(null)
  const [leadName, setLeadName] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const defaultClientType = useMemo(() => {
    if (leadType === 'consorcio') return 'consorcio'
    if (leadType === 'comercio') return 'empresa'
    return 'empresa'
  }, [leadType])

  const defaultWorkType = useMemo(() => {
    if (leadType === 'mantenimiento') return 'mantenimiento'
    if (leadType === 'obra') return 'obra-nueva'
    return 'reforma'
  }, [leadType])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    setSelectedFiles(files)
    setErrorMessage(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('submitting')
    setErrorMessage(null)

    const form = event.currentTarget
    const formData = new FormData()
    const rawFormData = new FormData(form)
    const nameValue = String(rawFormData.get('nombre') ?? '')
    const attribution = readAttribution()

    formData.set('name', nameValue)
    formData.set('phone', String(rawFormData.get('telefono') ?? ''))
    formData.set('email', String(rawFormData.get('email') ?? ''))
    formData.set('clientType', String(rawFormData.get('cliente') ?? ''))
    formData.set('location', String(rawFormData.get('ubicacion') ?? ''))
    formData.set('address', String(rawFormData.get('direccion') ?? ''))
    formData.set('workType', String(rawFormData.get('trabajo') ?? ''))
    formData.set('urgency', String(rawFormData.get('urgencia') ?? ''))
    formData.set('details', String(rawFormData.get('detalle') ?? ''))
    formData.set('consent', String(Boolean(rawFormData.get('consentimiento'))))
    formData.set('leadType', leadType || '')
    formData.set('plan', plan || '')
    formData.set('reason', leadType || plan || '')
    formData.set('hasFiles', String(selectedFiles.length > 0))
    formData.set('utmSource', attribution.utmSource || '')
    formData.set('utmMedium', attribution.utmMedium || '')
    formData.set('utmCampaign', attribution.utmCampaign || '')
    formData.set('utmTerm', attribution.utmTerm || '')
    formData.set('utmContent', attribution.utmContent || '')
    formData.set('fbclid', attribution.fbclid || '')
    formData.set('gclid', attribution.gclid || '')
    formData.set('landingPage', attribution.landingPage || '')
    formData.set('referrer', attribution.referrer || '')

    selectedFiles.forEach((file) => {
      formData.append('adjuntos', file, file.name)
    })

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error || 'Lead submission failed')
      }

      const data: { leadId: string } = await response.json()
      setLeadId(data.leadId)
      setLeadName(nameValue)
      setStatus('success')
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('lead_submitted', { detail: { leadId: data.leadId } }))
        const eventName = leadType === 'visita' ? 'book_appointment' : 'generate_lead'
        trackEvent(eventName, {
          content_name: leadType ? `Presupuesto ${leadType}` : 'Presupuesto',
          content_type: 'form',
          plan_tier: plan || undefined,
          channel: leadType === 'visita' ? 'schedule' : 'form',
          user_data: { email: String(rawFormData.get('email') ?? ''), phone: String(rawFormData.get('telefono') ?? '') },
        })
      }
      form.reset()
      setSelectedFiles([])
    } catch (error) {
      console.error(error)
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'No pudimos enviar el formulario. Probá de nuevo en unos minutos.')
    }
  }

  if (status === 'success' && leadId) {
    const message = `Hola, soy ${leadName ?? 'un cliente'}. Envié un pedido de presupuesto (ID: ${leadId}). Quiero coordinar.`
    const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    return (
      <div className="space-y-5 rounded-3xl border border-border bg-white p-4 shadow-subtle sm:p-6 lg:p-8">
        <h2 className="text-2xl font-semibold text-foreground">¡Solicitud enviada!</h2>
        <p className="text-sm text-slate-600">
          Recibimos tu pedido. Tu ID de solicitud es <strong>{leadId}</strong>. Te respondemos en 24–48 h.
        </p>
        <Button asChild size="lg">
          <a href={whatsappHref} target="_blank" rel="noreferrer" data-track="whatsapp" data-content-name="WhatsApp presupuesto">
            Continuar por WhatsApp
          </a>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-border bg-white p-4 shadow-subtle sm:p-6 lg:p-8">
      <AttributionFields />
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="nombre">Nombre y Apellido *</Label>
          <Input id="nombre" name="nombre" required placeholder="Ej: Carla Méndez" />
        </div>
        <div>
          <Label htmlFor="telefono">Teléfono (WhatsApp) *</Label>
          <Input id="telefono" name="telefono" required placeholder="11 5555-5555" />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" required placeholder="correo@empresa.com" />
        </div>
        <div>
          <Label htmlFor="cliente">Tipo de cliente *</Label>
          <select
            id="cliente"
            name="cliente"
            defaultValue={defaultClientType}
            className="min-h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            required
          >
            {clientTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="ubicacion">Ubicación (barrio) *</Label>
          <Input id="ubicacion" name="ubicacion" required placeholder="Ej: Palermo" />
        </div>
        <div>
          <Label htmlFor="direccion">Dirección (opcional)</Label>
          <Input id="direccion" name="direccion" placeholder="Calle y número" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="trabajo">Tipo de trabajo *</Label>
          <select
            id="trabajo"
            name="trabajo"
            defaultValue={defaultWorkType}
            className="min-h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            required
          >
            {workTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="urgencia">Urgencia *</Label>
          <select
            id="urgencia"
            name="urgencia"
            defaultValue="24-48h"
            className="min-h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            required
          >
            {urgencies.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <Label htmlFor="detalle">Detalle del pedido *</Label>
        <Textarea
          id="detalle"
          name="detalle"
          required
          placeholder="Ej: mantenimiento preventivo de tableros + puesta a tierra, visitas mensuales."
        />
      </div>
      <div>
        <Label htmlFor="adjuntos">Adjuntar fotos o plano (opcional)</Label>
        <Input id="adjuntos" name="adjuntos" type="file" multiple accept="image/*,.pdf" onChange={handleFileChange} />
        <p className="mt-2 text-xs text-slate-500">Formatos permitidos: imágenes o PDF. Máximo recomendado: 10 MB por archivo.</p>
        {selectedFiles.length > 0 && (
          <ul className="mt-2 space-y-1 text-xs text-slate-600">
            {selectedFiles.map((file) => (
              <li key={`${file.name}-${file.lastModified}`}>{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</li>
            ))}
          </ul>
        )}
      </div>
      {plan && (
        <p className="rounded-2xl border border-border bg-muted/50 p-3 text-sm text-slate-600">
          Plan seleccionado: <strong>{plan}</strong>
        </p>
      )}
      <label className="flex items-start gap-3 text-sm text-slate-600">
        <input
          type="checkbox"
          name="consentimiento"
          required
          className="mt-1 h-5 w-5 rounded border-border text-accent focus-visible:ring-accent/40"
        />
        Acepto contacto por WhatsApp/Email.
      </label>
      {status === 'error' && <p className="text-sm text-red-600">{errorMessage}</p>}
      {status === 'submitting' && <p className="text-sm text-slate-500">Enviando formulario y adjuntos, por favor esperá...</p>}
      <Button type="submit" size="lg" disabled={status === 'submitting'} className="w-full sm:w-auto">
        {status === 'submitting' ? 'Enviando...' : 'Enviar solicitud'}
      </Button>
    </form>
  )
}
