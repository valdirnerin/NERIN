'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('loading')
    await signIn('email', { email, redirect: false })
    setStatus('sent')
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <Badge>Portal de clientes</Badge>
      <h1>Ingresá con tu email</h1>
      <p className="text-sm text-slate-600">
        Te enviaremos un enlace mágico para ingresar. Si todavía no tenés acceso, escribinos a hola@nerin.com.ar.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-border bg-white p-6 shadow-subtle">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="correo@empresa.com"
          />
        </div>
        <Button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Enviando enlace...' : 'Enviar enlace de acceso'}
        </Button>
        {status === 'sent' && (
          <p className="text-xs text-slate-500">
            Revisá tu correo y hacé clic en el enlace para ingresar.
          </p>
        )}
      </form>
    </div>
  )
}
