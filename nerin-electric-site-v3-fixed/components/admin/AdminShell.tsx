'use client'

import { ReactNode, useState } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminTopbar } from '@/components/admin/AdminTopbar'

type AdminShellProps = {
  children: ReactNode
}

export function AdminShell({ children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-100 text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        <div className="hidden lg:flex">
          <AdminSidebar />
        </div>

        {sidebarOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Cerrar navegación"
            />
            <div className="fixed inset-y-0 left-0 z-40 lg:hidden">
              <AdminSidebar onNavigate={() => setSidebarOpen(false)} className="h-full w-[84vw] max-w-xs shadow-2xl" />
            </div>
          </>
        )}

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <AdminTopbar onToggleSidebar={() => setSidebarOpen(true)} />
          <div className="flex-1 px-4 py-4 sm:px-5 sm:py-5 lg:px-10 lg:py-8">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
