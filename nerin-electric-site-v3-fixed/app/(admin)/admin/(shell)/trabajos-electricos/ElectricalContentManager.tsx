'use client'

import { useMemo, useState } from 'react'
import type { ElectricalAdminContent } from '@/lib/electrical-admin-content'
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
  return value
    .split('\n')
    .map((x) => x.trim())
    .filter(Boolean)
}
function updateAt<T>(items: T[], index: number, patch: Partial<T>) {
  return items.map((item, i) => (i === index ? { ...item, ...patch } : item))
}

export function ElectricalContentManager({
  initialContent,
}: {
  initialContent: ElectricalAdminContent
}) {
  const [content, setContent] = useState(initialContent)
  const [tab, setTab] = useState<Tab>('quickServices')
  const [status, setStatus] = useState('')
  const activeCount = useMemo(() => (content[tab] as unknown[]).length, [content, tab])

  async function save() {
    setStatus('Guardando...')
    const response = await fetch('/api/admin/electrical-content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    })
    setStatus(
      response.ok
        ? 'Guardado. La web pública ya puede reflejar los cambios.'
        : 'No se pudo guardar.',
    )
  }

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Panel administrativo
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Trabajos eléctricos</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Editor persistente conectado a la tabla WebsiteContent. Permite modificar servicios
          rápidos, guías visuales, diagnósticos y pedidos comerciales. Si no hay contenido guardado,
          la web usa el fallback estático versionado.
        </p>
      </header>
      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <Button
            key={item.id}
            type="button"
            variant={tab === item.id ? 'primary' : 'outline'}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-2xl border bg-white p-4">
        <span className="text-sm text-slate-600">{activeCount} items</span>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => setContent(initialContent)}>
            Restaurar últimos cargados
          </Button>
          <Button type="button" onClick={save}>
            Guardar cambios
          </Button>
        </div>
      </div>
      {status ? (
        <p className="rounded-xl bg-slate-100 p-3 text-sm text-slate-700">{status}</p>
      ) : null}

      {tab === 'quickServices' ? (
        <div className="space-y-4">
          {content.quickServices.map((service, index) => (
            <article key={service.id} className="space-y-3 rounded-2xl border bg-white p-4">
              <div className="grid gap-3 md:grid-cols-3">
                <Input
                  value={service.title}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      quickServices: updateAt(c.quickServices, index, { title: e.target.value }),
                    }))
                  }
                />
                <Input
                  type="number"
                  value={service.baseLaborPrice}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      quickServices: updateAt(c.quickServices, index, {
                        baseLaborPrice: Number(e.target.value),
                      }),
                    }))
                  }
                />
                <Input value={`${service.durationMin}-${service.durationMax} min`} readOnly />
              </div>
              <Textarea
                value={service.description}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    quickServices: updateAt(c.quickServices, index, {
                      description: e.target.value,
                    }),
                  }))
                }
              />
              <div className="grid gap-3 md:grid-cols-3">
                <Textarea
                  value={lines(service.usualMaterials)}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      quickServices: updateAt(c.quickServices, index, {
                        usualMaterials: split(e.target.value),
                      }),
                    }))
                  }
                  placeholder="Materiales habituales"
                />
                <Textarea
                  value={service.appliesWhen}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      quickServices: updateAt(c.quickServices, index, {
                        appliesWhen: e.target.value,
                      }),
                    }))
                  }
                  placeholder="Aplica si"
                />
                <Textarea
                  value={service.doesNotApplyWhen}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      quickServices: updateAt(c.quickServices, index, {
                        doesNotApplyWhen: e.target.value,
                      }),
                    }))
                  }
                  placeholder="No aplica si"
                />
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {tab === 'visualGuides' ? (
        <div className="space-y-4">
          {content.visualGuides.map((item, index) => (
            <article key={item.serviceId} className="space-y-3 rounded-2xl border bg-white p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  value={item.visualGuide.diagramTitle}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      visualGuides: updateAt(c.visualGuides, index, {
                        visualGuide: { ...item.visualGuide, diagramTitle: e.target.value },
                      }),
                    }))
                  }
                />
                <Input
                  value={item.visualGuide.diagramSubtitle}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      visualGuides: updateAt(c.visualGuides, index, {
                        visualGuide: { ...item.visualGuide, diagramSubtitle: e.target.value },
                      }),
                    }))
                  }
                />
              </div>
              <AdminMediaField
                id={`guide-${item.serviceId}`}
                label="Subir imagen"
                value={item.visualGuide.imageSrc}
                uploadFolder="service-guides"
                allowManualUrl
                onChange={(value) =>
                  setContent((c) => ({
                    ...c,
                    visualGuides: updateAt(c.visualGuides, index, {
                      visualGuide: { ...item.visualGuide, imageSrc: value },
                    }),
                  }))
                }
              />
              <Input
                value={item.visualGuide.imageAlt}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    visualGuides: updateAt(c.visualGuides, index, {
                      visualGuide: { ...item.visualGuide, imageAlt: e.target.value },
                    }),
                  }))
                }
                placeholder="Alt de imagen"
              />
              <div className="grid gap-3 md:grid-cols-3">
                <Textarea
                  value={lines(item.visualGuide.appliesIf)}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      visualGuides: updateAt(c.visualGuides, index, {
                        visualGuide: { ...item.visualGuide, appliesIf: split(e.target.value) },
                      }),
                    }))
                  }
                  placeholder="Aplica si"
                />
                <Textarea
                  value={lines(item.visualGuide.doesNotApplyIf)}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      visualGuides: updateAt(c.visualGuides, index, {
                        visualGuide: { ...item.visualGuide, doesNotApplyIf: split(e.target.value) },
                      }),
                    }))
                  }
                  placeholder="No aplica si"
                />
                <Input
                  value={item.visualGuide.durationLabel}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      visualGuides: updateAt(c.visualGuides, index, {
                        visualGuide: { ...item.visualGuide, durationLabel: e.target.value },
                      }),
                    }))
                  }
                  placeholder="Duración"
                />
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {tab === 'diagnosticFaults' ? (
        <div className="space-y-4">
          {content.diagnosticFaults.map((fault, index) => (
            <article key={fault.id} className="space-y-3 rounded-2xl border bg-white p-4">
              <div className="grid gap-3 md:grid-cols-3">
                <Input
                  value={fault.faultName}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      diagnosticFaults: updateAt(c.diagnosticFaults, index, {
                        faultName: e.target.value,
                      }),
                    }))
                  }
                />
                <Input
                  type="number"
                  value={fault.initialPrice}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      diagnosticFaults: updateAt(c.diagnosticFaults, index, {
                        initialPrice: Number(e.target.value),
                      }),
                    }))
                  }
                />
                <Input
                  type="number"
                  value={fault.includedMinutes}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      diagnosticFaults: updateAt(c.diagnosticFaults, index, {
                        includedMinutes: Number(e.target.value),
                      }),
                    }))
                  }
                />
              </div>
              <Textarea
                value={lines(fault.possibleCauses)}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    diagnosticFaults: updateAt(c.diagnosticFaults, index, {
                      possibleCauses: split(e.target.value),
                    }),
                  }))
                }
                placeholder="Posibles causas"
              />
              <Textarea
                value={fault.disclaimer}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    diagnosticFaults: updateAt(c.diagnosticFaults, index, {
                      disclaimer: e.target.value,
                    }),
                  }))
                }
                placeholder="Disclaimer"
              />
            </article>
          ))}
        </div>
      ) : null}
      {tab === 'commercialServices' ? (
        <Textarea
          className="min-h-[420px] font-mono"
          value={JSON.stringify(content.commercialServices, null, 2)}
          onChange={(e) => {
            try {
              setContent((c) => ({ ...c, commercialServices: JSON.parse(e.target.value) }))
            } catch {
              setStatus('JSON comercial inválido; corregilo antes de guardar.')
            }
          }}
        />
      ) : null}
    </div>
  )
}
