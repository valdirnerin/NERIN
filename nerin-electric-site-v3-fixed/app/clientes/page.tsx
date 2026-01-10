export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { parseStringArray } from '@/lib/serialization'
import { DB_ENABLED } from '@/lib/dbMode'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableCell, TableHead, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

export const revalidate = 0

export default async function ClienteDashboard() {
  if (!DB_ENABLED) {
    return (
      <div className="space-y-4">
        <Badge>Portal de clientes</Badge>
        <h1>Portal no configurado</h1>
        <p className="text-sm text-slate-600">La base de datos está deshabilitada. Activala para ver proyectos.</p>
      </div>
    )
  }

  const session = await getSession()
  if (!session?.user?.id) {
    redirect('/clientes/login')
  }

  const displayName = session.user.name?.trim() || session.user.email || 'usuario'

  const client = await prisma.client.findUnique({
    where: { userId: session.user.id },
    include: {
      projects: {
        include: {
          progressCertificates: true,
          invoices: true,
        },
      },
    },
  })

  const normalizedClient = client
    ? {
        ...client,
        projects: client.projects.map((project) => ({
          ...project,
          normativasAplicadas: parseStringArray(project.normativasAplicadas),
        })),
      }
    : null

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <Badge>Portal de clientes</Badge>
        <h1>Hola {displayName}</h1>
        <p className="text-sm text-slate-600">
          {normalizedClient?.approved
            ? 'Visualizá tus proyectos, certificados de avance y facturas en un solo lugar.'
            : 'Tu cuenta está pendiente de aprobación. Mientras tanto, podés seguir avanzando con pedidos y compartir documentación.'}
        </p>
      </header>

      {!normalizedClient && (
        <Card>
          <CardHeader>
            <CardTitle>Activación en proceso</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            <p>
              Todavía no vinculamos tus datos a una cuenta de cliente. Escribinos a{' '}
              <a href="mailto:hola@nerin.com.ar" className="text-accent">
                hola@nerin.com.ar
              </a>{' '}
              para acelerar el proceso.
            </p>
          </CardContent>
        </Card>
      )}

      {normalizedClient?.projects.length ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Proyectos activos</h2>
            <p className="text-sm text-slate-500">Empresa de envío: {normalizedClient.notas ?? 'Se informará si aplica'}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {normalizedClient.projects.map((project) => (
              <Card key={project.id} className="space-y-3">
                <CardHeader>
                  <CardTitle>{project.nombre}</CardTitle>
                  <p className="text-sm text-slate-500">Estado: {project.estado}</p>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600">
                  <p>Dirección: {project.direccion}</p>
                  {project.metros2 && <p>Superficie: {project.metros2} m²</p>}
                  <p>Normativas aplicadas: {project.normativasAplicadas.join(', ') || 'En elaboración'}</p>
                  <div>
                    <p className="font-semibold text-foreground">Certificados de avance</p>
                    <Table>
                      <thead>
                        <TableRow>
                          <TableHead>Porcentaje</TableHead>
                          <TableHead>Monto</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </thead>
                      <tbody>
                        {project.progressCertificates.map((certificate) => (
                          <TableRow key={certificate.id}>
                            <TableCell>{certificate.porcentaje}%</TableCell>
                            <TableCell>${Number(certificate.monto).toLocaleString('es-AR')}</TableCell>
                            <TableCell className="capitalize">{certificate.estado}</TableCell>
                            <TableCell>
                              {certificate.estado === 'pendiente' && certificate.mpInitPointUrl ? (
                                <Button size="sm" variant="secondary" asChild>
                                  <a href={certificate.mpInitPointUrl} target="_blank" rel="noopener noreferrer">
                                    Pagar online
                                  </a>
                                </Button>
                              ) : (
                                <span className="text-xs text-slate-500">{certificate.estado === 'pagado' ? 'Pagado' : ''}</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Facturas</p>
                    <Table>
                      <thead>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Descarga</TableHead>
                        </TableRow>
                      </thead>
                      <tbody>
                        {project.invoices.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell>
                              {invoice.fecha
                                ? new Date(invoice.fecha).toLocaleDateString('es-AR')
                                : 'Pendiente'}
                            </TableCell>
                            <TableCell className="capitalize">{invoice.estado}</TableCell>
                            <TableCell>
                              {invoice.urlPdf ? (
                                <a className="text-accent" href={invoice.urlPdf} target="_blank" rel="noopener noreferrer">
                                  Ver PDF
                                </a>
                              ) : (
                                <span className="text-xs text-slate-500">Aún no disponible</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Sin proyectos asociados</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            <p>Cuando asignemos un proyecto a tu cuenta vas a poder ver el detalle completo acá.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
