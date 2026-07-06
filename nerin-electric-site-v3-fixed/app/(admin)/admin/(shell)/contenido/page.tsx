import Link from 'next/link'
import type { Route } from 'next'
import { getAdminTechnicalStatus } from '@/lib/admin-technical-status'
import { getElectricalAdminContentState } from '@/lib/electrical-admin-content'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const sections: Array<{ title: string; description: string; href: Route; status: string }> = [
  { title: 'Trabajos eléctricos', description: 'Servicios rápidos, guías visuales, diagnóstico y pedidos comerciales.', href: '/admin/contenido/trabajos-electricos' as Route, status: 'WebsiteContent' },
  { title: 'Biblioteca de medios', description: 'Subida de imágenes, preview, URL final y selección para guías visuales.', href: '/admin/contenido/media' as Route, status: 'Storage persistente' },
  { title: 'Home', description: 'Hero, textos principales, CTAs, servicios destacados e imágenes.', href: '/admin/contenido-comercial' as Route, status: 'SiteExperience' },
  { title: 'Refacciones', description: 'Textos, secciones, CTA y configuración del formulario.', href: '/admin/contenido-comercial' as Route, status: 'SiteExperience' },
  { title: 'Obras', description: 'Textos, secciones, CTA y configuración del formulario.', href: '/admin/contenido-comercial' as Route, status: 'SiteExperience' },
  { title: 'Contacto', description: 'WhatsApp, teléfono, email, zona, horarios y textos de formulario.', href: '/admin/ajustes' as Route, status: 'Ajustes' },
  { title: 'Ajustes generales', description: 'Identidad, contacto y parámetros técnicos compartidos.', href: '/admin/ajustes' as Route, status: 'Global' },
]

export default async function AdminContenidoPage() {
  const [technicalStatus, electricalState] = await Promise.all([
    getAdminTechnicalStatus(),
    getElectricalAdminContentState(),
  ])
  const warnings = [...new Set([...technicalStatus.warnings, ...electricalState.status.warnings])]

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">Admin madre</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Contenido público de NERIN</h1>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
          Entrada única para editar contenido público. Trabajos eléctricos usa WebsiteContent; TypeScript queda solo como fallback informado.
        </p>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Status label="DB persistente" value={technicalStatus.dbPersistent ? 'Sí' : 'No'} danger={!technicalStatus.dbPersistent} />
        <Status label="DB temporal" value={technicalStatus.dbTemporary ? 'Sí' : 'No'} danger={technicalStatus.dbTemporary} />
        <Status label="Storage configurado" value={technicalStatus.storageConfigured ? 'Sí' : 'No'} danger={!technicalStatus.storageConfigured} />
        <Status label="Upload persistente" value={technicalStatus.uploadPersistent ? 'Sí' : 'No'} danger={!technicalStatus.uploadPersistent} />
        <Status label="Fallback eléctrico" value={electricalState.status.isFallback ? 'Sí' : 'No'} danger={electricalState.status.isFallback} />
      </section>

      {warnings.length ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Advertencias técnicas</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {warnings.map((warning) => <li key={warning}>{warning}</li>)}
          </ul>
          <p className="mt-3">DB: <strong>{technicalStatus.databaseUrlLabel}</strong> · Storage: <strong>{technicalStatus.storageProvider}</strong> · Dir: <strong>{technicalStatus.storageDirLabel}</strong></p>
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
        <p className="mt-2">Servicios rápidos: {electricalState.content.quickServices.length} · Guías visuales: {electricalState.content.visualGuides.length} · Diagnósticos: {electricalState.content.diagnosticFaults.length} · Comercial: {electricalState.content.commercialServices.length}</p>
        <p className="mt-2 text-amber-700">Contenido guardado: {electricalState.status.hasPersistedContent ? 'sí' : 'no'}.</p>
      </section>
    </div>
  )
}

function Status({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return <div className={`rounded-2xl border p-4 ${danger ? 'border-red-200 bg-red-50 text-red-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}><p className="text-xs font-semibold uppercase tracking-wide">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></div>
}
