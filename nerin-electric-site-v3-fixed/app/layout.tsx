import './globals.css'
import type { ReactNode } from 'react'
import { IBM_Plex_Sans, IBM_Plex_Sans_Condensed } from 'next/font/google'
import { Providers } from '@/components/Providers'
import { cn } from '@/lib/utils'

const plexSans = IBM_Plex_Sans({ subsets: ['latin'], variable: '--font-plex', weight: ['400', '500', '600', '700'] })
const plexCondensed = IBM_Plex_Sans_Condensed({
  subsets: ['latin'],
  variable: '--font-plex-condensed',
  weight: ['400', '500', '600', '700'],
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-AR" className={cn(plexSans.variable, plexCondensed.variable)}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
