import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { DB_DEMO_MODE } from '@/lib/dbMode'
import { AdminShell } from '@/components/admin/AdminShell'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  try {
    await requireAdmin()
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      redirect('/admin/login')
    }
    throw error
  }

  return (
    <AdminShell>
      {DB_DEMO_MODE ? (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Modo demo: los datos se guardan en una base temporal y no son persistentes.
        </div>
      ) : null}
      {children}
    </AdminShell>
  )
}
