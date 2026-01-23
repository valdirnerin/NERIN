export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { DB_ENABLED } from '@/lib/dbMode'
import { createOpsProject, updateOpsClient } from '../../actions'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableCell, TableHead, TableRow } from '@/components/ui/table'

export default async function AdminOpsClientDetail({ params }: { params: { id: string } }) {
  if (!DB_ENABLED) {
    return (
      <div className="space-y-4">
        <Badge>Admin operativo</Badge>
        <h1>DB no configurada</h1>
        <p className="text-sm text-slate-600">La base de datos está deshabilitada.</p>
      </div>
    )
  }

  const client = await prisma.opsClient.findUnique({
    where: { id: params.id },
    include: { projects: true },
  })

  if (!client) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <Badge>Admin operativo</Badge>
        <h1>{client.name}</h1>
        <p className="text-sm text-slate-600">{client.email}</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Editar cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateOpsClient} className="grid gap-4">
              <input type="hidden" name="id" value={client.id} />
              <div className="grid gap-2">
                <Label htmlFor="client-name">Nombre</Label>
                <Input id="client-name" name="name" defaultValue={client.name} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client-email">Email</Label>
                <Input id="client-email" name="email" type="email" defaultValue={client.email} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client-phone">Teléfono</Label>
                <Input id="client-phone" name="phone" defaultValue={client.phone ?? ''} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client-company">Empresa</Label>
                <Input id="client-company" name="companyName" defaultValue={client.companyName ?? ''} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client-cuit">CUIT</Label>
                <Input id="client-cuit" name="cuit" defaultValue={client.cuit ?? ''} />
              </div>
              <Button type="submit">Guardar cambios</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nuevo proyecto</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createOpsProject} className="grid gap-4">
              <input type="hidden" name="clientId" value={client.id} />
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

      <Card>
        <CardHeader>
          <CardTitle>Proyectos del cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <thead>
              <TableRow>
                <TableHead>Proyecto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </thead>
            <tbody>
              {client.projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.title}</TableCell>
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
    </div>
  )
}
