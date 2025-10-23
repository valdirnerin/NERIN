export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/db'
import {
  createAdditional,
  createCertificate,
  createMaintenance,
  createPack,
} from '../actions'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CaseStudyForm } from './case-study-form'

export const revalidate = 0

export default async function AdminPage() {
  const [packs, adicionales, plans, projects] = await Promise.all([
    prisma.pack.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.additionalItem.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.maintenancePlan.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.project.findMany({ orderBy: { createdAt: 'desc' } }),
  ])

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <Badge>Panel administrativo</Badge>
        <h1>Gestión de contenidos y operaciones</h1>
        <p className="text-sm text-slate-600">
          Administrá packs, adicionales, planes de mantenimiento, casos de éxito y certificados de avance. Todos los
          cambios impactan en el sitio público y en el portal de clientes.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nuevo pack eléctrico</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createPack} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" name="nombre" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea id="descripcion" name="descripcion" required />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bocasIncluidas">Bocas incluidas</Label>
                  <Input id="bocasIncluidas" name="bocasIncluidas" type="number" required />
                </div>
                <div>
                  <Label htmlFor="ambientesReferencia">Ambientes</Label>
                  <Input id="ambientesReferencia" name="ambientesReferencia" type="number" required />
                </div>
                <div>
                  <Label htmlFor="precioManoObraBase">Precio mano de obra</Label>
                  <Input id="precioManoObraBase" name="precioManoObraBase" type="number" required />
                </div>
              </div>
              <div>
                <Label htmlFor="alcanceDetallado">Alcance (una línea por ítem)</Label>
                <Textarea id="alcanceDetallado" name="alcanceDetallado" required />
              </div>
              <Button type="submit">Crear pack</Button>
            </form>
          </CardContent>
        </Card>

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
            <form action={createMaintenance} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="plan-nombre">Nombre</Label>
                <Input id="plan-nombre" name="nombre" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="plan-slug">Slug</Label>
                <Input id="plan-slug" name="slug" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="plan-visitas">Visitas mensuales</Label>
                  <Input id="plan-visitas" name="visitasMes" type="number" required />
                </div>
                <div>
                  <Label htmlFor="plan-precio">Precio mensual</Label>
                  <Input id="plan-precio" name="precioMensual" type="number" required />
                </div>
              </div>
              <div>
                <Label htmlFor="plan-incluye">Tareas fijas (una por línea)</Label>
                <Textarea id="plan-incluye" name="incluye" required />
              </div>
              <Button type="submit">Crear plan</Button>
            </form>
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
