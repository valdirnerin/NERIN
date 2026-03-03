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
  { href: '/servicios', label: 'Servicios' },
  { href: '/presupuestador?mode=PROJECT', label: 'Obras' },
  { href: '/obras', label: 'Casos' },
  { href: '/contacto', label: 'Contacto' },
] as const

const clientDashboardRoute = '/clientes' as const

const marqueeMessages = [
  '⚡ Turnos técnicos para hoy: limitados',
  '📲 Atención prioritaria por WhatsApp',
  '🛠️ Servicio puntual y obra eléctrica',
  '🏙️ Cobertura CABA y GBA',
]

export function Header({ contact, logo }: HeaderProps) {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <div className="overflow-hidden border-b border-red-200 bg-red-600 text-white">
        <div className="marquee-track flex gap-8 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]">
          {[...marqueeMessages, ...marqueeMessages].map((message, idx) => (
            <span key={`${message}-${idx}`}>{message}</span>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-border/80 bg-white/95 backdrop-blur supports-[padding:env(safe-area-inset-top)]:pt-[env(safe-area-inset-top)]">
        <div className="container flex items-center justify-between gap-3 py-2.5 sm:gap-4 sm:py-3">
          <Logo
            title={logo.title}
            subtitle={logo.subtitle}
            imageUrl={logo.imageUrl}
            className="min-w-0"
          />

          <nav className="hidden items-center gap-5 text-sm font-medium text-muted-foreground xl:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              size="sm"
              asChild
              className="hidden border-0 bg-[#25D366] font-semibold text-black hover:bg-[#1ebe5a] lg:inline-flex"
            >
              <a
                href={contact.whatsappHref}
                aria-label={contact.whatsappLabel}
                title={contact.whatsappLabel}
                target="_blank"
                rel="noopener noreferrer"
                data-track="whatsapp"
                data-content-name="WhatsApp header"
              >
                WhatsApp ya
              </a>
            </Button>
            <Button
              size="sm"
              asChild
              className="hidden bg-red-600 hover:bg-red-700 lg:inline-flex pulse-ring"
            >
              <Link
                href="/presupuestador?mode=EXPRESS"
                data-track="lead"
                data-content-name="Servicio puntual header"
              >
                Reservar turno
              </Link>
            </Button>

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-foreground xl:hidden"
              aria-expanded={menuOpen}
              aria-label="Abrir menú de navegación"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-5 w-5 stroke-current"
                fill="none"
                strokeWidth="1.8"
              >
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6 6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-border bg-white xl:hidden">
            <div className="container space-y-5 py-4">
              <nav className="grid gap-1 text-sm font-medium text-foreground">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2 hover:bg-muted"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  asChild
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => setMenuOpen(false)}
                >
                  <Link href="/presupuestador?mode=EXPRESS">Reservar turno</Link>
                </Button>
                <Button asChild className="bg-[#25D366] text-black hover:bg-[#1ebe5a]">
                  <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer">
                    WhatsApp ya
                  </a>
                </Button>
                <Button
                  variant="secondary"
                  asChild
                  className="sm:col-span-2"
                  onClick={() => setMenuOpen(false)}
                >
                  <Link href="/contacto">Contacto</Link>
                </Button>

                {!session?.user && (
                  <Button
                    variant="outline"
                    asChild
                    className="sm:col-span-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Link href="/clientes/login">Ingresar</Link>
                  </Button>
                )}
                {session?.user && session.user.role !== 'admin' && (
                  <Button
                    variant="outline"
                    asChild
                    className="sm:col-span-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Link href={clientDashboardRoute}>Portal clientes</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
