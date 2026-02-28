import * as React from 'react'
import { cn } from '@/lib/utils'

export const Table = ({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-x-auto rounded-xl">
    <table className={cn('min-w-[620px] w-full border-collapse text-sm text-slate-700', className)} {...props} />
  </div>
)

export const TableHead = ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={cn('border-b border-border pb-3 pr-4 text-left font-medium text-slate-500', className)} {...props} />
)

export const TableRow = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn('border-b border-border last:border-b-0', className)} {...props} />
)

export const TableCell = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn('py-4 pr-4 align-middle text-slate-700', className)} {...props} />
)
