'use client'

import type { ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminTopbar } from '@/components/admin/AdminTopbar'

type AdminShellProps = {
  children: ReactNode
}

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-slate-100 text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        <div className="hidden lg:flex">
          <AdminSidebar />
        </div>
        <div className="flex min-h-screen flex-1 flex-col">
          <AdminTopbar />
          <div className="flex-1 px-6 py-6 lg:px-10 lg:py-8">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
