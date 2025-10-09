import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
      <h1>Página no encontrada</h1>
      <p className="text-lg text-slate-600">
        Revisá la URL o volvé al inicio para seguir explorando los servicios eléctricos de NERIN.
      </p>
      <Button asChild>
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  )
}
