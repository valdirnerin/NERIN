export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/db'
import { DB_ENABLED } from '@/lib/dbMode'
import { isMissingTableError } from '@/lib/prisma-errors'
import { createAdditionalCatalogItem } from './actions'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default async function AdminOpsDashboard() {
  if (!DB_ENABLED) {
    return (
      <div className="space-y-4">
        <Badge>Admin operativo</Badge>
        <h1>DB no configurada</h1>
        <p className="text-sm text-slate-600">La base de datos está deshabilitada. Activala para gestionar operaciones.</p>
      </div>
    )
  }

  let clients = 0
  let projects = 0
  let certificates = 0
  let additionals = 0

  try {
    ;[clients, projects, certificates, additionals] = await Promise.all([
      prisma.opsClient.count(),
      prisma.opsProject.count(),
      prisma.opsProgressCertificate.count(),
      prisma.opsProjectAdditionalItem.count(),
    ])
  } catch (error) {
    if (isMissingTableError(error)) {
      console.warn('[DB] Missing ops tables, rendering empty admin operativo dashboard.')
      return (
        <div className="space-y-4">
          <Badge>Admin operativo</Badge>
          <h1>DB no inicializada</h1>
          <p className="text-sm text-slate-600">
            La base de datos todavía no está lista. Ejecutá la inicialización y recargá para empezar a operar.
          </p>
        </div>
      )
    }
    throw error
  }

  const mpConfigured = Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN && process.env.PUBLIC_BASE_URL)

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <Badge>Admin operativo</Badge>
        <h1>Operación de obra</h1>
        <p className="text-sm text-slate-600">
          Gestioná clientes, obras, certificados y adicionales sin afectar el CMS existente.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button variant="outline" asChild>
            <Link href="/admin/ops/clients">Clientes</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/ops/projects">Proyectos</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/ops/certificates">Certificados</Link>
          </Button>
        </div>
        {!mpConfigured && (
          <p className="text-xs text-amber-600">
            Mercado Pago no está configurado. Definí MERCADOPAGO_ACCESS_TOKEN y PUBLIC_BASE_URL para generar links de pago.
          </p>
        )}
      </header>

      <section className="grid gap-4 text-sm text-slate-600 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Clientes</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-foreground">{clients}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Proyectos</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-foreground">{projects}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Certificados</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-foreground">{certificates}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Adicionales</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-foreground">{additionals}</CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nuevo adicional de catálogo</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createAdditionalCatalogItem} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="catalog-name">Nombre</Label>
                <Input id="catalog-name" name="name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="catalog-description">Descripción</Label>
                <Textarea id="catalog-description" name="description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="catalog-unit">Unidad</Label>
                  <Input id="catalog-unit" name="unit" required />
                </div>
                <div>
                  <Label htmlFor="catalog-price">Precio mano de obra (ARS)</Label>
                  <Input id="catalog-price" name="laborUnitPrice" type="number" step="0.01" required />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" name="active" defaultChecked />
                Activo
              </label>
              <Button type="submit">Agregar adicional</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accesos rápidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>
              Seguimiento de certificados →{' '}
              <Link className="text-accent" href="/admin/ops/certificates">
                Ver certificados
              </Link>
            </p>
            <p>
              Gestión de clientes →{' '}
              <Link className="text-accent" href="/admin/ops/clients">
                Administrar clientes
              </Link>
            </p>
            <p>
              Tablero de proyectos →{' '}
              <Link className="text-accent" href="/admin/ops/projects">
                Ver proyectos
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
