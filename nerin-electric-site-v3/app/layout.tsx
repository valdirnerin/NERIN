import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { readSite } from '@/lib/content'

export const metadata = { title: 'NERIN · Ingeniería Eléctrica', description: 'Servicios eléctricos para empresas en CABA y GBA.' }

export default function RootLayout({ children }: { children: React.ReactNode }){
  const site = readSite()
  return (
    <html lang="es">
      <body className="font-sans">
        <style>{`:root { --accent: ${site.accent || '#f59e0b'} }`}</style>
        <Header />
        <main className="container">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
