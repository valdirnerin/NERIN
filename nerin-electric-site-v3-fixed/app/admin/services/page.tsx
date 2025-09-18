'use client'

import Link from 'next/link'
import type { Route } from 'next'
import { useEffect, useMemo, useState } from 'react'

function slugify(value: string){
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function formatSlugLabel(value: string){
  return value
    .split('-')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function ServicesAdmin(){
  const [items, setItems] = useState<string[]>([])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(()=>{
    fetch('/api/admin/list?type=services').then(r=>r.json()).then(setItems)
  },[])

  const computedSlug = useMemo(()=> slugify(slugTouched ? slug : name), [name, slug, slugTouched])

  function handleNameChange(value: string){
    setName(value)
    if (!slugTouched) {
      setSlug(slugify(value))
    }
  }

  async function create(){
    setError(null)
    const trimmedName = name.trim()
    const finalSlug = slugify(slugTouched ? slug : trimmedName)
    if (!trimmedName) {
      setError('Ingresá un nombre para el servicio.')
      return
    }
    if (!finalSlug) {
      setError('No pudimos generar la URL. Revisá el nombre o escribí una manualmente.')
      return
    }
    setCreating(true)
    try {
      const response = await fetch('/api/admin/item?type=services&slug=' + finalSlug, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: { title: trimmedName, excerpt: '', cover: '' },
          content: ''
        })
      })
      if (!response.ok) {
        throw new Error('No se pudo crear el servicio. Probá con otro nombre.')
      }
      window.location.href = '/admin/services/' + finalSlug
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="py-10 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-extrabold">Servicios</h1>
        <p className="text-sm text-gray-600">Creá, editá y ordená la información que se muestra en la sección de servicios del sitio.</p>
      </header>

      <div className="card space-y-4">
        <div>
          <h2 className="font-semibold text-lg">Agregar un servicio nuevo</h2>
          <p className="text-sm text-gray-600">Usá un nombre descriptivo. La URL pública se genera automáticamente pero podés ajustarla.</p>
        </div>

        <div>
          <label>Nombre del servicio</label>
          <input
            value={name}
            onChange={(event)=>handleNameChange(event.target.value)}
            placeholder="Ej. Mantenimiento de subestaciones"
          />
        </div>

        <div>
          <label>URL pública</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">/services/</span>
            <input
              value={slugTouched ? slug : computedSlug}
              onChange={(event)=>{ setSlug(event.target.value); setSlugTouched(true) }}
              placeholder="mantenimiento-industrial"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Solo letras minúsculas, números y guiones medios.</p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button className="btn" onClick={create} disabled={creating}>
          {creating ? 'Creando…' : 'Crear servicio'}
        </button>
      </div>

      <section className="space-y-3">
        <div>
          <h2 className="font-semibold text-lg">Servicios existentes</h2>
          <p className="text-sm text-gray-600">Hacé clic en cualquiera para editar su contenido y las imágenes.</p>
        </div>
        {items.length === 0 ? (
          <p className="text-sm text-gray-600">Todavía no hay servicios cargados.</p>
        ) : (
          <ul className="grid md:grid-cols-3 gap-4">
            {items.map(slugValue => (
              <li key={slugValue} className="card flex flex-col gap-1">
                <span className="font-medium">{formatSlugLabel(slugValue)}</span>
                <span className="text-xs text-gray-500">/services/{slugValue}</span>
                <div className="flex gap-2">
                  <Link className="btn" href={`/admin/services/${slugValue}` as Route}>Editar</Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
