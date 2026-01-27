import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminNotFound() {
  return (
    <div className="rounded-3xl border border-border bg-white p-8 text-sm text-slate-600 shadow-subtle">
      <h1 className="text-xl font-semibold text-foreground">Sección no encontrada</h1>
      <p className="mt-2">No pudimos encontrar la pantalla administrativa que buscabas.</p>
      <Button asChild className="mt-6">
        <Link href="/admin">Volver al dashboard</Link>
      </Button>
    </div>
  )
}
