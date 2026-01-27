'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { adminNav } from '@/components/admin/nav'
import { cn } from '@/lib/utils'

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 flex-col gap-6 border-r border-border bg-white px-4 py-6">
      <div className="flex items-center gap-2 px-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        Admin Nerin
      </div>
      <nav className="flex flex-1 flex-col gap-6 text-sm">
        {adminNav.map((section) => (
          <div key={section.label} className="space-y-2">
            <p className="px-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {section.label}
            </p>
            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/admin' && pathname.startsWith(`${item.href}/`)) ||
                  (item.href === '/admin' && pathname === '/admin')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'rounded-xl px-3 py-2 text-sm transition hover:bg-slate-100',
                      isActive ? 'bg-slate-100 font-semibold text-foreground' : 'text-slate-600',
                    )}
                  >
                    {item.title}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="rounded-2xl border border-border/60 bg-slate-50 px-3 py-2 text-xs text-slate-500">
        Panel unificado · version admin
      </div>
    </aside>
  )
}
