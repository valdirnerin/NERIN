import Link from 'next/link'
import { listItems, readMarkdown } from '@/lib/content'
export const metadata = { title: 'Blog | NERIN' }
export default function BlogList(){
  const slugs = listItems('blog')
  return (
    <div className="py-10">
      <h1 className="text-3xl font-extrabold mb-6">Blog</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {slugs.map(slug => {
          const p = readMarkdown('blog', slug)
          return (
            <article key={slug} className="card">
              <h3 className="text-xl font-semibold mb-1">
                <Link href={`/blog/${slug}`}>{p?.data?.title || slug}</Link>
              </h3>
              <p className="text-sm text-neutral-600">{p?.data?.excerpt}</p>
            </article>
          )
        })}
      </div>
    </div>
  )
}
