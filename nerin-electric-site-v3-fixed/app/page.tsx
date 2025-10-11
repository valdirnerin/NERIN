export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import { getMarketingHomeData } from '@/lib/marketing-data'
import { siteConfig } from '@/lib/config'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionItem } from '@/components/ui/accordion'

export const revalidate = 60

const services = [
  {
    title: 'Instalaciones eléctricas completas',
    description:
      'Desde el proyecto ejecutivo hasta la puesta en marcha. Tableros, canalizaciones, cableado y medición.',
  },
  {
    title: 'Tableros a medida',
    description:
      'Diseño, montaje y ensayos para tableros generales, seccionales y CCM. Certificación de normas vigentes.',
  },
  {
    title: 'Puesta a tierra y descargas atmosféricas',
    description: 'Mallas, jabalinas, mediciones con informes certificados y adecuaciones AEA 90364-7-771.',
  },
  {
    title: 'Canalizaciones y bandejas portacables',
    description: 'Tendidos prolijos, registro fotográfico y planimetría actualizada para obras exigentes.',
  },
  {
    title: 'Datos, CCTV y audio profesional',
    description: 'Redes estructuradas, cámaras, audio distribuido y automatización preparada para futuros upgrades.',
  },
  {
    title: 'Aires acondicionados',
    description: 'Instalación integral con cañería de cobre, vacío, carga y alimentación eléctrica independiente.',
  },
]

const faqs = [
  {
    q: '¿Los packs incluyen materiales?',
    a: 'No. Los packs son solo mano de obra certificada. Los materiales se cotizan aparte según la elección de marcas (Schneider, Prysmian, Gimsa, Daisa, Genrock).',
  },
  {
    q: '¿El proyecto eléctrico está incluido?',
    a: 'El proyecto eléctrico se cotiza aparte. Tiene un valor base de $500.000 editable desde el panel de administración.',
  },
  {
    q: '¿Trabajan bajo normativa AEA?',
    a: 'Sí. Nuestras instalaciones cumplen AEA 90364-7-771 (2006) y las reglamentaciones locales. Documentamos cada etapa.',
  },
  {
    q: '¿Cómo se paga el avance de obra?',
    a: 'Emitimos Certificados de Avance con porcentaje ejecutado. Podés abonarlos online vía Mercado Pago con el link que te enviamos.',
  },
]

