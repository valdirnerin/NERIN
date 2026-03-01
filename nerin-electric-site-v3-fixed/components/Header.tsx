'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Logo } from './Logo'
import { Button } from './ui/button'
import { useSession } from 'next-auth/react'

interface HeaderProps {
  contact: {
    whatsappHref: string
    whatsappLabel: string
  }
  logo: {
    title: string
    subtitle: string
    imageUrl?: string | null
  }
}

const navigation = [
  { href: '/', label: 'Inicio' },
  { href: '/presupuestador', label: 'Cotización' },
  { href: '/obras', label: 'Casos' },
  { href: '/mantenimiento', label: 'Mantenimiento' },
  { href: '/contacto', label: 'Contacto' },
] as const

const clientDashboardRoute = '/clientes' as const

export function Header({ contact, logo }: HeaderProps) {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-white/95 backdrop-blur supports-[padding:env(safe-area-inset-top)]:pt-[env(safe-area-inset-top)]">
      <div className="container flex items-center justify-between gap-3 py-2.5 sm:gap-4 sm:py-3">
        <Logo title={logo.title} subtitle={logo.subtitle} imageUrl={logo.imageUrl} className="min-w-0" />

        <nav className="hidden items-center gap-5 text-sm font-medium text-muted-foreground xl:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="outline" size="sm" asChild className="hidden border border-border bg-white text-foreground lg:inline-flex">
            <a
              href={contact.whatsappHref}
              aria-label={contact.whatsappLabel}
              title={contact.whatsappLabel}
              target="_blank"
              rel="noopener noreferrer"
              data-track="whatsapp"
              data-content-name="WhatsApp header"
            >
              WhatsApp
            </a>
          </Button>
          <Button size="sm" asChild className="hidden lg:inline-flex">
            <Link href="/presupuestador" data-track="lead" data-content-name="Cotización header">
              Iniciar cotización
            </Link>
          </Button>

          {!session?.user && (
            <Button variant="secondary" size="sm" asChild className="hidden sm:inline-flex">
              <Link href="/clientes/login">Ingresar</Link>
            </Button>
          )}
          {session?.user && session.user.role !== 'admin' && (
            <Button variant="secondary" size="sm" asChild className="hidden sm:inline-flex">
              <Link href={clientDashboardRoute}>Portal clientes</Link>
            </Button>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-foreground xl:hidden"
            aria-expanded={menuOpen}
            aria-label="Abrir menú de navegación"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8">
              {menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-white xl:hidden">
          <div className="container space-y-5 py-4">
            <nav className="grid gap-1 text-sm font-medium text-foreground">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 hover:bg-muted" onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button asChild onClick={() => setMenuOpen(false)}>
                <Link href="/presupuestador">Iniciar cotización</Link>
              </Button>
              <Button variant="outline" asChild>
                <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </Button>
              {!session?.user && (
                <Button variant="secondary" asChild className="sm:col-span-2" onClick={() => setMenuOpen(false)}>
                  <Link href="/clientes/login">Ingresar</Link>
                </Button>
              )}
              {session?.user && session.user.role !== 'admin' && (
                <Button variant="secondary" asChild className="sm:col-span-2" onClick={() => setMenuOpen(false)}>
                  <Link href={clientDashboardRoute}>Portal clientes</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
