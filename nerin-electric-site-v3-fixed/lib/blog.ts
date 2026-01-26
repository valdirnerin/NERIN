import { fetchPublicJson } from '@/lib/public-api'
import { getContentStore } from '@/lib/content-store'

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  publishedAt: string
  heroImage?: string
  tags?: string[]
}

type ContentPostSummary = {
  slug: string
  title: string
  excerpt: string
  content: string
  publishedAt: string
  coverImage?: string | null
}
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await fetchPublicJson<ContentPostSummary[]>('/api/public/posts')
    return posts
      .map((post) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        publishedAt: post.publishedAt,
        content: post.content,
        heroImage: post.coverImage ?? undefined,
      }))
      .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
  } catch (error) {
    try {
      const store = getContentStore()
      const posts = await store.listPosts()
      return posts
        .filter((post) => post.publishedAt)
        .map((post) => ({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          publishedAt: post.publishedAt ?? new Date().toISOString(),
          content: post.content,
          heroImage: post.coverImage ?? undefined,
        }))
        .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    } catch (storeError) {
      console.warn('[BLOG] Unable to list posts, returning empty list.', storeError)
      return []
    }
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const post = await fetchPublicJson<ContentPostSummary>(`/api/public/posts/${slug}`)
    return {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      content: post.content,
      heroImage: post.coverImage ?? undefined,
    }
  } catch (error) {
    const store = getContentStore()
    const post = await store.getPost(slug)
    if (!post) {
      return null
    }
    return {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt ?? new Date().toISOString(),
      content: post.content,
      heroImage: post.coverImage ?? undefined,
    }
  }
}
