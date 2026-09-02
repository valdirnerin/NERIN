export const dynamic = 'force-dynamic'

import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { closeOpsWork, createOpsAdditional, recordOpsFieldEvent, startOpsWork, updateOpsMaterialConfirmation, uploadOpsEvidence } from '@/app/(admin)/admin/(shell)/ops/actions'

const statusLabel: Record<string, string> = { ASSIGNED: 'Asignado', IN_PROGRESS: 'En ejecución', BLOCKED: 'Impedimento', FOLLOW_UP: 'Segunda visita', COMPLETED: 'Finalizado' }
const approvalLabel: Record<string, string> = { PENDING: 'Pendiente de aprobación', APPROVED: 'Aprobado', REJECTED: 'Rechazado' }
const date = (value: Date | null) => value ? new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'short' }).format(value) : 'A coordinar'

export default async function TecnicoObraPage({ params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session?.user || !['admin', 'tecnico'].includes(session.user.role ?? '')) redirect('/clientes/login')
  const project = await prisma.opsProject.findUnique({
    where: { id: params.id },
    include: { client: true, additionals: { orderBy: { createdAt: 'desc' } }, materials: { orderBy: { createdAt: 'asc' } }, photos: { orderBy: { createdAt: 'desc' } }, events: { orderBy: { createdAt: 'desc' } } },
  })
  if (!project) notFound()
  const catalog = await prisma.additionalCatalogItem.findMany({ where: { active: true }, orderBy: { name: 'asc' } })
  const mapsUrl = project.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([project.address, project.city].filter(Boolean).join(', '))}` : null
  const completed = project.operationalStatus === 'COMPLETED'
  return <main className="mx-auto max-w-2xl space-y-4 px-4 py-5 pb-16 sm:py-8">
    <header className="sticky top-0 z-10 -mx-4 border-b bg-white/95 px-4 py-3 backdrop-blur">
      <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Orden #{project.id.slice(-6).toUpperCase()}</p><h1 className="text-xl font-bold text-slate-950">{project.title}</h1></div><Badge>{statusLabel[project.operationalStatus] || project.operationalStatus}</Badge></div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600"><span>{date(project.scheduledAt)}</span><span>{project.estimatedDuration ? `${project.estimatedDuration} min estimados` : 'Duración a confirmar'}</span><span>{project.city || 'Zona a confirmar'}</span><span>{project.status}</span></div>
    </header>

    {!completed && project.operationalStatus === 'ASSIGNED' && <form action={startOpsWork}><input type="hidden" name="projectId" value={project.id}/><Button className="w-full" type="submit">Iniciar trabajo</Button></form>}

    <Card><CardHeader><CardTitle>1. Llegada y contacto</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><p className="font-medium">{project.address || 'Dirección pendiente'}{project.city ? ` · ${project.city}` : ''}</p>{mapsUrl && <Button asChild className="w-full" variant="outline"><a href={mapsUrl} target="_blank" rel="noreferrer">Abrir navegación</a></Button>}<div className="rounded-lg bg-slate-50 p-3"><p className="font-medium">{project.contactName || project.client.name}</p>{(project.contactPhone || project.client.phone) && <a className="text-blue-700 underline" href={`tel:${project.contactPhone || project.client.phone}`}>{project.contactPhone || project.client.phone}</a>}<p className="mt-2 text-slate-600">{project.accessInstructions || 'Sin instrucciones de acceso cargadas.'}</p></div></CardContent></Card>

    <Card><CardHeader><CardTitle>2. Qué hay que hacer</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><p className="whitespace-pre-wrap">{project.scope || project.notes || 'El alcance aún no fue cargado.'}</p></CardContent></Card>

    <Card><CardHeader><CardTitle>3. Materiales</CardTitle></CardHeader><CardContent className="space-y-3">{project.materials.length ? project.materials.map(m => <div key={m.id} className="rounded-xl border p-3 text-sm"><div className="flex justify-between gap-2"><div><p className="font-semibold">{m.name}</p><p className="text-slate-600">{m.quantity} {m.unit}{m.brandModel ? ` · ${m.brandModel}` : ''}{m.sku ? ` · SKU ${m.sku}` : ''}</p>{m.technicalInfo && <p className="mt-1 text-xs text-slate-500">{m.technicalInfo}</p>}</div>{m.imageUrl && <img className="h-12 w-12 rounded object-cover" src={m.imageUrl} alt=""/>}</div>{!m.confirmedAt ? <form className="mt-2" action={updateOpsMaterialConfirmation}><input type="hidden" name="projectId" value={project.id}/><input type="hidden" name="materialId" value={m.id}/><Button size="sm" variant="outline">Confirmar disponible</Button></form> : <p className="mt-2 text-xs font-medium text-emerald-700">Confirmado{m.usedAt ? ' y utilizado' : ''}</p>}</div>) : <p className="text-sm text-slate-500">No hay materiales cargados para esta orden.</p>}</CardContent></Card>

    <Card><CardHeader><CardTitle>4. Adicionales o problemas</CardTitle></CardHeader><CardContent className="space-y-5"><form action={createOpsAdditional} className="grid gap-3"><input type="hidden" name="projectId" value={project.id}/><input type="hidden" name="returnTo" value={`/tecnico/obra/${project.id}`}/><input type="hidden" name="requestedBy" value={session.user.name || session.user.email || 'tecnico'}/><label className="text-sm font-medium">Trabajo del catálogo (opcional)<select name="catalogItemId" className="mt-1 w-full rounded-md border p-2"><option value="">Otro adicional</option>{catalog.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}</select></label><Input name="name" placeholder="Qué encontraste / qué hay que hacer"/><div className="grid grid-cols-2 gap-2"><Input type="number" name="quantity" defaultValue="1" min="0.1" step="0.1"/><Input name="unit" placeholder="Unidad" defaultValue="unidad"/></div><Input type="number" name="unitPrice" min="1" step="0.01" placeholder="Precio si no elegís catálogo"/><Textarea name="description" placeholder="Detalle técnico"/><Input type="file" name="evidenceFile" accept="image/*,application/pdf"/><Button type="submit" variant="outline">Solicitar adicional</Button></form><div className="space-y-2">{project.additionals.map(a => <div className="rounded-lg bg-slate-50 p-3 text-sm" key={a.id}><p className="font-semibold">{a.name}</p><p className="text-slate-600">{a.quantity} {a.unit} · {approvalLabel[a.approvalStatus] || a.approvalStatus}</p></div>)}</div><details className="rounded-lg border p-3"><summary className="cursor-pointer font-medium">Registrar impedimento o segunda visita</summary><form action={recordOpsFieldEvent} className="mt-3 grid gap-2"><input type="hidden" name="projectId" value={project.id}/><select name="type" className="rounded-md border p-2"><option value="IMPEDIMENT">Impedimento</option><option value="SECOND_VISIT">Solicitar segunda visita</option></select><Textarea name="detail" required placeholder="Contá qué pasó y qué se necesita"/><Button type="submit" variant="outline">Guardar</Button></form></details></CardContent></Card>

    <Card><CardHeader><CardTitle>5. Evidencias</CardTitle></CardHeader><CardContent><form action={uploadOpsEvidence} className="flex flex-col gap-3 sm:flex-row"><input type="hidden" name="projectId" value={project.id}/><Input type="file" name="file" accept="image/*,application/pdf" required/><Button type="submit">Guardar evidencia</Button></form>{project.photos.length > 0 && <p className="mt-3 text-xs text-slate-500">{project.photos.length} evidencia(s) registrada(s).</p>}</CardContent></Card>

    <Card><CardHeader><CardTitle>6. Cierre técnico</CardTitle></CardHeader><CardContent>{completed ? <p className="text-sm text-emerald-700">Trabajo cerrado el {date(project.closedAt)}. Conformidad: {project.closureSignedBy}.</p> : <form action={closeOpsWork} className="grid gap-3"><input type="hidden" name="projectId" value={project.id}/><Textarea name="closureNotes" required placeholder="Resumen del trabajo realizado, pruebas y pendientes"/><Input name="signedBy" required placeholder="Nombre de quien da conformidad"/><Button type="submit">Cerrar trabajo</Button></form>}</CardContent></Card>
  </main>
}
