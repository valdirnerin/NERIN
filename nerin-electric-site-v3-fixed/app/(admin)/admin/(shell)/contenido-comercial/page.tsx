'use client'

import { useEffect, useState } from 'react'
import { Copy, Pencil, Plus, Save, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormSection } from '@/components/admin/ui/FormSection'
import { resolveCommercialSite, type CommercialSite } from '@/lib/commercial-content'
import type { AdditionalCost, CommercialCard, CommercialImage, SmallService } from '@/types/site'

const inputClass = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900'
const labelClass = 'space-y-1 text-sm font-semibold text-slate-700'
const panelClass = 'rounded-xl border border-slate-200 bg-slate-50 p-4'
const imageLocations = ['hero-home', 'trabajos-chicos-cards', 'refacciones', 'obras', 'servicios-individuales', 'casos-reales', 'portal-cliente', 'empresa-equipo']

function parseLines(value: string) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean)
}

function emptyService(): SmallService {
  return { active: true, featured: false, category: '', name: '', slug: '', shortDescription: '', priceFrom: 0, showPrice: true, requiresVisit: false, quoteByPhotos: true, includes: [], excludes: [], priceChanges: [], estimatedDuration: '', coverageZone: 'CABA y GBA con confirmación', imageUrl: '', imageAlt: '', customCta: 'Enviar fotos para cotizar', order: 100 }
}

