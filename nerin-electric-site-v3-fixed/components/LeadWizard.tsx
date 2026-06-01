'use client'

import { FormEvent, useMemo, useState } from 'react'
import { CheckCircle2, Loader2, MessageCircle } from 'lucide-react'
import { leadWorkTypes, propertyTypes, urgencyOptions } from '@/lib/nerin-electricidad'
import { Button } from '@/components/ui/button'

type LeadWizardProps = {
  whatsappHref: string
  initialWorkType?: string
}

const zones = ['CABA', 'GBA'] as const

export function LeadWizard({ whatsappHref, initialWorkType }: LeadWizardProps) {
  const [form, setForm] = useState({
    workType: initialWorkType || leadWorkTypes[0],
    zone: 'CABA',
    location: '',
    propertyType: propertyTypes[0],
    urgency: urgencyOptions[0],
    details: '',
    phone: '',
    name: '',
    email: '',
    consent: true,
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const isWhatsappExternal = whatsappHref.startsWith('http')

  const summary = useMemo(
    () => [form.workType, form.zone, form.location || 'localidad a confirmar', form.urgency].join(' · '),
    [form.location, form.urgency, form.workType, form.zone],
  )

  const update = (key: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')

    const formData = new FormData(event.currentTarget)
    formData.set('clientType', form.propertyType)
    formData.set('location', `${form.zone} - ${form.location}`)
    formData.set('address', form.location)
    formData.set('leadType', 'public-wizard')
    formData.set('reason', form.urgency)
    formData.set('consent', form.consent ? 'true' : 'false')

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        body: formData,
      })
      const payload = (await response.json().catch(() => ({}))) as { error?: string }
      if (!response.ok) throw new Error(payload.error || 'No pudimos enviar la solicitud.')
      setStatus('success')
      setMessage('Solicitud recibida. Si es urgente, reforzala por WhatsApp para priorizar la respuesta.')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'No pudimos enviar la solicitud.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">1. Que necesitas</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {leadWorkTypes.map((item) => (
              <label key={item} className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 has-[:checked]:border-slate-950 has-[:checked]:bg-slate-950 has-[:checked]:text-white">
                <input
                  className="sr-only"
                  type="radio"
                  name="workType"
                  value={item}
                  checked={form.workType === item}
                  onChange={(event) => update('workType', event.target.value)}
                />
                {item}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">2. Donde es</legend>
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-2">
              {zones.map((zone) => (
                <label key={zone} className="flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold has-[:checked]:border-slate-950 has-[:checked]:bg-slate-950 has-[:checked]:text-white">
                  <input
                    className="sr-only"
                    type="radio"
                    name="zone"
                    value={zone}
                    checked={form.zone === zone}
                    onChange={(event) => update('zone', event.target.value)}
                  />
                  {zone}
                </label>
              ))}
            </div>
            <input
              name="locationInput"
              value={form.location}
              onChange={(event) => update('location', event.target.value)}
              placeholder="Barrio o localidad"
              className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-950"
              required
            />
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
          </div>
        </fieldset>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">3. Urgencia</legend>
        <div className="grid gap-2 sm:grid-cols-4">
          {urgencyOptions.map((item) => (
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
        <legend className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">4. Detalle y contacto</legend>
        <div className="grid gap-3 lg:grid-cols-2">
          <textarea
            name="details"
            value={form.details}
            onChange={(event) => update('details', event.target.value)}
            placeholder="Contanos que pasa, desde cuando, si hay cortes, olor, chispazos, tablero, obra o mantenimiento."
            className="min-h-32 rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-slate-950 lg:col-span-2"
            required
          />
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
            name="adjuntos"
            type="file"
            multiple
            accept="image/*,.pdf"
            className="h-11 rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
      </fieldset>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-slate-950">Resumen: {summary}</p>
        <p className="mt-1 text-sm text-slate-700">
          Si hay riesgo, corte o tablero comprometido, conviene diagnosticar antes de que el problema escale.
        </p>
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
            Enviar solicitud
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
