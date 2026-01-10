import { DEFAULT_SETTINGS } from '@/lib/siteSettings'

export type PublicService = {
  id?: string
  title: string
  description: string
  order: number
  active: boolean
}

export type PublicProject = {
  id?: string
  title: string
  description: string
  tags: string[]
  locationText?: string | null
  images: string[]
}

export type PublicPost = {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string | null
  publishedAt?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
}

export type PublicPage = {
  id?: string
  slug: string
  title: string
  description?: string | null
  sections: Array<Record<string, unknown>>
  seoTitle?: string | null
  seoDescription?: string | null
}

export const mockSettings = DEFAULT_SETTINGS

export const mockServices: PublicService[] = [
  {
    id: 'svc-1',
    title: 'Instalaciones eléctricas completas',
    description: 'Proyecto ejecutivo, tableros, canalizaciones y puesta en marcha.',
    order: 1,
    active: true,
  },
  {
    id: 'svc-2',
    title: 'Tableros y protección',
    description: 'Montaje, ensayo y certificación de tableros generales y seccionales.',
    order: 2,
    active: true,
  },
  {
    id: 'svc-3',
    title: 'Puesta a tierra certificada',
    description: 'Mediciones, informes y adecuaciones según normativa AEA.',
    order: 3,
    active: true,
  },
  {
    id: 'svc-4',
    title: 'Datos, CCTV y redes',
    description: 'Redes estructuradas, cámaras y audio distribuido para oficinas y locales.',
    order: 4,
    active: true,
  },
]

export const mockProjects: PublicProject[] = []
export const mockPosts: PublicPost[] = []
export const mockPages: PublicPage[] = []
