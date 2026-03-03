export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import { getMarketingHomeData } from '@/lib/marketing-data'
import { getSiteContent, getWhatsappHref } from '@/lib/site-content'
import { Button } from '@/components/ui/button'

export const revalidate = 60

export async function generateMetadata() {
  const site = await getSiteContent()
  const siteUrl = process.env.SITE_URL || 'https://nerin-1.onrender.com'
  const title = 'Contratista eléctrico en CABA y GBA | NERIN'
  const description =
    'Servicios, mantenimiento y trabajos eléctricos para viviendas, comercios y obras.'

  return {
    title,
    description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: site.name,
      images: [{ url: '/nerin/og-cover.png', width: 1200, height: 630, alt: 'NERIN Electric' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/nerin/og-cover.png'],
    },
  }
}

const services = [
  'Diagnóstico eléctrico',
  'Reparación de falla',
  'Colocación de artefactos',
  'Circuito para aire acondicionado',
  'Tablero',
  'Obra / reforma',
  'Local / oficina',
  'Vivienda',
  'Edificio',
]

const trustPoints = ['Atención en CABA y GBA', 'Respuesta rápida', 'Trabajo seguro y prolijo']

const urgencyItems = [
  { label: 'Turnos técnicos para hoy', value: '3' },
  { label: 'Tiempo de respuesta', value: '< 10 min' },
  { label: 'Canal más rápido', value: 'WhatsApp' },
]

const salesOffers = [
  {
    title: 'Servicio puntual express',
    oldPrice: '$58.000',
    newPrice: '$49.000',
    note: 'Diagnóstico + solución en visita técnica',
    href: '/presupuestador?mode=EXPRESS',
    cta: 'Reservar express',
  },
  {
    title: 'Obra / reforma',
    oldPrice: '$220.000',
    newPrice: '$189.000',
    note: 'Presupuesto técnico + plan de ejecución',
    href: '/presupuestador?mode=PROJECT',
    cta: 'Pedir presupuesto',
  },
  {
    title: 'Urgencias por WhatsApp',
    oldPrice: '2 hs',
    newPrice: 'Hoy',
    note: 'Canal prioritario para respuesta inmediata',
    href: '#whatsapp-directo',
    cta: 'Escribir ahora',
  },
]

const quickAnswers = [
  {
    q: '¿En cuánto responden?',
    a: 'Por WhatsApp respondemos rápido y coordinamos disponibilidad del día.',
  },
  {
    q: '¿Pasan precio antes?',
    a: 'Sí. Podés revisar lista de precios y pedir presupuesto en el momento.',
  },
  {
    q: '¿Atienden CABA y GBA?',
    a: 'Sí, trabajamos toda esa zona y coordinamos por tipo de trabajo.',
  },
]

export default async function HomePage() {
  const { caseStudies } = await getMarketingHomeData()
  const site = await getSiteContent()
  const whatsappHref = getWhatsappHref(site)

  return (
    <div className="space-y-10 pb-24 sm:space-y-14 sm:pb-0">
      <section className="rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 via-amber-50 to-red-50 px-4 py-3 text-sm sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-red-700">
            ⚠️ Hoy quedan pocos turnos. Confirmá por WhatsApp para entrar en agenda.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-red-700"
            data-track="whatsapp"
            data-content-name="WhatsApp urgencia home"
          >
            Reservar ahora
          </a>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-border/70 text-white">
        <Image
          src={site.hero.backgroundImage}
          alt={site.hero.caption}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.58)_0%,rgba(2,6,23,0.74)_55%,rgba(2,6,23,0.9)_100%)]" />

        <div className="pointer-events-none absolute right-6 top-6 hidden rounded-xl border border-cyan-300/50 bg-slate-950/70 px-4 py-2 text-xs font-semibold text-cyan-200 shadow-lg float-soft lg:block">
          ✅ 17 consultas recibidas hoy
        </div>

        <div className="pointer-events-none absolute bottom-24 right-6 hidden rounded-xl border border-red-300/50 bg-red-600/80 px-4 py-2 text-xs font-bold text-white shadow-lg animate-pulse lg:block">
          Quedan 3 turnos
        </div>

        <div className="relative z-10 flex min-h-[74vh] flex-col justify-end p-6 sm:p-10">
          <div className="max-w-3xl space-y-4">
            <p className="inline-flex w-fit animate-pulse rounded-full border border-[#FBBF24]/50 bg-[#FBBF24]/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[#FDE68A]">
              Últimos cupos del día
            </p>
            <h1 className="text-3xl font-semibold leading-[1.08] text-white sm:text-5xl">
              Contratista eléctrico en CABA y GBA
            </h1>
            <p className="max-w-2xl text-base text-slate-100 sm:text-xl">
              Servicios, mantenimiento y trabajos eléctricos para viviendas, comercios y obras.
            </p>
            <p className="text-sm font-medium text-slate-200">
              Zona de trabajo: {site.contact.serviceArea}
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:max-w-2xl sm:grid-cols-3">
            <Button size="lg" asChild className="h-12 text-base">
              <Link href="/presupuestador?mode=EXPRESS">Servicio puntual</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild className="h-12 text-base">
              <Link href="/presupuestador?mode=PROJECT">Obra o reforma</Link>
            </Button>
            <Button
              size="lg"
              asChild
              className="h-12 bg-[#25D366] text-base font-bold text-black hover:bg-[#1ebe5a]"
            >
              <a
                id="whatsapp-directo"
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                data-track="whatsapp"
                data-content-name="WhatsApp hero principal"
              >
                WhatsApp
              </a>
            </Button>
          </div>

          <ul className="mt-4 flex flex-wrap gap-2">
            {trustPoints.map((point) => (
              <li
                key={point}
                className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-slate-100"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {urgencyItems.map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-[#0EA5E9]/25 bg-[#0B0F14] p-4 text-white"
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-[#22d3ee]">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="space-y-5 rounded-2xl border border-red-200 bg-white p-5 sm:p-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-red-700">
            Ofertas del día
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">Elegí y cerrá hoy</h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          {salesOffers.map((offer) => (
            <article
              key={offer.title}
              className="rounded-xl border border-border bg-gradient-to-b from-white to-red-50/40 p-4 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">{offer.title}</h3>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Desde
              </p>
              <div className="mt-1 flex items-end gap-2">
                <span className="text-sm text-slate-400 line-through">{offer.oldPrice}</span>
                <span className="text-2xl font-bold text-red-600">{offer.newPrice}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{offer.note}</p>
              <Button asChild className="mt-4 w-full bg-red-600 hover:bg-red-700">
                <Link href={offer.href}>{offer.cta}</Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-sky-50 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-700">
              Precios y presupuesto
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Revisá la lista de precios y pedí tu presupuesto
            </h2>
            <p className="mt-1 text-sm text-slate-600">Compará opciones y avanzá en minutos.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href="/presupuestador">🗺️ Ver lista de precios</Link>
            </Button>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/presupuestador?mode=PROJECT">Pedir presupuesto ahora</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-muted-foreground">
            Servicios
          </p>
          <h2 className="text-2xl font-semibold sm:text-3xl">Qué resolvemos</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service}
              className="rounded-xl border border-border/80 bg-white px-4 py-3 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:border-red-300 hover:shadow-md"
            >
              {service}
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-muted-foreground">
            Casos
          </p>
          <h2 className="text-2xl font-semibold sm:text-3xl">Trabajos recientes</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {caseStudies.slice(0, 2).map((cs) => (
            <article
              key={cs.id}
              className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
            >
              <div className="relative h-56 w-full sm:h-64">
                <Image
                  src={cs.fotos[0] ?? site.hero.backgroundImage}
                  alt={cs.titulo}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 p-5">
                <h3 className="text-lg font-semibold text-slate-900">{cs.titulo}</h3>
                <p className="text-sm text-muted-foreground">{cs.resumen}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-white p-5 sm:p-6">
        <h2 className="text-2xl font-semibold">Respuestas rápidas antes de contratar</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {quickAnswers.map((item) => (
            <article key={item.q} className="rounded-xl border border-border bg-muted/20 p-4">
              <h3 className="text-base font-semibold text-slate-900">{item.q}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-red-300 bg-gradient-to-r from-red-50 to-amber-50 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-red-700">
              Últimos turnos de hoy
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Pedí presupuesto y cerrá tu turno ahora
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Te respondemos por WhatsApp y coordinamos rápido.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-[#25D366] text-black hover:bg-[#1ebe5a]">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                data-track="whatsapp"
                data-content-name="WhatsApp cierre home"
              >
                Llamar / WhatsApp ahora
              </a>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/contacto">Enviar consulta</Link>
            </Button>
          </div>
        </div>
      </section>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-4 z-40 hidden rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-black shadow-2xl hover:bg-[#1ebe5a] lg:inline-flex float-soft"
        data-track="whatsapp"
        data-content-name="WhatsApp flotante desktop"
      >
        WhatsApp inmediato
      </a>

      <div className="fixed inset-x-0 bottom-3 z-40 px-4 sm:hidden">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-2 rounded-2xl border border-border bg-white/95 p-2 shadow-xl backdrop-blur">
          <Button asChild className="h-11 bg-[#25D366] text-black hover:bg-[#1ebe5a]">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              data-track="whatsapp"
              data-content-name="WhatsApp barra fija mobile"
            >
              WhatsApp ya
            </a>
          </Button>
          <Button asChild className="h-11 bg-red-600 hover:bg-red-700">
            <Link href="/presupuestador?mode=EXPRESS">Reservar turno</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
