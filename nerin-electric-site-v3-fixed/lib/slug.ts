import { prisma } from '@/lib/db'

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function makeUniqueSlug(title: string): Promise<string> {
  const fallback = 'caso-de-exito'
  const baseSlug = slugify(title) || fallback

  let candidate = baseSlug
  let suffix = 2

  while (true) {
    const exists = await prisma.caseStudy.findUnique({ where: { slug: candidate } })
    if (!exists) {
      return candidate
    }

    candidate = `${baseSlug}-${suffix}`
    suffix += 1
  }
}
