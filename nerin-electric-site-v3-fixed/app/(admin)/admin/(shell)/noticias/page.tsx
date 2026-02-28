'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableCell, TableHead, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { AdminMediaField } from '@/components/admin/AdminMediaField'

type Metric = { label: string; value: string }

type CaseStudy = {
  id: string
  titulo: string
  slug: string
  resumen: string
  contenido: string
  metricas: Metric[]
  fotos: string[]
  publicado: boolean
}

type CaseStudyResponse = {
  items: CaseStudy[]
}

type FormState = {
  id: string | null
  titulo: string
  slug: string
  resumen: string
  contenido: string
  metricasText: string
  fotosText: string
  publicado: boolean
}

const emptyForm: FormState = {
  id: null,
  titulo: '',
  slug: '',
  resumen: '',
  contenido: '',
  metricasText: '',
  fotosText: '',
  publicado: true,
}

function metricsToText(metricas: Metric[]): string {
  return metricas.map((metric) => `${metric.label} | ${metric.value}`).join('\n')
}

function textToMetrics(text: string): Metric[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split('|')
      const value = rest.join('|')
      const trimmedLabel = label?.trim() ?? ''
      const trimmedValue = value.trim()

      if (!trimmedLabel || !trimmedValue) {
        return null
      }

      return { label: trimmedLabel, value: trimmedValue }
    })
    .filter((item): item is Metric => Boolean(item))
}

