import { cn } from '@/lib/utils'

export function Badge({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[var(--radius)] border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground',
        className,
      )}
    >
      {children}
    </span>
  )
}
