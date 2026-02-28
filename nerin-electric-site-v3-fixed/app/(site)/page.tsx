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
  const title = 'NERIN | Ejecución eléctrica premium para espacios exigentes'
  const description =
    'NERIN eleva viviendas, locales y operaciones corporativas con ejecución eléctrica premium. Contratá por servicio puntual, relevamiento o cotización profesional.'

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
    title: 'Residencial premium',
    description: 'Casas y unidades de alta exigencia donde diseño, seguridad y terminación deben convivir.',
    href: '/presupuestador?mode=ASSISTED',
  },
  {
    title: 'Comercial · gastronómico · eventos',
    description: 'Espacios que venden experiencia y necesitan ejecución limpia, rápida y sin improvisación.',
    href: '/presupuestador?mode=ASSISTED',
  },
  {
    title: 'Obras y mantenimiento corporativo',
    description: 'Operaciones con continuidad crítica, trazabilidad técnica y coordinación profesional.',
    href: '/presupuestador?mode=PROFESSIONAL',
  },
]

const brandReasons = [
  'Dirección técnica + ejecución con estándar premium.',
  'Menos ruido operativo, más control y previsibilidad.',
  'Comunicación clara para decidir rápido y bien.',
]

const hiringFlow = [
  {
    title: '1. Resolver algo puntual',
    description: 'Ingresás, elegís el servicio y avanzás en minutos.',
    href: '/presupuestador?mode=EXPRESS',
  },
  {
    title: '2. Pedir relevamiento/proyecto',
    description: 'Definimos alcance real para una propuesta seria.',
    href: '/presupuesto?tipo=obra',
  },
  {
    title: '3. Cotización profesional',
    description: 'Cargás plano/cantidades y recibís una base comercial ordenada.',
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
            <Badge className="bg-white/10 text-white">NERIN Premium Electric</Badge>
            <h1 className="max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              La ejecución eléctrica que eleva la categoría de tu espacio
            </h1>
            <p className="max-w-xl text-base text-slate-200 sm:text-lg">
              No vendemos confusión. Diseñamos y ejecutamos con foco en impacto, seguridad y resultado comercial.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/presupuestador">Quiero cotizar con NERIN</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/presupuesto?tipo=obra">Solicitar relevamiento</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/5 p-5 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Cobertura</p>
            <p className="mt-2 text-lg font-semibold">{site.contact.serviceArea}</p>
            <p className="mt-3 text-sm text-slate-200">{site.hero.caption}</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">Tres mundos</p>
          <h2>Elegí tu contexto, no una lista infinita de servicios</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {worlds.map((world) => (
            <article key={world.title} className="rounded-2xl border border-border bg-white p-5">
              <h3 className="text-lg font-semibold">{world.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{world.description}</p>
              <Button variant="ghost" className="mt-4 px-0" asChild>
                <a href={world.href}>Ver camino</a>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">Por qué NERIN</p>
          <h2>Menos promesa. Más estándar.</h2>
          <p className="text-sm text-muted-foreground">
            NERIN se contrata cuando la electricidad no puede quedar librada al azar ni a múltiples interlocutores.
          </p>
        </div>
        <ul className="grid gap-3">
          {brandReasons.map((reason) => (
            <li key={reason} className="rounded-2xl border border-border bg-muted/20 px-5 py-4 text-sm font-medium">
              {reason}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-6">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">Casos</p>
          <h2>Resultados que proyectan valor de marca</h2>
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
      </section>

      <section className="space-y-6 rounded-3xl border border-border bg-muted/30 p-6 sm:p-8">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">Contratación clara</p>
          <h2>Entrá por la puerta correcta</h2>
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
            <p className="text-xs uppercase tracking-[0.35em] text-[#FBBF24]">Siguiente paso</p>
            <h2 className="text-white">Si querés hacerlo bien, ya sabés con quién</h2>
            <p className="text-sm text-slate-300">Coordiná hoy y recibí respuesta comercial en 24–48 h.</p>
          </div>
          <Button size="lg" asChild>
            <Link href="/presupuestador">Iniciar contratación con NERIN</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