export default function ContenidoComercialPage() {
  const [site, setSite] = useState<CommercialSite | null>(null)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [serviceIndex, setServiceIndex] = useState<number | null>(null)
  const [costIndex, setCostIndex] = useState<number | null>(null)
  const [imageIndex, setImageIndex] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/admin/site').then((response) => response.json()).then((payload) => setSite(resolveCommercialSite(payload))).catch(() => setStatus('error'))
  }, [])

  function patch(value: Partial<CommercialSite>) {
    setSite((current) => current ? { ...current, ...value } : current)
  }

  function updateList<K extends 'commercialCards' | 'smallServices' | 'additionalCosts' | 'commercialImages'>(field: K, items: CommercialSite[K]) {
    patch({ [field]: items } as Pick<CommercialSite, K>)
  }

  async function save() {
    if (!site) return
    setStatus('saving')
    try {
      const response = await fetch('/api/admin/site', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(site) })
      setStatus(response.ok ? 'saved' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (!site) return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">Cargando contenido comercial...</div>

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Contenido comercial</p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div><h1 className="text-3xl font-semibold">Venta, precios e imagen pública</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Editá la home, servicios, costos e imágenes desde formularios visuales.</p></div>
          <Button type="button" onClick={save} disabled={status === 'saving'} className="bg-amber-300 text-slate-950 hover:bg-amber-200"><Save className="mr-2 h-4 w-4" />{status === 'saving' ? 'Guardando...' : 'Guardar cambios'}</Button>
        </div>
        {status === 'saved' ? <p className="mt-3 text-sm text-emerald-200">Cambios guardados.</p> : null}
        {status === 'error' ? <p className="mt-3 text-sm text-red-200">No se pudo guardar. Revisá la sesión de administrador.</p> : null}
      </header>

      <FormSection title="Franja superior comercial" description="Mensaje comercial compacto y editable.">
        <div className="grid gap-4 md:grid-cols-2">
          <Select label="Estado" value={String(site.commercialBar.enabled)} onChange={(value) => patch({ commercialBar: { ...site.commercialBar, enabled: value === 'true' } })} options={[['true', 'Activa'], ['false', 'Pausada']]} />
          <Select label="Modo de visualización" value={site.commercialBar.displayMode} onChange={(value) => patch({ commercialBar: { ...site.commercialBar, displayMode: value as CommercialSite['commercialBar']['displayMode'] } })} options={[['estatica', 'Estática'], ['rotativa', 'Rotativa'], ['marquee-suave', 'Marquee suave']]} />
          <Field className="md:col-span-2" label="Mensajes, uno por línea"><textarea className={inputClass} rows={4} value={site.commercialBar.messages.join('\n')} onChange={(event) => patch({ commercialBar: { ...site.commercialBar, messages: parseLines(event.target.value).slice(0, 4) } })} /></Field>
          <Field label="Link opcional"><input className={inputClass} value={site.commercialBar.optionalLinkHref} onChange={(event) => patch({ commercialBar: { ...site.commercialBar, optionalLinkHref: event.target.value } })} /></Field>
          <Field label="Texto del link"><input className={inputClass} value={site.commercialBar.optionalLinkLabel} onChange={(event) => patch({ commercialBar: { ...site.commercialBar, optionalLinkLabel: event.target.value } })} /></Field>
        </div>
      </FormSection>

      <FormSection title="Hero comercial home" description="La primera pantalla concentra precios, visita técnica, WhatsApp y cobertura.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field className="md:col-span-2" label="Badge"><input className={inputClass} value={site.hero.badge} onChange={(event) => patch({ hero: { ...site.hero, badge: event.target.value } })} /></Field>
          <Field className="md:col-span-2" label="Título principal"><input className={inputClass} value={site.hero.title} onChange={(event) => patch({ hero: { ...site.hero, title: event.target.value } })} /></Field>
          <Field className="md:col-span-2" label="Bajada"><textarea className={inputClass} rows={3} value={site.hero.subtitle} onChange={(event) => patch({ hero: { ...site.hero, subtitle: event.target.value } })} /></Field>
          <Field label="Texto botón primario"><input className={inputClass} value={site.hero.primaryCta.label} onChange={(event) => patch({ hero: { ...site.hero, primaryCta: { ...site.hero.primaryCta, label: event.target.value } } })} /></Field>
          <Field label="Link botón primario"><input className={inputClass} value={site.hero.primaryCta.href} onChange={(event) => patch({ hero: { ...site.hero, primaryCta: { ...site.hero.primaryCta, href: event.target.value } } })} /></Field>
          <Field label="Texto botón secundario"><input className={inputClass} value={site.hero.secondaryCta.label} onChange={(event) => patch({ hero: { ...site.hero, secondaryCta: { ...site.hero.secondaryCta, label: event.target.value } } })} /></Field>
          <Field label="Link botón secundario"><input className={inputClass} value={site.hero.secondaryCta.href} onChange={(event) => patch({ hero: { ...site.hero, secondaryCta: { ...site.hero.secondaryCta, href: event.target.value } } })} /></Field>
          <Field className="md:col-span-2" label="Beneficios, uno por línea"><textarea className={inputClass} rows={4} value={site.hero.benefits.map((item) => item.text).join('\n')} onChange={(event) => patch({ hero: { ...site.hero, benefits: parseLines(event.target.value).map((text) => ({ text })) } })} /></Field>
        </div>
      </FormSection>

      <FormSection title="Precios y reglas comerciales" description="Precio de visita y aclaraciones visibles para clientes.">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Visita técnica desde"><input type="number" className={inputClass} value={site.pricingRules.technicalVisitFrom} onChange={(event) => patch({ pricingRules: { ...site.pricingRules, technicalVisitFrom: Number(event.target.value) } })} /></Field>
          <Field label="Moneda"><input className={inputClass} value={site.pricingRules.currency} onChange={(event) => patch({ pricingRules: { ...site.pricingRules, currency: event.target.value } })} /></Field>
          <Select label="Visita descontable" value={String(site.pricingRules.visitDiscountable)} onChange={(value) => patch({ pricingRules: { ...site.pricingRules, visitDiscountable: value === 'true' } })} options={[['false', 'No'], ['true', 'Sí']]} />
          {(['visitCommercialText', 'urgencySurcharge', 'zoneSurcharge', 'minimumJob', 'quoteValidity', 'priceDisclaimer'] as const).map((field) => <Field key={field} className="md:col-span-3" label={field}><textarea className={inputClass} rows={2} value={site.pricingRules[field]} onChange={(event) => patch({ pricingRules: { ...site.pricingRules, [field]: event.target.value } })} /></Field>)}
        </div>
      </FormSection>

      <FormSection title="Tarjetas debajo del hero" description="Editá, duplicá, ordená o desactivá cada tarjeta.">
        <div className="grid gap-4 lg:grid-cols-2">
          {site.commercialCards.map((card, index) => <CardEditor key={index} card={card} onChange={(next) => updateList('commercialCards', site.commercialCards.map((item, itemIndex) => itemIndex === index ? next : item))} onDuplicate={() => updateList('commercialCards', [...site.commercialCards, { ...card, title: `${card.title} copia`, order: (card.order ?? 0) + 1 }])} onDelete={() => updateList('commercialCards', site.commercialCards.filter((_, itemIndex) => itemIndex !== index))} />)}
          <Button type="button" variant="outline" onClick={() => updateList('commercialCards', [...site.commercialCards, { title: 'Nueva tarjeta', description: '', ctaLabel: 'Ver más', href: '/', order: 100, active: true }])}><Plus className="mr-2 h-4 w-4" />Agregar tarjeta</Button>
        </div>
      </FormSection>

      <FormSection title="Servicios chicos" description="Listado comercial usado por /trabajos-electricos.">
        <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead><tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500"><th className="p-3">Nombre</th><th>Categoría</th><th>Precio desde</th><th>Activo</th><th>Destacado</th><th>Visita</th><th>Fotos</th><th>Orden</th><th /></tr></thead><tbody>{site.smallServices.map((service, index) => <tr key={`${service.slug}-${index}`} className="border-b border-slate-100"><td className="p-3 font-semibold">{service.name}</td><td>{service.category}</td><td>${service.priceFrom.toLocaleString('es-AR')}</td><td>{service.active ? 'Sí' : 'No'}</td><td>{service.featured ? 'Sí' : 'No'}</td><td>{service.requiresVisit ? 'Sí' : 'No'}</td><td>{service.quoteByPhotos ? 'Sí' : 'No'}</td><td>{service.order}</td><td><Button type="button" size="sm" variant="outline" onClick={() => setServiceIndex(index)}><Pencil className="mr-1 h-3 w-3" />Editar</Button></td></tr>)}</tbody></table></div>
        <Button type="button" variant="outline" className="mt-4" onClick={() => { updateList('smallServices', [...site.smallServices, emptyService()]); setServiceIndex(site.smallServices.length) }}><Plus className="mr-2 h-4 w-4" />Agregar servicio</Button>
        {serviceIndex !== null && site.smallServices[serviceIndex] ? <ServiceEditor service={site.smallServices[serviceIndex]} onChange={(next) => updateList('smallServices', site.smallServices.map((item, index) => index === serviceIndex ? next : item))} onDelete={() => { updateList('smallServices', site.smallServices.filter((_, index) => index !== serviceIndex)); setServiceIndex(null) }} onClose={() => setServiceIndex(null)} /> : null}
      </FormSection>

      <FormSection title="Costos adicionales" description="Definí nombre, tipo, monto y cuándo aplica.">
        <div className="grid gap-3 md:grid-cols-2">{site.additionalCosts.map((cost, index) => <button type="button" key={`${cost.name}-${index}`} className={`${panelClass} text-left`} onClick={() => setCostIndex(index)}><div className="flex justify-between gap-3"><span className="font-semibold text-slate-950">{cost.name}</span><span className="text-xs font-bold uppercase text-slate-500">{cost.type}</span></div><p className="mt-2 text-sm text-slate-600">{cost.description}</p></button>)}</div>
        <Button type="button" variant="outline" className="mt-4" onClick={() => { const item: AdditionalCost = { name: 'Nuevo costo', description: '', type: 'a-confirmar', amount: 0, active: true, appliesWhen: '', order: 100 }; updateList('additionalCosts', [...site.additionalCosts, item]); setCostIndex(site.additionalCosts.length) }}><Plus className="mr-2 h-4 w-4" />Agregar costo</Button>
        {costIndex !== null && site.additionalCosts[costIndex] ? <CostEditor cost={site.additionalCosts[costIndex]} onChange={(next) => updateList('additionalCosts', site.additionalCosts.map((item, index) => index === costIndex ? next : item))} onDelete={() => { updateList('additionalCosts', site.additionalCosts.filter((_, index) => index !== costIndex)); setCostIndex(null) }} /> : null}
      </FormSection>

      <FormSection title="Imágenes comerciales" description="Gestioná ubicaciones, texto alternativo y vista previa.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{site.commercialImages.map((item, index) => <button type="button" key={`${item.location}-${index}`} className={`${panelClass} overflow-hidden text-left`} onClick={() => setImageIndex(index)}>{item.url ? <img src={item.url} alt={item.alt} className="mb-3 h-32 w-full rounded-lg object-cover" /> : <div className="mb-3 grid h-32 place-items-center rounded-lg bg-slate-200 text-xs text-slate-500">Sin imagen</div>}<p className="font-semibold text-slate-950">{item.title}</p><p className="text-xs text-slate-500">{item.location} · {item.active ? 'Activa' : 'Inactiva'}</p></button>)}</div>
        <Button type="button" variant="outline" className="mt-4" onClick={() => { const item: CommercialImage = { title: 'Nueva imagen', url: '', location: 'hero-home', alt: '', active: true }; updateList('commercialImages', [...site.commercialImages, item]); setImageIndex(site.commercialImages.length) }}><Plus className="mr-2 h-4 w-4" />Agregar imagen</Button>
        {imageIndex !== null && site.commercialImages[imageIndex] ? <ImageEditor image={site.commercialImages[imageIndex]} onChange={(next) => updateList('commercialImages', site.commercialImages.map((item, index) => index === imageIndex ? next : item))} onDelete={() => { updateList('commercialImages', site.commercialImages.filter((_, index) => index !== imageIndex)); setImageIndex(null) }} /> : null}
      </FormSection>
    </div>
  )
}

