import { readMarkdown } from '@/lib/content'
import { marked } from 'marked'
export default function BlogPost({ params }: { params: { slug: string }}){
  const post = readMarkdown('blog', params.slug)
  if (!post) return <div className="py-10">No encontrado.</div>
  return (
    <article className="py-10 prose">
      <h1 className="text-3xl font-extrabold">{post.data.title}</h1>
      <div className="text-sm text-neutral-600 mb-6">{post.data.date}</div>
      <div dangerouslySetInnerHTML={{ __html: marked.parse(post.content || '') }} />
    </article>
  )
}
