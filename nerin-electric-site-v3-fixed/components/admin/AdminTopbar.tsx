'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { adminNav, findAdminNavMatch } from '@/components/admin/nav'

export function AdminTopbar() {
  const pathname = usePathname()
  const match = findAdminNavMatch(pathname)
  const sectionLabel = match?.sectionLabel ?? adminNav[0]?.label ?? 'Admin'
  const title = match?.title ?? 'Panel administrativo'

  return (
    <div className="sticky top-0 z-10 border-b border-border bg-white/95 px-6 py-4 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{sectionLabel}</p>
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-border bg-slate-50 px-3 py-2 text-xs text-slate-500 md:flex">
            Buscar (próximamente)
          </div>
          <Link
            href="/"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Ver sitio
          </Link>
        </div>
      </div>
    </div>
  )
}
