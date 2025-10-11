'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export function Accordion({ children }: { children: React.ReactNode }) {
  return <div className="space-y-3">{children}</div>
}

export function AccordionItem({ question, answer }: { question: string; answer: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-subtle">
      <button
        className="flex w-full items-center justify-between gap-4 text-left"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span className="text-lg font-semibold text-foreground">{question}</span>
        <span aria-hidden className="text-2xl text-accent">
          {open ? '−' : '+'}
        </span>
      </button>
      <div className={cn('mt-3 text-sm text-slate-600', open ? 'block' : 'hidden')}>
        {answer}
      </div>
    </div>
  )
}
