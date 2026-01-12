'use client'

import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AttributionFields } from '@/components/tracking/AttributionFields'
import { readAttribution, trackLeadEvent } from '@/lib/tracking'

const clientTypes = [
  { value: 'consorcio', label: 'Consorcio' },
  { value: 'empresa', label: 'Empresa' },
  { value: 'obra', label: 'Obra' },
  { value: 'vivienda', label: 'Vivienda' },
] as const

const workTypes = [
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'obra-nueva', label: 'Obra nueva' },
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

  const defaultClientType = useMemo(() => {
    if (leadType === 'consorcio') return 'consorcio'
    if (leadType === 'comercio') return 'empresa'
    return 'empresa'
  }, [leadType])

  const defaultWorkType = useMemo(() => {
    if (leadType === 'mantenimiento') return 'mantenimiento'
    return 'adecuacion'
  }, [leadType])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('submitting')
    setErrorMessage(null)

    const form = event.currentTarget
    const formData = new FormData(form)
    const hasFiles = (form.elements.namedItem('adjuntos') as HTMLInputElement | null)?.files?.length
      ? true
      : false

    const nameValue = String(formData.get('nombre') ?? '')
    const attribution = readAttribution()
    const payload = {
      name: nameValue,
      phone: String(formData.get('telefono') ?? ''),
      email: String(formData.get('email') ?? ''),
      clientType: String(formData.get('cliente') ?? ''),
      location: String(formData.get('ubicacion') ?? ''),
      address: String(formData.get('direccion') ?? ''),
      workType: String(formData.get('trabajo') ?? ''),
      urgency: String(formData.get('urgencia') ?? ''),
      details: String(formData.get('detalle') ?? ''),
      consent: Boolean(formData.get('consentimiento')),
      leadType: leadType || undefined,
      plan: plan || undefined,
      reason: leadType || plan || undefined,
      hasFiles,
      utmSource: attribution.utmSource,
      utmMedium: attribution.utmMedium,
      utmCampaign: attribution.utmCampaign,
      utmTerm: attribution.utmTerm,
      utmContent: attribution.utmContent,
      fbclid: attribution.fbclid,
      gclid: attribution.gclid,
      landingPage: attribution.landingPage,
      referrer: attribution.referrer,
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Lead submission failed')
      }

      const data: { leadId: string } = await response.json()
      setLeadId(data.leadId)
      setLeadName(nameValue)
      setStatus('success')
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('lead_submitted', { detail: { leadId: data.leadId } }))
        trackLeadEvent()
      }
      form.reset()
    } catch (error) {
      console.error(error)
      setStatus('error')
      setErrorMessage('No pudimos enviar el formulario. Probá de nuevo en unos minutos.')
    }
  }

  if (status === 'success' && leadId) {
    const message = `Hola, soy ${leadName ?? 'un cliente'}. Envié un pedido de presupuesto (ID: ${leadId}). Quiero coordinar.`
    const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    return (
      <div className="space-y-6 rounded-3xl border border-border bg-white p-8 shadow-subtle">
        <h2 className="text-2xl font-semibold text-foreground">¡Solicitud enviada!</h2>
        <p className="text-sm text-slate-600">
          Recibimos tu pedido. Tu ID de solicitud es <strong>{leadId}</strong>. Te respondemos en 24–48 h.
        </p>
        <Button asChild size="lg">
          <a href={whatsappHref} target="_blank" rel="noreferrer">
            Continuar por WhatsApp
          </a>
        </Button>
        <p className="text-xs text-slate-500">Si tenés fotos o planos, podés enviarlos en la conversación.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-border bg-white p-8 shadow-subtle">
      <AttributionFields />
      <div className="grid gap-4 sm:grid-cols-2">
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
            className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="trabajo">Tipo de trabajo *</Label>
          <select
            id="trabajo"
            name="trabajo"
            defaultValue={defaultWorkType}
            className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
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
            className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
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
        <Input id="adjuntos" name="adjuntos" type="file" multiple />
        <p className="mt-2 text-xs text-slate-500">Si no podés adjuntar, envialo por WhatsApp luego.</p>
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
          className="mt-1 h-4 w-4 rounded border-border text-accent focus-visible:ring-accent/40"
        />
        Acepto contacto por WhatsApp/Email.
      </label>
      {status === 'error' && <p className="text-sm text-red-600">{errorMessage}</p>}
      <Button type="submit" size="lg" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Enviando...' : 'Enviar solicitud'}
      </Button>
    </form>
  )
}
