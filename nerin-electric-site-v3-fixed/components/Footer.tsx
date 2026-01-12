import Link from 'next/link'
import type { SiteExperience } from '@/types/site'
import { getWhatsappHref } from '@/lib/site-content'

const legalLinks = [
  { href: '/terminos', label: 'Términos y condiciones' },
  { href: '/privacidad', label: 'Política de privacidad' },
] as const

const quickLinks = [
  { href: '/packs', label: 'Packs eléctricos' },
  { href: '/presupuesto', label: 'Pedir presupuesto' },
  { href: '/mantenimiento', label: 'Planes de mantenimiento' },
  { href: '/faq', label: 'Preguntas frecuentes' },
] as const

interface FooterProps {
  site: SiteExperience
}

export function Footer({ site }: FooterProps) {
  const whatsappHref = getWhatsappHref(site)
  return (
    <footer className="border-t border-border bg-white">
      <div className="container grid gap-12 py-14 md:grid-cols-4">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">NERIN</p>
          <p className="text-sm text-muted-foreground">{site.tagline}</p>
          <p className="text-sm text-muted-foreground">{site.contact.schedule}</p>
          <p className="text-sm text-muted-foreground">{site.contact.phone}</p>
          <p className="text-sm text-muted-foreground">{site.socials.linkedin}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Servicios</h4>
          <ul className="mt-3 space-y-2 text-sm text-foreground">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link className="hover:text-foreground" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Contacto</h4>
          <ul className="mt-3 space-y-2 text-sm text-foreground">
            <li>
              <a href={whatsappHref} className="hover:text-foreground">
                WhatsApp directo
              </a>
            </li>
            <li>
              <a href={`mailto:${site.contact.email}`} className="hover:text-foreground">
                {site.contact.email}
              </a>
            </li>
            <li>
              <Link href="/presupuesto?tipo=visita" className="hover:text-foreground">
                Agendar visita técnica
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Legales</h4>
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
        <div className="container flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} NERIN Electric. Todos los derechos reservados.</span>
          <div className="flex flex-col gap-2 md:items-end">
            <span>Desarrollado con foco en performance, accesibilidad AA y cumplimiento normativo AEA 90364-7-771.</span>
            <Link href="/admin" className="text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground">
              Panel admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