function Field({ label, className = '', children }: { label: string; className?: string; children: React.ReactNode }) { return <label className={`${labelClass} ${className}`}><span>{label}</span>{children}</label> }
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[][] }) { return <Field label={label}><select className={inputClass} value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([optionValue, text]) => <option key={optionValue} value={optionValue}>{text}</option>)}</select></Field> }
function BooleanSelect({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) { return <Select label={label} value={String(value)} onChange={(next) => onChange(next === 'true')} options={[['true', 'Sí'], ['false', 'No']]} /> }

function CardEditor({ card, onChange, onDuplicate, onDelete }: { card: CommercialCard; onChange: (card: CommercialCard) => void; onDuplicate: () => void; onDelete: () => void }) {
  return <div className={panelClass}><div className="grid gap-3 sm:grid-cols-2"><Field label="Título"><input className={inputClass} value={card.title} onChange={(e) => onChange({ ...card, title: e.target.value })} /></Field><Field label="Orden"><input type="number" className={inputClass} value={card.order ?? 0} onChange={(e) => onChange({ ...card, order: Number(e.target.value) })} /></Field><Field className="sm:col-span-2" label="Descripción"><textarea className={inputClass} rows={2} value={card.description} onChange={(e) => onChange({ ...card, description: e.target.value })} /></Field><Field label="Texto CTA"><input className={inputClass} value={card.ctaLabel} onChange={(e) => onChange({ ...card, ctaLabel: e.target.value })} /></Field><Field label="Link"><input className={inputClass} value={card.href} onChange={(e) => onChange({ ...card, href: e.target.value })} /></Field><BooleanSelect label="Activa" value={card.active !== false} onChange={(active) => onChange({ ...card, active })} /></div><div className="mt-3 flex gap-2"><Button type="button" size="sm" variant="outline"><Pencil className="mr-1 h-3 w-3" />Editar</Button><Button type="button" size="sm" variant="outline" onClick={onDuplicate}><Copy className="mr-1 h-3 w-3" />Duplicar</Button><Button type="button" size="sm" variant="outline" onClick={onDelete}><Trash2 className="mr-1 h-3 w-3" />Eliminar</Button></div></div>
}

function Repeatable({ label, items, onChange }: { label: string; items: string[]; onChange: (items: string[]) => void }) { return <div className="space-y-2"><p className="text-sm font-semibold text-slate-700">{label}</p>{items.map((item, index) => <div key={index} className="flex gap-2"><input className={inputClass} value={item} onChange={(e) => onChange(items.map((value, itemIndex) => itemIndex === index ? e.target.value : value))} /><Button type="button" size="sm" variant="outline" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}><Trash2 className="h-4 w-4" /></Button></div>)}<Button type="button" size="sm" variant="outline" onClick={() => onChange([...items, ''])}><Plus className="mr-1 h-3 w-3" />Agregar ítem</Button></div> }

