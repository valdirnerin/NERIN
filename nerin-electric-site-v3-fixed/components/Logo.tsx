import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('no-underline flex items-center gap-3 font-display text-lg', className)}>
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius)] border border-border bg-white">
        <svg aria-hidden viewBox="0 0 64 64" className="h-7 w-7">
          <rect x="6" y="6" width="52" height="52" rx="6" fill="#0B0F14" stroke="#FBBF24" strokeWidth="2" />
          <path
            d="M35 10L20 36h14l-8 18 18-28H30l5-16z"
            fill="#FBBF24"
          />
        </svg>
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-base font-semibold uppercase tracking-[0.2em] text-foreground">NERIN</span>
        <span className="text-xs text-muted-foreground">Ingeniería Eléctrica</span>
      </div>
    </Link>
  )
}
