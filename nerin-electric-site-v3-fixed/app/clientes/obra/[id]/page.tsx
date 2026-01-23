export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { DB_ENABLED } from '@/lib/dbMode'
import { getSession } from '@/lib/auth'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableCell, TableHead, TableRow } from '@/components/ui/table'

export default async function ClienteObraPage({ params }: { params: { id: string } }) {
  if (!DB_ENABLED) {
    return (
      <div className="space-y-4">
        <Badge>Portal de clientes</Badge>
        <h1>Portal no configurado</h1>
        <p className="text-sm text-slate-600">La base de datos está deshabilitada. Activala para ver obras.</p>
      </div>
    )
  }

  const session = await getSession()
  if (!session?.user?.id) {
    redirect('/clientes/login')
  }

  const project = await prisma.opsProject.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      certificates: { orderBy: { createdAt: 'desc' } },
      additionals: { orderBy: { createdAt: 'desc' } },
      photos: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!project) {
    notFound()
  }

  const canView =
    session.user.role === 'admin' || (session.user.email && project.client.email === session.user.email)
  if (!canView) {
    redirect('/clientes')
  }

  const historyItems = [
    ...project.certificates.map((item) => ({
      type: 'Certificado',
      date: item.createdAt,
      label: `+${item.percentToAdd}% · $${(item.amount / 100).toLocaleString('es-AR')} · ${item.status}`,
    })),
    ...project.additionals.map((item) => ({
      type: 'Adicional',
      date: item.createdAt,
      label: `${item.name} · ${item.quantity} ${item.unit} · $${(item.unitPrice / 100).toLocaleString('es-AR')}`,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <Badge>Portal de clientes</Badge>
        <h1>{project.title}</h1>
        <p className="text-sm text-slate-600">
          Estado: {project.status} · Progreso {project.progressPercent}%
        </p>
        <Button size="sm" variant="secondary" asChild>
          <Link href="/clientes">Volver a mis proyectos</Link>
        </Button>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
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
                  <TableHead></TableHead>
                </TableRow>
              </thead>
              <tbody>
                {project.certificates.map((certificate) => (
                  <TableRow key={certificate.id}>
                    <TableCell>{new Date(certificate.createdAt).toLocaleDateString('es-AR')}</TableCell>
                    <TableCell>+{certificate.percentToAdd}%</TableCell>
                    <TableCell>${(certificate.amount / 100).toLocaleString('es-AR')}</TableCell>
                    <TableCell>
                      <Badge className="bg-slate-100 text-slate-600">{certificate.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {certificate.status === 'PENDING_PAYMENT' && certificate.mercadoPagoInitPoint ? (
                        <Button size="sm" variant="secondary" asChild>
                          <a href={certificate.mercadoPagoInitPoint} target="_blank" rel="noreferrer">
                            Pagar
                          </a>
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-500">{certificate.status === 'PAID' ? 'Pagado' : ''}</span>
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
            <CardTitle>Adicionales</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <thead>
                <TableRow>
                  <TableHead>Adicional</TableHead>
                  <TableHead>Detalle</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </thead>
              <tbody>
                {project.additionals.map((additional) => (
                  <TableRow key={additional.id}>
                    <TableCell>{additional.name}</TableCell>
                    <TableCell>
                      {additional.quantity} {additional.unit} · $
                      {(additional.unitPrice / 100).toLocaleString('es-AR')}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-slate-100 text-slate-600">{additional.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {additional.status !== 'PAID' && additional.mercadoPagoInitPoint ? (
                        <Button size="sm" variant="secondary" asChild>
                          <a href={additional.mercadoPagoInitPoint} target="_blank" rel="noreferrer">
                            Pagar
                          </a>
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-500">{additional.status === 'PAID' ? 'Pagado' : ''}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fotos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            {project.photos.length ? (
              project.photos.map((photo) => (
                <div key={photo.id} className="rounded-xl border border-border p-4">
                  <p className="font-semibold text-foreground">{photo.title || 'Sin título'}</p>
                  <p className="text-xs text-slate-500">{photo.url}</p>
                  {photo.takenAt && (
                    <p className="text-xs text-slate-500">
                      Tomada: {new Date(photo.takenAt).toLocaleDateString('es-AR')}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p>No hay fotos cargadas.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            {historyItems.length ? (
              historyItems.map((item, index) => (
                <div key={`${item.type}-${index}`} className="rounded-xl border border-border p-4">
                  <p className="font-semibold text-foreground">{item.type}</p>
                  <p>{item.label}</p>
                  <p className="text-xs text-slate-500">{item.date.toLocaleDateString('es-AR')}</p>
                </div>
              ))
            ) : (
              <p>Sin movimientos recientes.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