function ServiceEditor({ service, onChange, onDelete, onClose }: { service: SmallService; onChange: (service: SmallService) => void; onDelete: () => void; onClose: () => void }) {
  return <div className={`${panelClass} mt-5 space-y-4`}><div className="flex justify-between"><h3 className="text-lg font-semibold">Editar servicio</h3><Button type="button" size="sm" variant="outline" onClick={onClose}>Cerrar</Button></div><div className="grid gap-3 md:grid-cols-3"><BooleanSelect label="Activo" value={service.active} onChange={(active) => onChange({ ...service, active })} /><BooleanSelect label="Destacado" value={service.featured} onChange={(featured) => onChange({ ...service, featured })} /><Field label="Categoría"><input className={inputClass} value={service.category} onChange={(e) => onChange({ ...service, category: e.target.value })} /></Field><Field label="Nombre"><input className={inputClass} value={service.name} onChange={(e) => onChange({ ...service, name: e.target.value })} /></Field><Field label="Slug"><input className={inputClass} value={service.slug} onChange={(e) => onChange({ ...service, slug: e.target.value })} /></Field><Field label="Orden"><input type="number" className={inputClass} value={service.order} onChange={(e) => onChange({ ...service, order: Number(e.target.value) })} /></Field><Field className="md:col-span-3" label="Descripción corta"><textarea className={inputClass} rows={2} value={service.shortDescription} onChange={(e) => onChange({ ...service, shortDescription: e.target.value })} /></Field><Field label="Precio desde"><input type="number" className={inputClass} value={service.priceFrom} onChange={(e) => onChange({ ...service, priceFrom: Number(e.target.value) })} /></Field><BooleanSelect label="Mostrar precio" value={service.showPrice} onChange={(showPrice) => onChange({ ...service, showPrice })} /><BooleanSelect label="Requiere visita" value={service.requiresVisit} onChange={(requiresVisit) => onChange({ ...service, requiresVisit })} /><BooleanSelect label="Cotiza por fotos" value={service.quoteByPhotos} onChange={(quoteByPhotos) => onChange({ ...service, quoteByPhotos })} /><Field label="Duración estimada"><input className={inputClass} value={service.estimatedDuration} onChange={(e) => onChange({ ...service, estimatedDuration: e.target.value })} /></Field><Field label="Zona de cobertura"><input className={inputClass} value={service.coverageZone} onChange={(e) => onChange({ ...service, coverageZone: e.target.value })} /></Field><Field label="Imagen URL"><input className={inputClass} value={service.imageUrl} onChange={(e) => onChange({ ...service, imageUrl: e.target.value })} /></Field><Field label="ALT imagen"><input className={inputClass} value={service.imageAlt} onChange={(e) => onChange({ ...service, imageAlt: e.target.value })} /></Field><Field label="CTA personalizado"><input className={inputClass} value={service.customCta} onChange={(e) => onChange({ ...service, customCta: e.target.value })} /></Field></div><div className="grid gap-4 lg:grid-cols-3"><Repeatable label="Qué incluye" items={service.includes} onChange={(includes) => onChange({ ...service, includes })} /><Repeatable label="Qué no incluye" items={service.excludes} onChange={(excludes) => onChange({ ...service, excludes })} /><Repeatable label="Qué puede cambiar el precio" items={service.priceChanges} onChange={(priceChanges) => onChange({ ...service, priceChanges })} /></div><Button type="button" variant="outline" onClick={onDelete}><Trash2 className="mr-2 h-4 w-4" />Eliminar servicio</Button></div>
}

