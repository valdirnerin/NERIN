'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type LogoProps = {
  title: string
  subtitle: string
  imageUrl?: string | null
  className?: string
}

export function Logo({ className, imageUrl, subtitle, title }: LogoProps) {
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    setImageFailed(false)
  }, [imageUrl])

  const showImage = Boolean(imageUrl) && !imageFailed

  return (
    <Link href="/" className={cn('no-underline flex min-w-0 items-center gap-2.5 font-display text-lg sm:gap-3', className)}>
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius)] border border-border bg-white p-1 sm:h-10 sm:w-10">
        {showImage ? (
          <img
            src={imageUrl ?? undefined}
            alt={`${title} ${subtitle}`.trim()}
            className="h-full w-full object-contain"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <svg aria-hidden viewBox="0 0 64 64" className="h-full w-full">
            <rect x="6" y="6" width="52" height="52" rx="6" fill="#0B0F14" stroke="#FBBF24" strokeWidth="2" />
            <path d="M35 10L20 36h14l-8 18 18-28H30l5-16z" fill="#FBBF24" />
          </svg>
        )}
      </span>
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-sm font-semibold uppercase tracking-[0.16em] text-foreground sm:text-base sm:tracking-[0.2em]">{title}</span>
        <span className="hidden text-xs text-muted-foreground sm:block">{subtitle}</span>
      </div>
    </Link>
  )
}
