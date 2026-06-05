import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    process.env.SITE_URL?.replace(/\/$/, '') ||
    'https://www.nerin.com.ar'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/admin/',
        '/clientes',
        '/clientes/',
        '/tecnico',
        '/tecnico/',
        '/api/admin',
        '/api/admin/',
        '/api/quotes',
        '/api/quotes/',
        '/api/upload/project-photo',
        '/api/upload/project-photo/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
