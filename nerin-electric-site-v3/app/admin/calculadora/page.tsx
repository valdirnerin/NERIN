'use client'
import { useEffect, useState } from 'react'

type Item = { code: string; name: string; unit: string; price_ars: number }
type Model = { currency: string; items: Item[] }

export default function CalculadoraAdmin(){
  const [model, setModel] = useState<Model>({ currency:'ARS', items: [] })
  const [saved, setSaved] = useState(false)
  const [newItem, setNewItem] = useState<Item>({ code:'', name:'', unit:'ud', price_ars:0 })

  useEffect(()=>{ fetch('/api/admin/calculator').then(r=>r.json()).then(setModel) }, [])

  function add(){
    if(!newItem.code || !newItem.name) return
    setModel({ ...model, items: [...model.items, newItem] })
    setNewItem({ code:'', name:'', unit:'ud', price_ars:0 })
  }

  function remove(i:number){
    const cp = model.items.slice(); cp.splice(i,1); setModel({ ...model, items: cp })
  }

  async function save(){
    setSaved(false)
    const res = await fetch('/api/admin/calculator', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(model) })
    if (res.ok) setSaved(true)
  }

  return (
    <div className="py-10">
      <h1 className="text-3xl font-extrabold mb-6">Calculadora: ítems y precios</h1>
      <div className="card mb-6 space-y-3">
        <div className="grid md:grid-cols-4 gap-3">
          <input placeholder="Código" value={newItem.code} onChange={e=>setNewItem({...newItem, code:e.target.value.toUpperCase()})} />
          <input placeholder="Nombre" value={newItem.name} onChange={e=>setNewItem({...newItem, name:e.target.value})} />
          <input placeholder="Unidad (ud/m/hora/boca...)" value={newItem.unit} onChange={e=>setNewItem({...newItem, unit:e.target.value})} />
          <input placeholder="Precio ARS" type="number" value={newItem.price_ars} onChange={e=>setNewItem({...newItem, price_ars:Number(e.target.value)})} />
        </div>
        <button className="btn" onClick={add}>Agregar ítem</button>
      </div>

      <div className="space-y-3">
        {model.items.map((it, idx)=>(
          <div key={it.code} className="card grid md:grid-cols-4 gap-3 items-end">
            <input value={it.code} onChange={e=>{ const cp=[...model.items]; cp[idx]={...it, code:e.target.value.toUpperCase()}; setModel({...model, items:cp}) }} />
            <input value={it.name} onChange={e=>{ const cp=[...model.items]; cp[idx]={...it, name:e.target.value}; setModel({...model, items:cp}) }} />
            <input value={it.unit} onChange={e=>{ const cp=[...model.items]; cp[idx]={...it, unit:e.target.value}; setModel({...model, items:cp}) }} />
            <input type="number" value={it.price_ars} onChange={e=>{ const cp=[...model.items]; cp[idx]={...it, price_ars:Number(e.target.value)}; setModel({...model, items:cp}) }} />
            <button className="btn" onClick={()=>remove(idx)}>Eliminar</button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button className="btn" onClick={save}>Guardar cambios</button>
        {saved && <span className="text-green-700 text-sm">Guardado.</span>}
      </div>
    </div>
  )
}
