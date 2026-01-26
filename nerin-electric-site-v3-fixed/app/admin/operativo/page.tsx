export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'
import { DB_ENABLED } from '@/lib/dbMode'
import { isMissingTableError } from '@/lib/prisma-errors'
import { createCertificate, markCertificatePaid } from '../actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableCell, TableHead, TableRow } from '@/components/ui/table'

const formatCurrency = (value: number) =>
  value.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  })

type ProjectWithDetails = Prisma.ProjectGetPayload<{
  include: {
    client: { include: { user: true } }
    progressCertificates: true
    photos: true
  }
}>

export default async function AdminOperativoPage() {
  if (!DB_ENABLED) {
    return (
      <div className="space-y-4">
        <Badge>Admin operativo</Badge>
        <h1>Admin operativo no configurado</h1>
        <p className="text-sm text-slate-600">La base de datos está deshabilitada.</p>
      </div>
    )
  }

  let projects: ProjectWithDetails[] = []

  try {
    projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        client: { include: { user: true } },
        progressCertificates: { orderBy: { createdAt: 'desc' } },
        photos: { orderBy: { createdAt: 'desc' } },
      },
    })
  } catch (error) {
    if (isMissingTableError(error)) {
      return (
        <div className="space-y-4">
          <Badge>Admin operativo</Badge>
          <h1>DB no inicializada</h1>
          <p className="text-sm text-slate-600">La base de datos todavía no está lista. Inicializala y recargá.</p>
          <Button variant="secondary" asChild>
            <Link href="/admin">Volver al panel</Link>
          </Button>
        </div>
      )
    }
    throw error
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <Badge>Admin operativo</Badge>
        <h1>Obras en ejecución</h1>
        <p className="text-sm text-slate-600">Seguimiento de certificados, CAC, IVA y pagos en un solo tablero.</p>
      </header>

      {!projects.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Sin obras registradas</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            <p>Cuando cargues proyectos para clientes vas a poder emitir certificados desde aquí.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-10">
          {projects.map((project) => {
            const clientName = project.client?.user?.name || project.client?.user?.email || 'Cliente'
            return (
              <Card key={project.id} className="space-y-4">
                <CardHeader>
                  <CardTitle>{project.nombre}</CardTitle>
                  <p className="text-sm text-slate-500">
                    Cliente: {clientName} · Base obra {formatCurrency(Number(project.valorObraBase))}
                  </p>
                  <p className="text-sm text-slate-500">
                    Avance certificado: {project.avanceCertificado}% · Avance pagado: {project.avancePagado}%
                  </p>
                </CardHeader>
                <CardContent className="space-y-8">
                  <section className="grid gap-4 md:grid-cols-[1.1fr_1fr]">
                    <div className="space-y-4">
                      <h3 className="text-base font-semibold text-foreground">Emitir certificado</h3>
                      <form action={createCertificate} className="grid gap-4">
                        <input type="hidden" name="projectId" value={project.id} />
                        <div className="grid gap-2">
                          <Label htmlFor={`porcentaje-${project.id}`}>Porcentaje (%)</Label>
                          <Input
                            id={`porcentaje-${project.id}`}
                            name="porcentaje"
                            type="number"
                            min="1"
                            max="100"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`cacActual-${project.id}`}>CAC actual</Label>
                          <Input
                            id={`cacActual-${project.id}`}
                            name="cacActual"
                            type="number"
                            step="0.01"
                            required
                          />
                        </div>
                        <label className="flex items-center gap-2 text-sm text-slate-600">
                          <input type="checkbox" name="aplicaIVA" defaultChecked />
                          Aplicar IVA ({project.ivaPorcentaje}%)
                        </label>
                        <Button type="submit">Crear certificado</Button>
                      </form>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-base font-semibold text-foreground">Fotos de obra</h3>
                      <form
                        action="/api/upload/project-photo"
                        method="post"
                        encType="multipart/form-data"
                        className="grid gap-3"
                      >
                        <input type="hidden" name="projectId" value={project.id} />
                        <div className="grid gap-2">
                          <Label htmlFor={`photo-title-${project.id}`}>Título</Label>
                          <Input id={`photo-title-${project.id}`} name="title" placeholder="Ingreso de materiales" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`photo-file-${project.id}`}>Archivo</Label>
                          <Input id={`photo-file-${project.id}`} name="file" type="file" accept="image/*" required />
                        </div>
                        <Button type="submit" variant="secondary">
                          Subir foto
                        </Button>
                      </form>
                      {project.photos.length ? (
                        <div className="grid grid-cols-2 gap-3">
                          {project.photos.map((photo) => (
                            <figure key={photo.id} className="space-y-2">
                              <img
                                src={`/uploads/${photo.storedPath}`}
                                alt={photo.title ?? 'Foto de obra'}
                                className="h-32 w-full rounded-lg object-cover"
                                loading="lazy"
                              />
                              <figcaption className="text-xs text-slate-500">{photo.title ?? photo.filename}</figcaption>
                            </figure>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500">Todavía no hay fotos cargadas.</p>
                      )}
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-semibold text-foreground">Certificados emitidos</h3>
                    <Table>
                      <thead>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Porcentaje</TableHead>
                          <TableHead>CAC</TableHead>
                          <TableHead>Subtotal</TableHead>
                          <TableHead>IVA</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </thead>
                      <tbody>
                        {project.progressCertificates.length ? (
                          project.progressCertificates.map((certificate) => (
                            <TableRow key={certificate.id}>
                              <TableCell>{new Date(certificate.createdAt).toLocaleDateString('es-AR')}</TableCell>
                              <TableCell>{certificate.porcentaje}%</TableCell>
                              <TableCell>
                                {Number(certificate.cacAnterior).toLocaleString('es-AR')} →{' '}
                                {Number(certificate.cacActual).toLocaleString('es-AR')}
                              </TableCell>
                              <TableCell>{formatCurrency(Number(certificate.subtotalSinIVA))}</TableCell>
                              <TableCell>{formatCurrency(Number(certificate.ivaMonto))}</TableCell>
                              <TableCell>{formatCurrency(Number(certificate.totalConIVA))}</TableCell>
                              <TableCell className="capitalize">{certificate.estado}</TableCell>
                              <TableCell>
                                {certificate.estado !== 'pagado' ? (
                                  <form action={markCertificatePaid}>
                                    <input type="hidden" name="certificateId" value={certificate.id} />
                                    <Button size="sm" variant="outline">
                                      Marcar pagado
                                    </Button>
                                  </form>
                                ) : (
                                  <span className="text-xs text-slate-500">Pagado</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center text-sm text-slate-500">
                              No hay certificados cargados.
                            </TableCell>
                          </TableRow>
                        )}
                      </tbody>
                    </Table>
                  </section>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
