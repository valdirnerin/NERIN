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
        'inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground',
        className,
      )}
    >
      {children}
    </span>
  )
}
