'use client'

import { useEffect, useMemo, useState } from 'react'
import slugify from 'slugify'

export type AdminPack = {
  id: string
  name: string
  slug: string
  description: string
  scope: string
  basePrice: number
  advancePrice: number
  features: string[]
  active: boolean
}

const toSlug = (value: string) => slugify(value || '', { lower: true, strict: true })

const parseFeatures = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean)
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item)).filter(Boolean)
      }
    } catch {
      // ignore
    }
    return value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

export default function AdminPacks() {
  const [name, setName] = useState('')
  const autoSlug = useMemo(() => toSlug(name), [name])
  const [customSlug, setCustomSlug] = useState('')
  const finalSlug = customSlug || autoSlug
  const [description, setDescription] = useState('')
  const [scope, setScope] = useState('')
  const [basePrice, setBasePrice] = useState<number | ''>('')
  const [advancePrice, setAdvancePrice] = useState<number | ''>('')
  const [featuresText, setFeaturesText] = useState('')
  const [active, setActive] = useState(true)

  const [items, setItems] = useState<AdminPack[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [editBasePrice, setEditBasePrice] = useState<number | ''>('')
  const [editAdvancePrice, setEditAdvancePrice] = useState<number | ''>('')
  const [editActive, setEditActive] = useState<boolean>(true)
  const [msg, setMsg] = useState<string | null>(null)

  const reload = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/pack', { cache: 'no-store' })
      const json = await response.json()
      const payload = Array.isArray(json.packs) ? json.packs : []
      const normalized: AdminPack[] = payload.map((item: any) => ({
        ...item,
        features: parseFeatures(item?.features),
      }))
      setItems(normalized)
    } catch (error) {
      console.error('Failed to load packs', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void reload()
  }, [])

  useEffect(() => {
    if (!editing) {
      setEditBasePrice('')
      setEditAdvancePrice('')
      setEditActive(true)
      return
    }

    const pack = items.find((item) => item.slug === editing)
    if (!pack) {
      setEditBasePrice('')
      setEditAdvancePrice('')
      setEditActive(true)
      return
    }
    setEditBasePrice(pack.basePrice)
    setEditAdvancePrice(pack.advancePrice)
    setEditActive(pack.active)
  }, [editing, items])

  const resetForm = () => {
    setName('')
    setCustomSlug('')
    setDescription('')
    setScope('')
    setBasePrice('')
    setAdvancePrice('')
    setFeaturesText('')
    setActive(true)
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setMsg(null)

    const response = await fetch('/api/admin/pack', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name,
        slug: finalSlug,
        description,
        scope,
        basePrice: basePrice || 0,
        advancePrice: advancePrice || 0,
        features: featuresText,
        active,
      }),
    })

    const json = await response.json()
    setSaving(false)

    if (!response.ok) {
      setMsg(json.message || 'Error al guardar')
      return
    }

    resetForm()
    await reload()
    setMsg('Pack guardado')
  }

  const removePack = async (slug: string) => {
    if (!confirm('¿Eliminar este pack?')) {
      return
    }
    const response = await fetch(`/api/admin/pack/${slug}`, { method: 'DELETE' })
    if (!response.ok) {
      alert('No se pudo eliminar')
      return
    }
    if (editing === slug) {
      setEditing(null)
    }
    await reload()
  }

  const saveEdit = async () => {
    if (!editing) return

    const response = await fetch(`/api/admin/pack/${editing}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        basePrice: editBasePrice === '' ? 0 : editBasePrice,
        advancePrice: editAdvancePrice === '' ? 0 : editAdvancePrice,
        active: editActive,
      }),
    })

    const json = await response.json()
    if (!response.ok) {
      alert(json.message || 'No se pudo actualizar')
      return
    }

    setEditing(null)
    await reload()
  }

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold">Nuevo pack eléctrico</h3>
      <form onSubmit={onSubmit} className="grid max-w-xl gap-3">
        <label>
          Nombre
          <input
            className="w-full rounded border p-2"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label>
          Slug
          <input
            className="w-full rounded border p-2"
            value={customSlug}
            placeholder={finalSlug}
            onChange={(event) => setCustomSlug(event.target.value)}
          />
        </label>
        <label>
          Descripción
          <textarea
            className="w-full rounded border p-2"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
        <label>
          Alcance (scope)
          <input
            className="w-full rounded border p-2"
            value={scope}
            onChange={(event) => setScope(event.target.value)}
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label>
            Precio base
            <input
              type="number"
              className="w-full rounded border p-2"
              value={basePrice}
              onChange={(event) =>
                setBasePrice(event.target.value === '' ? '' : Number(event.target.value))
              }
            />
          </label>
          <label>
            Precio anticipo
            <input
              type="number"
              className="w-full rounded border p-2"
              value={advancePrice}
              onChange={(event) =>
                setAdvancePrice(event.target.value === '' ? '' : Number(event.target.value))
              }
            />
          </label>
        </div>
        <label>
          Características (una por línea)
          <textarea
            className="w-full rounded border p-2"
            value={featuresText}
            onChange={(event) => setFeaturesText(event.target.value)}
          />
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={active}
            onChange={(event) => setActive(event.target.checked)}
          />
          Mostrar como activo en el sitio
        </label>

        <button disabled={saving} className="rounded bg-black px-4 py-2 text-white">
          {saving ? 'Guardando…' : 'Crear/Actualizar pack'}
        </button>
        {msg && <p className="text-sm opacity-80">{msg}</p>}
      </form>

      <div className="flex items-center gap-3">
        <h3 className="text-xl font-semibold">Packs configurados</h3>
        <button onClick={reload} disabled={loading} className="rounded border px-3 py-1">
          {loading ? 'Actualizando…' : 'Actualizar listado'}
        </button>
      </div>

      <div className="overflow-auto">
        <table className="w-full min-w-[800px] rounded border">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-2">Título</th>
              <th className="p-2">Slug</th>
              <th className="p-2">Precio base</th>
              <th className="p-2">Activo</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td className="p-4 text-center opacity-70" colSpan={5}>
                  Todavía no cargaste packs.
                </td>
              </tr>
            )}
            {items.map((pack) => (
              <tr key={pack.slug} className="border-t">
                <td className="p-2">{pack.name}</td>
                <td className="p-2">{pack.slug}</td>
                <td className="p-2">${pack.basePrice}</td>
                <td className="p-2">{pack.active ? 'Sí' : 'No'}</td>
                <td className="p-2 flex gap-2">
                  <button className="rounded border px-2 py-1" onClick={() => setEditing(pack.slug)}>
                    Editar
                  </button>
                  <button
                    className="rounded border px-2 py-1"
                    onClick={() => removePack(pack.slug)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="space-y-3 rounded border p-4">
          {(() => {
            const pack = items.find((item) => item.slug === editing)
            if (!pack) {
              return <p className="text-sm text-slate-500">Pack no encontrado.</p>
            }
            return (
              <>
                <h4 className="font-semibold">Editar: {pack.name}</h4>
                <div className="grid max-w-xl grid-cols-2 gap-3">
                  <label>
                    Precio base
                    <input
                      type="number"
                      className="w-full rounded border p-2"
                      value={editBasePrice}
                      onChange={(event) =>
                        setEditBasePrice(
                          event.target.value === '' ? '' : Number(event.target.value),
                        )
                      }
                    />
                  </label>
                  <label>
                    Precio anticipo
                    <input
                      type="number"
                      className="w-full rounded border p-2"
                      value={editAdvancePrice}
                      onChange={(event) =>
                        setEditAdvancePrice(
                          event.target.value === '' ? '' : Number(event.target.value),
                        )
                      }
                    />
                  </label>
                  <label className="col-span-2">
                    Estado
                    <select
                      className="w-full rounded border p-2"
                      value={editActive ? '1' : '0'}
                      onChange={(event) => setEditActive(event.target.value === '1')}
                    >
                      <option value="1">Sí</option>
                      <option value="0">No</option>
                    </select>
                  </label>
                </div>
                <div className="flex gap-2">
                  <button className="rounded bg-black px-3 py-1 text-white" onClick={saveEdit}>
                    Guardar cambios
                  </button>
                  <button className="rounded border px-3 py-1" onClick={() => setEditing(null)}>
                    Cancelar
                  </button>
                </div>
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
}
