import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { getBlogPost } from '@/lib/blog'
import { getSiteContent } from '@/lib/site-content'

export const revalidate = 3600

interface Props {
  params: { slug: string }
}

export default async function BlogPostPage({ params }: Props) {
  const site = await getSiteContent()
  const post = await getBlogPost(params.slug)
  if (!post) {
    notFound()
  }

  return (
    <article className="space-y-6">
      <Badge>{site.blog.introTitle}</Badge>
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
