export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const sections = [['Hoy', ['ASSIGNED', 'IN_PROGRESS']], ['Pausados / impedimento', ['BLOCKED', 'FOLLOW_UP']], ['Finalizados', ['COMPLETED']]] as const
export default async function TecnicoPage() { const session = await getSession(); if (!session?.user || !['admin','tecnico'].includes(session.user.role ?? '')) redirect('/clientes/login'); const projects = await prisma.opsProject.findMany({ where: { OR: [{ assignedTo: session.user.name || undefined }, { assignedTo: null }] }, include: { client: true }, orderBy: { scheduledAt: 'asc' } }); return <main className="mx-auto max-w-2xl space-y-6 px-4 py-6"><header><p className="text-sm font-semibold text-slate-500">NERIN Operativo</p><h1 className="text-2xl font-bold">Mis trabajos</h1></header>{sections.map(([title, states]) => { const list = projects.filter(p => states.includes(p.operationalStatus as never)); return <section key={title} className="space-y-3"><h2 className="font-semibold">{title}</h2>{list.length ? list.map(p => <Card key={p.id}><CardHeader><div className="flex justify-between gap-2"><CardTitle className="text-base">{p.title}</CardTitle><Badge>{p.operationalStatus}</Badge></div></CardHeader><CardContent className="space-y-2 text-sm text-slate-600"><p>{p.address || 'Dirección pendiente'}{p.city ? ` · ${p.city}` : ''}</p><p>{p.scheduledAt ? new Intl.DateTimeFormat('es-AR',{dateStyle:'short',timeStyle:'short'}).format(p.scheduledAt) : 'Horario a coordinar'} · {p.estimatedDuration ? `${p.estimatedDuration} min` : 'duración a confirmar'}</p><Button asChild className="w-full"><Link href={`/tecnico/obra/${p.id}`}>{p.operationalStatus === 'IN_PROGRESS' ? 'Continuar trabajo' : 'Ver trabajo'}</Link></Button></CardContent></Card>) : <p className="text-sm text-slate-500">Sin trabajos en esta etapa.</p>}</section>})}</main> }
