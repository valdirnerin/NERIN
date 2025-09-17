export default function Footer(){
  return (
    <footer className="mt-16 border-t border-black">
      <div className="container py-6 text-sm flex items-center justify-between">
        <p>© {new Date().getFullYear()} NERIN · Ingeniería Eléctrica</p>
        <p><a className="nav-link" href="/contacto">Escribinos</a></p>
      </div>
    </footer>
  )
}
