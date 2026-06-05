'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { Badge } from '@/components/ui/badge'

import { LoginForm } from './login-form'

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const isClient = session?.user?.role === 'client'

  useEffect(() => {
    if (status !== 'authenticated') {
      return
    }

    if (isClient) {
      router.replace('/clientes')
    }
  }, [status, isClient, router])

  const redirectMessage = useMemo(() => {
    if (status !== 'authenticated') {
      return null
    }

    if (isClient) {
      return 'Redirigiendo a tu portal...'
    }

    return null
  }, [status, isClient])

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-0 py-4 sm:py-8 md:flex-row md:items-start md:gap-10">
      <div className="max-w-md space-y-6">
        <Badge>Portal de clientes</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Ingresa con tu email</h1>
        <p className="text-sm text-slate-600">
          Te enviamos un enlace magico para que accedas a tus proyectos, certificaciones y documentacion. Es rapido y seguro,
          sin contrasenas.
        </p>
        <ul className="space-y-3 text-sm text-slate-600">
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
            Revisa los hitos de tu obra y certificaciones de avance.
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
            Descarga presupuestos, documentacion tecnica y comprobantes.
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
            Coordina visitas y soporte con el equipo NERIN.
          </li>
        </ul>
        <p className="text-xs text-slate-500">
          Si todavia no tenes acceso, escribinos a{' '}
          <a className="font-medium underline" href="mailto:hola@nerin.com.ar">
            hola@nerin.com.ar
          </a>
          .
        </p>
      </div>
      <div className="flex w-full max-w-md shrink-0 justify-center md:justify-end">
        {redirectMessage ? (
          <div className="w-full rounded-lg border border-emerald-100/60 p-6 text-sm text-slate-600 shadow-lg shadow-emerald-100/40">
            {redirectMessage}
          </div>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  )
}
