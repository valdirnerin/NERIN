'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

type ServiceData = {
  title: string
  excerpt: string
  cover: string
}

export default function EditServices(){
  const params = useParams()
  const router = useRouter()
  const slug = String(params.slug)

  const [data, setData] = useState<ServiceData>({ title: '', excerpt: '', cover: '' })
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(()=>{
    async function load(){
      setLoading(true)
      setLoadError(null)
      try {
        const response = await fetch('/api/admin/item?type=services&slug=' + slug)
        if (!response.ok) {
          throw new Error('No se pudo cargar la información del servicio.')
        }
        const payload = await response.json()
        setData({
          title: payload.data?.title ?? '',
          excerpt: payload.data?.excerpt ?? '',
          cover: payload.data?.cover ?? ''
        })
        setContent(payload.content ?? '')
      } catch (err) {
        console.error(err)
        setLoadError('Ocurrió un error al cargar el servicio. Actualizá la página para intentar nuevamente.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  async function save(){
    setSaving(true)
    setFeedback(null)
    setError(null)
    try {
      const response = await fetch('/api/admin/item?type=services&slug=' + slug, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, content })
      })
      if (!response.ok) {
        throw new Error('No se pudieron guardar los cambios.')
      }
      setFeedback('Cambios guardados correctamente.')
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.')
    } finally {
      setSaving(false)
    }
  }

  async function del(){
    if(!confirm('¿Eliminar este servicio? Esta acción no se puede deshacer.')) return
    setDeleting(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/item?type=services&slug=' + slug,{ method:'DELETE' })
      if(!response.ok){
        throw new Error('No se pudo eliminar el servicio.')
      }
      router.push('/admin/services')
    } catch (err){
      console.error(err)
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <div className="py-10">Cargando…</div>
  }

  if (loadError) {
    return (
      <div className="py-10">
        <h1 className="text-2xl font-semibold mb-2">Editar servicio</h1>
        <p className="text-sm text-red-600">{loadError}</p>
      </div>
    )
  }

  return (
    <div className="py-10 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-extrabold">{data.title || 'Editar servicio'}</h1>
        <p className="text-sm text-gray-600">La URL pública es <code className="bg-gray-100 px-1 rounded text-xs">/services/{slug}</code>.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <label>Título del servicio</label>
            <input
              value={data.title}
              onChange={event=>setData(current => ({ ...current, title: event.target.value }))}
              placeholder="Ej. Mantenimiento de subestaciones"
            />
          </div>

          <div>
            <label>Resumen corto</label>
            <textarea
              rows={4}
              value={data.excerpt}
              onChange={event=>setData(current => ({ ...current, excerpt: event.target.value }))}
              placeholder="Texto breve que aparece en la tarjeta del servicio."
            />
            <p className="text-xs text-gray-500 mt-1">Se recomienda entre 1 y 2 oraciones.</p>
          </div>

          <div>
            <label>Imagen de portada (URL)</label>
            <input
              value={data.cover}
              onChange={event=>setData(current => ({ ...current, cover: event.target.value }))}
              placeholder="https://tusitio.com/imagenes/servicio.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">Usá una imagen horizontal. Podés cargar archivos desde la sección “Media”.</p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <button className="btn" onClick={save} disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
            <button className="btn" onClick={del} disabled={deleting}>
              {deleting ? 'Eliminando…' : 'Eliminar servicio'}
            </button>
            {feedback && <span className="text-sm text-green-700">{feedback}</span>}
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </div>

        <div className="space-y-2">
          <label>Detalle del servicio (Markdown)</label>
          <textarea
            rows={24}
            value={content}
            onChange={event=>setContent(event.target.value)}
            placeholder={"## ¿Qué incluye?\nDescribí el alcance, entregables y materiales."}
          />
          <p className="text-xs text-gray-500">Podés usar títulos, listas y negritas con sintaxis Markdown.</p>
        </div>
      </div>
    </div>
  )
}
