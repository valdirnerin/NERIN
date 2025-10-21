import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { LoginForm } from './login-form'
import { getSession } from '@/lib/auth'

export const runtime = 'nodejs'

export default async function LoginPage() {
  const session = await getSession()
  if (session?.user?.role === 'admin') {
    redirect('/admin')
  }

  if (session?.user?.role === 'client') {
    redirect('/clientes')
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16 md:flex-row md:items-start">
      <div className="max-w-md space-y-6">
        <Badge>Portal de clientes</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Ingresá con tu email</h1>
        <p className="text-sm text-slate-600">
          Te enviamos un enlace mágico para que accedas a tus proyectos, certificaciones y documentación. Es rápido y seguro,
          sin contraseñas.
        </p>
        <ul className="space-y-3 text-sm text-slate-600">
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
            Revisá los hitos de tu obra y certificaciones de avance.
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
            Descargá presupuestos, documentación técnica y comprobantes.
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
            Coordiná visitas y soporte con el equipo NERIN.
          </li>
        </ul>
        <p className="text-xs text-slate-500">
          ¿No tenés acceso? Escribinos a{' '}
          <a className="font-medium underline" href="mailto:hola@nerin.com.ar">
            hola@nerin.com.ar
          </a>
          .
        </p>
        <p className="text-xs text-slate-500">
          ¿Sos parte del equipo NERIN?{' '}
          <Link className="font-medium underline" href="/admin/login">
            Ingresá al panel administrativo
          </Link>
          .
        </p>
      </div>
      <LoginForm />
    </div>
  )
}
