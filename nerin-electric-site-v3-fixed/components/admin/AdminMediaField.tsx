'use client'

import { useCallback, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function getFilenameFromValue(value?: string) {
  if (!value) return null
  const normalized = value.split('?')[0]
  const parts = normalized.split('/')
  return decodeURIComponent(parts[parts.length - 1] || 'archivo')
}

function isImagePath(value?: string) {
  if (!value) return false
  return /\.(png|jpe?g|webp|gif|svg)$/i.test(value)
}

type AdminMediaFieldProps = {
  id: string
  label: string
  value?: string
  onChange: (value: string) => void
  description?: string
  uploadFolder?: string
  accept?: string
  allowManualUrl?: boolean
}

export function AdminMediaField({
  id,
  label,
  value,
  onChange,
  description,
  uploadFolder = 'admin',
  accept = 'image/*',
  allowManualUrl = true,
}: AdminMediaFieldProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [pendingSave, setPendingSave] = useState(false)

  const previewSrc = localPreview ?? value ?? ''
  const fileName = useMemo(() => getFilenameFromValue(value), [value])

  const handleUpload = useCallback(
    async (file: File) => {
      setError(null)
      setIsUploading(true)
      setPendingSave(false)

      if (isImagePath(file.name)) {
        setLocalPreview((current) => {
          if (current) {
            URL.revokeObjectURL(current)
          }
          return URL.createObjectURL(file)
        })
      }

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('name', file.name)
        formData.append('folder', uploadFolder)

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })

        const payload = (await response.json().catch(() => null)) as { url?: string; error?: string } | null

        if (!response.ok || !payload?.url) {
          throw new Error(payload?.error ?? 'No se pudo subir el archivo')
        }

        onChange(payload.url)
        setPendingSave(true)
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : 'No se pudo subir el archivo')
      } finally {
        setIsUploading(false)
      }
    },
    [onChange, uploadFolder],
  )

  return (
    <div className="space-y-2 rounded-xl border border-border bg-white p-3">
      <div className="space-y-1">
        <Label htmlFor={id}>{label}</Label>
        {description ? <p className="text-xs text-slate-500">{description}</p> : null}
      </div>

      <Input
        id={id}
        type="file"
        accept={accept}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (!file) return
          void handleUpload(file)
          event.currentTarget.value = ''
        }}
      />

      {allowManualUrl ? (
        <Input
          value={value ?? ''}
          onChange={(event) => {
            setError(null)
            setPendingSave(false)
            onChange(event.target.value)
          }}
          placeholder="https://..."
        />
      ) : null}

      {(isImagePath(previewSrc) && previewSrc) ? (
        <div className="space-y-2">
          <img src={previewSrc} alt={label} className="h-24 w-full rounded-lg border border-border object-cover" loading="lazy" />
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
        {fileName ? <span>Archivo: {fileName}</span> : <span>Sin archivo seleccionado</span>}
        {isUploading ? <span className="text-slate-600">Subiendo...</span> : null}
        {pendingSave ? <span className="text-amber-600">Archivo cargado, falta guardar cambios.</span> : null}
      </div>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}

      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setError(null)
            setPendingSave(false)
            setLocalPreview((current) => {
              if (current) {
                URL.revokeObjectURL(current)
              }
              return null
            })
            onChange('')
          }}
        >
          Quitar archivo
        </Button>
      ) : null}
    </div>
  )
}
