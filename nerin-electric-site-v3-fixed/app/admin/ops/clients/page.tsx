export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/db'
import { DB_ENABLED } from '@/lib/dbMode'
import { createOpsClient } from '../actions'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableCell, TableHead, TableRow } from '@/components/ui/table'

export default async function AdminOpsClientsPage() {
  if (!DB_ENABLED) {
    return (
      <div className="space-y-4">
        <Badge>Admin operativo</Badge>
        <h1>DB no configurada</h1>
        <p className="text-sm text-slate-600">La base de datos está deshabilitada. Activala para gestionar clientes.</p>
      </div>
    )
  }

  const clients = await prisma.opsClient.findMany({
    orderBy: { createdAt: 'desc' },
    include: { projects: true },
  })

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <Badge>Admin operativo</Badge>
        <h1>Clientes</h1>
        <p className="text-sm text-slate-600">Creá y administrá clientes operativos.</p>
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
                  <TableHead>Cliente</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Proyectos</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.projects.length}</TableCell>
                    <TableCell>
                      <Button variant="secondary" size="sm" asChild>
                        <Link href={`/admin/ops/clients/${client.id}`}>Ver</Link>
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
            <CardTitle>Nuevo cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createOpsClient} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="client-name">Nombre</Label>
                <Input id="client-name" name="name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client-email">Email</Label>
                <Input id="client-email" name="email" type="email" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client-phone">Teléfono</Label>
                <Input id="client-phone" name="phone" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client-company">Empresa</Label>
                <Input id="client-company" name="companyName" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client-cuit">CUIT</Label>
                <Input id="client-cuit" name="cuit" />
              </div>
              <Button type="submit">Crear cliente</Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
