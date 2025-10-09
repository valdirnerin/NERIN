import Link from 'next/link'
import { siteConfig } from '@/lib/config'

const legalLinks = [
  { href: '/terminos', label: 'Términos y condiciones' },
  { href: '/privacidad', label: 'Política de privacidad' },
] as const

const quickLinks = [
  { href: '/packs', label: 'Packs eléctricos' },
  { href: '/presupuestador', label: 'Configurar pack' },
  { href: '/mantenimiento', label: 'Planes de mantenimiento' },
  { href: '/faq', label: 'Preguntas frecuentes' },
] as const

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="container grid gap-12 py-14 md:grid-cols-4">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">NERIN</p>
          <p className="text-sm text-slate-500">
            Ingeniería eléctrica integral para obras, empresas y viviendas premium en CABA y GBA.
          </p>
          <p className="text-sm text-slate-500">CUIT 30-71583698-5 · Lunes a viernes 08 a 18 h</p>
          <p className="text-sm text-slate-500">{siteConfig.whatsapp.number}</p>
          <p className="text-sm text-slate-500">{siteConfig.social.linkedin}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Servicios</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
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
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Contacto</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <a
                href={`https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(siteConfig.whatsapp.message)}`}
                className="hover:text-foreground"
              >
                WhatsApp directo
              </a>
            </li>
            <li>
              <a href="mailto:hola@nerin.com.ar" className="hover:text-foreground">
                hola@nerin.com.ar
              </a>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-foreground">
                Pedir visita técnica
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Legales</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
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
      <div className="border-t border-border bg-muted/60 py-6">
        <div className="container flex flex-col gap-3 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} NERIN Electric. Todos los derechos reservados.</span>
          <span>Desarrollado con foco en performance, accesibilidad AA y cumplimiento normativo AEA 90364-7-771.</span>
        </div>
      </div>
    </footer>
  )
}
