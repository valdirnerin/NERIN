import { redirect } from 'next/navigation'
import Link from 'next/link'
import { submitContact } from './actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export const revalidate = 60

export default function ContactoPage({ searchParams }: { searchParams?: { enviado?: string } }) {
  async function action(formData: FormData) {
    'use server'
    await submitContact(formData)
    redirect('/contacto?enviado=1')
  }

  return (
    <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-8">
        <Badge>Contacto</Badge>
        <h1>Coordinemos tu obra eléctrica</h1>
        <p className="text-lg text-slate-600">
          Completá el formulario y un técnico senior se contactará dentro de las próximas 24 horas hábiles para
          coordinar visita o reunión virtual.
        </p>
        {searchParams?.enviado === '1' && (
          <p className="rounded-2xl border border-accent/30 bg-accent/10 p-4 text-sm text-slate-700">
            ¡Listo! Recibimos tu consulta. Te contactamos por mail dentro de las próximas 24 horas hábiles.
          </p>
        )}
        <form action={action} className="space-y-6 rounded-3xl border border-border bg-white p-8 shadow-subtle">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="nombre">Nombre y apellido *</Label>
              <Input name="nombre" id="nombre" required placeholder="Ej: Florencia Gómez" />
            </div>
            <div>
              <Label htmlFor="empresa">Empresa / Consorcio</Label>
              <Input name="empresa" id="empresa" placeholder="Ej: Consorcio Lavalle 1200" />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input name="email" id="email" type="email" required placeholder="correo@empresa.com" />
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input name="telefono" id="telefono" required placeholder="11 5555-5555" />
            </div>
            <div>
              <Label htmlFor="cuit">CUIT</Label>
              <Input name="cuit" id="cuit" placeholder="30-XXXXXXXX-X" />
            </div>
            <div>
              <Label htmlFor="direccion">Dirección de la obra</Label>
              <Input name="direccion" id="direccion" placeholder="Calle, número, ciudad" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="servicio">Servicio requerido</Label>
              <Input name="servicio" id="servicio" placeholder="Ej: Tableros + CCTV" required />
            </div>
            <div>
              <Label htmlFor="urgencia">Urgencia</Label>
              <select
                className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                name="urgencia"
                id="urgencia"
                defaultValue="planificado"
                required
              >
                <option value="48hs">48 hs</option>
                <option value="7dias">Dentro de 7 días</option>
                <option value="planificado">Planificado (más de 7 días)</option>
              </select>
            </div>
          </div>
          <div>
            <Label htmlFor="mensaje">Detalle adicional</Label>
            <Textarea
              name="mensaje"
              id="mensaje"
              placeholder="Adjuntá datos de potencia, planos o comentarios relevantes."
            />
          </div>
          <Button type="submit" size="pill">
            Enviar consulta
          </Button>
          <p className="text-xs text-slate-500">
            También podés usar nuestro <Link className="underline" href="https://nerin.typeform.com/to/xxxxx">Typeform</Link>
            {' '}si preferís completar desde el celular.
          </p>
        </form>
      </div>
      <aside className="space-y-6 rounded-3xl border border-border bg-white p-8 shadow-subtle">
        <h2>¿Por qué elegir NERIN?</h2>
        <ul className="space-y-3 text-sm text-slate-600">
          <li>• Equipo propio con ART y seguros vigentes.</li>
          <li>• Certificados de avance con pago online vía Mercado Pago.</li>
          <li>• Reportes fotográficos y checklist digital en cada visita.</li>
          <li>• Trabajo bajo normativa AEA 90364-7-771 (2006).</li>
          <li>• Separación transparente entre mano de obra y materiales.</li>
        </ul>
        <div className="rounded-2xl bg-muted p-6 text-sm text-slate-600">
          <p className="font-semibold text-foreground">WhatsApp directo</p>
          <p>+54 9 11 0000 0000</p>
          <p className="mt-3 font-semibold text-foreground">Correo</p>
          <p>hola@nerin.com.ar</p>
          <p className="mt-3 font-semibold text-foreground">Oficina técnica</p>
          <p>Villa Ortúzar · CABA</p>
        </div>
      </aside>
    </div>
  )
}
