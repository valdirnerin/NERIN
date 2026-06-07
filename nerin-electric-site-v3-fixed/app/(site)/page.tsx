import Link from 'next/link'
import { ArrowRight, CheckCircle2, MessageCircle, Search, ShieldCheck, Zap } from 'lucide-react'
import { getSiteContent, getWhatsappHref } from '@/lib/site-content'
import { resolveCommercialSite, type CommercialSite } from '@/lib/commercial-content'
import { Button } from '@/components/ui/button'

export const revalidate = 60

export async function generateMetadata() {
  const siteUrl = process.env.SITE_URL || 'https://nerin-1.onrender.com'
  const title = 'Electricidad profesional en CABA y GBA | NERIN'
  const description = 'Trabajos chicos con precios orientativos, refacciones y obras electricas con ejecucion prolija y seguimiento real.'

  return {
    title,
    description,
    alternates: { canonical: '/' },
    openGraph: {
      title,
      description,
      url: siteUrl,
      images: [{ url: '/nerin/og-cover.png', width: 1200, height: 630, alt: 'NERIN Electricidad' }],
    },
  }
}

function money(value: number, currency: string) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
}

function imageFor(site: CommercialSite, location: string, fallback: string) {
  return site.commercialImages.find((image) => image.active && image.location === location)?.url || fallback
}

export default async function HomePage() {
  const site = resolveCommercialSite(await getSiteContent())
  const whatsappHref = getWhatsappHref(site)
  const isWhatsappExternal = whatsappHref.startsWith('http')
  const heroImage = imageFor(site, 'hero-home', site.hero.backgroundImage)

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-[linear-gradient(180deg,#fff_0%,#f8fafc_100%)]">
        <div className="container grid min-h-[calc(100svh-8.5rem)] items-center gap-8 py-8 lg:grid-cols-[0.9fr_0.65fr] lg:py-12">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-900 sm:text-xs">
              <Zap className="h-4 w-4 text-amber-500" />
              {site.hero.badge}
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.03] tracking-tight text-slate-950 sm:text-6xl">
                {site.hero.title}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">{site.hero.subtitle}</p>
            </div>
            <div className="grid gap-3 sm:flex">
              <Button asChild size="lg" className="h-12 bg-slate-950 px-6 text-base font-bold text-white hover:bg-slate-800">
                <Link href={site.hero.primaryCta.href || '/trabajos-electricos'}>
                  <Search className="mr-2 h-5 w-5" />
                  {site.hero.primaryCta.label}
                </Link>
              </Button>
              <Button asChild size="lg" className="h-12 bg-[#25D366] px-6 text-base font-bold text-black hover:bg-[#1ebe5a]">
                <a href={whatsappHref} target={isWhatsappExternal ? '_blank' : undefined} rel={isWhatsappExternal ? 'noopener noreferrer' : undefined}>
                  <MessageCircle className="mr-2 h-5 w-5" />
                  {site.hero.secondaryCta.label}
                </a>
              </Button>
            </div>
            <div className="grid gap-2 pt-1 sm:grid-cols-3">
              {site.hero.benefits.map((benefit) => (
                <p key={benefit.text} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {benefit.text}
                </p>
              ))}
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <div
                className="h-72 bg-slate-200 bg-cover bg-center"
                style={{ backgroundImage: `url(${heroImage})` }}
                role="img"
                aria-label={site.commercialImages.find((image) => image.location === 'hero-home')?.alt || 'NERIN Electricidad'}
              />
              <div className="grid gap-3 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Arranca claro</p>
                <p className="text-2xl font-semibold text-slate-950">
                  Visita tecnica desde {money(site.pricingRules.technicalVisitFrom, site.pricingRules.currency)}
                </p>
                <p className="text-sm leading-6 text-slate-600">{site.pricingRules.priceDisclaimer}</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="container py-10">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Servicios principales</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Elegi el tipo de trabajo electrico</h2>
          </div>
          <Link href="/trabajos-electricos" className="inline-flex items-center text-sm font-semibold text-slate-950">
            Ver trabajos chicos con precios
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {site.commercialCards.map((item) => (
            <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
              <Link href={item.href} className="mt-5 inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                {item.ctaLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-10">
        <div className="container grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Precio claro antes de empezar</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Si es simple, ves un precio orientativo. Si es complejo, lo revisamos.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              'Envia fotos y evita visitas innecesarias',
              'Trabajos prolijos, sin improvisar',
              'Materiales separados cuando aplica',
              'Seguimiento real en refacciones y obras',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
