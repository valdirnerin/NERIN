import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { DB_DEMO_MODE } from '@/lib/dbMode'

export const runtime = 'nodejs'

export default async function AdminOpsLayout({ children }: { children: ReactNode }) {
  try {
    await requireAdmin()
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      redirect('/admin/login')
    }
    throw error
  }

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-6 pb-16 pt-10">
      {DB_DEMO_MODE && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Modo demo: los datos se guardan en una base temporal y no son persistentes.
        </div>
      )}
      {children}
    </main>
  )
}
