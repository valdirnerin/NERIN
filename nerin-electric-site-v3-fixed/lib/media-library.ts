import { prisma } from '@/lib/db'

export const MEDIA_LIBRARY_KEY = 'site_media_library_v1'

export type MediaLibraryItem = {
  id: string
  url: string
  name: string
  mimeType?: string
  size?: number
  provider?: string
  storedPath?: string
  createdAt: string
}

export async function getMediaLibrary(): Promise<MediaLibraryItem[]> {
  try {
    const row = await prisma.websiteContent.findUnique({ where: { key: MEDIA_LIBRARY_KEY } })
    const parsed = row?.content ? JSON.parse(row.content) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function addMediaLibraryItem(item: Omit<MediaLibraryItem, 'id' | 'createdAt'>) {
  const current = await getMediaLibrary()
  const next: MediaLibraryItem = { ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
  await prisma.websiteContent.upsert({
    where: { key: MEDIA_LIBRARY_KEY },
    create: { key: MEDIA_LIBRARY_KEY, title: 'Biblioteca de medios', content: JSON.stringify([next, ...current]), visible: true },
    update: { content: JSON.stringify([next, ...current]) },
  })
  return next
}
