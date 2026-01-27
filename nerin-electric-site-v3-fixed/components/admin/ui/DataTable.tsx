import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type DataTableProps = {
  children: ReactNode
  className?: string
}

export function DataTable({ children, className }: DataTableProps) {
  return (
    <div className={cn('overflow-hidden rounded-2xl border border-border bg-white shadow-subtle', className)}>
      <table className="w-full text-sm">{children}</table>
    </div>
  )
}
