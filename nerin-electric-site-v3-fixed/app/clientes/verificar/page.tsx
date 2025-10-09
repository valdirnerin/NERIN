import { Badge } from '@/components/ui/badge'

export default function VerificarPage() {
  return (
    <div className="mx-auto max-w-md space-y-4 text-center">
      <Badge>Portal de clientes</Badge>
      <h1>Revisá tu correo</h1>
      <p className="text-sm text-slate-600">
        Te enviamos un enlace seguro para ingresar. Si no lo encontrás, revisá la carpeta de spam o escribinos a
        hola@nerin.com.ar.
      </p>
    </div>
  )
}
