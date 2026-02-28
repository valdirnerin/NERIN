'use client'

import { useMemo, useState, useTransition } from 'react'
import { calculateTotals } from './calculations'
import { professionalCatalog, quoteServices } from './catalog'
import { WizardAdditional, WizardPack, WizardSummary } from './types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { createConfiguratorQuote } from './actions'

const steps = ['Modo y servicio', 'Definición técnica', 'Ajustes comerciales', 'Resumen']

interface Props {
  packs: WizardPack[]
  adicionales: WizardAdditional[]
  defaultPackId?: string
}

export function ConfiguratorWizard({ packs, adicionales, defaultPackId }: Props) {
  const [step, setStep] = useState(0)
  const [summary, setSummary] = useState<WizardSummary>({
    mode: 'EXPRESS',
    serviceId: quoteServices[0].id,
    zoneTier: 'PRIORITY',
    urgencyMultiplier: 1,
    difficultyMultiplier: 1,
    packId: defaultPackId && packs.some((pack) => pack.id === defaultPackId) ? defaultPackId : packs[0]?.id ?? '',
    ambientes: 4,
    bocasExtra: 0,
    adicionales: [],
    professionalItems: professionalCatalog
      .filter((item) => item.suggestedQty)
      .map((item) => ({ id: item.id, cantidad: item.suggestedQty ?? 0 })),
    comentarios: '',
  })
  const [contacto, setContacto] = useState({ nombre: '', email: '' })
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const selectedPack = useMemo(() => packs.find((pack) => pack.id === summary.packId) ?? packs[0] ?? null, [packs, summary.packId])
  const totals = useMemo(() => calculateTotals({ pack: selectedPack, adicionales, summary, services: quoteServices, catalog: professionalCatalog }), [selectedPack, adicionales, summary])

  const next = () => setStep((prev) => Math.min(prev + 1, steps.length - 1))
  const back = () => setStep((prev) => Math.max(prev - 1, 0))

  const updateItems = (id: string, cantidad: number, key: 'adicionales' | 'professionalItems') => {
    setSummary((prev) => {
      const filtered = prev[key].filter((item) => item.id !== id)
      if (cantidad <= 0) return { ...prev, [key]: filtered }
      return { ...prev, [key]: [...filtered, { id, cantidad }] }
    })
  }

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await createConfiguratorQuote({ ...summary, nombre: contacto.nombre || undefined, email: contacto.email || undefined })
      setPdfUrl(result.pdfUrl)
      setStep(3)
    })
  }

  const service = quoteServices.find((item) => item.id === summary.serviceId)

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Paso {step + 1} de {steps.length}</span>
          <span>{steps[step]}</span>
        </div>
        <Progress value={((step + 1) / steps.length) * 100} />
      </div>

      {step === 0 && (
        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Modo de presupuesto</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {['EXPRESS', 'ASSISTED', 'PROFESSIONAL'].map((mode) => (
                <label key={mode} className="flex items-center gap-3 rounded-xl border p-3">
                  <input type="radio" name="mode" checked={summary.mode === mode} onChange={() => setSummary((prev) => ({ ...prev, mode: mode as WizardSummary['mode'] }))} />
                  <span>{mode === 'EXPRESS' ? 'Modo Express' : mode === 'ASSISTED' ? 'Modo Asistido' : 'Modo Profesional'}</span>
                </label>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Servicio</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <select className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm" value={summary.serviceId} onChange={(event) => setSummary((prev) => ({ ...prev, serviceId: event.target.value }))}>
                {quoteServices.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
              <p className="text-sm text-slate-600">{service?.description}</p>
              <p className="text-sm">Flujo: <b>{service?.flow === 'ONLINE' ? 'Contratable online' : 'Requiere relevamiento'}</b></p>
            </CardContent>
          </Card>
        </section>
      )}

      {step === 1 && summary.mode !== 'PROFESSIONAL' && (
        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>{summary.mode === 'EXPRESS' ? 'Alcance Express' : 'Supuestos asistidos editables'}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Ambientes</Label><Input type="number" value={summary.ambientes} onChange={(e) => setSummary((p) => ({ ...p, ambientes: Number(e.target.value) || 0 }))} /></div>
              <div><Label>Bocas extra</Label><Input type="number" value={summary.bocasExtra} onChange={(e) => setSummary((p) => ({ ...p, bocasExtra: Number(e.target.value) || 0 }))} /></div>
              <div><Label>Comentarios</Label><Textarea value={summary.comentarios} onChange={(e) => setSummary((p) => ({ ...p, comentarios: e.target.value }))} /></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Ítems ajustables</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {adicionales.slice(0, 8).map((item) => (
                <div key={item.id} className="grid grid-cols-[1fr_90px] items-center gap-3">
                  <span className="text-sm">{item.nombre}</span>
                  <Input type="number" min={0} value={summary.adicionales.find((it) => it.id === item.id)?.cantidad ?? 0} onChange={(e) => updateItems(item.id, Number(e.target.value) || 0, 'adicionales')} />
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      )}

      {step === 1 && summary.mode === 'PROFESSIONAL' && (
        <Card>
          <CardHeader><CardTitle>Carga profesional por rubro e ítem</CardTitle></CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {professionalCatalog.map((item) => (
              <div key={item.id} className="grid grid-cols-[1fr_88px] items-center gap-3">
                <span className="text-sm">{item.name}</span>
                <Input type="number" min={0} value={summary.professionalItems.find((it) => it.id === item.id)?.cantidad ?? 0} onChange={(e) => updateItems(item.id, Number(e.target.value) || 0, 'professionalItems')} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Zona y recargos</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Zona</Label>
                <select className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm" value={summary.zoneTier} onChange={(e) => setSummary((p) => ({ ...p, zoneTier: e.target.value as WizardSummary['zoneTier'] }))}>
                  <option value="PRIORITY">Prioritaria</option>
                  <option value="SECONDARY">Secundaria</option>
                  <option value="REVIEW">Revisión manual</option>
                </select>
              </div>
              <div><Label>Recargo urgencia</Label><Input type="number" min={1} step={0.05} value={summary.urgencyMultiplier} onChange={(e) => setSummary((p) => ({ ...p, urgencyMultiplier: Number(e.target.value) || 1 }))} /></div>
              <div><Label>Recargo dificultad</Label><Input type="number" min={1} step={0.05} value={summary.difficultyMultiplier} onChange={(e) => setSummary((p) => ({ ...p, difficultyMultiplier: Number(e.target.value) || 1 }))} /></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Contacto</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Nombre" value={contacto.nombre} onChange={(e) => setContacto((p) => ({ ...p, nombre: e.target.value }))} />
              <Input placeholder="Email" type="email" value={contacto.email} onChange={(e) => setContacto((p) => ({ ...p, email: e.target.value }))} />
            </CardContent>
          </Card>
        </section>
      )}

      {step === 3 && (
        <Card>
          <CardHeader><CardTitle>Resumen</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>Servicio: <b>{service?.name}</b></p>
            <p>Flujo: <b>{totals.requiresSurvey ? 'Relevamiento / presupuesto' : 'Express con contratación online'}</b></p>
            <p>Subtotal base: ${totals.subtotalBase.toLocaleString('es-AR')}</p>
            <p>Recargo zona: ${totals.recargoZona.toLocaleString('es-AR')}</p>
            <p>Recargo urgencia: ${totals.recargoUrgencia.toLocaleString('es-AR')}</p>
            <p>Recargo dificultad: ${totals.recargoDificultad.toLocaleString('es-AR')}</p>
            <p className="text-lg font-semibold">Total estimado: ${totals.totalManoObra.toLocaleString('es-AR')}</p>
            {totals.warning && <p className="text-amber-600">{totals.warning}</p>}
            {!pdfUrl ? <Button onClick={handleSubmit} disabled={isPending}>{isPending ? 'Guardando...' : 'Guardar cotización'}</Button> : <a className="text-accent" href={pdfUrl} target="_blank">Descargar PDF</a>}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={back} disabled={step === 0}>Volver</Button>
        {step < steps.length - 1 && <Button onClick={next}>Continuar</Button>}
      </div>
    </div>
  )
}
