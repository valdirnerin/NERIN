'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ProjectPhotoUploader({ projectId }: { projectId: string }) {
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!file) {
      setError('Seleccioná una imagen para subir')
      return
    }

    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('projectId', projectId)
      formData.append('title', title)
      formData.append('file', file)

      const response = await fetch('/api/upload/project-photo', {
        method: 'POST',
        body: formData,
      })

      const payload = (await response.json().catch(() => null)) as { error?: string } | null
      if (!response.ok) {
        throw new Error(payload?.error ?? 'No se pudo subir la foto')
      }

      setMessage('Foto subida. Recargando listado...')
      setTitle('')
      setFile(null)
      setPreviewUrl((current) => {
        if (current) URL.revokeObjectURL(current)
        return null
      })
      window.location.reload()
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'No se pudo subir la foto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <div className="grid gap-2">
        <Label htmlFor={`photo-title-${projectId}`}>Título</Label>
        <Input id={`photo-title-${projectId}`} value={title} onChange={(event) => setTitle(event.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`photo-file-${projectId}`}>Archivo</Label>
        <Input
          id={`photo-file-${projectId}`}
          name="file"
          type="file"
          accept="image/*"
          required
          onChange={(event) => {
            const selected = event.target.files?.[0] ?? null
            setFile(selected)
            setPreviewUrl((current) => {
              if (current) URL.revokeObjectURL(current)
              return selected ? URL.createObjectURL(selected) : null
            })
          }}
        />
      </div>
      {previewUrl ? <img src={previewUrl} alt="Preview" className="h-28 w-full rounded-lg object-cover" /> : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      {message ? <p className="text-xs text-amber-600">{message}</p> : null}
      <Button type="submit" variant="secondary" disabled={loading}>
        {loading ? 'Subiendo...' : 'Subir foto'}
      </Button>
    </form>
  )
}
