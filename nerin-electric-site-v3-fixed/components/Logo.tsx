import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2 font-display text-lg', className)}>
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        NE
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-base font-semibold uppercase tracking-[0.3em] text-slate-500">NERIN</span>
        <span className="text-xs text-slate-400">Ingeniería Eléctrica</span>
      </div>
    </Link>
  )
}
