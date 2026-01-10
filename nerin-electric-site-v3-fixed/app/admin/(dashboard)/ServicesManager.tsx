'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableCell, TableHead, TableRow } from '@/components/ui/table'

type Service = {
  id?: string
  title: string
  description: string
  order: number
  active: boolean
}

const EMPTY_FORM: Service = {
  title: '',
  description: '',
  order: 0,
  active: true,
}

type MessageState = { type: 'success' | 'error'; message: string } | null

export function ServicesManager() {
  const [items, setItems] = useState<Service[]>([])
  const [form, setForm] = useState<Service>(EMPTY_FORM)
  const [message, setMessage] = useState<MessageState>(null)

  const isEditing = useMemo(() => Boolean(form.id), [form.id])

  const loadItems = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/services', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('No se pudieron cargar los servicios')
      }
      const data = (await response.json()) as { items: Service[] }
      setItems(data.items)
    } catch (error) {
      console.error('Error loading services', error)
      setMessage({ type: 'error', message: 'No se pudieron cargar los servicios.' })
    }
  }, [])

  useEffect(() => {
    void loadItems()
  }, [loadItems])

  const resetForm = useCallback(() => {
    setForm(EMPTY_FORM)
    setMessage(null)
  }, [])

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setMessage(null)
      try {
        const response = await fetch('/api/admin/services', {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!response.ok) {
          throw new Error('No se pudo guardar el servicio')
        }
        await loadItems()
        setMessage({ type: 'success', message: 'Servicio guardado correctamente.' })
        resetForm()
      } catch (error) {
        console.error('Error saving service', error)
        setMessage({ type: 'error', message: 'Error al guardar el servicio.' })
      }
    },
    [form, isEditing, loadItems, resetForm],
  )

  const handleEdit = useCallback((item: Service) => {
    setForm(item)
    setMessage(null)
  }, [])

  const handleDelete = useCallback(
    async (id?: string) => {
      if (!id) return
      try {
        const response = await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' })
        if (!response.ok) {
          throw new Error('No se pudo eliminar el servicio')
        }
        await loadItems()
        if (form.id === id) {
          resetForm()
        }
      } catch (error) {
        console.error('Error deleting service', error)
        setMessage({ type: 'error', message: 'No se pudo eliminar el servicio.' })
      }
    },
    [form.id, loadItems, resetForm],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Servicios CMS</CardTitle>
        {message ? (
          <p className={`text-sm ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
            {message.message}
          </p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="service-title">Título</Label>
            <Input
              id="service-title"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="service-description">Descripción</Label>
            <Textarea
              id="service-description"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="service-order">Orden</Label>
              <Input
                id="service-order"
                type="number"
                value={form.order}
                onChange={(event) => setForm((prev) => ({ ...prev, order: Number(event.target.value) }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="service-active">Activo</Label>
              <select
                id="service-active"
                className="h-11 rounded-xl border border-border bg-white px-4 text-sm"
                value={form.active ? '1' : '0'}
                onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.value === '1' }))}
              >
                <option value="1">Sí</option>
                <option value="0">No</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="submit">{isEditing ? 'Actualizar' : 'Crear'}</Button>
            {isEditing ? (
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancelar
              </Button>
            ) : null}
          </div>
        </form>

        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr className="text-left text-slate-500">
                <TableHead>Título</TableHead>
                <TableHead>Orden</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead>Acciones</TableHead>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.order}</TableCell>
                  <TableCell>{item.active ? 'Sí' : 'No'}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                      Editar
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)}>
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
