import Link from 'next/link'
import { AlertTriangle, ArrowRight, CheckCircle2, MessageCircle, ShieldCheck, Zap } from 'lucide-react'
import { getSiteContent, getWhatsappHref } from '@/lib/site-content'
import { featuredExperience, maintenancePlans, packs, serviceCards, trustItems } from '@/lib/nerin-electricidad'
import { LeadWizard } from '@/components/LeadWizard'
import { Button } from '@/components/ui/button'

export const revalidate = 60

export async function generateMetadata() {
  const siteUrl = process.env.SITE_URL || 'https://nerin-1.onrender.com'
  const title = 'Instalaciones electricas profesionales en CABA y GBA | NERIN'
  const description =
    'Fallas, tableros, obras, mantenimiento y packs electricos con presupuesto claro, respuesta rapida y seguimiento por WhatsApp.'

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

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-[linear-gradient(180deg,#fff_0%,#f8fafc_100%)]">
        <div className="container grid min-h-[calc(100vh-7rem)] gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-16">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-900">
              <Zap className="h-4 w-4 text-amber-500" />
              Respuesta prioritaria en CABA y GBA
            </div>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-4xl font-semibold leading-[1.03] tracking-tight text-slate-950 sm:text-6xl">
                Instalaciones electricas profesionales en CABA y GBA
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Fallas, tableros, obras, mantenimiento y packs electricos para viviendas, comercios, edificios y
                empresas. Presupuesto claro, ejecucion prolija y respuesta rapida.
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
                <Link href="/servicios">
                  Ver servicios y precios
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {['Respuesta prioritaria', 'Visita tecnica disponible', 'Presupuesto claro antes de avanzar', 'Evita fallas, cortes y riesgos electricos'].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="rounded-2xl bg-slate-950 p-6 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Diagnostico primero</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Una falla electrica no se deja para despues.</h2>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Un tablero mal armado puede quemar equipos. Una instalacion improvisada termina costando mas. En
                comercios y edificios, cada corte implica tiempo perdido y plata parada.
              </p>
            </div>
            <div className="mt-4 grid gap-3">
              {['Revisar', 'Diagnosticar', 'Presupuestar', 'Ejecutar bien'].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                  <span className="font-semibold text-slate-900">{item}</span>
                  <ShieldCheck className="h-5 w-5 text-slate-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-14">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Servicios principales</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950">Precio desde, alcance claro y CTA directo.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {serviceCards.map((service) => (
            <article key={service.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-950">{service.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
              <p className="mt-4 text-sm font-bold text-slate-950">{service.price}</p>
              <Link href={service.href} className="mt-4 inline-flex items-center text-sm font-semibold text-slate-950">
                Consultar
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-14">
        <div className="container grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Packs electricos</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Mano de obra clara desde el principio.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Valores orientativos de mano de obra. Materiales, artefactos y proyecto electrico se cotizan por separado.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {packs.map((pack) => (
              <article key={pack.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-950">{pack.name}</h3>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{pack.price}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{pack.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-14">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Mantenimiento mensual</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Prevenir sale menos que apagar incendios.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {maintenancePlans.map((plan) => (
              <article key={plan.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-950">{plan.name}</h3>
                <p className="mt-1 font-bold text-slate-950">{plan.price}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{plan.fit}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-950 py-14 text-white">
        <div className="container grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">Experiencia</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Obras, locales y edificios con criterio profesional.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Experiencia en instalaciones electricas para locales comerciales, gimnasios, supermercados y edificios residenciales.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {featuredExperience.map((item) => (
              <article key={item} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-xl font-semibold text-white">{item}</h3>
                <p className="mt-2 text-sm text-slate-300">Referencia de experiencia por tipo de obra. Datos especificos editables cuando se carguen.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-14">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Confianza</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Seriedad visual, proceso claro y seguimiento real.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {trustItems.map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-14">
        <div className="container grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-red-700">
              <AlertTriangle className="h-4 w-4" />
              Solicitud rapida
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">Contanos el problema y priorizamos la respuesta.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Menos vueltas, mas claridad: tipo de trabajo, zona, urgencia, fotos si tenes y WhatsApp para avanzar.
            </p>
          </div>
          <LeadWizard whatsappHref={whatsappHref} />
        </div>
      </section>
    </div>
  )
}
