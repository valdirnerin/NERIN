'use client'
import { useEffect, useState } from 'react'

type Item = { code:string; name:string; unit:string; price_ars:number }
type Model = { currency:string; items:Item[] }

export default function CalculadoraPage(){
  const [model, setModel] = useState<Model>({ currency:'ARS', items: [] })
  const [qty, setQty] = useState<Record<string,number>>({})
  const [client, setClient] = useState({ name:'', email:'', notes:'' })
  const [resultUrl, setResultUrl] = useState<string>('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(()=>{ fetch('/api/calculator').then(r=>r.json()).then(setModel) }, [])

  const rows = model.items.map(it => {
    const q = qty[it.code] || 0
    const subtotal = q * it.price_ars
    return { ...it, q, subtotal }
  })
  const total = rows.reduce((a,b)=> a + b.subtotal, 0)

  async function generar(){
    setSending(true); setError(''); setResultUrl('')
    const payload = {
      clientName: client.name, clientEmail: client.email, notes: client.notes,
      currency: model.currency, items: rows.filter(r=>r.q>0).map(r=>({ code:r.code, name:r.name, unit:r.unit, qty:r.q, price:r.price_ars }))
    }
    const res = await fetch('/api/quote', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    const j = await res.json()
    setSending(false)
    if (res.ok) setResultUrl(j.url || '')
    else setError(j?.error || 'Error')
  }

  return (
    <div className="py-10">
      <h1 className="text-3xl font-extrabold mb-6">Calculadora de presupuesto</h1>
      <div className="card mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div><label>Cliente</label><input value={client.name} onChange={e=>setClient({...client, name:e.target.value})} placeholder="Razón social o contacto" /></div>
          <div><label>Email</label><input value={client.email} onChange={e=>setClient({...client, email:e.target.value})} type="email" placeholder="email@empresa.com" /></div>
          <div><label>Notas</label><input value={client.notes} onChange={e=>setClient({...client, notes:e.target.value})} placeholder="Plazos, accesos, etc." /></div>
        </div>
      </div>

      <div className="space-y-3">
        {rows.map(it => (
          <div key={it.code} className="card grid md:grid-cols-5 gap-3 items-end">
            <div><label>Código</label><input value={it.code} readOnly /></div>
            <div className="md:col-span-2"><label>Descripción</label><input value={it.name} readOnly /></div>
            <div><label>Precio</label><input value={`$${it.price_ars.toLocaleString()} / ${it.unit}`} readOnly /></div>
            <div><label>Cantidad</label><input type="number" min={0} value={it.q} onChange={e=>setQty({...qty, [it.code]: Number(e.target.value)})} /></div>
          </div>
        ))}
      </div>

      <div className="mt-6 card flex items-center justify-between">
        <div className="text-xl font-semibold">Total: ${'{'}total.toLocaleString(){'}'}</div>
        <button className="btn" disabled={sending || total<=0 || !client.name} onClick={generar}>
          {sending ? 'Generando...' : 'Generar presupuesto'}
        </button>
      </div>

      {resultUrl && <div className="mt-4 text-sm">Presupuesto listo: <a className="underline" href={resultUrl} target="_blank">{resultUrl}</a></div>}
      {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}
      <p className="mt-6 text-sm text-neutral-600">Nota: precios orientativos, sujetos a relevamiento en sitio. Materiales aparte.</p>
    </div>
  )
}