export default async function HomePage() {
  const { packs, plans, caseStudies, brands } = await getMarketingHomeData()

  return (
    <div className="space-y-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Electrician',
            name: 'NERIN Ingeniería Eléctrica',
            url: 'https://www.nerin.com.ar',
            telephone: siteConfig.whatsapp.number,
            areaServed: 'Ciudad Autónoma de Buenos Aires y GBA',
            serviceType: [
              'Instalaciones eléctricas',
              'Tableros',
              'Puesta a tierra',
              'Canalizaciones',
              'Datos y CCTV',
              'Mantenimiento eléctrico',
            ],
          }),
        }}
      />
      <section className="grid gap-12 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <Badge>Contratista eléctrico integral en CABA</Badge>
          <h1>
            Obras eléctricas premium con trazabilidad total, sin sorpresas y listas para auditorías exigentes.
          </h1>
          <p className="max-w-xl text-lg text-slate-600">
            NERIN acompaña a empresas, consorcios, gimnasios y viviendas de alto nivel desde el anteproyecto
            hasta la entrega de certificados finales. Mano de obra propia, técnicos habilitados y reportes en
            tiempo real.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="pill" asChild>
              <Link href="/contacto">Pedir presupuesto</Link>
            </Button>
            <Button size="pill" variant="secondary" asChild>
              <Link
                href={`https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(siteConfig.whatsapp.message)}`}
              >
                Hablar por WhatsApp
              </Link>
            </Button>
            <Button size="pill" variant="ghost" asChild>
              <Link href="/packs">Ver packs eléctricos</Link>
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
            <div>
              <p className="font-semibold text-foreground">+120 obras entregadas</p>
              <p>Smart Fit, KFC, supermercados DIA, edificios corporativos.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Certificaciones y ART al día</p>
              <p>Equipo propio, cobertura integral y protocolos de ingreso.</p>
            </div>
          </div>
        </div>
        <div className="relative hidden overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-slate-100 to-slate-200 shadow-subtle md:block">
          <Image
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80"
            alt="Tablero eléctrico profesional instalado por NERIN"
            fill
            className="object-cover"
          />
          <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/85 p-4 text-sm text-slate-600 shadow-subtle">
            <p className="font-semibold text-slate-800">Tablero general edificio 4.000 m²</p>
            <p>Montaje, etiquetado y ensayo térmico. Certificado RETIE y AEA 90364-7-771.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h2>Servicios eléctricos de punta a punta</h2>
          <p>
            Intervenimos en obra nueva, adecuaciones y expansión. Documentación completa, planos as-built y
            soporte post entrega.
          </p>
        </div>
        <div className="lg:col-span-2 grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <Card key={service.title}>
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2>Packs eléctricos para viviendas y countries</h2>
            <p>Packs 100% mano de obra especializada. Materiales a elección del cliente, sin sobreprecios ocultos.</p>
          </div>
          <Button variant="secondary" asChild>
            <Link href="/presupuestador">Configurar pack</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {packs.map((pack) => (
            <Card key={pack.id}>
              <CardHeader>
                <CardTitle>{pack.nombre}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-500">{pack.descripcion}</p>
                <p className="text-sm font-semibold text-foreground">
                  Mano de obra base ${Number(pack.precioManoObraBase).toLocaleString('es-AR')}
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  {pack.alcanceDetallado.slice(0, 5).map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
                <Button variant="ghost" asChild>
                  <Link href={`/packs#${pack.slug}`}>Ver alcance completo</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-10 shadow-subtle">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-4">
            <h2>Planes de mantenimiento con SLAs reales</h2>
            <p>
              Diseñados para oficinas, cadenas de retail y consorcios. Cantidades fijas inalterables, visitas
              programadas y reportes digitales.
            </p>
            <Button asChild>
              <Link href="/mantenimiento">Ver planes completos</Link>
            </Button>
          </div>
          <div className="grid gap-4">
            {plans.map((plan) => (
              <div key={plan.id} className="rounded-2xl border border-border p-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-xl font-semibold text-foreground">{plan.nombre}</h3>
                  <p className="text-lg font-semibold text-foreground">
                    ${Number(plan.precioMensual).toLocaleString('es-AR')} / mes
                  </p>
                </div>
                <p className="mt-3 text-sm text-slate-600">Incluye tareas fijas: {plan.incluyeTareasFijas.join(', ')}.</p>
                <p className="mt-2 text-sm text-slate-500">
                  {plan.visitasMes} visita(s) mensual(es). Cantidades inalterables para garantizar tiempos de respuesta.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {caseStudies.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2>Casos de éxito</h2>
              <p>Resultados medibles y documentación lista para auditorías de seguros, ART y entes reguladores.</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/obras">Ver todas las obras</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {caseStudies.map((cs) => (
              <Card key={cs.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{cs.titulo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-500">{cs.resumen}</p>
                  <p className="text-sm text-slate-600">{cs.contenido.slice(0, 180)}...</p>
                  <Button variant="ghost" asChild>
                    <Link href={`/obras/${cs.slug}`}>Ver detalle</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-3xl border border-border bg-white/60 p-10 shadow-subtle">
        <h2 className="mb-6">Marcas que trabajamos todos los días</h2>
        <div className="grid grid-cols-2 gap-6 text-sm text-slate-500 md:grid-cols-5">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex h-16 items-center justify-center rounded-2xl border border-border/60 bg-white text-center font-semibold text-slate-500"
            >
              {brand.nombre}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <h2>Preguntas frecuentes</h2>
          <p>
            Transparencia total: contratos claros, avances certificados y soporte técnico en menos de 24 h hábil.
          </p>
        </div>
        <Accordion>
          {faqs.map((faq) => (
            <AccordionItem key={faq.q} question={faq.q} answer={<p>{faq.a}</p>} />
          ))}
        </Accordion>
      </section>

      <section className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 p-10 text-white">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <h2 className="text-white">Listos para ejecutar tu obra eléctrica con excelencia</h2>
            <p className="text-slate-200">
              Coordinamos visita técnica, entregamos presupuesto detallado con desglose de mano de obra y
              materiales sugeridos, y planificamos el cronograma completo.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 md:justify-end">
            <Button size="pill" asChild>
              <Link href="/contacto">Solicitar visita técnica</Link>
            </Button>
            <Button size="pill" variant="secondary" asChild>
              <Link href="/presupuestador">Configurar pack online</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
