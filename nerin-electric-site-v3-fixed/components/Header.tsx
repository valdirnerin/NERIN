export default function Header(){
  return (
    <header className="border-b border-black">
      <div className="container py-4 flex items-center justify-between">
        <a className="font-extrabold text-lg nav-link" href="/">NERIN</a>
        <nav className="flex gap-4 text-sm">
          <a className="nav-link" href="/calculadora">Calculadora</a>
          <a className="nav-link" href="/blog">Blog</a>
          <a className="nav-link" href="/contacto">Contacto</a>
          <a className="nav-link" href="/admin">Admin</a>
        </nav>
      </div>
    </header>
  )
}
