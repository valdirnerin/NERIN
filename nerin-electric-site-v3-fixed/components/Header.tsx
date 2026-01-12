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
  { href: '/mantenimiento', label: 'Mantenimiento' },
  { href: '/obras', label: 'Obras' },
  { href: '/packs', label: 'Packs' },
  { href: '/empresa', label: 'Empresa' },
  { href: '/contacto', label: 'Contacto' },
] as const

const clientDashboardRoute = '/clientes' as const

export function Header({ contact }: HeaderProps) {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-white/95 backdrop-blur">
      <div className="container flex items-center justify-between gap-6 py-3">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground lg:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="hidden items-center gap-2 border border-border bg-white text-foreground md:inline-flex"
          >
            <a
              href={contact.whatsappHref}
              aria-label={contact.whatsappLabel}
              title={contact.whatsappLabel}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-current text-[#FBBF24]">
                <path d="M12 4.2a7.8 7.8 0 0 0-6.75 11.7L4 20l4.2-1.1A7.8 7.8 0 1 0 12 4.2Zm0 1.6a6.2 6.2 0 0 1 0 12.4 6.1 6.1 0 0 1-3.1-.9l-.4-.2-2.5.7.7-2.4-.3-.4a6.2 6.2 0 0 1 5.6-9.2Zm-2.4 3.3c-.2 0-.4 0-.5.2-.2.2-.7.7-.7 1.6s.7 2 1 2.3c.2.3 1.4 2.1 3.5 2.9 1.7.7 2 .5 2.3.5.3 0 1-.5 1.1-.9.1-.4.1-.8.1-.9s0-.2-.2-.2l-1.1-.5c-.2-.1-.3 0-.4.1-.1.2-.5.9-.6 1-.1.2-.2.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.1-1.4-1.2-1.6-.1-.2 0-.3.1-.4l.3-.3.2-.3c.1-.1.1-.3 0-.4l-.5-1.1c-.1-.2-.2-.2-.4-.2Z" />
              </svg>
              WhatsApp
            </a>
          </Button>
          <Button size="sm" asChild className="hidden md:inline-flex">
            <Link href="/presupuesto">Pedir presupuesto</Link>
          </Button>
          {!session?.user && (
            <Button variant="secondary" size="sm" asChild>
              <Link href="/clientes/login">Ingresar</Link>
            </Button>
          )}
          {session?.user && session.user.role !== 'admin' && (
            <Button variant="secondary" size="sm" asChild>
              <Link href={clientDashboardRoute}>Portal clientes</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
