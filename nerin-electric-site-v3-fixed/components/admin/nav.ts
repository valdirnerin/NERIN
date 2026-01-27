import type { Route } from 'next'

export type AdminNavItem = {
  title: string
  href: Route
}

export type AdminNavSection = {
  label: string
  items: AdminNavItem[]
}

export const adminNav: AdminNavSection[] = [
  {
    label: 'Dashboard',
    items: [
      { title: 'Dashboard', href: '/admin' as Route },
      { title: 'Leads', href: '/admin/leads' as Route },
    ],
  },
  {
    label: 'Operaciones (Ops)',
    items: [
      { title: 'Panel Ops', href: '/admin/ops' as Route },
      { title: 'Proyectos', href: '/admin/ops/projects' as Route },
      { title: 'Certificados', href: '/admin/ops/certificates' as Route },
      { title: 'Adicionales', href: '/admin/ops/projects?tab=adicionales' as Route },
      { title: 'Clientes', href: '/admin/ops/clients' as Route },
    ],
  },
  {
    label: 'Packs',
    items: [{ title: 'Packs comerciales', href: '/admin/packs' as Route }],
  },
  {
    label: 'Contenido',
    items: [
      { title: 'Textos del sitio', href: '/admin' as Route },
      { title: 'Noticias', href: '/admin/noticias' as Route },
    ],
  },
  {
    label: 'Ajustes',
    items: [
      { title: 'Config general', href: '/admin/ajustes' as Route },
      { title: 'CAC/IVA operativo', href: '/admin/operativo' as Route },
    ],
  },
]

export function findAdminNavMatch(pathname: string) {
  const flatItems = adminNav.flatMap((section) =>
    section.items.map((item) => ({ ...item, sectionLabel: section.label })),
  )

  const sorted = [...flatItems].sort((a, b) => b.href.length - a.href.length)
  return sorted.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) ?? null
}
