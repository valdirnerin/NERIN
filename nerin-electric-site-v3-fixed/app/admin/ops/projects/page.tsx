export const dynamic = 'force-dynamic'

import Link from 'next/link'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { DB_ENABLED } from '@/lib/dbMode'
import { isMissingTableError } from '@/lib/prisma-errors'
import { createOpsProject } from '../actions'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableCell, TableHead, TableRow } from '@/components/ui/table'

export default async function AdminOpsProjectsPage() {
  if (!DB_ENABLED) {
    return (
      <div className="space-y-4">
        <Badge>Admin operativo</Badge>
        <h1>DB no configurada</h1>
        <p className="text-sm text-slate-600">La base de datos está deshabilitada.</p>
      </div>
    )
  }

  let projects: Prisma.OpsProjectGetPayload<{ include: { client: true } }>[] = []
  let clients: Awaited<ReturnType<typeof prisma.opsClient.findMany>> = []

  try {
    ;[projects, clients] = await Promise.all([
      prisma.opsProject.findMany({
        orderBy: { createdAt: 'desc' },
        include: { client: true },
      }),
      prisma.opsClient.findMany({ orderBy: { createdAt: 'desc' } }),
    ])
  } catch (error) {
    if (isMissingTableError(error)) {
      console.warn('[DB] Missing ops tables, rendering empty projects list.')
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
        <h1>Proyectos</h1>
        <p className="text-sm text-slate-600">Creá y administrá obras operativas.</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Listado</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <thead>
                <TableRow>
                  <TableHead>Proyecto</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.title}</TableCell>
                    <TableCell>{project.client.name}</TableCell>
                    <TableCell>{project.status}</TableCell>
                    <TableCell>{project.progressPercent}%</TableCell>
                    <TableCell>
                      <Button variant="secondary" size="sm" asChild>
                        <Link href={`/admin/ops/projects/${project.id}`}>Abrir</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nuevo proyecto</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createOpsProject} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="project-client">Cliente</Label>
                <select
                  id="project-client"
                  name="clientId"
                  className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm"
                  required
                >
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-title">Título</Label>
                <Input id="project-title" name="title" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-address">Dirección</Label>
                <Input id="project-address" name="address" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-city">Ciudad</Label>
                <Input id="project-city" name="city" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-area">Superficie (m²)</Label>
                <Input id="project-area" name="areaM2" type="number" step="0.1" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-level">Nivel de electrificación</Label>
                <Input id="project-level" name="electrificationLevel" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-notes">Notas</Label>
                <Textarea id="project-notes" name="notes" />
              </div>
              <Button type="submit">Crear proyecto</Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
