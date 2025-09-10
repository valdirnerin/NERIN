'use client'
import { useState } from 'react'
export const metadata = { title: 'Contacto | NERIN' }
export default function Contacto(){
  const [form, setForm] = useState({ nombre:'', email:'', mensaje:''})
  const [ok, setOk] = useState<string>('')
  const [err, setErr] = useState<string>('')
  async function send(e:any){
    e.preventDefault(); setOk(''); setErr('')
    const res = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
    const j = await res.json(); if (res.ok) setOk('Mensaje enviado. ¡Gracias!'); else setErr(j?.error || 'Error')
  }
  return (
    <div className="py-10">
      <h1 className="text-3xl font-extrabold mb-6">Contacto</h1>
      <form className="grid md:grid-cols-2 gap-6" onSubmit={send}>
        <div><label>Nombre y apellido</label><input value={form.nombre} onChange={e=>setForm({...form, nombre:e.target.value})} placeholder="Nombre" /></div>
        <div><label>Email</label><input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} type="email" placeholder="tu@email.com" /></div>
        <div className="md:col-span-2"><label>Mensaje</label><textarea rows={6} value={form.mensaje} onChange={e=>setForm({...form, mensaje:e.target.value})} placeholder="Contanos sobre tu proyecto..." /></div>
        <div className="md:col-span-2 flex items-center gap-3">
          <button className="btn" type="submit">Enviar</button>
          {ok && <span className="text-green-700 text-sm">{ok}</span>}
          {err && <span className="text-red-600 text-sm">{err}</span>}
        </div>
      </form>
    </div>
  )
}
