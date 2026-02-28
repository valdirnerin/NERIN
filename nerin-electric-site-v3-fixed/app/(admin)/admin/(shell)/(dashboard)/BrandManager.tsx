
'use client'

import { useCallback, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AdminMediaField } from '@/components/admin/AdminMediaField'
import { Table, TableCell, TableHead, TableRow } from '@/components/ui/table'

interface Brand {
  id: string
  nombre: string
  logoUrl?: string | null
}

interface BrandManagerProps {
  initialBrands: Brand[]
}

type MessageState = { type: 'success' | 'error'; message: string } | null

export function BrandManager({ initialBrands }: BrandManagerProps) {
  const [brands, setBrands] = useState<Brand[]>(initialBrands)
  const [form, setForm] = useState<{ id: string | null; nombre: string; logoUrl: string }>({
    id: null,
    nombre: '',
    logoUrl: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<MessageState>(null)

  const isEditing = useMemo(() => Boolean(form.id), [form.id])

  const loadBrands = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/brands', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('No se pudo cargar la lista de marcas')
      }
      const data = (await response.json()) as { items: Brand[] }
      setBrands(data.items)
    } catch (error) {
      console.error('Failed to load brands', error)
      setMessage({ type: 'error', message: 'Error al actualizar la tabla de marcas.' })
    }
  }, [])

  const resetForm = useCallback(() => {
    setForm({ id: null, nombre: '', logoUrl: '' })
    setMessage(null)
  }, [])

  const handleEdit = useCallback((brand: Brand) => {
    setForm({ id: brand.id, nombre: brand.nombre, logoUrl: brand.logoUrl ?? '' })
    setMessage(null)
  }, [])

  const handleDelete = useCallback(
    async (id: string) => {
      const confirmed = window.confirm('¿Eliminar esta marca? Esta acción no se puede deshacer.')
      if (!confirmed) return

      setLoading(true)
      setMessage(null)
      try {
        const response = await fetch(`/api/admin/brands?id=${id}`, { method: 'DELETE' })
        if (!response.ok) {
          throw new Error('No se pudo eliminar la marca')
        }
        await loadBrands()
        if (form.id === id) {
          resetForm()
        }
        setMessage({ type: 'success', message: 'Marca eliminada correctamente.' })
      } catch (error) {
        console.error('Failed to delete brand', error)
        setMessage({ type: 'error', message: 'No se pudo eliminar la marca. Intentá nuevamente.' })
      } finally {
        setLoading(false)
      }
    },
    [form.id, loadBrands, resetForm],
  )

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      setMessage(null)

      const payload = {
        id: form.id ?? undefined,
        nombre: form.nombre.trim(),
        logoUrl: form.logoUrl.trim() || undefined,
      }

      try {
        const response = await fetch('/api/admin/brands', {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const errorData = (await response.json().catch(() => null)) as { error?: string } | null
          throw new Error(errorData?.error ?? 'No se pudo guardar la marca')
        }

        await loadBrands()
        setMessage({ type: 'success', message: isEditing ? 'Marca actualizada.' : 'Marca creada.' })
        setForm((prev) => ({ ...prev, id: prev.id ?? null }))
        if (!isEditing) {
          resetForm()
        }
      } catch (error) {
        console.error('Failed to save brand', error)
        setMessage({ type: 'error', message: error instanceof Error ? error.message : 'No se pudo guardar la marca.' })
      } finally {
        setLoading(false)
      }
    },
    [form.id, form.logoUrl, form.nombre, isEditing, loadBrands, resetForm],
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Marcas y partners tecnológicos</CardTitle>
            <p className="text-sm text-slate-600">
              Cargá marcas que se muestran en el home y en la página de contacto usando un flujo unificado de media.
            </p>
            {message && (
              <p className={`text-xs ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>{message.message}</p>
            )}
          </div>
          {isEditing && (
            <Button variant="ghost" type="button" onClick={resetForm} disabled={loading}>
              Crear nueva marca
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <div className="grid gap-2">
            <Label htmlFor="brand-name">Nombre</Label>
            <Input
              id="brand-name"
              value={form.nombre}
              onChange={(event) => setForm((prev) => ({ ...prev, nombre: event.target.value }))}
              required
            />
          </div>
          <AdminMediaField
            id="brand-logo"
            label="Logo de la marca"
            value={form.logoUrl}
            onChange={(next) => setForm((prev) => ({ ...prev, logoUrl: next }))}
            uploadFolder="brands"
            description="Podés subir archivo desde el dispositivo o pegar una URL externa."
          />
          <Button type="submit" disabled={loading}>
            {isEditing ? 'Actualizar' : 'Agregar'}
          </Button>
        </form>

        <div className="overflow-x-auto">
          <Table>
            <thead>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Logo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>{brand.nombre}</TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {brand.logoUrl ? (
                      <div className="flex items-center gap-3">
                        <img src={brand.logoUrl} alt={brand.nombre} className="h-10 w-10 rounded-md border border-border object-contain bg-white p-1" />
                        <a className="max-w-[260px] truncate text-accent underline" href={brand.logoUrl} target="_blank" rel="noreferrer">
                          {brand.logoUrl}
                        </a>
                      </div>
                    ) : (
                      <span className="text-slate-400">Sin logo</span>
                    )}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button type="button" variant="secondary" size="sm" onClick={() => handleEdit(brand)} disabled={loading}>
                      Editar
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(brand.id)}
                      disabled={loading}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
