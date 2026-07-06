'use client'

import { useMemo, useState } from 'react'
import type {
  ElectricalAdminContent,
  ElectricalAdminContentState,
  ManagedCommercialElectricalService,
} from '@/lib/electrical-admin-content'
import { AdminMediaField } from '@/components/admin/AdminMediaField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type Tab = 'quickServices' | 'visualGuides' | 'diagnosticFaults' | 'commercialServices'

const tabs: Array<{ id: Tab; label: string }> = [
  { id: 'quickServices', label: 'Servicios rápidos' },
  { id: 'visualGuides', label: 'Guías visuales' },
  { id: 'diagnosticFaults', label: 'Diagnóstico de fallas' },
  { id: 'commercialServices', label: 'Comercios / consorcios / countries' },
]

function lines(value: unknown) {
  return Array.isArray(value) ? value.join('\n') : ''
}

function split(value: string) {
  return value.split('\n').map((x) => x.trim()).filter(Boolean)
}

function updateAt<T>(items: T[], index: number, patch: Partial<T>) {
  return items.map((item, i) => (i === index ? { ...item, ...patch } : item))
}

function parseCallouts(value: string) {
  return split(value).map((line, index) => {
    const match = line.match(/^(\d+)\s*[).:-]?\s*(.*)$/)
    return { number: match ? Number(match[1]) : index + 1, label: match?.[2]?.trim() || line }
  })
}

function calloutLines(value: Array<{ number: number; label: string }>) {
  return value.map((item) => `${item.number}. ${item.label}`).join('\n')
}

function relatedLines(value: Array<{ label: string; targetServiceId: string }>) {
  return value.map((item) => `${item.label}|${item.targetServiceId}`).join('\n')
}

function parseRelated(value: string) {
  return split(value).map((line) => {
    const [label, targetServiceId] = line.split('|')
    return { label: label?.trim() || 'Servicio relacionado', targetServiceId: targetServiceId?.trim() || '' }
  })
}

function emptyCommercialService(order: number): ManagedCommercialElectricalService {
  return {
    id: `comercial-${Date.now()}`,
    title: 'Nuevo servicio comercial',
    description: '',
    quoteNeeds: '',
    access: '',
    requiredFields: [],
    accessConditions: [],
    materials: 'a definir',
    schedule: 'a coordinar',
    height: 'según caso',
    authorization: 'según inmueble',
    priceLabel: 'a cotizar',
    basePrice: null,
    active: true,
    order,
  }
}

function StatusCard({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${danger ? 'border-red-200 bg-red-50 text-red-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>
      <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  )
}

function BooleanField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4" />
      {label}
    </label>
  )
}

