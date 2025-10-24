import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'

export const runtime = 'nodejs'

export default async function AdminPacksLayout({ children }: { children: ReactNode }) {
  try {
    await requireAdmin()
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      redirect('/admin/login')
    }

    throw error
  }

  return <main className="mx-auto max-w-5xl space-y-10 px-6 pb-16 pt-10">{children}</main>
}
