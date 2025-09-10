'use client'
import { useState } from 'react'
export default function LoginPage(){
  const [username, setUsername] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState('')
  async function submit(e:any){ e.preventDefault(); setError('')
    const res = await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})})
    if(res.ok) window.location.href='/admin'; else { const j = await res.json().catch(()=>({})); setError(j?.error||'Error') }
  }
  return (<div className="py-10 max-w-md mx-auto">
    <h1 className="text-3xl font-extrabold mb-4">Acceso admin</h1>
    <form onSubmit={submit} className="space-y-4 card">
      <div><label>Usuario</label><input value={username} onChange={e=>setUsername(e.target.value)} /></div>
      <div><label>Contraseña</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button className="btn" type="submit">Ingresar</button>
    </form>
  </div>)
}
