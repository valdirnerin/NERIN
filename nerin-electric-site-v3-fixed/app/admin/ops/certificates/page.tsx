export const dynamic = 'force-dynamic'

import Link from 'next/link'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { DB_ENABLED } from '@/lib/dbMode'
import { isMissingTableError } from '@/lib/prisma-errors'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableCell, TableHead, TableRow } from '@/components/ui/table'

export default async function AdminOpsCertificatesPage({
  searchParams,
}: {
  searchParams: { projectId?: string; status?: string }
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

  let projects: Awaited<ReturnType<typeof prisma.opsProject.findMany>> = []
  let certificates: Prisma.OpsProgressCertificateGetPayload<{
    include: { project: true }
  }>[] = []

  try {
    ;[projects, certificates] = await Promise.all([
      prisma.opsProject.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.opsProgressCertificate.findMany({
        where: {
          ...(searchParams.projectId ? { projectId: searchParams.projectId } : {}),
          ...(searchParams.status ? { status: searchParams.status as any } : {}),
        },
        orderBy: { createdAt: 'desc' },
        include: { project: true },
      }),
    ])
  } catch (error) {
    if (isMissingTableError(error)) {
      console.warn('[DB] Missing ops tables, rendering empty certificates list.')
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

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <Badge>Admin operativo</Badge>
        <h1>Certificados</h1>
        <p className="text-sm text-slate-600">Seguimiento de certificados de avance y pagos.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-wrap items-end gap-3">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Proyecto</label>
              <select
                name="projectId"
                defaultValue={searchParams.projectId || ''}
                className="h-11 rounded-xl border border-border bg-white px-4 text-sm"
              >
                <option value="">Todos</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Estado</label>
              <select
                name="status"
                defaultValue={searchParams.status || ''}
                className="h-11 rounded-xl border border-border bg-white px-4 text-sm"
              >
                <option value="">Todos</option>
                <option value="DRAFT">DRAFT</option>
                <option value="SENT">SENT</option>
                <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
                <option value="PAID">PAID</option>
                <option value="CANCELED">CANCELED</option>
              </select>
            </div>
            <Button type="submit">Aplicar</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Listado</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <thead>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead>Porcentaje</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </thead>
            <tbody>
              {certificates.map((certificate) => (
                <TableRow key={certificate.id}>
                  <TableCell>{new Date(certificate.createdAt).toLocaleDateString('es-AR')}</TableCell>
                  <TableCell>
                    {(certificate.project as { title?: string; name?: string; nombre?: string } | null)
                      ?.title ??
                      (certificate.project as { title?: string; name?: string; nombre?: string } | null)
                        ?.name ??
                      (certificate.project as { title?: string; name?: string; nombre?: string } | null)
                        ?.nombre ??
                      '-'}
                  </TableCell>
                  <TableCell>
                    +{certificate.percentToAdd}% → {certificate.percentAfter}%
                  </TableCell>
                  <TableCell>${(Number(certificate.amount) / 100).toLocaleString('es-AR')}</TableCell>
                  <TableCell>
                    <Badge className="bg-slate-100 text-slate-600">{certificate.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="secondary" asChild>
                      <Link href={`/admin/ops/projects/${certificate.projectId}`}>Abrir</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
