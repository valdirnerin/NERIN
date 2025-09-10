'use client'
import { useEffect, useState } from 'react'
export default function SiteEditor(){
  const [site, setSite] = useState<any>(null); const [saved, setSaved]=useState(false)
  useEffect(()=>{ fetch('/api/admin/site').then(r=>r.json()).then(setSite) },[])
  async function save(){ setSaved(false); const res = await fetch('/api/admin/site',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(site)}); if(res.ok) setSaved(true) }
  if(!site) return <div className="py-10">Cargando...</div>
  return (
    <div className="py-10 max-w-2xl">
      <h1 className="text-3xl font-extrabold mb-6">Ajustes del sitio</h1>
      <div className="card space-y-4">
        {['siteName','tagline','logo','primaryPhone','primaryEmail','address','accent'].map(k=>(
          <div key={k}><label>{k}</label><input value={site[k]||''} onChange={e=>setSite({...site,[k]:e.target.value})}/></div>
        ))}
        <div><label>LinkedIn</label><input value={site.social?.linkedin||''} onChange={e=>setSite({...site,social:{...site.social,linkedin:e.target.value}})}/></div>
        <div><label>Instagram</label><input value={site.social?.instagram||''} onChange={e=>setSite({...site,social:{...site.social,instagram:e.target.value}})}/></div>
        <button className="btn" onClick={save}>Guardar</button>{saved && <span className="text-green-700 text-sm"> Guardado.</span>}
      </div>
    </div>
  )
}