export function ElectricalContentManager({ initialState }: { initialState: ElectricalAdminContentState }) {
  const [content, setContent] = useState<ElectricalAdminContent>(initialState.content)
  const [tab, setTab] = useState<Tab>('quickServices')
  const [message, setMessage] = useState('')
  const [dirty, setDirty] = useState(false)
  const [technicalStatus, setTechnicalStatus] = useState(initialState.status.technicalStatus)
  const activeCount = useMemo(() => (content[tab] as unknown[]).length, [content, tab])
  const canPersist = technicalStatus.dbPersistent

  function patchContent(updater: (current: ElectricalAdminContent) => ElectricalAdminContent) {
    setContent((current) => updater(current))
    setDirty(true)
    setMessage('Falta guardar cambios.')
  }

  async function save() {
    if (!canPersist) {
      setMessage('No se guardó: la DB no es persistente o apunta a /tmp.')
      return
    }
    setMessage('Guardando...')
    const response = await fetch('/api/admin/electrical-content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    })
    const payload = await response.json().catch(() => null)
    if (!response.ok) {
      if (payload?.technicalStatus) setTechnicalStatus(payload.technicalStatus)
      setMessage(payload?.error ?? 'Error al guardar. No se confirmó persistencia.')
      return
    }
    if (payload?.technicalStatus) setTechnicalStatus(payload.technicalStatus)
    setDirty(false)
    setMessage('Guardado correctamente. La web pública refleja estos cambios desde la misma fuente de datos.')
  }

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">Admin madre · contenido público</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Trabajos eléctricos</h1>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
          Esta pantalla edita la fuente única <strong>WebsiteContent/{initialState.status.key}</strong>. Las rutas legacy redirigen acá; el fallback TypeScript queda solo como respaldo visible.
        </p>
      </header>

      <section className="grid gap-3 md:grid-cols-4">
        <StatusCard label="Contenido guardado" value={initialState.status.hasPersistedContent ? 'Sí' : 'No'} danger={!initialState.status.hasPersistedContent} />
        <StatusCard label="Fallback activo" value={initialState.status.isFallback ? 'Sí' : 'No'} danger={initialState.status.isFallback} />
        <StatusCard label="DB persistente" value={technicalStatus.dbPersistent ? 'Sí' : 'No'} danger={!technicalStatus.dbPersistent} />
        <StatusCard label="Storage persistente" value={technicalStatus.uploadPersistent ? 'Sí' : 'No'} danger={!technicalStatus.uploadPersistent} />
      </section>

      {initialState.status.warnings.length ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-semibold">Advertencias reales del admin</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {initialState.status.warnings.map((warning) => <li key={warning}>{warning}</li>)}
          </ul>
          <p className="mt-3">DB: <strong>{technicalStatus.databaseUrlLabel}</strong> · Storage: <strong>{technicalStatus.storageProvider}</strong> · Dir: <strong>{technicalStatus.storageDirLabel}</strong></p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <Button key={item.id} type="button" variant={tab === item.id ? 'primary' : 'outline'} onClick={() => setTab(item.id)}>
            {item.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm text-slate-600">{activeCount} items · {dirty ? 'falta guardar cambios' : 'sin cambios pendientes'}</span>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => { setContent(initialState.content); setDirty(false); setMessage('Restaurado a la última carga del servidor.') }}>
            Restaurar últimos cargados
          </Button>
          <Button type="button" onClick={save} disabled={!canPersist}>
            Guardar cambios
          </Button>
        </div>
      </div>
      {message ? <p className="rounded-xl bg-slate-100 p-3 text-sm text-slate-700">{message}</p> : null}
      {!canPersist ? <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">Guardado bloqueado: configurá una DB persistente antes de usar este admin como CMS real.</p> : null}

      {tab === 'quickServices' ? (
        <div className="space-y-4">
          {content.quickServices.map((service, index) => (
            <article key={service.id} className="space-y-3 rounded-2xl border bg-white p-4">
              <div className="grid gap-3 md:grid-cols-4">
                <Input value={service.title} onChange={(e) => patchContent((c) => ({ ...c, quickServices: updateAt(c.quickServices, index, { title: e.target.value }) }))} />
                <Input type="number" value={service.baseLaborPrice} onChange={(e) => patchContent((c) => ({ ...c, quickServices: updateAt(c.quickServices, index, { baseLaborPrice: Number(e.target.value) }) }))} />
                <Input type="number" value={service.order} onChange={(e) => patchContent((c) => ({ ...c, quickServices: updateAt(c.quickServices, index, { order: Number(e.target.value) }) }))} />
                <BooleanField label="Activo" checked={service.active} onChange={(active) => patchContent((c) => ({ ...c, quickServices: updateAt(c.quickServices, index, { active }) }))} />
              </div>
              <Textarea value={service.description} onChange={(e) => patchContent((c) => ({ ...c, quickServices: updateAt(c.quickServices, index, { description: e.target.value }) }))} />
              <div className="grid gap-3 md:grid-cols-4">
                <Input type="number" value={service.durationMin} onChange={(e) => patchContent((c) => ({ ...c, quickServices: updateAt(c.quickServices, index, { durationMin: Number(e.target.value) }) }))} placeholder="Duración min" />
                <Input type="number" value={service.durationMax} onChange={(e) => patchContent((c) => ({ ...c, quickServices: updateAt(c.quickServices, index, { durationMax: Number(e.target.value) }) }))} placeholder="Duración max" />
                <select className="h-11 rounded-xl border border-border bg-white px-3 text-sm" value={String(service.requiresVisit)} onChange={(e) => patchContent((c) => ({ ...c, quickServices: updateAt(c.quickServices, index, { requiresVisit: e.target.value === 'segun_caso' ? 'segun_caso' : e.target.value === 'true' }) }))}>
                  <option value="false">No requiere visita</option>
                  <option value="true">Requiere visita</option>
                  <option value="segun_caso">Según caso</option>
                </select>
                <BooleanField label="Requiere fotos" checked={service.photoRequired} onChange={(photoRequired) => patchContent((c) => ({ ...c, quickServices: updateAt(c.quickServices, index, { photoRequired }) }))} />
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <Textarea value={lines(service.usualMaterials)} onChange={(e) => patchContent((c) => ({ ...c, quickServices: updateAt(c.quickServices, index, { usualMaterials: split(e.target.value) }) }))} placeholder="Materiales habituales" />
                <Textarea value={service.appliesWhen} onChange={(e) => patchContent((c) => ({ ...c, quickServices: updateAt(c.quickServices, index, { appliesWhen: e.target.value }) }))} placeholder="Aplica si" />
                <Textarea value={service.doesNotApplyWhen} onChange={(e) => patchContent((c) => ({ ...c, quickServices: updateAt(c.quickServices, index, { doesNotApplyWhen: e.target.value }) }))} placeholder="No aplica si" />
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <Textarea value={lines(service.includes)} onChange={(e) => patchContent((c) => ({ ...c, quickServices: updateAt(c.quickServices, index, { includes: split(e.target.value) }) }))} placeholder="Qué incluye" />
                <Textarea value={lines(service.excludes)} onChange={(e) => patchContent((c) => ({ ...c, quickServices: updateAt(c.quickServices, index, { excludes: split(e.target.value) }) }))} placeholder="Qué no incluye" />
                <Textarea value={lines(service.priceModifiers)} onChange={(e) => patchContent((c) => ({ ...c, quickServices: updateAt(c.quickServices, index, { priceModifiers: split(e.target.value) }) }))} placeholder="Cuándo cambia el precio" />
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {tab === 'visualGuides' ? (
        <div className="space-y-4">
          {content.visualGuides.map((item, index) => (
            <article key={item.serviceId} className="space-y-3 rounded-2xl border bg-white p-4">
              <div className="grid gap-3 md:grid-cols-4">
                <Input value={item.serviceId} onChange={(e) => patchContent((c) => ({ ...c, visualGuides: updateAt(c.visualGuides, index, { serviceId: e.target.value }) }))} />
                <Input type="number" value={item.order} onChange={(e) => patchContent((c) => ({ ...c, visualGuides: updateAt(c.visualGuides, index, { order: Number(e.target.value) }) }))} />
                <BooleanField label="Activa" checked={item.active} onChange={(active) => patchContent((c) => ({ ...c, visualGuides: updateAt(c.visualGuides, index, { active }) }))} />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Input value={item.visualGuide.diagramTitle} onChange={(e) => patchContent((c) => ({ ...c, visualGuides: updateAt(c.visualGuides, index, { visualGuide: { ...item.visualGuide, diagramTitle: e.target.value } }) }))} />
                <Input value={item.visualGuide.diagramSubtitle} onChange={(e) => patchContent((c) => ({ ...c, visualGuides: updateAt(c.visualGuides, index, { visualGuide: { ...item.visualGuide, diagramSubtitle: e.target.value } }) }))} />
              </div>
              <AdminMediaField id={`guide-${item.serviceId}`} label="Imagen principal" value={item.visualGuide.imageSrc} uploadFolder="service-guides" accept="image/png,image/jpeg,image/webp,image/svg+xml" allowManualUrl onChange={(value) => patchContent((c) => ({ ...c, visualGuides: updateAt(c.visualGuides, index, { visualGuide: { ...item.visualGuide, imageSrc: value } }) }))} />
              <Input value={item.visualGuide.imageAlt} onChange={(e) => patchContent((c) => ({ ...c, visualGuides: updateAt(c.visualGuides, index, { visualGuide: { ...item.visualGuide, imageAlt: e.target.value } }) }))} placeholder="Alt de imagen" />
              <div className="grid gap-3 md:grid-cols-3">
                <Textarea value={calloutLines(item.visualGuide.callouts)} onChange={(e) => patchContent((c) => ({ ...c, visualGuides: updateAt(c.visualGuides, index, { visualGuide: { ...item.visualGuide, callouts: parseCallouts(e.target.value) } }) }))} placeholder="1. tapa" />
                <Textarea value={lines(item.visualGuide.appliesIf)} onChange={(e) => patchContent((c) => ({ ...c, visualGuides: updateAt(c.visualGuides, index, { visualGuide: { ...item.visualGuide, appliesIf: split(e.target.value) } }) }))} placeholder="Aplica si" />
                <Textarea value={lines(item.visualGuide.doesNotApplyIf)} onChange={(e) => patchContent((c) => ({ ...c, visualGuides: updateAt(c.visualGuides, index, { visualGuide: { ...item.visualGuide, doesNotApplyIf: split(e.target.value) } }) }))} placeholder="No aplica si" />
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <Input value={item.visualGuide.usualMaterialsShort} onChange={(e) => patchContent((c) => ({ ...c, visualGuides: updateAt(c.visualGuides, index, { visualGuide: { ...item.visualGuide, usualMaterialsShort: e.target.value } }) }))} placeholder="Materiales habituales" />
                <Input value={item.visualGuide.durationLabel} onChange={(e) => patchContent((c) => ({ ...c, visualGuides: updateAt(c.visualGuides, index, { visualGuide: { ...item.visualGuide, durationLabel: e.target.value } }) }))} placeholder="Duración" />
                <Textarea value={relatedLines(item.visualGuide.relatedIfNotApplies)} onChange={(e) => patchContent((c) => ({ ...c, visualGuides: updateAt(c.visualGuides, index, { visualGuide: { ...item.visualGuide, relatedIfNotApplies: parseRelated(e.target.value) } }) }))} placeholder="Servicio relacionado|target-id" />
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {tab === 'diagnosticFaults' ? (
        <div className="space-y-4">
          {content.diagnosticFaults.map((fault, index) => (
            <article key={fault.id} className="space-y-3 rounded-2xl border bg-white p-4">
              <div className="grid gap-3 md:grid-cols-5">
                <Input value={fault.faultName} onChange={(e) => patchContent((c) => ({ ...c, diagnosticFaults: updateAt(c.diagnosticFaults, index, { faultName: e.target.value }) }))} />
                <Input type="number" value={fault.initialPrice} onChange={(e) => patchContent((c) => ({ ...c, diagnosticFaults: updateAt(c.diagnosticFaults, index, { initialPrice: Number(e.target.value) }) }))} />
                <Input type="number" value={fault.includedMinutes} onChange={(e) => patchContent((c) => ({ ...c, diagnosticFaults: updateAt(c.diagnosticFaults, index, { includedMinutes: Number(e.target.value) }) }))} />
                <Input type="number" value={fault.order} onChange={(e) => patchContent((c) => ({ ...c, diagnosticFaults: updateAt(c.diagnosticFaults, index, { order: Number(e.target.value) }) }))} />
                <BooleanField label="Activo" checked={fault.active} onChange={(active) => patchContent((c) => ({ ...c, diagnosticFaults: updateAt(c.diagnosticFaults, index, { active }) }))} />
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <Textarea value={lines(fault.possibleCauses)} onChange={(e) => patchContent((c) => ({ ...c, diagnosticFaults: updateAt(c.diagnosticFaults, index, { possibleCauses: split(e.target.value) }) }))} placeholder="Posibles causas" />
                <Textarea value={lines(fault.usualTests)} onChange={(e) => patchContent((c) => ({ ...c, diagnosticFaults: updateAt(c.diagnosticFaults, index, { usualTests: split(e.target.value) }) }))} placeholder="Pruebas habituales" />
                <Textarea value={lines(fault.possibleSolutions)} onChange={(e) => patchContent((c) => ({ ...c, diagnosticFaults: updateAt(c.diagnosticFaults, index, { possibleSolutions: split(e.target.value) }) }))} placeholder="Soluciones posibles" />
              </div>
              <Textarea value={fault.disclaimer} onChange={(e) => patchContent((c) => ({ ...c, diagnosticFaults: updateAt(c.diagnosticFaults, index, { disclaimer: e.target.value }) }))} placeholder="Disclaimer" />
            </article>
          ))}
        </div>
      ) : null}

      {tab === 'commercialServices' ? (
        <div className="space-y-4">
          <Button type="button" variant="outline" onClick={() => patchContent((c) => ({ ...c, commercialServices: [...c.commercialServices, emptyCommercialService(c.commercialServices.length + 1)] }))}>Agregar servicio comercial</Button>
          {content.commercialServices.map((service, index) => (
            <article key={service.id} className="space-y-3 rounded-2xl border bg-white p-4">
              <div className="grid gap-3 md:grid-cols-5">
                <Input value={service.title} onChange={(e) => patchContent((c) => ({ ...c, commercialServices: updateAt(c.commercialServices, index, { title: e.target.value }) }))} />
                <Input type="number" value={service.basePrice ?? 0} onChange={(e) => patchContent((c) => ({ ...c, commercialServices: updateAt(c.commercialServices, index, { basePrice: e.target.value ? Number(e.target.value) : null }) }))} />
                <Input value={service.priceLabel} onChange={(e) => patchContent((c) => ({ ...c, commercialServices: updateAt(c.commercialServices, index, { priceLabel: e.target.value }) }))} />
                <Input type="number" value={service.order} onChange={(e) => patchContent((c) => ({ ...c, commercialServices: updateAt(c.commercialServices, index, { order: Number(e.target.value) }) }))} />
                <BooleanField label="Activo" checked={service.active} onChange={(active) => patchContent((c) => ({ ...c, commercialServices: updateAt(c.commercialServices, index, { active }) }))} />
              </div>
              <Textarea value={service.description} onChange={(e) => patchContent((c) => ({ ...c, commercialServices: updateAt(c.commercialServices, index, { description: e.target.value }) }))} placeholder="Descripción" />
              <div className="grid gap-3 md:grid-cols-2">
                <Textarea value={service.quoteNeeds} onChange={(e) => patchContent((c) => ({ ...c, commercialServices: updateAt(c.commercialServices, index, { quoteNeeds: e.target.value }) }))} placeholder="Qué datos necesita" />
                <Textarea value={service.access} onChange={(e) => patchContent((c) => ({ ...c, commercialServices: updateAt(c.commercialServices, index, { access: e.target.value }) }))} placeholder="Condiciones de acceso" />
              </div>
              <div className="grid gap-3 md:grid-cols-4">
                <Input value={service.materials} onChange={(e) => patchContent((c) => ({ ...c, commercialServices: updateAt(c.commercialServices, index, { materials: e.target.value }) }))} placeholder="Materiales" />
                <Input value={service.schedule} onChange={(e) => patchContent((c) => ({ ...c, commercialServices: updateAt(c.commercialServices, index, { schedule: e.target.value }) }))} placeholder="Horario" />
                <Input value={service.height} onChange={(e) => patchContent((c) => ({ ...c, commercialServices: updateAt(c.commercialServices, index, { height: e.target.value }) }))} placeholder="Altura" />
                <Input value={service.authorization} onChange={(e) => patchContent((c) => ({ ...c, commercialServices: updateAt(c.commercialServices, index, { authorization: e.target.value }) }))} placeholder="Autorización" />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Textarea value={lines(service.requiredFields)} onChange={(e) => patchContent((c) => ({ ...c, commercialServices: updateAt(c.commercialServices, index, { requiredFields: split(e.target.value) }) }))} placeholder="Campos requeridos" />
                <Textarea value={lines(service.accessConditions)} onChange={(e) => patchContent((c) => ({ ...c, commercialServices: updateAt(c.commercialServices, index, { accessConditions: split(e.target.value) }) }))} placeholder="Condiciones de acceso" />
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  )
}
