'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, MessageCircle, X, Zap } from 'lucide-react'
import { Logo } from './Logo'
import { Button } from './ui/button'

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
  { href: '/trabajos-electricos', label: 'Trabajos chicos' },
  { href: '/refacciones-electricas', label: 'Refacciones' },
  { href: '/obras-electricas', label: 'Obras electricas' },
  { href: '/servicios-especiales', label: 'Servicios especiales' },
  { href: '/obras', label: 'Obras realizadas' },
  { href: '/empresa', label: 'Empresa' },
  { href: '/contacto', label: 'Contacto' },
] as const

const marqueeMessages = [
  'Trabajos chicos con precios orientativos',
  'Refacciones y obras con revision por Valdir Nerin',
  'Materiales, jornales y costos separados',
  'CABA y GBA con confirmacion de zona',
]

export function Header({ contact, logo }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const isWhatsappExternal = contact.whatsappHref.startsWith('http')

  return (
    <>
      <div className="overflow-hidden border-b border-slate-200 bg-slate-950 text-white">
        <div className="marquee-track flex gap-10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em]">
          {[...marqueeMessages, ...marqueeMessages].map((message, idx) => (
            <span key={`${message}-${idx}`} className="inline-flex items-center gap-2">
              <Zap className="h-3 w-3 text-amber-300" />
              {message}
            </span>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-border/80 bg-white/95 backdrop-blur supports-[padding:env(safe-area-inset-top)]:pt-[env(safe-area-inset-top)]">
        <div className="container flex items-center justify-between gap-3 py-2.5 sm:gap-4 sm:py-3">
          <Logo title={logo.title} subtitle={logo.subtitle} imageUrl={logo.imageUrl} className="min-w-0" />

          <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 xl:flex">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-slate-950">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button size="sm" asChild className="hidden border-0 bg-[#25D366] font-semibold text-black hover:bg-[#1ebe5a] lg:inline-flex">
              <a
                href={contact.whatsappHref}
                aria-label={contact.whatsappLabel}
                title={contact.whatsappLabel}
                target={isWhatsappExternal ? '_blank' : undefined}
                rel={isWhatsappExternal ? 'noopener noreferrer' : undefined}
                data-track="whatsapp"
                data-content-name="WhatsApp header"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </a>
            </Button>
            <Button size="sm" asChild className="hidden bg-slate-950 hover:bg-slate-800 lg:inline-flex">
              <Link href="/presupuestador" data-track="lead" data-content-name="Presupuesto header">
                Pedir presupuesto
              </Link>
            </Button>

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-foreground xl:hidden"
              aria-expanded={menuOpen}
              aria-label="Abrir menu de navegacion"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
                <Button asChild className="bg-slate-950 hover:bg-slate-800" onClick={() => setMenuOpen(false)}>
                  <Link href="/presupuestador">Pedir presupuesto</Link>
                </Button>
                <Button asChild className="bg-[#25D366] text-black hover:bg-[#1ebe5a]">
                  <a
                    href={contact.whatsappHref}
                    target={isWhatsappExternal ? '_blank' : undefined}
                    rel={isWhatsappExternal ? 'noopener noreferrer' : undefined}
                  >
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
