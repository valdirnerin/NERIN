export const dynamic = 'force-dynamic'

import Link from 'next/link'
import dynamicImport from 'next/dynamic'
import { prisma } from '@/lib/db'
import { getSiteContent } from '@/lib/site-content'
import { DB_ENABLED } from '@/lib/dbMode'
import { createAdditional, createCertificate } from '../../actions'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { StatCard } from '@/components/admin/ui/StatCard'
import { CaseStudyForm } from './case-study-form'
import { MaintenanceForm } from './maintenance-form'
import { SiteExperienceDesigner } from './SiteExperienceDesigner'
import { BrandManager } from './BrandManager'
import { BlogManager } from './BlogManager'
import { ServicesManager } from './ServicesManager'
import { ProjectsManager } from './ProjectsManager'

const AdminPacks = dynamicImport(() => import('./AdminPacks'), { ssr: false })

export const revalidate = 0

const moduleCards = [
  {
    title: 'Contenido del sitio',
    description: 'Home, textos clave, contacto y estructura comercial.',
    href: '#contenido',
  },
  {
    title: 'Servicios y proyectos',
    description: 'Actualizá catálogo, casos y material visual.',
    href: '#servicios',
  },
  {
    title: 'Precios y packs',
    description: 'Mantené oferta comercial, adicionales y mantenimiento.',
    href: '#precios',
  },
  {
    title: 'Operaciones',
    description: 'Consultas, proyectos, certificados y clientes.',
    href: '#operaciones',
  },
]

export default async function AdminPage() {
  if (!DB_ENABLED) {
    return (
      <div className="space-y-4">
        <Badge>Panel administrativo</Badge>
        <h1>Panel no configurado</h1>
        <p className="text-sm text-slate-600">La base de datos está deshabilitada. Activala para gestionar contenido.</p>
      </div>
    )
  }

  const site = await getSiteContent()
  const [packs, adicionales, plans, projects, brands] = await Promise.all([
    prisma.pack.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.additionalItem.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.maintenancePlan.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.project.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.brand.findMany({ orderBy: { nombre: 'asc' } }),
  ])

  return (
    <div className="space-y-10">
      <header className="rounded-3xl border border-border bg-white p-5 sm:p-7">
        <div className="space-y-3">
          <Badge>Centro admin NERIN</Badge>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Admin reestructurado por módulos
          </h1>
          <p className="max-w-3xl text-sm text-slate-600 sm:text-base">
            Todo está organizado para usarlo fácil: elegí un módulo, hacé el cambio y seguí al próximo.
          </p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {moduleCards.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="rounded-2xl border border-border bg-slate-50 p-4 text-left transition hover:border-slate-300 hover:bg-white"
            >
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="mt-1 text-xs text-slate-600">{item.description}</p>
            </a>
          ))}
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Packs" value={packs.length} />
        <StatCard label="Adicionales" value={adicionales.length} />
        <StatCard label="Planes" value={plans.length} />
        <StatCard label="Proyectos" value={projects.length} />
      </section>

      <section id="contenido" className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Módulo 1 · Contenido del sitio</h2>
        <SiteExperienceDesigner initialData={site} />
      </section>

      <section id="servicios" className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Módulo 2 · Servicios, marcas y proyectos</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <ServicesManager />
          <ProjectsManager />
          <BrandManager initialBrands={brands} />
          <BlogManager />
        </div>
      </section>

      <section id="precios" className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Módulo 3 · Precios y oferta comercial</h2>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Packs</h3>
          <AdminPacks />
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Agregar adicional</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createAdditional} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="adicional-nombre">Nombre</Label>
                  <Input id="adicional-nombre" name="nombre" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="adicional-descripcion">Descripción</Label>
                  <Textarea id="adicional-descripcion" name="descripcion" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="adicional-unidad">Unidad</Label>
                    <Input id="adicional-unidad" name="unidad" required />
                  </div>
                  <div>
                    <Label htmlFor="adicional-precio">Precio mano de obra</Label>
                    <Input id="adicional-precio" name="precioUnitarioManoObra" type="number" required />
                  </div>
                </div>
                <Button type="submit">Guardar adicional</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plan de mantenimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <MaintenanceForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Caso real / obra destacada</CardTitle>
            </CardHeader>
            <CardContent>
              <CaseStudyForm />
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="operaciones" className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Módulo 4 · Operaciones y certificados</h2>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/leads">Ver consultas nuevas</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/ops">Ir al panel operativo</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/ops/projects">Ver proyectos</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Crear certificado de avance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={createCertificate} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="projectId">Proyecto</Label>
                <select
                  id="projectId"
                  name="projectId"
                  className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm"
                  required
                >
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="porcentaje">Porcentaje</Label>
                  <Input id="porcentaje" name="porcentaje" type="number" required />
                </div>
                <div>
                  <Label htmlFor="cacActual">CAC actual</Label>
                  <Input id="cacActual" name="cacActual" type="number" step="0.01" required />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" name="aplicaIVA" defaultChecked />
                Aplicar IVA
              </label>
              <Button type="submit">Crear certificado</Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
