import './globals.css'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { IBM_Plex_Sans, IBM_Plex_Sans_Condensed } from 'next/font/google'
import { getSiteContent, getWhatsappHref } from '@/lib/site-content'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Providers } from '@/components/Providers'
import { cn } from '@/lib/utils'
import { TrackingScripts } from '@/components/tracking/TrackingScripts'
import { AttributionCapture } from '@/components/tracking/AttributionCapture'

const plexSans = IBM_Plex_Sans({ subsets: ['latin'], variable: '--font-plex', weight: ['400', '500', '600', '700'] })
const plexCondensed = IBM_Plex_Sans_Condensed({
  subsets: ['latin'],
  variable: '--font-plex-condensed',
  weight: ['400', '500', '600', '700'],
})

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent()

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteContent()
  const whatsappHref = getWhatsappHref(site)
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || process.env.GTM_ID
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID || process.env.GA4_ID
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.META_PIXEL_ID

  return (
    <html lang="es-AR" className={cn(plexSans.variable, plexCondensed.variable)}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <TrackingScripts gtmId={gtmId} ga4Id={ga4Id} metaPixelId={metaPixelId} />
        {gtmId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        ) : null}
        <Providers>
          <Suspense fallback={null}>
            <AttributionCapture />
          </Suspense>
          <Header
            contact={{
              whatsappHref,
              whatsappLabel: site.contact.whatsappCtaLabel,
            }}
          />
          <main className="container pb-24 pt-14">{children}</main>
          <Footer site={site} />
          <a
            className="no-underline fixed bottom-6 right-6 hidden h-12 w-12 items-center justify-center rounded-full border border-transparent bg-[#0B0F14] text-white shadow-subtle transition hover:border-[#FBBF24] hover:text-[#FBBF24] focus-visible:ring-2 focus-visible:ring-[#FBBF24]/60 md:inline-flex"
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            aria-label="Hablar con NERIN por WhatsApp"
            title="WhatsApp"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M12 4.2a7.8 7.8 0 0 0-6.75 11.7L4 20l4.2-1.1A7.8 7.8 0 1 0 12 4.2Zm0 1.6a6.2 6.2 0 0 1 0 12.4 6.1 6.1 0 0 1-3.1-.9l-.4-.2-2.5.7.7-2.4-.3-.4a6.2 6.2 0 0 1 5.6-9.2Zm-2.4 3.3c-.2 0-.4 0-.5.2-.2.2-.7.7-.7 1.6s.7 2 1 2.3c.2.3 1.4 2.1 3.5 2.9 1.7.7 2 .5 2.3.5.3 0 1-.5 1.1-.9.1-.4.1-.8.1-.9s0-.2-.2-.2l-1.1-.5c-.2-.1-.3 0-.4.1-.1.2-.5.9-.6 1-.1.2-.2.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.1-1.4-1.2-1.6-.1-.2 0-.3.1-.4l.3-.3.2-.3c.1-.1.1-.3 0-.4l-.5-1.1c-.1-.2-.2-.2-.4-.2Z" />
            </svg>
          </a>
        </Providers>
      </body>
    </html>
  )
}
