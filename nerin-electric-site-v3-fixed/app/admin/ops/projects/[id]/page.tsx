export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { DB_ENABLED } from '@/lib/dbMode'
import { isMissingTableError } from '@/lib/prisma-errors'
import { createOpsAdditional, createOpsCertificate, createOpsPhoto, updateOpsProject } from '../../actions'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableCell, TableHead, TableRow } from '@/components/ui/table'

export default async function AdminOpsProjectDetail({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { mpError?: string }
}) {
  if (!DB_ENABLED) {
    return (
      <div className="space-y-4">
        <Badge>Admin operativo</Badge>
        <h1>DB no configurada</h1>
        <p className="text-sm text-slate-600">La base de datos está deshabilitada.</p>
      </div>
    )
  }

  let project: Prisma.OpsProjectGetPayload<{
    include: {
      client: true
      certificates: { orderBy: { createdAt: 'desc' } }
      additionals: { orderBy: { createdAt: 'desc' } }
      photos: { orderBy: { createdAt: 'desc' } }
    }
  }> | null = null
  let catalogItems: Awaited<ReturnType<typeof prisma.additionalCatalogItem.findMany>> = []

  try {
    ;[project, catalogItems] = await Promise.all([
      prisma.opsProject.findUnique({
        where: { id: params.id },
        include: {
          client: true,
          certificates: { orderBy: { createdAt: 'desc' } },
          additionals: { orderBy: { createdAt: 'desc' } },
          photos: { orderBy: { createdAt: 'desc' } },
        },
      }),
      prisma.additionalCatalogItem.findMany({
        where: { active: true },
        orderBy: { name: 'asc' },
      }),
    ])
  } catch (error) {
    if (isMissingTableError(error)) {
      console.warn('[DB] Missing ops tables, rendering empty project detail.')
      return (
        <div className="space-y-4">
          <Badge>Admin operativo</Badge>
          <h1>DB no inicializada</h1>
          <p className="text-sm text-slate-600">
            La base de datos todavía no está lista. Ejecutá la inicialización y recargá para empezar a operar.
          </p>
          <Button variant="secondary" asChild>
            <Link href="/admin/ops">Volver al tablero</Link>
          </Button>
        </div>
      )
    }
    throw error
  }

  if (!project) {
    notFound()
  }

  const returnTo = `/admin/ops/projects/${project.id}`

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <Badge>Admin operativo</Badge>
        <h1>{project.title}</h1>
        <p className="text-sm text-slate-600">
          Cliente:{' '}
          <Link className="text-accent" href={`/admin/ops/clients/${project.clientId}`}>
            {project.client.name}
          </Link>
        </p>
        {searchParams.mpError && (
          <p className="text-xs text-amber-600">
            No se pudo generar el link de Mercado Pago. Revisá las variables de entorno e intentá nuevamente.
          </p>
        )}
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <p>
              Estado: <span className="font-semibold text-foreground">{project.status}</span>
            </p>
            <p>
              Progreso actual: <span className="font-semibold text-foreground">{project.progressPercent}%</span>
            </p>
            {project.address && <p>Dirección: {project.address}</p>}
            {project.city && <p>Ciudad: {project.city}</p>}
            {project.areaM2 && <p>Superficie: {project.areaM2} m²</p>}
            {project.electrificationLevel && <p>Nivel de electrificación: {project.electrificationLevel}</p>}
            {project.notes && <p>Notas: {project.notes}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actualizar proyecto</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateOpsProject} className="grid gap-4">
              <input type="hidden" name="id" value={project.id} />
              <div className="grid gap-2">
                <Label htmlFor="project-title">Título</Label>
                <Input id="project-title" name="title" defaultValue={project.title} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-address">Dirección</Label>
                <Input id="project-address" name="address" defaultValue={project.address ?? ''} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-city">Ciudad</Label>
                <Input id="project-city" name="city" defaultValue={project.city ?? ''} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-area">Superficie (m²)</Label>
                <Input id="project-area" name="areaM2" type="number" step="0.1" defaultValue={project.areaM2 ?? ''} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-progress">Progreso (%)</Label>
                <Input id="project-progress" name="progressPercent" type="number" defaultValue={project.progressPercent} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-status">Estado</Label>
                <select
                  id="project-status"
                  name="status"
                  className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm"
                  defaultValue={project.status}
                >
                  <option value="PLANNING">PLANNING</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="ON_HOLD">ON_HOLD</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-notes">Notas</Label>
                <Textarea id="project-notes" name="notes" defaultValue={project.notes ?? ''} />
              </div>
              <Button type="submit">Guardar cambios</Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Certificados de avance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <thead>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Porcentaje</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Pago</TableHead>
                </TableRow>
              </thead>
              <tbody>
                {project.certificates.map((certificate) => (
                  <TableRow key={certificate.id}>
                    <TableCell>{new Date(certificate.createdAt).toLocaleDateString('es-AR')}</TableCell>
                    <TableCell>
                      +{certificate.percentToAdd}% → {certificate.percentAfter}%
                    </TableCell>
                    <TableCell>${(certificate.amount / 100).toLocaleString('es-AR')}</TableCell>
                    <TableCell>
                      <Badge className="bg-slate-100 text-slate-600">{certificate.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {certificate.mercadoPagoInitPoint ? (
                        <a className="text-accent" href={certificate.mercadoPagoInitPoint} target="_blank" rel="noreferrer">
                          Link de pago
                        </a>
                      ) : (
                        <span className="text-xs text-slate-500">Sin link</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nuevo certificado</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createOpsCertificate} className="grid gap-4">
              <input type="hidden" name="projectId" value={project.id} />
              <input type="hidden" name="returnTo" value={returnTo} />
              <div className="grid gap-2">
                <Label htmlFor="cert-percent">Porcentaje a sumar</Label>
                <Input id="cert-percent" name="percentToAdd" type="number" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cert-amount">Monto (ARS)</Label>
                <Input id="cert-amount" name="amount" type="number" step="0.01" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cert-description">Descripción</Label>
                <Textarea id="cert-description" name="description" />
              </div>
              <Button type="submit">Crear certificado</Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Adicionales</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <thead>
                <TableRow>
                  <TableHead>Adicional</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Pago</TableHead>
                </TableRow>
              </thead>
              <tbody>
                {project.additionals.map((additional) => (
                  <TableRow key={additional.id}>
                    <TableCell>{additional.name}</TableCell>
                    <TableCell>
                      {additional.quantity} {additional.unit}
                    </TableCell>
                    <TableCell>${(additional.unitPrice / 100).toLocaleString('es-AR')}</TableCell>
                    <TableCell>
                      <Badge className="bg-slate-100 text-slate-600">{additional.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {additional.mercadoPagoInitPoint ? (
                        <a className="text-accent" href={additional.mercadoPagoInitPoint} target="_blank" rel="noreferrer">
                          Link de pago
                        </a>
                      ) : (
                        <span className="text-xs text-slate-500">Sin link</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agregar adicional</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createOpsAdditional} className="grid gap-4">
              <input type="hidden" name="projectId" value={project.id} />
              <input type="hidden" name="returnTo" value={returnTo} />
              <div className="grid gap-2">
                <Label htmlFor="additional-catalog">Catálogo</Label>
                <select
                  id="additional-catalog"
                  name="catalogItemId"
                  className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm"
                >
                  <option value="">Personalizado</option>
                  {catalogItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="additional-name">Nombre</Label>
                <Input id="additional-name" name="name" placeholder="Solo si no usás catálogo" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="additional-description">Descripción</Label>
                <Textarea id="additional-description" name="description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="additional-unit">Unidad</Label>
                  <Input id="additional-unit" name="unit" placeholder="u, m, jornal" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="additional-quantity">Cantidad</Label>
                  <Input id="additional-quantity" name="quantity" type="number" step="0.1" defaultValue={1} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="additional-price">Precio unitario (ARS)</Label>
                <Input id="additional-price" name="unitPrice" type="number" step="0.01" />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" name="generatePayment" />
                Generar link de pago automáticamente
              </label>
              <Button type="submit">Agregar adicional</Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Fotos del proyecto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {project.photos.length ? (
              <div className="grid gap-3">
                {project.photos.map((photo) => (
                  <div key={photo.id} className="rounded-xl border border-border p-4 text-sm text-slate-600">
                    <p className="font-semibold text-foreground">{photo.title || 'Sin título'}</p>
                    <p className="text-xs text-slate-500">{photo.url}</p>
                    {photo.takenAt && (
                      <p className="text-xs text-slate-500">
                        Tomada: {new Date(photo.takenAt).toLocaleDateString('es-AR')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Todavía no hay fotos cargadas.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agregar foto</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createOpsPhoto} className="grid gap-4">
              <input type="hidden" name="projectId" value={project.id} />
              <input type="hidden" name="returnTo" value={returnTo} />
              <div className="grid gap-2">
                <Label htmlFor="photo-title">Título</Label>
                <Input id="photo-title" name="title" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="photo-url">URL</Label>
                <Input id="photo-url" name="url" type="url" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="photo-date">Fecha</Label>
                <Input id="photo-date" name="takenAt" type="date" />
              </div>
              <Button type="submit">Agregar foto</Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
