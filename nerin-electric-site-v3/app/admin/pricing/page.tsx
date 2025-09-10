'use client'
import { useEffect, useState } from 'react'
type Plan = { slug:string; name:string; price_ars:number; sla:string; description:string; features:string[] }
export default function PricingAdmin(){
  const [plans, setPlans] = useState<Plan[]>([]); const [saved, setSaved] = useState(false)
  const [newPlan, setNewPlan] = useState<Plan>({ slug:'', name:'', price_ars:0, sla:'', description:'', features:[] })
  useEffect(()=>{ fetch('/api/admin/pricing').then(r=>r.json()).then(j=> setPlans(j.plans || [])) }, [])
  function add(){ if(!newPlan.slug || !newPlan.name) return; setPlans([...plans, {...newPlan, features:newPlan.features||[]}]); setNewPlan({ slug:'', name:'', price_ars:0, sla:'', description:'', features:[] }) }
  function remove(idx:number){ const cp=plans.slice(); cp.splice(idx,1); setPlans(cp) }
  async function save(){ setSaved(false); const res = await fetch('/api/admin/pricing',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({plans})}); if(res.ok) setSaved(true) }
  return (<div className="py-10">
    <h1 className="text-3xl font-extrabold mb-6">Paquetes corporativos</h1>
    <div className="card mb-6 space-y-3">
      <h3 className="font-semibold">Nuevo plan</h3>
      <div className="grid md:grid-cols-3 gap-3">
        <input placeholder="slug" value={newPlan.slug} onChange={e=>setNewPlan({...newPlan, slug:e.target.value})} />
        <input placeholder="nombre" value={newPlan.name} onChange={e=>setNewPlan({...newPlan, name:e.target.value})} />
        <input placeholder="precio ARS" type="number" value={newPlan.price_ars} onChange={e=>setNewPlan({...newPlan, price_ars:Number(e.target.value)})} />
        <input placeholder="SLA (ej: 24h hábiles)" value={newPlan.sla} onChange={e=>setNewPlan({...newPlan, sla:e.target.value})} />
        <input placeholder="descripción corta" value={newPlan.description} onChange={e=>setNewPlan({...newPlan, description:e.target.value})} />
        <input placeholder="features (separadas por ;)" value={newPlan.features.join('; ')} onChange={e=>setNewPlan({...newPlan, features:e.target.value.split(';').map(s=>s.trim()).filter(Boolean)})} />
      </div>
      <button className="btn" onClick={add}>Agregar</button>
    </div>
    <div className="space-y-4">
      {plans.map((pl,idx)=>(
        <div key={pl.slug} className="card space-y-2">
          <div className="grid md:grid-cols-3 gap-3">
            <input value={pl.slug} onChange={e=>{const cp=plans.slice(); cp[idx]={...pl, slug:e.target.value}; setPlans(cp)}} />
            <input value={pl.name} onChange={e=>{const cp=plans.slice(); cp[idx]={...pl, name:e.target.value}; setPlans(cp)}} />
            <input type="number" value={pl.price_ars} onChange={e=>{const cp=plans.slice(); cp[idx]={...pl, price_ars:Number(e.target.value)}; setPlans(cp)}} />
            <input value={pl.sla} onChange={e=>{const cp=plans.slice(); cp[idx]={...pl, sla:e.target.value}; setPlans(cp)}} />
            <input value={pl.description} onChange={e=>{const cp=plans.slice(); cp[idx]={...pl, description:e.target.value}; setPlans(cp)}} />
            <input value={pl.features.join('; ')} onChange={e=>{const cp=plans.slice(); cp[idx]={...pl, features:e.target.value.split(';').map(s=>s.trim()).filter(Boolean)}; setPlans(cp)}} />
          </div>
          <div className="flex gap-2"><a className="btn" href={`/precios`} target="_blank">Ver público</a><button className="btn" onClick={()=>remove(idx)}>Eliminar</button></div>
        </div>
      ))}
    </div>
    <div className="mt-4 flex items-center gap-3"><button className="btn" onClick={save}>Guardar cambios</button>{saved && <span className="text-green-700 text-sm">Guardado.</span>}</div>
  </div>)
}
