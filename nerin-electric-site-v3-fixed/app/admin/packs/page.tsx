'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableCell, TableHead, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'

type PricingPlan = {
  title: string
  price: string
  slug: string
  features: string[]
  active?: boolean
}

type PricingResponse = {
  plans?: PricingPlan[]
}

type PlanState = {
  title: string
  price: string
  slug: string
  features: string[]
  active: boolean
}

type FormState = {
  originalSlug: string | null
  title: string
  price: string
  slug: string
  featuresText: string
  active: boolean
}

const emptyForm: FormState = {
  originalSlug: null,
  title: '',
  price: '',
  slug: '',
  featuresText: '',
  active: true,
}

function normalizePlan(plan: PricingPlan): PlanState {
  return {
    title: plan.title ?? '',
    price: plan.price ?? '',
    slug: plan.slug ?? '',
    features: Array.isArray(plan.features) ? plan.features.map((item) => String(item)) : [],
    active: plan.active ?? true,
  }
}

function featuresToText(features: string[]): string {
  return features.join('\n')
}

function textToFeatures(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export default function AdminPacksPage() {
  const [plans, setPlans] = useState<PlanState[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)

  const isEditing = useMemo(() => Boolean(form.originalSlug), [form.originalSlug])

  const resetForm = useCallback(() => {
    setForm(emptyForm)
    setMessage(null)
  }, [])

  const loadPlans = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/pricing', { cache: 'no-store' })

      if (response.status === 401) {
        setError('No tenés permisos para ver esta sección. Iniciá sesión nuevamente.')
        setPlans([])
        return
      }

      if (!response.ok) {
        throw new Error('No se pudieron cargar los packs')
      }

      const data = (await response.json()) as PricingResponse
      const normalized = (data.plans ?? []).map(normalizePlan)
      setPlans(normalized)
    } catch (err) {
      console.error('Error fetching pricing plans', err)
      setError('Ocurrió un error al cargar los packs. Intentá nuevamente más tarde.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadPlans()
  }, [loadPlans])

  const persistPlans = useCallback(
    async (updatedPlans: PlanState[], successMessage: string) => {
      setSaving(true)
      setError(null)
      setMessage(null)

      try {
        const response = await fetch('/api/admin/pricing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            plans: updatedPlans.map((plan) => ({
              title: plan.title,
              price: plan.price,
              slug: plan.slug,
              features: plan.features,
              active: plan.active,
            })),
          }),
        })

        if (response.status === 401) {
          setError('No tenés permisos para realizar esta acción.')
          return false
        }

        if (!response.ok) {
          const errorData = (await response.json().catch(() => null)) as { error?: string } | null
          throw new Error(errorData?.error ?? 'No se pudo guardar la información')
        }

        setPlans(updatedPlans)
        setMessage(successMessage)
        return true
      } catch (err) {
        console.error('Error saving pricing plans', err)
        setError(err instanceof Error ? err.message : 'No se pudo guardar la información.')
        return false
      } finally {
        setSaving(false)
      }
    },
    [],
  )

  const handleEdit = useCallback((plan: PlanState) => {
    setForm({
      originalSlug: plan.slug,
      title: plan.title,
      price: plan.price,
      slug: plan.slug,
      featuresText: featuresToText(plan.features),
      active: plan.active,
    })
    setMessage(null)
  }, [])

  const handleDelete = useCallback(
    async (slug: string) => {
      const confirmed = window.confirm('¿Seguro que querés eliminar este pack? Esta acción no se puede deshacer.')
      if (!confirmed) return

      const updated = plans.filter((plan) => plan.slug !== slug)
      const success = await persistPlans(updated, 'Pack eliminado correctamente.')
      if (success && form.originalSlug === slug) {
        resetForm()
      }
    },
    [plans, persistPlans, form.originalSlug, resetForm],
  )

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (!form.title.trim() || !form.slug.trim() || !form.price.trim()) {
        setError('Completá los campos obligatorios antes de guardar.')
        return
      }

      const normalizedSlug = form.slug.trim()
      const existingSlug = plans.find((plan) => plan.slug === normalizedSlug)
      const editingSlug = form.originalSlug

      if (!editingSlug && existingSlug) {
        setError('Ese slug ya está en uso. Elegí otro identificador.')
        return
      }

      if (editingSlug && existingSlug && existingSlug.slug !== editingSlug) {
        setError('Ese slug ya está en uso por otro pack.')
        return
      }

      const newPlan: PlanState = {
        title: form.title.trim(),
        price: form.price.trim(),
        slug: normalizedSlug,
        features: textToFeatures(form.featuresText),
        active: form.active,
      }

      let updatedPlans: PlanState[]
      let successMessage = 'Pack creado correctamente.'

      if (editingSlug) {
        updatedPlans = plans.map((plan) => (plan.slug === editingSlug ? newPlan : plan))
        successMessage = 'Pack actualizado correctamente.'
      } else {
        updatedPlans = [newPlan, ...plans]
      }

      const success = await persistPlans(updatedPlans, successMessage)

      if (success) {
        setForm({
          originalSlug: newPlan.slug,
          title: newPlan.title,
          price: newPlan.price,
          slug: newPlan.slug,
          featuresText: featuresToText(newPlan.features),
          active: newPlan.active,
        })
      }
    },
    [form, plans, persistPlans],
  )

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Panel administrativo</p>
            <h1 className="text-2xl font-semibold text-foreground">Packs y planes comerciales</h1>
            <p className="text-sm text-slate-600">
              Actualizá los packs disponibles en el sitio y controlá qué planes se muestran como destacados.
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
            <CardTitle>{isEditing ? 'Editar pack' : 'Nuevo pack'}</CardTitle>
            {isEditing && (
              <Button variant="ghost" type="button" onClick={resetForm}>
                Crear nuevo
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
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="ej: pack-premium"
                value={form.slug}
                onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
                required
              />
              <p className="text-xs text-slate-500">Usá minúsculas y guiones para identificar el pack.</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                placeholder="$1.000.000 + IVA"
                value={form.price}
                onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="features">Características (una por línea)</Label>
              <Textarea
                id="features"
                value={form.featuresText}
                onChange={(event) => setForm((prev) => ({ ...prev, featuresText: event.target.value }))}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))}
              />
              Mostrar como activo en el sitio
            </label>
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear pack'}
            </Button>
          </form>
          {message && <p className="mt-4 text-sm text-emerald-600">{message}</p>}
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Packs configurados</h2>
          <Button variant="secondary" onClick={loadPlans} disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar listado'}
          </Button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <thead>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden md:table-cell">Características</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <TableRow key={plan.slug} className="align-top">
                  <TableCell className="font-medium text-foreground">{plan.title}</TableCell>
                  <TableCell className="text-xs text-slate-500">{plan.slug}</TableCell>
                  <TableCell>{plan.price}</TableCell>
                  <TableCell>
                    <span
                      className={
                        plan.active
                          ? 'rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700'
                          : 'rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600'
                      }
                    >
                      {plan.active ? 'Activo' : 'Oculto'}
                    </span>
                  </TableCell>
                  <TableCell className="hidden text-xs text-slate-500 md:table-cell">
                    <ul className="space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={`${plan.slug}-feature-${index}`}>{feature}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="space-y-2 text-sm">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(plan)}>
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleDelete(plan.slug)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!plans.length && !loading && (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-sm text-slate-500">
                    Todavía no cargaste packs.
                  </TableCell>
                </TableRow>
              )}
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-sm text-slate-500">
                    Cargando packs...
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
