import Link from 'next/link'
import type { SiteExperience } from '@/types/site'
import { getWhatsappHref } from '@/lib/site-content'

const legalLinks = [
  { href: '/terminos', label: 'Términos y condiciones' },
  { href: '/privacidad', label: 'Política de privacidad' },
] as const

const quickLinks = [
  { href: '/servicios', label: 'Servicios' },
  { href: '/presupuestador?mode=PROJECT', label: 'Obras' },
  { href: '/obras', label: 'Casos' },
  { href: '/contacto', label: 'Contacto' },
] as const

interface FooterProps {
  site: SiteExperience
}

export function Footer({ site }: FooterProps) {
  const whatsappHref = getWhatsappHref(site)

  return (
    <footer className="border-t border-border bg-white">
      <div className="border-b border-red-200 bg-red-50 py-3">
        <div className="container flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-red-700">
            🔥 Últimos servicios del día: confirmá ahora por WhatsApp.
          </p>
          <a
            href={whatsappHref}
            className="inline-flex w-fit items-center rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-red-700 pulse-ring"
            data-track="whatsapp"
            data-content-name="WhatsApp promo footer"
          >
            Cerrar turno ahora
          </a>
        </div>
      </div>

      <div className="container grid gap-8 py-10 sm:py-12 lg:grid-cols-[1.25fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-muted-foreground">
            NERIN
          </p>
          <p className="text-sm font-medium text-foreground">
            Contratista eléctrico en CABA y GBA.
          </p>
          <p className="text-sm text-muted-foreground">{site.contact.serviceArea}</p>
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
            Agenda activa · Respuesta rápida
          </div>
          <a
            href={whatsappHref}
            className="inline-flex items-center rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#1ebe5a]"
            data-track="whatsapp"
            data-content-name="WhatsApp footer principal"
          >
            WhatsApp directo
          </a>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.34em] text-muted-foreground">
            Accesos
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-foreground">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.34em] text-muted-foreground">
            Contacto
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-foreground">
            <li>
              <a
                href={whatsappHref}
                className="hover:text-foreground"
                data-track="whatsapp"
                data-content-name="WhatsApp footer"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${site.contact.email}`} className="hover:text-foreground break-all">
                {site.contact.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.34em] text-muted-foreground">
            Legales
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-foreground">
            {legalLinks.map((item) => (
              <li key={item.href}>
                <Link className="hover:text-foreground" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border bg-muted py-6">
        <div className="container flex flex-col gap-3 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
          <span>© {new Date().getFullYear()} NERIN Electric.</span>
          <Link
            href="/admin"
            className="text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground"
          >
            Panel admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
