import './globals.css'
import type { Metadata } from 'next'
import { Inter, Sora } from 'next/font/google'
import { siteConfig } from '@/lib/config'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Providers } from '@/components/Providers'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' })

export const metadata: Metadata = {
  metadataBase: new URL('https://nerin-electric.render.com'),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.domain,
    siteName: 'NERIN Electric',
    locale: 'es_AR',
    type: 'website',
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'NERIN Electric' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={cn(inter.variable, sora.variable)}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Providers>
          <Header />
          <main className="container pb-24 pt-16">{children}</main>
          <Footer />
          <a
            className="fixed bottom-6 right-6 hidden h-14 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white shadow-xl transition hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-white/60 md:inline-flex md:items-center"
            href={`https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(siteConfig.whatsapp.message)}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Hablar con NERIN por WhatsApp"
          >
            Hablar por WhatsApp
          </a>
        </Providers>
      </body>
    </html>
  )
}
