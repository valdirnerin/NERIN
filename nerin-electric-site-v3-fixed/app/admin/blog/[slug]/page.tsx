'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
export default function EditBlog(){
  const params = useParams(); const slug = String(params.slug)
  const [data,setData] = useState<any>({title:'',excerpt:'',cover:''})
  const [content,setContent] = useState(''); const [saved,setSaved]=useState(false)
  useEffect(()=>{ fetch('/api/admin/item?type=blog&slug=' + slug).then(r=>r.json()).then(j=>{ setData(j.data||{}); setContent(j.content||'') }) },[slug])
  async function save(){ setSaved(false); const res = await fetch('/api/admin/item?type=blog&slug=' + slug,{method:'POST',body:JSON.stringify({data,content})}); if(res.ok) setSaved(true) }
  async function del(){ if(!confirm('Eliminar?')) return; const res = await fetch('/api/admin/item?type=blog&slug=' + slug,{method:'DELETE'}); if(res.ok) window.location.href='/admin/blog' }
  return (<div className="py-10 grid md:grid-cols-2 gap-8">
    <div className="space-y-4">
      <h1 className="text-3xl font-extrabold">Editar: {slug}</h1>
      {['title','excerpt','cover'].map(k => (
        <div key={k}><label>{k}</label><input value={data[k]||''} onChange={e=>setData({...data,[k]:e.target.value})}/></div>
      ))}
      <button className="btn" onClick={save}>Guardar</button>
      <button className="btn" onClick={del}>Eliminar</button>
      {saved && <span className="text-green-700 text-sm">Guardado.</span>}
    </div>
    <div>
      <label>Contenido (Markdown)</label>
      <textarea rows={24} value={content} onChange={e=>setContent(e.target.value)} />
    </div>
  </div>)
}
