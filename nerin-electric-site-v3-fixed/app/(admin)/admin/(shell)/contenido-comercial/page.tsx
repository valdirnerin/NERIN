'use client'

import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormSection } from '@/components/admin/ui/FormSection'
import { resolveCommercialSite, type CommercialSite } from '@/lib/commercial-content'

type JsonField = 'commercialCards' | 'smallServices' | 'additionalCosts' | 'commercialImages'

const inputClass = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900'
const labelClass = 'space-y-1 text-sm font-semibold text-slate-700'

function parseLines(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function formatJson(value: unknown) {
  return JSON.stringify(value, null, 2)
}

export default function ContenidoComercialPage() {
  const [site, setSite] = useState<CommercialSite | null>(null)
  const [jsonDrafts, setJsonDrafts] = useState<Record<JsonField, string> | null>(null)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    let mounted = true
    fetch('/api/admin/site')
      .then((response) => response.json())
      .then((payload) => {
        const resolved = resolveCommercialSite(payload)
        if (!mounted) return
        setSite(resolved)
        setJsonDrafts({
          commercialCards: formatJson(resolved.commercialCards),
          smallServices: formatJson(resolved.smallServices),
          additionalCosts: formatJson(resolved.additionalCosts),
          commercialImages: formatJson(resolved.commercialImages),
        })
      })
      .catch(() => setStatus('error'))
    return () => {
      mounted = false
    }
  }, [])

  function patch(patchValue: Partial<CommercialSite>) {
    setSite((current) => (current ? { ...current, ...patchValue } : current))
  }

  function patchJson(field: JsonField, value: string) {
    setJsonDrafts((current) => (current ? { ...current, [field]: value } : current))
  }

  async function save() {
    if (!site || !jsonDrafts) return
    setStatus('saving')
    try {
      const payload = {
        ...site,
        commercialCards: JSON.parse(jsonDrafts.commercialCards),
        smallServices: JSON.parse(jsonDrafts.smallServices),
        additionalCosts: JSON.parse(jsonDrafts.additionalCosts),
        commercialImages: JSON.parse(jsonDrafts.commercialImages),
      }
      const response = await fetch('/api/admin/site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      setStatus(response.ok ? 'saved' : 'error')
      if (response.ok) setSite(resolveCommercialSite(payload))
    } catch {
      setStatus('error')
    }
  }

  if (!site || !jsonDrafts) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">Cargando contenido comercial...</div>
  }

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Contenido comercial</p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Venta, precios e imagen publica</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              Edita franja superior, hero, precios, servicios chicos, costos adicionales e imagenes sin tocar codigo.
            </p>
          </div>
          <Button type="button" onClick={save} disabled={status === 'saving'} className="bg-amber-300 text-slate-950 hover:bg-amber-200">
            <Save className="mr-2 h-4 w-4" />
            {status === 'saving' ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
        {status === 'saved' ? <p className="mt-3 text-sm text-emerald-200">Cambios guardados.</p> : null}
        {status === 'error' ? <p className="mt-3 text-sm text-red-200">No se pudo guardar. Revisa JSON y sesion admin.</p> : null}
      </header>

      <FormSection title="Franja superior comercial" description="Mensajes cortos y vendedores. La franja se conserva y queda administrable.">
        <div className="grid gap-4 md:grid-cols-2">
          <label className={labelClass}>
            <span>Activar/desactivar franja</span>
            <select className={inputClass} value={String(site.commercialBar.enabled)} onChange={(event) => patch({ commercialBar: { ...site.commercialBar, enabled: event.target.value === 'true' } })}>
              <option value="true">Activa</option>
              <option value="false">Pausada</option>
            </select>
          </label>
          <label className={labelClass}>
            <span>Modo de visualizacion</span>
            <select className={inputClass} value={site.commercialBar.displayMode} onChange={(event) => patch({ commercialBar: { ...site.commercialBar, displayMode: event.target.value as CommercialSite['commercialBar']['displayMode'] } })}>
              <option value="estatica">Estatica</option>
              <option value="rotativa">Rotativa</option>
              <option value="marquee-suave">Marquee suave</option>
            </select>
          </label>
          <label className={`${labelClass} md:col-span-2`}>
            <span>Mensaje 1 a 4</span>
            <textarea className={inputClass} rows={4} value={site.commercialBar.messages.join('\n')} onChange={(event) => patch({ commercialBar: { ...site.commercialBar, messages: parseLines(event.target.value).slice(0, 4) } })} />
          </label>
          <label className={labelClass}>
            <span>Link opcional</span>
            <input className={inputClass} value={site.commercialBar.optionalLinkHref} onChange={(event) => patch({ commercialBar: { ...site.commercialBar, optionalLinkHref: event.target.value } })} />
          </label>
          <label className={labelClass}>
            <span>Texto del link opcional</span>
            <input className={inputClass} value={site.commercialBar.optionalLinkLabel} onChange={(event) => patch({ commercialBar: { ...site.commercialBar, optionalLinkLabel: event.target.value } })} />
          </label>
          <label className={labelClass}>
            <span>Prioridad mobile</span>
            <select className={inputClass} value={String(site.commercialBar.mobilePriority)} onChange={(event) => patch({ commercialBar: { ...site.commercialBar, mobilePriority: event.target.value === 'true' } })}>
              <option value="true">Alta</option>
              <option value="false">Normal</option>
            </select>
          </label>
        </div>
      </FormSection>

      <FormSection title="Hero comercial home" description="La primera pantalla debe explicar que hace NERIN, donde trabaja, cuanto puede costar arrancar y que boton tocar.">
        <div className="grid gap-4 md:grid-cols-2">
          <label className={`${labelClass} md:col-span-2`}><span>Badge superior</span><input className={inputClass} value={site.hero.badge} onChange={(event) => patch({ hero: { ...site.hero, badge: event.target.value } })} /></label>
          <label className={`${labelClass} md:col-span-2`}><span>Titulo principal</span><input className={inputClass} value={site.hero.title} onChange={(event) => patch({ hero: { ...site.hero, title: event.target.value } })} /></label>
          <label className={`${labelClass} md:col-span-2`}><span>Bajada</span><textarea className={inputClass} rows={3} value={site.hero.subtitle} onChange={(event) => patch({ hero: { ...site.hero, subtitle: event.target.value } })} /></label>
          <label className={labelClass}><span>Texto boton primario</span><input className={inputClass} value={site.hero.primaryCta.label} onChange={(event) => patch({ hero: { ...site.hero, primaryCta: { ...site.hero.primaryCta, label: event.target.value } } })} /></label>
          <label className={labelClass}><span>Link boton primario</span><input className={inputClass} value={site.hero.primaryCta.href} onChange={(event) => patch({ hero: { ...site.hero, primaryCta: { ...site.hero.primaryCta, href: event.target.value } } })} /></label>
          <label className={labelClass}><span>Texto boton secundario</span><input className={inputClass} value={site.hero.secondaryCta.label} onChange={(event) => patch({ hero: { ...site.hero, secondaryCta: { ...site.hero.secondaryCta, label: event.target.value } } })} /></label>
          <label className={labelClass}><span>Link boton secundario</span><input className={inputClass} value={site.hero.secondaryCta.href} onChange={(event) => patch({ hero: { ...site.hero, secondaryCta: { ...site.hero.secondaryCta, href: event.target.value } } })} /></label>
          <label className={`${labelClass} md:col-span-2`}><span>Beneficios cortos debajo del hero</span><textarea className={inputClass} rows={3} value={site.hero.benefits.map((item) => item.text).join('\n')} onChange={(event) => patch({ hero: { ...site.hero, benefits: parseLines(event.target.value).map((text) => ({ text })) } })} /></label>
          <label className={`${labelClass} md:col-span-2`}><span>Imagen principal o card visual</span><input className={inputClass} value={site.hero.backgroundImage} onChange={(event) => patch({ hero: { ...site.hero, backgroundImage: event.target.value } })} /></label>
        </div>
      </FormSection>

      <FormSection title="Precios y reglas comerciales" description="Precio de visita, recargos, minimo, validez y texto de precios orientativos.">
        <div className="grid gap-4 md:grid-cols-3">
          <label className={labelClass}><span>Visita tecnica desde</span><input type="number" className={inputClass} value={site.pricingRules.technicalVisitFrom} onChange={(event) => patch({ pricingRules: { ...site.pricingRules, technicalVisitFrom: Number(event.target.value) } })} /></label>
          <label className={labelClass}><span>Moneda</span><input className={inputClass} value={site.pricingRules.currency} onChange={(event) => patch({ pricingRules: { ...site.pricingRules, currency: event.target.value } })} /></label>
          <label className={labelClass}><span>Visita descontable</span><select className={inputClass} value={String(site.pricingRules.visitDiscountable)} onChange={(event) => patch({ pricingRules: { ...site.pricingRules, visitDiscountable: event.target.value === 'true' } })}><option value="false">No</option><option value="true">Si</option></select></label>
          {(['visitCommercialText', 'urgencySurcharge', 'zoneSurcharge', 'minimumJob', 'quoteValidity', 'priceDisclaimer'] as const).map((field) => (
            <label key={field} className={`${labelClass} md:col-span-3`}>
              <span>{field}</span>
              <textarea className={inputClass} rows={2} value={site.pricingRules[field]} onChange={(event) => patch({ pricingRules: { ...site.pricingRules, [field]: event.target.value } })} />
            </label>
          ))}
        </div>
      </FormSection>

      <JsonEditor title="Tarjetas debajo del hero" field="commercialCards" value={jsonDrafts.commercialCards} onChange={patchJson} />
      <JsonEditor title="Servicios chicos" field="smallServices" value={jsonDrafts.smallServices} onChange={patchJson} />
      <JsonEditor title="Costos adicionales" field="additionalCosts" value={jsonDrafts.additionalCosts} onChange={patchJson} />
      <JsonEditor title="Imagenes comerciales" field="commercialImages" value={jsonDrafts.commercialImages} onChange={patchJson} />
    </div>
  )
}

function JsonEditor({ title, field, value, onChange }: { title: string; field: JsonField; value: string; onChange: (field: JsonField, value: string) => void }) {
  return (
    <FormSection title={title} description="Edita el JSON para agregar, ordenar o modificar elementos. Guardar valida el formato antes de publicar.">
      <textarea className={`${inputClass} font-mono`} rows={14} value={value} onChange={(event) => onChange(field, event.target.value)} />
    </FormSection>
  )
}