function textToFotos(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export default function AdminNoticiasPage() {
  const [items, setItems] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)

  const isEditing = useMemo(() => Boolean(form.id), [form.id])

  const fotos = textToFotos(form.fotosText)

  const resetForm = useCallback(() => {
    setForm(emptyForm)
    setMessage(null)
  }, [])

  const loadItems = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/case-studies', {
        cache: 'no-store',
      })

      if (response.status === 401) {
        setError('No tenés permisos para ver esta sección. Iniciá sesión nuevamente.')
        setItems([])
        return
      }

      if (!response.ok) {
        throw new Error('No se pudo cargar la información')
      }

      const data = (await response.json()) as CaseStudyResponse
      setItems(data.items ?? [])
    } catch (err) {
      console.error('Error fetching case studies', err)
      setError('Ocurrió un error al cargar las noticias. Intentá nuevamente más tarde.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadItems()
  }, [loadItems])

  const handleEdit = useCallback((item: CaseStudy) => {
    setForm({
      id: item.id,
      titulo: item.titulo,
      slug: item.slug,
      resumen: item.resumen,
      contenido: item.contenido,
      metricasText: metricsToText(item.metricas),
      fotosText: item.fotos.join('\n'),
      publicado: item.publicado,
    })
    setMessage(null)
  }, [])

  const handleDelete = useCallback(
    async (id: string) => {
      const confirmed = window.confirm('¿Seguro que querés eliminar esta noticia? Esta acción no se puede deshacer.')
      if (!confirmed) return

      setSaving(true)
      setMessage(null)
      setError(null)

      try {
        const response = await fetch(`/api/admin/case-studies?id=${id}`, {
          method: 'DELETE',
        })

        if (response.status === 401) {
          setError('No tenés permisos para realizar esta acción.')
          return
        }

        if (!response.ok) {
          throw new Error('No se pudo eliminar la noticia')
        }

        setItems((prev) => prev.filter((item) => item.id !== id))
        setMessage('Noticia eliminada correctamente.')
        if (form.id === id) {
          resetForm()
        }
      } catch (err) {
        console.error('Error deleting case study', err)
        setError('No se pudo eliminar la noticia. Intentá nuevamente.')
      } finally {
        setSaving(false)
      }
    },
    [form.id, resetForm],
  )

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      setSaving(true)
      setMessage(null)
      setError(null)

      const payload = {
        id: form.id ?? undefined,
        titulo: form.titulo.trim(),
        slug: form.slug.trim() || undefined,
        resumen: form.resumen.trim(),
        contenido: form.contenido.trim(),
        metricas: textToMetrics(form.metricasText),
        fotos: textToFotos(form.fotosText),
        publicado: form.publicado,
      }

      const method = isEditing ? 'PUT' : 'POST'

      try {
        const response = await fetch('/api/admin/case-studies', {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (response.status === 401) {
          setError('No tenés permisos para realizar esta acción.')
          return
        }

        if (!response.ok) {
          const errorData = (await response.json().catch(() => null)) as { error?: string } | null
          throw new Error(errorData?.error ?? 'No se pudo guardar la noticia')
        }

        const data = (await response.json()) as { item: CaseStudy }
        const item = data.item

        setItems((prev) => {
          const withoutItem = prev.filter((cs) => cs.id !== item.id)
          return [item, ...withoutItem]
        })

        setMessage(isEditing ? 'Noticia actualizada correctamente.' : 'Noticia creada correctamente.')
        setForm({
          id: item.id,
          titulo: item.titulo,
          slug: item.slug,
          resumen: item.resumen,
          contenido: item.contenido,
          metricasText: metricsToText(item.metricas),
          fotosText: item.fotos.join('\n'),
          publicado: item.publicado,
        })
      } catch (err) {
        console.error('Error saving case study', err)
        setError(err instanceof Error ? err.message : 'No se pudo guardar la noticia.')
      } finally {
        setSaving(false)
      }
    },
    [form, isEditing],
  )

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Panel administrativo</p>
            <h1 className="text-2xl font-semibold text-foreground">Noticias y casos de éxito</h1>
            <p className="text-sm text-slate-600">
              Gestioná las noticias del blog y los casos de éxito publicados en el sitio.
            </p>
          </div>
          <Button variant="secondary" asChild>
            <Link href="/admin">Volver al panel</Link>
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{isEditing ? 'Editar noticia' : 'Nueva noticia'}</CardTitle>
            {isEditing && (
              <Button variant="ghost" type="button" onClick={resetForm}>
                Crear nueva
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={form.titulo}
                onChange={(event) => setForm((prev) => ({ ...prev, titulo: event.target.value }))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug (opcional)</Label>
              <Input
                id="slug"
                placeholder="ej: obra-corporativa"
                value={form.slug}
                onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
              />
              <p className="text-xs text-slate-500">Si lo dejás vacío se genera automáticamente a partir del título.</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="resumen">Resumen</Label>
              <Textarea
                id="resumen"
                value={form.resumen}
                onChange={(event) => setForm((prev) => ({ ...prev, resumen: event.target.value }))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contenido">Contenido</Label>
              <Textarea
                id="contenido"
                rows={6}
                value={form.contenido}
                onChange={(event) => setForm((prev) => ({ ...prev, contenido: event.target.value }))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="metricas">Métricas (una por línea usando formato Etiqueta | Valor)</Label>
              <Textarea
                id="metricas"
                placeholder={'Tiempo de obra | 90 días'}
                value={form.metricasText}
                onChange={(event) => setForm((prev) => ({ ...prev, metricasText: event.target.value }))}
              />
            </div>
            <div className="grid gap-3">
              <Label>Fotos de la noticia</Label>
              {fotos.map((foto, index) => (
                <div key={`${form.id ?? 'new'}-foto-${index}`} className="space-y-2 rounded-xl border border-border p-3">
                  <AdminMediaField
                    id={`case-study-foto-${index}`}
                    label={`Foto ${index + 1}`}
                    value={foto}
                    onChange={(next) => {
                      const nextFotos = fotos.map((item, itemIndex) => (itemIndex === index ? next : item)).filter(Boolean)
                      setForm((prev) => ({ ...prev, fotosText: nextFotos.join('\n') }))
                    }}
                    uploadFolder="case-studies"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const nextFotos = fotos.filter((_, itemIndex) => itemIndex !== index)
                      setForm((prev) => ({ ...prev, fotosText: nextFotos.join('\n') }))
                    }}
                  >
                    Eliminar foto
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() => setForm((prev) => ({ ...prev, fotosText: [...fotos, ''].join('\n') }))}
              >
                Agregar foto
              </Button>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={form.publicado}
                onChange={(event) => setForm((prev) => ({ ...prev, publicado: event.target.checked }))}
              />
              Publicar en el sitio público
            </label>
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear noticia'}
            </Button>
          </form>
          {message && <p className="mt-4 text-sm text-emerald-600">{message}</p>}
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Noticias publicadas</h2>
          <Button variant="secondary" onClick={loadItems} disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar listado'}
          </Button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <thead>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden md:table-cell">Métricas</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </thead>
            <tbody>
              {items.map((item) => (
                <TableRow key={item.id} className="align-top">
                  <TableCell className="font-medium text-foreground">
                    <div className="space-y-1">
                      <p>{item.titulo}</p>
                      <p className="text-xs text-slate-500">{item.resumen}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">{item.slug}</TableCell>
                  <TableCell>
                    <span
                      className={
                        item.publicado
                          ? 'rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700'
                          : 'rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600'
                      }
                    >
                      {item.publicado ? 'Publicado' : 'Borrador'}
                    </span>
                  </TableCell>
                  <TableCell className="hidden text-xs text-slate-500 md:table-cell">
                    <ul className="space-y-1">
                      {item.metricas.map((metric) => (
                        <li key={`${item.id}-${metric.label}`}>{metric.label}: {metric.value}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="space-y-2 text-sm">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                      Editar
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(item.id)}>
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!items.length && !loading && (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-sm text-slate-500">
                    No hay noticias cargadas todavía.
                  </TableCell>
                </TableRow>
              )}
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-sm text-slate-500">
                    Cargando noticias...
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </div>
      </section>
    </div>
  )
}
