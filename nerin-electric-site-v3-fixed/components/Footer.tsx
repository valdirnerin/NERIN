import Link from 'next/link'
import type { SiteExperience } from '@/types/site'
import { getWhatsappHref } from '@/lib/site-content'

const quickLinks = [
  { href: '/servicios', label: 'Servicios' },
  { href: '/packs', label: 'Packs' },
  { href: '/mantenimiento', label: 'Mantenimiento' },
  { href: '/obras', label: 'Obras' },
  { href: '/contacto', label: 'Contacto' },
] as const

const legalLinks = [
  { href: '/terminos', label: 'Terminos y condiciones' },
  { href: '/privacidad', label: 'Politica de privacidad' },
] as const

interface FooterProps {
  site: SiteExperience
}

export function Footer({ site }: FooterProps) {
  const whatsappHref = getWhatsappHref(site)
  const isWhatsappExternal = whatsappHref.startsWith('http')

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-950 py-4 text-white">
        <div className="container flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-white">
            Una instalacion mal resuelta puede salir mas cara despues. Pedi diagnostico y presupuesto claro.
          </p>
          <a
            href={whatsappHref}
            target={isWhatsappExternal ? '_blank' : undefined}
            rel={isWhatsappExternal ? 'noopener noreferrer' : undefined}
            className="inline-flex w-fit items-center rounded-full bg-[#25D366] px-4 py-2 text-xs font-bold uppercase tracking-wide text-black hover:bg-[#1ebe5a]"
            data-track="whatsapp"
            data-content-name="WhatsApp footer"
          >
            Pedir presupuesto
          </a>
        </div>
      </div>

      <div className="container grid gap-8 py-10 sm:py-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-500">NERIN Electricidad</p>
          <p className="max-w-sm text-sm font-medium text-slate-900">
            Servicios electricos para viviendas, comercios, edificios, empresas y obras en CABA/GBA.
          </p>
          <p className="text-sm text-slate-600">{site.contact.serviceArea}</p>
          <p className="text-xs text-slate-500">
            Datos legales, responsables tecnicos y matriculas se muestran cuando esten cargados en configuracion.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-500">Accesos</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-500">Contacto</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>
              <a
                href={whatsappHref}
                target={isWhatsappExternal ? '_blank' : undefined}
                rel={isWhatsappExternal ? 'noopener noreferrer' : undefined}
                data-track="whatsapp"
                data-content-name="WhatsApp footer link"
              >
                WhatsApp
              </a>
            </li>
            {site.contact.email ? (
              <li>
                <a href={`mailto:${site.contact.email}`} className="break-all">
                  {site.contact.email}
                </a>
              </li>
            ) : null}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-500">Sistema</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {legalLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/admin">Panel admin</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 py-5">
        <div className="container text-sm text-slate-500">
          <span>© {new Date().getFullYear()} NERIN Electricidad.</span>
        </div>
      </div>
    </footer>
  )
}
