import type { MetadataRoute } from 'next'
import { SITE_ORIGIN } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/clientes',
          '/clientes/',
          '/clientes/login',
          '/clientes/login/',
          '/tecnico',
          '/tecnico/',
          '/portal',
          '/portal/',
          '/api',
          '/api/',
          '/presupuesto/',
          '/presupuestos/',
          '/token/',
          '/*token=*',
          '/*?token=*',
          '/*estado=*',
          '/*internal=*',
        ],
      },
    ],
    sitemap: new URL('/sitemap.xml', SITE_ORIGIN).toString(),
  }
}
