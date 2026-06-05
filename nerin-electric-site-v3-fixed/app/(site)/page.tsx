import Link from 'next/link'
import { ArrowRight, CheckCircle2, MessageCircle, Search, ShieldAlert, Zap } from 'lucide-react'
import { getSiteContent, getWhatsappHref } from '@/lib/site-content'
import {
  majorWorks,
  renovationCards,
  serviceCatalog,
  specialServices,
} from '@/lib/nerin-electricidad'
import { LeadWizard } from '@/components/LeadWizard'
import { realCases } from '@/lib/real-cases'
import { Button } from '@/components/ui/button'

export const revalidate = 60

const clientPaths = [
  {
    title: 'Trabajos chicos',
    description: 'Pedidos simples: tomas, llaves de luz, fallas, luminarias y pequenas reparaciones con fotos.',
    href: '/trabajos-chicos',
    cta: 'Ver trabajos chicos',
  },
  {
    title: 'Refacciones electricas',
    description: 'Trabajos medianos en departamentos, locales, oficinas y reformas parciales con relevamiento.',
    href: '/refacciones-electricas',
    cta: 'Pedir relevamiento',
  },
  {
    title: 'Obras electricas',
    description: 'Locales, edificios y obras nuevas con planificacion, presupuesto formal y seguimiento por etapas.',
    href: '/obras-electricas',
    cta: 'Consultar por obra',
  },
] as const

const clientBenefits = [
  'Presupuesto claro',
  'Materiales separados cuando aplica',
  'Trabajo prolijo',
  'Seguimiento real',
  'Criterio de seguridad',
  'Documentacion cuando corresponde',
] as const

export async function generateMetadata() {
  const siteUrl = process.env.SITE_URL || 'https://nerin-1.onrender.com'
  const title = 'Instalaciones y trabajos electricos profesionales en CABA y GBA | NERIN'
  const description =
    'Trabajos chicos, refacciones electricas y obras completas con presupuesto claro, ejecucion prolija y seguimiento real.'

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

export default async function HomePage() {
  const site = await getSiteContent()
  const whatsappHref = getWhatsappHref(site)
  const isWhatsappExternal = whatsappHref.startsWith('http')
  const featuredCases = realCases.slice(0, 4)

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-[linear-gradient(180deg,#fff_0%,#f8fafc_100%)]">
        <div className="container flex min-h-[calc(100svh-7rem)] items-center py-10 lg:py-16">
          <div className="max-w-4xl space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-900">
              <Zap className="h-4 w-4 text-amber-500" />
              Trabajos chicos, refacciones y obras electricas
            </div>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-4xl font-semibold leading-[1.03] tracking-tight text-slate-950 sm:text-6xl">
                Instalaciones electricas profesionales en CABA y GBA
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Trabajos chicos, refacciones y obras con presupuesto claro, ejecucion prolija y seguimiento real.
              </p>
            </div>
            <div className="grid gap-3 sm:flex">
              <Button asChild size="lg" className="h-12 bg-[#25D366] px-6 text-base font-bold text-black hover:bg-[#1ebe5a]">
                <a href={whatsappHref} target={isWhatsappExternal ? '_blank' : undefined} rel={isWhatsappExternal ? 'noopener noreferrer' : undefined}>
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Pedir presupuesto por WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base">
                <Link href="/trabajos-chicos">
                  <Search className="mr-2 h-5 w-5" />
                  Enviar fotos para cotizar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-14">
        <div className="grid gap-4 lg:grid-cols-3">
          {clientPaths.map((item) => (
            <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
              <Link href={item.href} className="mt-6 inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                {item.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="container pb-14">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Trabajos chicos</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Catalogo de servicios puntuales con precio desde.</h2>
          </div>
          <Link href="/trabajos-chicos" className="inline-flex items-center text-sm font-semibold text-slate-950">
            Ver catalogo
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {serviceCatalog.slice(0, 8).map((service) => (
            <article key={service.slug} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{service.category}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">{service.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{service.shortDescription}</p>
              <p className="mt-4 text-sm font-bold text-slate-950">{service.priceFrom ?? 'A presupuestar'}</p>
              <Link href={`/trabajos-chicos/${service.slug}`} className="mt-4 inline-flex items-center text-sm font-semibold text-slate-950">
                Enviar fotos para cotizar
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-14">
        <div className="container grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Refacciones electricas</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Trabajos medianos con relevamiento, alcance y presupuesto.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              En refacciones, el precio depende del estado existente, cantidad de bocas, tablero, canalizaciones y alcance real.
            </p>
            <Link href="/refacciones-electricas" className="mt-5 inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
              Pedir relevamiento
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {renovationCards.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-14">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Obras grandes</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Planificacion por etapas, presupuesto formal y portal cliente.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Para constructores, locales comerciales, edificios e instalaciones completas con seguimiento y certificados de avance cuando corresponda.
            </p>
            <Link href="/obras-electricas" className="mt-5 inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
              Consultar obra electrica
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {majorWorks.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-800 shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-950 py-14 text-white">
        <div className="container grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">Servicios especiales</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Consultas que generan confianza y mejores decisiones.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {specialServices.slice(0, 4).map((item) => (
              <article key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-1 text-sm font-semibold text-amber-200">{item.price}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-14">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Por que elegir NERIN</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Trabajo claro, prolijo y seguro de principio a fin.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {clientBenefits.map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-14">
        <div className="container grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Obras realizadas</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Casos reales comunicados con prudencia tecnica.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Referencias por rubro, alcance y resultado. No usamos logos ni presentamos marcas como clientes directos sin permiso confirmado.
            </p>
            <Link href="/obras" className="mt-5 inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
              Ver casos reales
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {featuredCases.map((item) => (
              <article key={item.slug} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{item.clientType}</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.workType}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.result}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container grid gap-8 py-14 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-red-700">
            <ShieldAlert className="h-4 w-4" />
            Solicitud
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-950">Elegi el camino correcto para tu solicitud.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Todo lo especial, riesgoso, fuera de zona o no catalogado pasa a revision manual por Valdir Nerin.
          </p>
        </div>
        <LeadWizard whatsappHref={whatsappHref} />
      </section>
    </div>
  )
}
