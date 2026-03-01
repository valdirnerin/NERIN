export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import { getMarketingHomeData } from '@/lib/marketing-data'
import { getSiteContent } from '@/lib/site-content'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const revalidate = 60

export async function generateMetadata() {
  const site = await getSiteContent()
  const siteUrl = process.env.SITE_URL || 'https://nerin-1.onrender.com'
  const title = 'Contratista eléctrico en CABA y GBA | NERIN'
  const description = 'Servicios, mantenimiento y trabajos eléctricos para viviendas, comercios y obras.'

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

const worlds = [
  {
    title: 'Viviendas',
    description: 'Instalaciones, arreglos y reformas eléctricas en casas y departamentos.',
    href: '/presupuestador?mode=ASSISTED',
  },
  {
    title: 'Comercios',
    description: 'Trabajos para locales, oficinas y espacios de atención al público.',
    href: '/presupuestador?mode=ASSISTED',
  },
  {
    title: 'Obras',
    description: 'Cotización para obra nueva, ampliaciones y mantenimiento técnico.',
    href: '/presupuestador?mode=PROFESSIONAL',
  },
]

const workSteps = [
  'Revisamos el pedido y el tipo de trabajo.',
  'Definimos alcance y forma de trabajo antes de empezar.',
  'Ejecutamos y dejamos registro de lo realizado.',
]

const hiringFlow = [
  {
    title: 'Servicio puntual',
    description: 'Para resolver algo concreto.',
    href: '/presupuestador?mode=EXPRESS',
  },
  {
    title: 'Relevamiento',
    description: 'Para obras o trabajos más grandes.',
    href: '/presupuesto?tipo=obra',
  },
  {
    title: 'Cotización técnica',
    description: 'Para cotizar por plano o cantidades.',
    href: '/presupuestador?mode=PROFESSIONAL',
  },
]

export default async function HomePage() {
  const { caseStudies } = await getMarketingHomeData()
  const site = await getSiteContent()

  return (
    <div className="space-y-14 sm:space-y-16 lg:space-y-20">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-[#0B0F14] px-6 py-10 text-white sm:px-8 sm:py-14">
        <Image
          src={site.hero.backgroundImage}
          alt={site.hero.caption}
          fill
          className="pointer-events-none object-cover opacity-30"
        />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="space-y-5">
            <Badge className="bg-white/10 text-white">NERIN</Badge>
            <h1 className="max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              Contratista eléctrico en CABA y GBA
            </h1>
            <p className="max-w-xl text-base text-slate-200 sm:text-lg">
              Servicios, mantenimiento y trabajos eléctricos para viviendas, comercios y obras.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/presupuestador">Iniciar cotización</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/presupuesto?tipo=obra">Solicitar relevamiento</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/5 p-5 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Zona de trabajo</p>
            <p className="mt-2 text-lg font-semibold">{site.contact.serviceArea}</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">Qué hacemos</p>
          <h2>Tipos de trabajo</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {worlds.map((world) => (
            <article key={world.title} className="rounded-2xl border border-border bg-white p-5">
              <h3 className="text-lg font-semibold">{world.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{world.description}</p>
              <Button variant="ghost" className="mt-4 px-0" asChild>
                <a href={world.href}>Continuar</a>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">Cómo trabajamos</p>
          <h2>Proceso simple</h2>
        </div>
        <ul className="grid gap-3">
          {workSteps.map((step) => (
            <li key={step} className="rounded-2xl border border-border bg-muted/20 px-5 py-4 text-sm font-medium">
              {step}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-6">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">Casos</p>
          <h2>Trabajos recientes</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {caseStudies.slice(0, 2).map((cs) => (
            <article key={cs.id} className="overflow-hidden rounded-2xl border border-border bg-white">
              <div className="relative h-56 w-full">
                <Image src={cs.fotos[0] ?? site.hero.backgroundImage} alt={cs.titulo} fill className="object-cover" />
              </div>
              <div className="space-y-3 p-5">
                <h3 className="text-lg font-semibold">{cs.titulo}</h3>
                <p className="text-sm text-muted-foreground">{cs.resumen}</p>
              </div>
            </article>
          ))}
        </div>
        <Button variant="secondary" asChild>
          <Link href="/obras">Ver casos</Link>
        </Button>
      </section>

      <section className="space-y-6 rounded-3xl border border-border bg-muted/30 p-6 sm:p-8">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">Cómo contratar</p>
          <h2>Elegí una opción</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {hiringFlow.map((step) => (
            <article key={step.title} className="rounded-2xl border border-border bg-white p-5">
              <h3 className="font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              <Button variant="ghost" className="mt-4 px-0" asChild>
                <a href={step.href}>Continuar</a>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-[#0B0F14] px-6 py-10 text-white sm:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-[#FBBF24]">Contacto</p>
            <h2 className="text-white">¿Necesitás una cotización?</h2>
          </div>
          <Button size="lg" asChild>
            <Link href="/contacto">Contacto</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
