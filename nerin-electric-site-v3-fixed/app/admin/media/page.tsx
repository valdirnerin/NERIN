'use client'
import { useState } from 'react'
export default function MediaUploader(){
  const [file, setFile] = useState<File|null>(null)
  const [url, setUrl] = useState<string>('')
  const [err, setErr] = useState<string>('')
  async function upload(e:any){
    e.preventDefault(); setErr(''); setUrl('')
    if(!file) return
    const fd = new FormData(); fd.append('file', file); fd.append('name', file.name)
    const res = await fetch('/api/admin/upload', { method:'POST', body: fd })
    const j = await res.json(); if (res.ok) setUrl(j.url); else setErr(j.error||'Error')
  }
  return (<div className="py-10 max-w-xl">
    <h1 className="text-3xl font-extrabold mb-4">Subir imagen</h1>
    <form onSubmit={upload} className="card space-y-4">
      <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0] || null)} />
      <button className="btn" type="submit">Subir</button>
      {url && <div className="text-sm">URL: <a className="underline" href={url} target="_blank">{url}</a></div>}
      {err && <div className="text-sm text-red-600">{err}</div>}
    </form>
    <p className="mt-4 text-sm text-neutral-600">Usá la URL en "cover" o dentro del Markdown.</p>
  </div>)
}
