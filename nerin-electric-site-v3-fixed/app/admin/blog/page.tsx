'use client'
import Link from 'next/link'
import type { Route } from 'next'
import { useEffect, useState } from 'react'
export default function BlogAdmin(){
  const [items, setItems] = useState<string[]>([])
  const [slug, setSlug] = useState('')
  useEffect(()=>{ fetch('/api/admin/list?type=blog').then(r=>r.json()).then(setItems) },[])
  async function create(){
    const s = slug.trim().toLowerCase().replace(/\s+/g,'-'); if(!s) return
    const res = await fetch('/api/admin/item?type=blog&slug=' + s, { method:'POST', body: JSON.stringify({data:{title:s}, content:''}) })
    if(res.ok) window.location.href='/admin/blog/' + s
  }
  return (<div className="py-10">
    <h1 className="text-3xl font-extrabold mb-6">Blog</h1>
    <div className="card mb-6 flex gap-3 items-end">
      <div><label>Nuevo slug</label><input value={slug} onChange={e=>setSlug(e.target.value)} placeholder="mi-item" /></div>
      <button className="btn" onClick={create}>Crear</button>
    </div>
    <ul className="grid md:grid-cols-3 gap-4">
      {items.map(s => (
        <li key={s} className="card flex justify-between items-center">
          <span>{s}</span>
          <div className="flex gap-2"><Link className="btn" href={`/admin/blog/${s}` as Route}>Editar</Link></div>
        </li>
      ))}
    </ul>
  </div>)
}
