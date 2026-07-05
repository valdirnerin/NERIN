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
      { title: 'Admin madre · Contenido', href: '/admin/contenido' as Route },
      { title: 'Consultas', href: '/admin/consultas' as Route },
      { title: 'Presupuestos', href: '/admin/presupuestos' as Route },
      { title: 'Media library', href: '/admin/contenido/media' as Route },
      { title: 'Dinero', href: '/admin/dinero' as Route },
      { title: 'Capacidad', href: '/admin/capacidad' as Route },
    ],
  },
]

export function findAdminNavMatch(pathname: string) {
  const flatItems = adminNav.flatMap((section) =>
    section.items.map((item) => ({ ...item, sectionLabel: section.label })),
  )

  const sorted = [...flatItems].sort((a, b) => b.href.length - a.href.length)
  return (
    sorted.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) ?? null
  )
}
