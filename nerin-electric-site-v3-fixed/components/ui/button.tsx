'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'no-underline inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius)] text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground hover:bg-[#111827] focus-visible:ring-[#111827]/40 focus-visible:ring-offset-background',
        secondary:
          'border border-border bg-transparent text-foreground hover:border-[#111827] hover:text-[#111827] focus-visible:ring-[#111827]/30 focus-visible:ring-offset-background',
        outline:
          'border border-border text-foreground hover:border-[#111827] hover:text-[#111827] focus-visible:ring-[#111827]/30 focus-visible:ring-offset-background',
        ghost: 'text-foreground hover:bg-muted',
        link: 'text-accent underline-offset-4 hover:underline',
        accent:
          'bg-accent text-accent-foreground hover:bg-[#F59E0B] focus-visible:ring-[#F59E0B]/40 focus-visible:ring-offset-background',
      },
      size: {
        sm: 'h-9 px-4',
        md: 'h-11 px-6 text-base',
        lg: 'h-12 px-8 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'
