/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  i18n: {
    locales: ['es-AR'],
    defaultLocale: 'es-AR',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'dummyimage.com',
      },
    ],
  },
  eslint: {
    dirs: ['app', 'components', 'lib', 'tests'],
  },
}

export default nextConfig
