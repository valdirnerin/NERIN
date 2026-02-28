
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableCell, TableHead, TableRow } from '@/components/ui/table'
import { AdminMediaField } from '@/components/admin/AdminMediaField'

interface BlogSummary {
  slug: string
  title: string
  publishedAt?: string
}

interface BlogPayload {
  slug: string
  title: string
  excerpt: string
  content: string
  publishedAt: string
  heroImage?: string
  tags: string[]
}

type MessageState = { type: 'success' | 'error'; message: string } | null

const EMPTY_FORM: BlogPayload = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  publishedAt: new Date().toISOString().slice(0, 10),
  heroImage: '',
  tags: [],
}

export function BlogManager() {
  const [posts, setPosts] = useState<BlogSummary[]>([])
  const [form, setForm] = useState<BlogPayload>(EMPTY_FORM)
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<MessageState>(null)

  const isEditing = useMemo(() => Boolean(selectedSlug), [selectedSlug])

  const loadList = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/list?type=blog', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('No se pudo cargar la lista de artículos')
      }
      const slugs = (await response.json()) as string[]
      setPosts(slugs.map((slug) => ({ slug, title: slug })))
    } catch (error) {
      console.error('Failed to load blog list', error)
      setMessage({ type: 'error', message: 'Error al cargar la lista del blog.' })
    }
  }, [])

  const loadPost = useCallback(async (slug: string) => {
    setLoading(true)
    setMessage(null)
    try {
      const response = await fetch(`/api/admin/item?type=blog&slug=${slug}`, { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('No se pudo cargar el artículo')
      }
      const data = (await response.json()) as {
        data?: { title?: string; excerpt?: string; publishedAt?: string; heroImage?: string; tags?: string[] }
        content?: string
      }
      setForm({
        slug,
        title: data.data?.title ?? '',
        excerpt: data.data?.excerpt ?? '',
        publishedAt: data.data?.publishedAt ?? new Date().toISOString().slice(0, 10),
        heroImage: data.data?.heroImage ?? '',
        tags: Array.isArray(data.data?.tags) ? data.data?.tags ?? [] : [],
        content: data.content ?? '',
      })
      setPosts((prev) =>
        prev.map((item) =>
          item.slug === slug
            ? { ...item, title: data.data?.title ?? item.title, publishedAt: data.data?.publishedAt }
            : item,
        ),
      )
      setSelectedSlug(slug)
    } catch (error) {
      console.error('Failed to load blog post', error)
      setMessage({ type: 'error', message: 'No se pudo cargar el artículo seleccionado.' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadList()
  }, [loadList])

  const resetForm = useCallback(() => {
    setForm(EMPTY_FORM)
    setSelectedSlug(null)
    setMessage(null)
  }, [])

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!form.slug.trim()) {
        setMessage({ type: 'error', message: 'El slug es obligatorio.' })
        return
      }
      if (!form.title.trim() || !form.content.trim()) {
        setMessage({ type: 'error', message: 'Completá título y contenido.' })
        return
      }

      setLoading(true)
      setMessage(null)

      const payload = {
        data: {
          title: form.title.trim(),
          excerpt: form.excerpt.trim(),
          publishedAt: form.publishedAt,
          heroImage: form.heroImage?.trim() || undefined,
          tags: form.tags,
        },
        content: form.content,
      }

      try {
        const response = await fetch(`/api/admin/item?type=blog&slug=${form.slug.trim()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!response.ok) {
          const errorData = (await response.json().catch(() => null)) as { error?: string } | null
          throw new Error(errorData?.error ?? 'No se pudo guardar el artículo')
        }
        setMessage({ type: 'success', message: 'Artículo guardado correctamente.' })
        const savedSlug = form.slug.trim()
        setSelectedSlug(savedSlug)
        await loadList()
        setPosts((prev) =>
          prev.map((item) =>
            item.slug === savedSlug
              ? { ...item, title: form.title.trim(), publishedAt: form.publishedAt }
              : item,
          ),
        )
      } catch (error) {
        console.error('Failed to save blog post', error)
        setMessage({ type: 'error', message: error instanceof Error ? error.message : 'No se pudo guardar el artículo.' })
      } finally {
        setLoading(false)
      }
    },
    [form, loadList],
  )

  const handleDelete = useCallback(
    async (slug: string) => {
      const confirmed = window.confirm('¿Eliminar este artículo del blog?')
      if (!confirmed) return

      setLoading(true)
      setMessage(null)
      try {
        const response = await fetch(`/api/admin/item?type=blog&slug=${slug}`, { method: 'DELETE' })
        if (!response.ok) {
          throw new Error('No se pudo eliminar el artículo')
        }
        await loadList()
        if (selectedSlug === slug) {
          resetForm()
        }
        setMessage({ type: 'success', message: 'Artículo eliminado.' })
      } catch (error) {
        console.error('Failed to delete blog post', error)
        setMessage({ type: 'error', message: 'No se pudo eliminar el artículo. Intentá nuevamente.' })
      } finally {
        setLoading(false)
      }
    },
    [loadList, resetForm, selectedSlug],
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Blog y notas técnicas</CardTitle>
            <p className="text-sm text-slate-600">
              Publicá contenido editorial desde el panel. Los artículos se almacenan en <code>.data/blog</code> como JSON +
              markdown.
            </p>
            {message && (
              <p className={`text-xs ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>{message.message}</p>
            )}
          </div>
          <Button type="button" variant="ghost" onClick={resetForm} disabled={loading}>
            Crear nuevo artículo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="blog-slug">Slug</Label>
            <Input
              id="blog-slug"
              value={form.slug}
              onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
              placeholder="ej: obra-corporativa"
              required
              readOnly={isEditing}
            />
            {isEditing && <p className="text-xs text-slate-500">El slug no se puede editar una vez creado.</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="blog-title">Título</Label>
            <Input
              id="blog-title"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="blog-excerpt">Resumen</Label>
            <Textarea
              id="blog-excerpt"
              value={form.excerpt}
              onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="blog-published">Fecha de publicación</Label>
            <Input
              id="blog-published"
              type="date"
              value={form.publishedAt}
              onChange={(event) => setForm((prev) => ({ ...prev, publishedAt: event.target.value }))}
            />
          </div>
          <AdminMediaField
            id="blog-hero"
            label="Imagen principal"
            value={form.heroImage ?? ''}
            onChange={(next) => setForm((prev) => ({ ...prev, heroImage: next }))}
            uploadFolder="blog"
          />
          <div className="grid gap-2">
            <Label htmlFor="blog-tags">Tags (separadas por coma)</Label>
            <Input
              id="blog-tags"
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
          <div className="grid gap-2">
            <Label htmlFor="blog-content">Contenido (Markdown simple)</Label>
            <Textarea
              id="blog-content"
              rows={12}
              value={form.content}
              onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
              required
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={loading}>
              {isEditing ? 'Actualizar artículo' : 'Publicar artículo'}
            </Button>
            {isEditing && (
              <Button type="button" variant="ghost" onClick={() => handleDelete(form.slug)} disabled={loading}>
                Eliminar
              </Button>
            )}
          </div>
        </form>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Artículos existentes</h3>
          <div className="overflow-hidden rounded-2xl border border-border">
            <Table>
              <thead>
                <TableRow>
                  <TableHead>Slug</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <TableRow key={post.slug}>
                    <TableCell>{post.slug}</TableCell>
                    <TableCell>{post.title}</TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button type="button" size="sm" variant="secondary" onClick={() => loadPost(post.slug)} disabled={loading}>
                        Editar
                      </Button>
                      <Button type="button" size="sm" variant="ghost" onClick={() => handleDelete(post.slug)} disabled={loading}>
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
