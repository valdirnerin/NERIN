export const dynamic = 'force-dynamic'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getSiteContent } from '@/lib/site-content'
import { fetchPublicJson } from '@/lib/public-api'

type Project = {
  id?: string
  title: string
  description: string
  tags?: string[]
  locationText?: string | null
}

export const revalidate = 60

export default async function ObrasPage() {
  const site = await getSiteContent()
  let projects: Project[] = []
  try {
    projects = await fetchPublicJson<Project[]>('/api/public/projects')
  } catch (error) {
    projects = []
  }

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <Badge>Obras destacadas</Badge>
        <h1>{site.works.introTitle}</h1>
        <p className="text-lg text-slate-600">{site.works.introDescription}</p>
      </header>
      <section className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id ?? project.title} className="flex flex-col">
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <p className="text-sm text-slate-500">{project.locationText ?? ''}</p>
            </CardHeader>
            <CardContent className="mt-auto space-y-3 text-sm text-slate-600">
              <p>{project.description}</p>
              {project.tags && project.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-muted px-2 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
