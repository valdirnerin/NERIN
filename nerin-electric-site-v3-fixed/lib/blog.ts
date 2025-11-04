import { listItems, readMarkdown } from '@/lib/content'
import { blogPosts as fallbackPosts } from '@/content/blogPosts'

type StoredPost = {
  data?: {
    title?: string
    excerpt?: string
    publishedAt?: string
    heroImage?: string
    tags?: string[]
  }
  content?: string
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  publishedAt: string
  heroImage?: string
  tags?: string[]
}

function normalizePost(slug: string, raw: StoredPost | null): BlogPost | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }

  const title = raw.data?.title?.trim() ?? ''
  const excerpt = raw.data?.excerpt?.trim() ?? ''
  const publishedAt = raw.data?.publishedAt ?? new Date().toISOString().slice(0, 10)
  const content = raw.content ?? ''

  if (!title || !content) {
    return null
  }

  return {
    slug,
    title,
    excerpt,
    publishedAt,
    content,
    heroImage: raw.data?.heroImage?.trim() || undefined,
    tags: Array.isArray(raw.data?.tags) ? raw.data?.tags : undefined,
  }
}

export function getBlogPosts(): BlogPost[] {
  const slugs = listItems('blog')
  const posts = slugs
    .map((slug) => normalizePost(slug, readMarkdown('blog', slug) as StoredPost | null))
    .filter((post): post is BlogPost => Boolean(post))
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))

  if (posts.length) {
    return posts
  }

  return fallbackPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    content: post.content,
  }))
}

export function getBlogPost(slug: string): BlogPost | null {
  const post = normalizePost(slug, readMarkdown('blog', slug) as StoredPost | null)
  if (post) {
    return post
  }

  const fallback = fallbackPosts.find((item) => item.slug === slug)
  return fallback
    ? {
        slug: fallback.slug,
        title: fallback.title,
        excerpt: fallback.excerpt,
        publishedAt: fallback.publishedAt,
        content: fallback.content,
      }
    : null
}
