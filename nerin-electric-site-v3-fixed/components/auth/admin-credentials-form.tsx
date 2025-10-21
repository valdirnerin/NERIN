'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Route } from 'next'
import { signIn } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface AdminCredentialsCopy {
  cardTitle: string
  cardDescription: string
  emailLabel: string
  emailPlaceholder: string
  passwordLabel: string
  passwordPlaceholder: string
  submitLabel: string
  pendingLabel: string
  errorMessage: string
}

export function AdminCredentialsForm({
  cardTitle,
  cardDescription,
  emailLabel,
  emailPlaceholder,
  passwordLabel,
  passwordPlaceholder,
  submitLabel,
  pendingLabel,
  errorMessage,
}: AdminCredentialsCopy) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  const isLoading = status === 'loading'

  const defaultCallbackUrl: Route = '/admin'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email || !password) {
      setStatus('error')
      setMessage('Completá tu correo y contraseña para continuar.')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const callbackParam = searchParams?.get('callbackUrl') ?? null
      const callbackUrl =
        callbackParam && callbackParam.startsWith('/')
          ? (callbackParam as Route)
          : defaultCallbackUrl
      const result = await signIn('admin-credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      })

      if (!result || result.error) {
        setStatus('error')
        setMessage(errorMessage)
        return
      }

      const redirectUrl = (() => {
        if (!result.url) {
          return callbackUrl
        }

        try {
          const url = new URL(result.url, window.location.origin)
          return (url.pathname as Route) ?? callbackUrl
        } catch (error) {
          console.error('[LOGIN] Error procesando URL de redirección', error)
          return callbackUrl
        }
      })()

      router.replace(redirectUrl)
    } catch (error) {
      console.error('[LOGIN] Error iniciando sesión administrador', error)
      setStatus('error')
      setMessage('No pudimos iniciar sesión. Intentá nuevamente en unos segundos.')
    } finally {
      setStatus('idle')
    }
  }

  return (
    <Card className="w-full max-w-sm shrink-0 border border-emerald-100/60 shadow-lg shadow-emerald-100/40">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg">{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{emailLabel}</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                if (status === 'error') {
                  setStatus('idle')
                  setMessage('')
                }
              }}
              placeholder={emailPlaceholder}
              autoComplete="username"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{passwordLabel}</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                if (status === 'error') {
                  setStatus('idle')
                  setMessage('')
                }
              }}
              placeholder={passwordPlaceholder}
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? pendingLabel : submitLabel}
          </Button>
          {message && <p className="text-xs text-red-600">{message}</p>}
        </form>
      </CardContent>
    </Card>
  )
}
