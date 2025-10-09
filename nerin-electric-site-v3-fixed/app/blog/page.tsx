import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { blogPosts } from '@/content/blogPosts'

export const revalidate = 3600

export default function BlogPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <Badge>Blog</Badge>
        <h1>Insights eléctricos y buenas prácticas</h1>
        <p className="text-lg text-slate-600">
          Consejos prácticos para administradores, desarrolladores y equipos de facilities que buscan instalaciones
          confiables y auditables.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {blogPosts.map((post) => (
          <article key={post.slug} className="rounded-3xl border border-border bg-white p-6 shadow-subtle">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {new Date(post.publishedAt).toLocaleDateString('es-AR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-foreground">{post.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
            <Link className="mt-4 inline-flex text-accent" href={`/blog/${post.slug}`}>
              Leer más →
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
