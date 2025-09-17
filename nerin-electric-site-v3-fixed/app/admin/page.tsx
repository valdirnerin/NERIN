import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { readSite } from '@/lib/content'
export const dynamic = 'force-dynamic'
export default async function AdminHome(){
  const session = await getSession()
  if (!session.user || session.user.role !== 'admin') {
    redirect('/admin/login')
  }
  const site = readSite()
  return (
    <div className="py-10">
      <h1 className="text-3xl font-extrabold mb-6">Panel de control</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-2">Ajustes del sitio</h3>
          <p className="text-sm mb-3">Logo, colores, datos de contacto, redes.</p>
          <Link className="btn" href="/admin/site">Editar</Link>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Blog</h3>
          <p className="text-sm mb-3">Artículos en Markdown.</p>
          <Link className="btn" href="/admin/blog">Administrar</Link>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Servicios</h3>
          <p className="text-sm mb-3">Servicios ofrecidos a empresas.</p>
          <Link className="btn" href="/admin/services">Administrar</Link>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Proyectos</h3>
          <p className="text-sm mb-3">Cargar casos reales con imágenes.</p>
          <Link className="btn" href="/admin/projects">Administrar</Link>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Páginas</h3>
          <p className="text-sm mb-3">Nosotros y otras páginas.</p>
          <Link className="btn" href="/admin/pages">Administrar</Link>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Paquetes</h3>
          <p className="text-sm mb-3">Editá planes y precios para empresas.</p>
          <a className="btn" href="/admin/pricing">Administrar</a>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Media</h3>
          <p className="text-sm mb-3">Subí imágenes y obtené URL pública.</p>
          <a className="btn" href="/admin/media">Abrir</a>
        </div>
              <div className="card">
          <h3 className="font-semibold mb-2">Calculadora</h3>
          <p className="text-sm mb-3">Editá ítems y precios usados en la calculadora.</p>
          <a className="btn" href="/admin/calculadora">Administrar</a>
        </div>
      </div>
    </div>
  )
}
