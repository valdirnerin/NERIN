export const dynamic = 'force-dynamic'

import Link from 'next/link'
import dynamicImport from 'next/dynamic'
import { prisma } from '@/lib/db'
import { getSiteContent } from '@/lib/site-content'
import { DB_ENABLED } from '@/lib/dbMode'
import { createAdditional, createCertificate } from '../actions'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CaseStudyForm } from './case-study-form'
import { MaintenanceForm } from './maintenance-form'
import { SiteExperienceDesigner } from './SiteExperienceDesigner'
import { BrandManager } from './BrandManager'
import { BlogManager } from './BlogManager'
import { ServicesManager } from './ServicesManager'
import { ProjectsManager } from './ProjectsManager'

const AdminPacks = dynamicImport(() => import('./AdminPacks'), { ssr: false })

export const revalidate = 0

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
    <div className="space-y-12">
      <header className="space-y-2">
        <Badge>Panel administrativo</Badge>
        <h1>Control total de contenido y operaciones</h1>
        <p className="text-sm text-slate-600">
          Diseñá la experiencia del sitio, gestioná marcas, blog, packs, planes de mantenimiento y certificados desde un solo
          lugar. Cada cambio impacta en el sitio público, clientes y SEO.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button variant="outline" asChild>
            <Link href="/admin/noticias">Gestionar noticias</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/packs">Gestionar packs comerciales</Link>
          </Button>
        </div>
      </header>

      <SiteExperienceDesigner initialData={site} />

      <section className="grid gap-6 lg:grid-cols-2">
        <BrandManager initialBrands={brands} />
        <BlogManager />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ServicesManager />
        <ProjectsManager />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nuevo adicional</CardTitle>
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
                  <Label htmlFor="adicional-precio">Precio unitario mano de obra</Label>
                  <Input id="adicional-precio" name="precioUnitarioManoObra" type="number" required />
                </div>
              </div>
              <Button type="submit">Agregar adicional</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nuevo plan de mantenimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <MaintenanceForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nuevo caso de éxito</CardTitle>
          </CardHeader>
          <CardContent>
            <CaseStudyForm />
          </CardContent>
        </Card>
      </section>

      <section className="mt-10">
        <AdminPacks />
      </section>

      <section className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Certificados de avance</CardTitle>
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
                  <Label htmlFor="monto">Monto</Label>
                  <Input id="monto" name="monto" type="number" required />
                </div>
              </div>
              <Button type="submit">Crear certificado</Button>
            </form>
            <p className="text-xs text-slate-500">
              Una vez creado, recordá generar el enlace de pago desde Mercado Pago y guardarlo en el certificado.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 text-sm text-slate-600">
        <h2 className="text-lg font-semibold text-foreground">Resumen actual</h2>
        <p>Packs publicados: {packs.length}</p>
        <p>Adicionales disponibles: {adicionales.length}</p>
        <p>Planes de mantenimiento: {plans.length}</p>
        <p>
          Exportar datos →{' '}
          <Link className="text-accent" href="/api/admin/export?resource=proyectos">
            Descargar CSV de proyectos
          </Link>
        </p>
      </section>
    </div>
  )
}
