'use client'

import Link from 'next/link'
import type { Route } from 'next'
import { useEffect, useMemo, useState } from 'react'
import { Menu, MessageCircle, X, Zap } from 'lucide-react'
import { Logo } from './Logo'
import { Button } from './ui/button'

interface HeaderProps {
  contact: { whatsappHref: string; whatsappLabel: string }
  logo: { title: string; subtitle: string; imageUrl?: string | null }
  commercialBar?: {
    enabled: boolean
    messages: string[]
    optionalLinkHref?: string
    optionalLinkLabel?: string
    displayMode?: 'estatica' | 'rotativa' | 'marquee-suave'
    mobilePriority?: boolean
  }
}

const navigation = [
  { href: '/', label: 'Inicio' },
  { href: '/trabajos-electricos', label: 'Trabajos chicos' },
  { href: '/refacciones-electricas', label: 'Refacciones' },
  { href: '/obras-electricas', label: 'Obras' },
  { href: '/obras', label: 'Casos reales' },
  { href: '/empresa', label: 'Empresa' },
  { href: '/contacto', label: 'Contacto' },
] as const

const fallbackMessages = ['⚡ Mirá precios antes de consultar · Visita técnica desde $80.000 · Enviá fotos por WhatsApp · CABA y GBA']

function asRoute(href: string) {
  return href as Route
}

export function Header({ contact, logo, commercialBar }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeMessage, setActiveMessage] = useState(0)
  const isWhatsappExternal = contact.whatsappHref.startsWith('http')
  const incomingMessages = useMemo(() => commercialBar?.messages?.filter(Boolean) ?? [], [commercialBar?.messages])
  const barMessages = useMemo(() => (incomingMessages.length ? incomingMessages : fallbackMessages), [incomingMessages])
  const displayMode = commercialBar?.displayMode ?? 'marquee-suave'
  const showBar = commercialBar?.enabled !== false

  useEffect(() => {
    if (displayMode !== 'rotativa' || barMessages.length < 2) return undefined
    const interval = window.setInterval(() => setActiveMessage((current) => (current + 1) % barMessages.length), 3200)
    return () => window.clearInterval(interval)
  }, [barMessages.length, displayMode])

  return (
    <>
      {showBar ? (
        <div className="max-h-9 overflow-hidden border-b border-amber-200 bg-slate-950 text-white sm:max-h-none">
          {displayMode === 'estatica' ? (
            <div className="container flex flex-wrap items-center justify-center gap-x-5 gap-y-1 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] sm:justify-between">
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
                {barMessages.map((message) => (
                  <span key={message} className="inline-flex items-center gap-2 whitespace-nowrap">
                    <Zap className="h-3 w-3 text-amber-300" />
                    {message}
                  </span>
                ))}
              </div>
              {commercialBar?.optionalLinkHref && commercialBar.optionalLinkLabel ? (
                <Link href={asRoute(commercialBar.optionalLinkHref)} className="text-amber-200 underline-offset-4 hover:underline">
                  {commercialBar.optionalLinkLabel}
                </Link>
              ) : null}
            </div>
          ) : displayMode === 'rotativa' ? (
            <div className="container flex items-center justify-center gap-3 px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[0.14em] sm:justify-between">
              <span className="inline-flex items-center gap-2">
                <Zap className="h-3 w-3 text-amber-300" />
                {barMessages[activeMessage] ?? barMessages[0]}
              </span>
              {commercialBar?.optionalLinkHref && commercialBar.optionalLinkLabel ? (
                <Link href={asRoute(commercialBar.optionalLinkHref)} className="hidden text-amber-200 underline-offset-4 hover:underline sm:inline-flex">
                  {commercialBar.optionalLinkLabel}
                </Link>
              ) : null}
            </div>
          ) : (
            <div className="marquee-track flex gap-10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em]">
              {[...barMessages, ...barMessages].map((message, idx) => (
                <span key={`${message}-${idx}`} className="inline-flex items-center gap-2 whitespace-nowrap">
                  <Zap className="h-3 w-3 text-amber-300" />
                  {message}
                </span>
              ))}
              {commercialBar?.optionalLinkHref && commercialBar.optionalLinkLabel ? (
                <Link href={asRoute(commercialBar.optionalLinkHref)} className="inline-flex whitespace-nowrap text-amber-200 underline-offset-4 hover:underline">
                  {commercialBar.optionalLinkLabel}
                </Link>
              ) : null}
            </div>
          )}
        </div>
      ) : null}

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
                  <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 hover:bg-muted" onClick={() => setMenuOpen(false)}>
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="grid gap-2">
                <Button asChild className="bg-[#25D366] text-black hover:bg-[#1ebe5a]">
                  <a href={contact.whatsappHref} target={isWhatsappExternal ? '_blank' : undefined} rel={isWhatsappExternal ? 'noopener noreferrer' : undefined}>
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

