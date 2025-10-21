import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { AdminLoginForm } from './login-form'
import { getSession } from '@/lib/auth'

export const runtime = 'nodejs'

export default async function AdminLoginPage() {
  const session = await getSession()
  if (session?.user?.role === 'admin') {
    redirect('/admin')
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid gap-12 md:grid-cols-2 md:items-start">
        <div className="space-y-6">
          <Badge>Panel administrativo</Badge>
          <h1 className="text-3xl font-semibold tracking-tight">Ingresá al panel de administración</h1>
          <p className="text-sm text-slate-600">
            Ingresá usando la cuenta administradora configurada en Render. Con ese usuario único accedés directo al tablero
            para publicar packs, casos de éxito y certificados de avance.
          </p>
          <ol className="space-y-3 text-sm text-slate-600">
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
              Ingresá tu correo administrador.
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
              Escribí la contraseña segura que definiste en las variables de entorno.
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
              Actualizá contenidos, certificados y planes con un par de clics.
            </li>
          </ol>
          <p className="text-xs text-slate-500">
            ¿Necesitás sumar más cuentas o restablecer la clave? Escribinos a{' '}
            <a className="font-medium underline" href="mailto:hola@nerin.com.ar">
              hola@nerin.com.ar
            </a>
            .
          </p>
          <p className="text-xs text-slate-500">
            ¿Sos cliente NERIN?{' '}
            <Link className="font-medium underline" href="/clientes/login">
              Ingresá al portal de clientes
            </Link>
            .
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <Suspense
            fallback={
              <div className="w-full max-w-sm shrink-0 rounded-lg border border-emerald-100/60 p-6 shadow-lg shadow-emerald-100/40" />
            }
          >
            <AdminLoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
