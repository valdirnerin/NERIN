import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const resource = searchParams.get('resource')

  if (resource === 'proyectos') {
    const projects = await prisma.project.findMany({
      include: { client: { include: { user: true } }, progressCertificates: true },
    })
    const header = 'Proyecto,Cliente,Estado,Porcentaje Avance,Dirección\n'
    const rows = projects
      .map((project) => {
        const porcentaje = project.progressCertificates?.reduce((acc, cert) => acc + cert.porcentaje, 0) ?? 0
        return `${project.nombre},${project.client?.user?.name ?? ''},${project.estado},${porcentaje},${project.direccion}`
      })
      .join('\n')
    const csv = header + rows
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="nerin-proyectos.csv"',
      },
    })
  }

  return NextResponse.json({ error: 'Recurso no soportado' }, { status: 400 })
}
