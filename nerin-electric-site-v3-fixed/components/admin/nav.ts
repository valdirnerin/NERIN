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
      { title: 'Dashboard', href: '/admin' as Route },
      { title: 'Leads', href: '/admin/leads' as Route },
      { title: 'Clientes', href: '/admin/ops/clients' as Route },
      { title: 'Presupuestos', href: '/admin/ops' as Route },
    ],
  },
  {
    label: 'Operacion',
    items: [
      { title: 'Obras', href: '/admin/ops/projects' as Route },
      { title: 'Certificados', href: '/admin/ops/certificates' as Route },
      { title: 'Mantenimiento', href: '/admin/operativo' as Route },
      { title: 'Visitas tecnicas', href: '/admin/ops' as Route },
    ],
  },
  {
    label: 'Finanzas',
    items: [
      { title: 'Ingresos', href: '/admin/ops' as Route },
      { title: 'Gastos', href: '/admin/ops' as Route },
    ],
  },
  {
    label: 'Contenido y oferta',
    items: [
      { title: 'Servicios y packs', href: '/admin/packs' as Route },
      { title: 'Contenido web', href: '/admin' as Route },
      { title: 'Configuracion', href: '/admin/ajustes' as Route },
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
