'use client'

import { useState } from 'react'
import type { AdminTechnicalStatus } from '@/lib/admin-technical-status'
import type { MediaLibraryItem } from '@/lib/media-library'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function MediaLibraryManager({ initialMedia, technicalStatus }: { initialMedia: MediaLibraryItem[]; technicalStatus: AdminTechnicalStatus }) {
  const [media, setMedia] = useState(initialMedia)
  const [status, setStatus] = useState('')
  const canUpload = technicalStatus.uploadPersistent

  async function upload(file: File | null) {
    if (!file) return
    if (!canUpload) {
      setStatus('Storage persistente no configurado. No se subió el archivo para evitar uploads que se pierdan.')
      return
    }
    setStatus('Subiendo imagen...')
    const form = new FormData()
    form.append('file', file)
    form.append('folder', 'site-media')
    const response = await fetch('/api/admin/upload', { method: 'POST', body: form })
    const payload = await response.json().catch(() => null)
    if (!response.ok) {
      setStatus(payload?.error ?? 'Error al subir imagen')
      return
    }
    setMedia((items) => [payload.media ?? { id: payload.storedPath, url: payload.url, name: file.name, createdAt: new Date().toISOString() }, ...items])
    setStatus('Imagen subida correctamente y registrada en la biblioteca.')
  }

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">Admin madre</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Biblioteca de medios</h1>
        <p className="mt-2 text-sm text-slate-600">Subí png, jpg, jpeg, webp o svg. No se guardan uploads dinámicos en /public.</p>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        <Status label="Provider" value={technicalStatus.storageProvider} danger={!canUpload} />
        <Status label="Upload persistente" value={canUpload ? 'Sí' : 'No'} danger={!canUpload} />
        <Status label="Storage dir" value={technicalStatus.storageDirLabel} danger={!canUpload} />
      </section>

      {!canUpload ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-semibold">Uploads bloqueados</p>
          <p className="mt-1">Configurá Cloudinary, S3, R2, Supabase Storage, UploadThing o Render Disk antes de subir imágenes desde el admin.</p>
          {technicalStatus.warnings.length ? <ul className="mt-2 list-disc pl-5">{technicalStatus.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul> : null}
        </div>
      ) : null}

      <div className="rounded-2xl border bg-white p-4">
        <Input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" disabled={!canUpload} onChange={(event) => void upload(event.target.files?.[0] ?? null)} />
        {status ? <p className="mt-3 text-sm text-slate-700">{status}</p> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {media.map((item) => (
          <article key={item.id} className="rounded-2xl border bg-white p-4">
            {item.url.match(/\.(png|jpe?g|webp|svg|gif)(\?|$)/i) || item.url.startsWith('http') ? <img src={item.url} alt={item.name} className="h-40 w-full rounded-xl object-cover" /> : null}
            <p className="mt-3 font-semibold text-slate-950">{item.name}</p>
            <p className="mt-1 text-xs text-slate-500">{item.provider ?? 'storage'} · {item.mimeType ?? 'archivo'}</p>
            <Input className="mt-2" value={item.url} readOnly onFocus={(e) => e.currentTarget.select()} />
            <Button className="mt-2" type="button" variant="outline" onClick={() => void navigator.clipboard.writeText(item.url)}>Copiar URL</Button>
          </article>
        ))}
      </div>
    </div>
  )
}

function Status({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return <div className={`rounded-2xl border p-4 ${danger ? 'border-red-200 bg-red-50 text-red-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}><p className="text-xs font-semibold uppercase tracking-wide">{label}</p><p className="mt-1 text-lg font-semibold">{value}</p></div>
}
