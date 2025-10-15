import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { AdminLoginForm } from './login-form'

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid gap-12 md:grid-cols-2 md:items-start">
        <div className="space-y-6">
          <Badge>Panel administrativo</Badge>
          <h1 className="text-3xl font-semibold tracking-tight">Ingresá al panel de administración</h1>
          <p className="text-sm text-slate-600">
            Recibís un enlace de un solo uso en tu correo corporativo. Ese enlace te lleva directo al tablero para publicar
            packs, casos de éxito y certificados de avance.
          </p>
          <ol className="space-y-3 text-sm text-slate-600">
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
              Ingresá tu correo @nerin para verificar tu identidad.
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
              Abrí el enlace mágico y llegás directo al panel.
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
              Actualizá contenidos, certificados y planes con un par de clics.
            </li>
          </ol>
          <p className="text-xs text-slate-500">
            ¿Necesitás sumar a alguien del equipo? Escribinos a{' '}
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
          <AdminLoginForm />
        </div>
      </div>
    </div>
  )
}
