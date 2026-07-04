import Link from 'next/link'
import type { Route } from 'next'
import { getAdminTechnicalStatus } from '@/lib/admin-technical-status'
import { getElectricalAdminContent } from '@/lib/electrical-admin-content'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const sections: Array<{ title: string; description: string; href: Route; status: string }> = [
  { title: 'Trabajos eléctricos', description: 'Servicios rápidos, guías visuales, diagnóstico y trabajos para comercios/consorcios/countries.', href: '/admin/contenido/trabajos-electricos' as Route, status: 'Conectado a WebsiteContent' },
  { title: 'Imágenes / Biblioteca de medios', description: 'Carga de archivos, preview, URL final y selección para guías visuales.', href: '/admin/contenido/media' as Route, status: 'Conectado al storage configurado' },
  { title: 'Home', description: 'Hero, textos principales, CTAs, servicios destacados e imágenes.', href: '/admin/contenido-comercial' as Route, status: 'Migración progresiva: WebsiteContent/SiteExperience' },
  { title: 'Refacciones', description: 'Textos, secciones, CTA y configuración del formulario.', href: '/admin/contenido-comercial' as Route, status: 'Pendiente de extraer de contenido comercial' },
  { title: 'Obras', description: 'Textos, secciones, CTA y configuración del formulario.', href: '/admin/contenido-comercial' as Route, status: 'Pendiente de extraer de contenido comercial' },
  { title: 'Contacto', description: 'Teléfono, WhatsApp, email, zona, horarios y textos de formulario.', href: '/admin/ajustes' as Route, status: 'Conectado a ajustes generales' },
  { title: 'Ajustes generales', description: 'Identidad, contacto y parámetros técnicos compartidos.', href: '/admin/ajustes' as Route, status: 'Configuración global' },
]

export default async function AdminContenidoPage() {
  const [technicalStatus, electricalContent] = await Promise.all([
    getAdminTechnicalStatus(),
    getElectricalAdminContent(),
  ])

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">Admin madre</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Contenido público de NERIN</h1>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
          Esta es la entrada única para contenido editable del sitio. La fuente de verdad elegida es
          <strong> WebsiteContent</strong> para contenido público versionable en JSON, con fallback estático solo como respaldo visible.
        </p>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Status label="DB configurada" value={technicalStatus.dbConfigured ? 'Sí' : 'No'} danger={!technicalStatus.dbConfigured} />
        <Status label="DB temporal" value={technicalStatus.dbTemporary ? 'Sí' : 'No'} danger={technicalStatus.dbTemporary} />
        <Status label="Storage configurado" value={technicalStatus.storageConfigured ? 'Sí' : 'No'} danger={!technicalStatus.storageConfigured} />
        <Status label="Upload persistente" value={technicalStatus.uploadPersistent ? 'Sí' : 'No'} danger={!technicalStatus.uploadPersistent} />
      </section>

      {technicalStatus.warnings.length ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Advertencias técnicas</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {technicalStatus.warnings.map((warning) => <li key={warning}>{warning}</li>)}
          </ul>
          <p className="mt-3">Provider de storage activo: <strong>{technicalStatus.storageProvider}</strong></p>
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <Link key={section.title} href={section.href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{section.status}</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">{section.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{section.description}</p>
          </Link>
        ))}
      </section>

      <section className="rounded-2xl border bg-white p-5 text-sm text-slate-700">
        <h2 className="text-lg font-semibold text-slate-950">Estado de contenido eléctrico</h2>
        <p className="mt-2">Servicios rápidos: {electricalContent.quickServices.length} · Guías visuales: {electricalContent.visualGuides.length} · Diagnósticos: {electricalContent.diagnosticFaults.length} · Comercial: {electricalContent.commercialServices.length}</p>
        <p className="mt-2 text-amber-700">Si no hay fila guardada en WebsiteContent, la web pública usa fallback estático y este admin lo informa como respaldo, no como persistencia real.</p>
      </section>
    </div>
  )
}

function Status({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return <div className={`rounded-2xl border p-4 ${danger ? 'border-red-200 bg-red-50 text-red-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}><p className="text-xs font-semibold uppercase tracking-wide">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></div>
}
