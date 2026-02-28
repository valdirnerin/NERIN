export const dynamic = 'force-dynamic'

import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { createOpsAdditional } from '@/app/(admin)/admin/(shell)/ops/actions'

export default async function TecnicoObraPage({ params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session?.user || !['admin', 'tecnico'].includes(session.user.role ?? '')) {
    redirect('/clientes/login')
  }

  const project = await prisma.opsProject.findUnique({
    where: { id: params.id },
    include: { additionals: { orderBy: { createdAt: 'desc' } } },
  })

  if (!project) notFound()

  return (
    <div className="space-y-6">
      <header>
        <Badge>Flujo técnico móvil</Badge>
        <h1 className="text-2xl font-semibold">{project.title}</h1>
        <p className="text-sm text-slate-600">Cargá adicionales con trazabilidad y aprobación previa del cliente.</p>
      </header>

      <Card>
        <CardHeader><CardTitle>Registrar adicional en obra</CardTitle></CardHeader>
        <CardContent>
          <form action={createOpsAdditional} className="grid gap-3">
            <input type="hidden" name="projectId" value={project.id} />
            <input type="hidden" name="returnTo" value={`/tecnico/obra/${project.id}`} />
            <input type="hidden" name="requestedBy" value={session.user.name ?? session.user.email ?? 'tecnico'} />
            <div className="grid gap-2"><Label>Tipo de adicional</Label><Input name="name" required /></div>
            <div className="grid gap-2"><Label>Cantidad</Label><Input type="number" name="quantity" defaultValue={1} min={0.1} step={0.1} required /></div>
            <div className="grid gap-2"><Label>Unidad</Label><Input name="unit" defaultValue="unidad" required /></div>
            <div className="grid gap-2"><Label>Precio unitario</Label><Input type="number" name="unitPrice" min={1} step={0.01} required /></div>
            <div className="grid gap-2"><Label>Nota técnica</Label><Textarea name="description" /></div>
            <div className="grid gap-2"><Label>Foto/evidencia URL (opcional)</Label><Input name="evidenceUrl" /></div>
            <Button type="submit">Guardar para aprobación del cliente</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Adicionales registrados</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {project.additionals.map((item) => (
            <div key={item.id} className="rounded-xl border p-3">
              <p className="font-semibold">{item.name}</p>
              <p>{item.quantity} {item.unit} · ${((Number(item.unitPrice) * item.quantity) / 100).toLocaleString('es-AR')}</p>
              <p className="text-xs text-slate-500">Estado: {item.status} · Aprobación: {item.approvalStatus}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
