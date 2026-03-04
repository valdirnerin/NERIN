export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import type { Route } from 'next'
import { getMarketingHomeData } from '@/lib/marketing-data'
import { getSiteContent, getWhatsappHref } from '@/lib/site-content'
import { Button } from '@/components/ui/button'

export const revalidate = 60

export async function generateMetadata() {
  const site = await getSiteContent()
  const siteUrl = process.env.SITE_URL || 'https://nerin-1.onrender.com'
  const title = 'Electricidad para hogares y obras en CABA y GBA | NERIN'
  const description =
    'Respuesta rápida, solicitud simple y ejecución prolija para hogares, comercios y proyectos de obra.'

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

const trustPoints = [
  'Atención en CABA y GBA',
  'Solicitud por WhatsApp o formulario',
  'Ejecución prolija y seguimiento',
]

const systemSteps = [
  {
    title: '1) Enviás solicitud',
    description: 'Nos contás qué necesitás por WhatsApp o formulario en menos de 2 minutos.',
  },
  {
    title: '2) Ordenamos el trabajo',
    description: 'Definimos alcance, prioridad y el mejor formato: puntual, instalación o proyecto.',
  },
  {
    title: '3) Te confirmamos propuesta',
    description: 'Recibís una propuesta clara para avanzar sin idas y vueltas.',
  },
  {
    title: '4) Ejecutamos y cerramos',
    description: 'Coordinamos, resolvemos y dejamos el trabajo terminado con seguimiento.',
  },
]

const serviceCards = [
  {
    title: 'Servicio puntual en hogar',
    description: 'Artefactos, lámparas, circuitos y fallas comunes resueltas con orden y rapidez.',
    href: '/presupuestador?mode=EXPRESS',
    cta: 'Enviar solicitud puntual',
  },
  {
    title: 'Instalaciones y mejoras',
    description: 'Tableros, circuitos dedicados, puesta a tierra y mejoras para trabajar con tranquilidad.',
    href: '/servicios',
    cta: 'Ver servicios',
  },
  {
    title: 'Obras y reformas con presupuesto',
    description: 'Proyectos de vivienda y obra con alcance claro y coordinación profesional.',
    href: '/presupuestador?mode=PROJECT',
    cta: 'Iniciar cotización',
  },
] as const satisfies ReadonlyArray<{
  title: string
  description: string
  href: Route
  cta: string
}>

const riskPoints = [
  'Solicitud simple y respuesta ordenada para que no quedes esperando sin saber.',
  'Alcance claro antes de avanzar, para evitar sorpresas innecesarias.',
  'Seguimiento del trabajo hasta cierre, especialmente en proyectos grandes.',
]

export default async function HomePage() {
  const { caseStudies } = await getMarketingHomeData()
  const site = await getSiteContent()
  const whatsappHref = getWhatsappHref(site)

  return (
    <div className="space-y-10 pb-24 sm:space-y-14 sm:pb-0">
      <section className="rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-sky-50 px-4 py-3 text-sm sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-cyan-900">
            Agenda activa esta semana. Si querés resolverlo rápido, enviá tu solicitud ahora.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center rounded-full bg-[#25D366] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-black hover:bg-[#1ebe5a]"
            data-track="whatsapp"
            data-content-name="WhatsApp urgencia home"
          >
            Solicitar por WhatsApp
          </a>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-border/70 text-white">
        <Image src={site.hero.backgroundImage} alt={site.hero.caption} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.58)_0%,rgba(2,6,23,0.74)_55%,rgba(2,6,23,0.9)_100%)]" />

        <div className="relative z-10 flex min-h-[72vh] flex-col justify-end p-6 sm:p-10">
          <div className="max-w-3xl space-y-4">
            <p className="inline-flex w-fit rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-100">
              NERIN Electricidad
            </p>
            <h1 className="text-3xl font-semibold leading-[1.08] text-white sm:text-5xl">
              Si necesitás resolver una falla, una instalación o una obra sin perder tiempo con
              improvisados, hablá con nosotros.
            </h1>
            <p className="max-w-2xl text-base text-slate-100 sm:text-xl">
              Respuesta rápida, solicitud simple y ejecución prolija para hogares, comercios y proyectos
              de obra en CABA y GBA.
            </p>
            <p className="text-sm font-medium text-slate-200">Zona de trabajo: {site.contact.serviceArea}</p>
          </div>

          <div className="mt-6 grid gap-3 sm:max-w-2xl sm:grid-cols-2">
            <Button size="lg" asChild className="h-12 bg-[#25D366] text-base font-bold text-black hover:bg-[#1ebe5a]">
              <a
                id="whatsapp-directo"
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                data-track="whatsapp"
                data-content-name="WhatsApp hero principal"
              >
                Hablar por WhatsApp
              </a>
            </Button>
            <Button size="lg" asChild className="h-12 bg-red-600 text-base hover:bg-red-700">
              <Link href="/presupuestador">Enviar solicitud</Link>
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

      <section className="space-y-5 rounded-2xl border border-border bg-white p-5 sm:p-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-muted-foreground">Sistema</p>
          <h2 className="text-2xl font-semibold text-slate-900">Cómo funciona NERIN</h2>
          <p className="text-sm text-slate-600">Un proceso simple para que vos sepas qué pasa en cada etapa.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {systemSteps.map((step) => (
            <article key={step.title} className="rounded-xl border border-border bg-muted/20 p-4">
              <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-red-200 bg-white p-5 sm:p-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-red-700">Servicios</p>
          <h2 className="text-2xl font-semibold text-slate-900">Qué podés resolver con NERIN</h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          {serviceCards.map((card) => (
            <article
              key={card.title}
              className="rounded-xl border border-border bg-gradient-to-b from-white to-red-50/40 p-4 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{card.description}</p>
              <Button asChild className="mt-4 w-full bg-red-600 hover:bg-red-700">
                <Link href={card.href}>{card.cta}</Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-muted-foreground">Casos reales</p>
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
        <h2 className="text-2xl font-semibold">Tranquilidad antes de contratar</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {riskPoints.map((item) => (
            <article key={item} className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-red-300 bg-gradient-to-r from-red-50 to-amber-50 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-red-700">Cierre rápido</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Enviá tu solicitud y seguí por el canal que te quede más cómodo
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              WhatsApp para velocidad. Formulario para dejar todo ordenado desde el inicio.
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
                Solicitar por WhatsApp
              </a>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/presupuestador">Enviar solicitud</Link>
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
        Solicitar por WhatsApp
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
              WhatsApp
            </a>
          </Button>
          <Button asChild className="h-11 bg-red-600 hover:bg-red-700">
            <Link href="/presupuestador">Solicitud</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
