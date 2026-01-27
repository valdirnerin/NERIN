'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableCell, TableHead, TableRow } from '@/components/ui/table'

type Project = {
  id?: string
  title: string
  description: string
  locationText?: string | null
  tags: string[]
  images: string[]
}

const EMPTY_FORM: Project = {
  title: '',
  description: '',
  locationText: '',
  tags: [],
  images: [],
}

type MessageState = { type: 'success' | 'error'; message: string } | null

export function ProjectsManager() {
  const [items, setItems] = useState<Project[]>([])
  const [form, setForm] = useState<Project>(EMPTY_FORM)
  const [message, setMessage] = useState<MessageState>(null)

  const isEditing = useMemo(() => Boolean(form.id), [form.id])

  const loadItems = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/projects', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('No se pudieron cargar los proyectos')
      }
      const data = (await response.json()) as { items: Project[] }
      setItems(data.items)
    } catch (error) {
      console.error('Error loading projects', error)
      setMessage({ type: 'error', message: 'No se pudieron cargar los proyectos.' })
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
        const response = await fetch('/api/admin/projects', {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!response.ok) {
          throw new Error('No se pudo guardar el proyecto')
        }
        await loadItems()
        setMessage({ type: 'success', message: 'Proyecto guardado correctamente.' })
        resetForm()
      } catch (error) {
        console.error('Error saving project', error)
        setMessage({ type: 'error', message: 'No se pudo guardar el proyecto.' })
      }
    },
    [form, isEditing, loadItems, resetForm],
  )

  const handleEdit = useCallback((item: Project) => {
    setForm(item)
    setMessage(null)
  }, [])

  const handleDelete = useCallback(
    async (id?: string) => {
      if (!id) return
      try {
        const response = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' })
        if (!response.ok) {
          throw new Error('No se pudo eliminar el proyecto')
        }
        await loadItems()
        if (form.id === id) {
          resetForm()
        }
      } catch (error) {
        console.error('Error deleting project', error)
        setMessage({ type: 'error', message: 'No se pudo eliminar el proyecto.' })
      }
    },
    [form.id, loadItems, resetForm],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trabajos / Portfolio</CardTitle>
        {message ? (
          <p className={`text-sm ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
            {message.message}
          </p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="project-title">Título</Label>
            <Input
              id="project-title"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-description">Descripción</Label>
            <Textarea
              id="project-description"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="project-location">Ubicación (texto)</Label>
              <Input
                id="project-location"
                value={form.locationText ?? ''}
                onChange={(event) => setForm((prev) => ({ ...prev, locationText: event.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-tags">Tags (separadas por coma)</Label>
              <Input
                id="project-tags"
                value={form.tags.join(', ')}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    tags: event.target.value
                      .split(',')
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                  }))
                }
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-images">Imágenes (URLs separadas por coma)</Label>
            <Input
              id="project-images"
              value={form.images.join(', ')}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  images: event.target.value
                    .split(',')
                    .map((url) => url.trim())
                    .filter(Boolean),
                }))
              }
            />
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
                <TableHead>Ubicación</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Acciones</TableHead>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.locationText ?? '-'}</TableCell>
                  <TableCell>{item.tags.join(', ')}</TableCell>
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
