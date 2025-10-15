'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface MagicLinkFormCopy {
  cardTitle: string
  cardDescription: string
  emailLabel: string
  placeholder: string
  submitLabel: string
  pendingLabel: string
  successMessage: string
}

export function MagicLinkForm({
  cardTitle,
  cardDescription,
  emailLabel,
  placeholder,
  submitLabel,
  pendingLabel,
  successMessage,
}: MagicLinkFormCopy) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const isLoading = status === 'loading'
  const isSent = status === 'sent'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email) {
      setErrorMessage('Ingresá un correo válido para continuar.')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const result = await signIn('email', { email, redirect: false })

      if (result?.error) {
        setStatus('idle')
        setErrorMessage('No pudimos enviar el enlace. Intentá nuevamente en unos instantes.')
        return
      }

      setStatus('sent')
    } catch (error) {
      console.error('[LOGIN] Failed to trigger magic link', error)
      setStatus('idle')
      setErrorMessage('Ocurrió un error inesperado. Intentá nuevamente.')
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
                if (errorMessage) {
                  setErrorMessage('')
                }
              }}
              placeholder={placeholder}
              disabled={isLoading || isSent}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || isSent}>
            {isLoading ? pendingLabel : submitLabel}
          </Button>
          {isSent && <p className="text-xs text-emerald-600">{successMessage}</p>}
          {errorMessage && !isSent && <p className="text-xs text-red-600">{errorMessage}</p>}
        </form>
      </CardContent>
    </Card>
  )
}
