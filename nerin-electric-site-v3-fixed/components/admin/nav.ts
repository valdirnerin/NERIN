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
    label: 'Panel de NERIN',
    items: [
      { title: 'Inicio', href: '/admin' as Route },
      { title: 'Solicitudes', href: '/admin/solicitudes' as Route },
    ],
  },
  {
    label: 'Operacion',
    items: [
      { title: 'Trabajos chicos', href: '/admin/trabajos-chicos' as Route },
      { title: 'Refacciones', href: '/admin/refacciones' as Route },
      { title: 'Obras', href: '/admin/obras' as Route },
      { title: 'Clientes', href: '/admin/clientes' as Route },
      { title: 'Presupuestos', href: '/admin/presupuestos' as Route },
    ],
  },
  {
    label: 'Gestion',
    items: [
      { title: 'Dinero', href: '/admin/dinero' as Route },
      { title: 'Catalogo web', href: '/admin/catalogo-web' as Route },
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
