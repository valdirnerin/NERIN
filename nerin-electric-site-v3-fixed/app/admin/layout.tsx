import type { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto max-w-5xl space-y-10 px-6 pb-16 pt-10">
      {children}
    </main>
  )
}
