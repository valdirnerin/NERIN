export type AdminNavItem = {
  title: string
  href: string
}

export type AdminNavSection = {
  label: string
  items: AdminNavItem[]
}

export const adminNav: AdminNavSection[] = [
  {
    label: 'Dashboard',
    items: [
      { title: 'Dashboard', href: '/admin' },
      { title: 'Leads', href: '/admin/leads' },
    ],
  },
  {
    label: 'Operaciones (Ops)',
    items: [
      { title: 'Panel Ops', href: '/admin/ops' },
      { title: 'Proyectos', href: '/admin/ops/projects' },
      { title: 'Certificados', href: '/admin/ops/certificates' },
      { title: 'Adicionales', href: '/admin/ops/projects?tab=adicionales' },
      { title: 'Clientes', href: '/admin/ops/clients' },
    ],
  },
  {
    label: 'Packs',
    items: [{ title: 'Packs comerciales', href: '/admin/packs' }],
  },
  {
    label: 'Contenido',
    items: [
      { title: 'Textos del sitio', href: '/admin' },
      { title: 'Noticias', href: '/admin/noticias' },
    ],
  },
  {
    label: 'Ajustes',
    items: [
      { title: 'Config general', href: '/admin/ajustes' },
      { title: 'CAC/IVA operativo', href: '/admin/operativo' },
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
