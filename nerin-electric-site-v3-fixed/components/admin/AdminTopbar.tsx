'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { adminNav, findAdminNavMatch } from '@/components/admin/nav'

type AdminTopbarProps = {
  onToggleSidebar?: () => void
}

export function AdminTopbar({ onToggleSidebar }: AdminTopbarProps) {
  const pathname = usePathname()
  const match = findAdminNavMatch(pathname)
  const sectionLabel = match?.sectionLabel ?? adminNav[0]?.label ?? 'Admin'
  const title = match?.title ?? 'Panel administrativo'

  return (
    <div className="sticky top-0 z-20 border-b border-border bg-white/95 px-4 py-3 backdrop-blur sm:px-6 sm:py-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white lg:hidden"
            aria-label="Abrir menú de administración"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{sectionLabel}</p>
            <h1 className="text-lg font-semibold text-foreground sm:text-xl">{title}</h1>
          </div>
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
