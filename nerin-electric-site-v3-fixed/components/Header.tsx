'use client'

import Link from 'next/link'
import { siteConfig } from '@/lib/config'
import { Logo } from './Logo'
import { Button } from './ui/button'
import { useSession } from 'next-auth/react'

const navigation = [
  { href: '/servicios', label: 'Servicios' },
  { href: '/packs', label: 'Packs eléctricos' },
  { href: '/mantenimiento', label: 'Mantenimiento' },
  { href: '/obras', label: 'Obras' },
  { href: '/empresa', label: 'Empresa' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/blog', label: 'Blog' },
] as const

const adminDashboardRoute = '/admin' as const
const clientDashboardRoute = '/clientes' as const

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-white/90 backdrop-blur">
      <div className="container flex items-center justify-between gap-6 py-4">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
            <a
              href={`https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(siteConfig.whatsapp.message)}`}
              aria-label="Hablar por WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </Button>
          <Button size="sm" asChild className="hidden md:inline-flex">
            <Link href="/contacto">Pedir presupuesto</Link>
          </Button>
          {session?.user ? (
            <Button variant="secondary" size="sm" asChild>
              <Link href={session.user.role === 'admin' ? adminDashboardRoute : clientDashboardRoute}>
                {session.user.role === 'admin' ? 'Panel admin' : 'Portal clientes'}
              </Link>
            </Button>
          ) : (
            <Button variant="secondary" size="sm" asChild>
              <Link href="/clientes/login">Ingresar</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