function CostEditor({ cost, onChange, onDelete }: { cost: AdditionalCost; onChange: (cost: AdditionalCost) => void; onDelete: () => void }) { return <div className={`${panelClass} mt-5 grid gap-3 md:grid-cols-3`}><Field label="Nombre"><input className={inputClass} value={cost.name} onChange={(e) => onChange({ ...cost, name: e.target.value })} /></Field><Select label="Tipo" value={cost.type} onChange={(type) => onChange({ ...cost, type: type as AdditionalCost['type'] })} options={[['fijo', 'Fijo'], ['desde', 'Desde'], ['porcentaje', 'Porcentaje'], ['a-confirmar', 'A confirmar']]} /><Field label="Monto"><input type="number" className={inputClass} value={cost.amount} onChange={(e) => onChange({ ...cost, amount: Number(e.target.value) })} /></Field><Field className="md:col-span-3" label="Descripción"><textarea className={inputClass} value={cost.description} onChange={(e) => onChange({ ...cost, description: e.target.value })} /></Field><Field className="md:col-span-2" label="Cuándo aplica"><input className={inputClass} value={cost.appliesWhen} onChange={(e) => onChange({ ...cost, appliesWhen: e.target.value })} /></Field><Field label="Orden"><input type="number" className={inputClass} value={cost.order} onChange={(e) => onChange({ ...cost, order: Number(e.target.value) })} /></Field><BooleanSelect label="Activo" value={cost.active} onChange={(active) => onChange({ ...cost, active })} /><Button type="button" variant="outline" onClick={onDelete}><Trash2 className="mr-2 h-4 w-4" />Eliminar</Button></div> }

function ImageEditor({ image, onChange, onDelete }: { image: CommercialImage; onChange: (image: CommercialImage) => void; onDelete: () => void }) { return <div className={`${panelClass} mt-5 grid gap-3 md:grid-cols-2`}><Field label="Título"><input className={inputClass} value={image.title} onChange={(e) => onChange({ ...image, title: e.target.value })} /></Field><Select label="Ubicación" value={image.location} onChange={(location) => onChange({ ...image, location })} options={imageLocations.map((location) => [location, location])} /><Field className="md:col-span-2" label="URL"><input className={inputClass} value={image.url} onChange={(e) => onChange({ ...image, url: e.target.value })} /></Field><Field label="ALT"><input className={inputClass} value={image.alt} onChange={(e) => onChange({ ...image, alt: e.target.value })} /></Field><BooleanSelect label="Activa" value={image.active} onChange={(active) => onChange({ ...image, active })} />{image.url ? <img src={image.url} alt={image.alt} className="h-40 w-full rounded-lg object-cover md:col-span-2" /> : null}<Button type="button" variant="outline" onClick={onDelete}><Trash2 className="mr-2 h-4 w-4" />Eliminar</Button></div> }

