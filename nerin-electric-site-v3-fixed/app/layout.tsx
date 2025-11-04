import './globals.css'
import type { Metadata } from 'next'
import { Inter, Sora } from 'next/font/google'
import { getSiteContent, getWhatsappHref } from '@/lib/site-content'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Providers } from '@/components/Providers'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' })

export function generateMetadata(): Metadata {
  const site = getSiteContent()

  return {
    metadataBase: new URL('https://nerin-electric.render.com'),
    title: {
      default: site.seo.metaTitle,
      template: `%s · ${site.name}`,
    },
    description: site.seo.metaDescription,
    keywords: site.seo.keywords,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: site.seo.metaTitle,
      description: site.seo.metaDescription,
      url: 'https://www.nerin.com.ar',
      siteName: 'NERIN Electric',
      locale: 'es_AR',
      type: 'website',
      images: [{ url: '/nerin/og-cover.png', width: 1200, height: 630, alt: 'NERIN Electric' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: site.seo.metaTitle,
      description: site.seo.metaDescription,
      images: ['/nerin/og-cover.png'],
    },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = getSiteContent()
  const whatsappHref = getWhatsappHref(site)

  return (
    <html lang="es-AR" className={cn(inter.variable, sora.variable)}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Providers>
          <Header
            contact={{
              whatsappHref,
              whatsappLabel: site.hero.secondaryCta.label,
            }}
          />
          <main className="container pb-24 pt-16">{children}</main>
          <Footer site={site} />
          <a
            className="fixed bottom-6 right-6 hidden h-14 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white shadow-xl transition hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-white/60 md:inline-flex md:items-center"
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            aria-label="Hablar con NERIN por WhatsApp"
          >
            {site.hero.secondaryCta.label}
          </a>
        </Providers>
      </body>
    </html>
  )
}
