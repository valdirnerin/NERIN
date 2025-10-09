import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { blogPosts } from '@/content/blogPosts'

export const revalidate = 3600

interface Props {
  params: { slug: string }
}

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts.find((item) => item.slug === params.slug)
  if (!post) {
    notFound()
  }

  return (
    <article className="space-y-6">
      <Badge>Blog</Badge>
      <h1>{post.title}</h1>
      <p className="text-sm text-slate-500">
        {new Date(post.publishedAt).toLocaleDateString('es-AR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })}
      </p>
      <div className="space-y-4 text-base leading-relaxed text-slate-600">
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  )
}
