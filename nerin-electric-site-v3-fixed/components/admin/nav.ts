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
    label: 'Centro de control',
    items: [
      { title: 'Inicio admin', href: '/admin' as Route },
      { title: 'Consultas (leads)', href: '/admin/leads' as Route },
    ],
  },
  {
    label: 'Gestión comercial',
    items: [
      { title: 'Packs y precios', href: '/admin/packs' as Route },
      { title: 'Noticias', href: '/admin/noticias' as Route },
    ],
  },
  {
    label: 'Operaciones',
    items: [
      { title: 'Panel operativo', href: '/admin/ops' as Route },
      { title: 'Proyectos', href: '/admin/ops/projects' as Route },
      { title: 'Certificados', href: '/admin/ops/certificates' as Route },
      { title: 'Clientes', href: '/admin/ops/clients' as Route },
      { title: 'CAC / IVA', href: '/admin/operativo' as Route },
    ],
  },
  {
    label: 'Sistema',
    items: [{ title: 'Ajustes generales', href: '/admin/ajustes' as Route }],
  },
]

export function findAdminNavMatch(pathname: string) {
  const flatItems = adminNav.flatMap((section) =>
    section.items.map((item) => ({ ...item, sectionLabel: section.label })),
  )

  const sorted = [...flatItems].sort((a, b) => b.href.length - a.href.length)
  return sorted.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) ?? null
}
