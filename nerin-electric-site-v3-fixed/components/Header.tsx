'use client'

import Link from 'next/link'
import { Logo } from './Logo'
import { Button } from './ui/button'
import { useSession } from 'next-auth/react'

interface HeaderProps {
  contact: {
    whatsappHref: string
    whatsappLabel: string
  }
}

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

export function Header({ contact }: HeaderProps) {
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
            <a href={contact.whatsappHref} aria-label="Hablar por WhatsApp" target="_blank" rel="noopener noreferrer">
              {contact.whatsappLabel}
            </a>
          </Button>
          <Button size="sm" asChild className="hidden md:inline-flex">
            <Link href="/presupuesto">Pedir presupuesto</Link>
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
