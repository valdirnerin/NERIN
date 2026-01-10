import { redirect } from 'next/navigation'
import { submitContact } from './actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { getSiteContent, getWhatsappHref } from '@/lib/site-content'
import { AttributionFields } from '@/components/tracking/AttributionFields'

export const revalidate = 60
export const dynamic = 'force-dynamic'

export default async function ContactoPage({
  searchParams,
}: {
  searchParams?: { enviado?: string; motivo?: string }
}) {
  const site = await getSiteContent()
  const whatsappHref = getWhatsappHref(site)
  const motivo = searchParams?.motivo ?? ''

  async function action(formData: FormData) {
    'use server'
    await submitContact(formData)
    redirect('/contacto?enviado=1')
  }

  return (
    <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-8">
        <Badge>Contacto</Badge>
        <h1>{site.contactPage.introTitle}</h1>
        <p className="text-lg text-slate-600">{site.contactPage.introDescription}</p>
        {searchParams?.enviado === '1' && (
          <p className="rounded-2xl border border-accent/30 bg-accent/10 p-4 text-sm text-slate-700">
            ¡Listo! Recibimos tu consulta. Te contactamos por mail dentro de las próximas 24 horas hábiles.
          </p>
        )}
        <form action={action} className="space-y-6 rounded-3xl border border-border bg-white p-8 shadow-subtle">
          <AttributionFields />
          <input type="hidden" name="reason" value={motivo} />
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
              <Input name="servicio" id="servicio" defaultValue={motivo} placeholder="Ej: Tableros + CCTV" required />
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
            También podés usar nuestro{' '}
            <a
              className="underline"
              href={site.contactPage.typeformUrl}
              target="_blank"
              rel="noreferrer"
            >
              Typeform
            </a>{' '}
            si preferís completar desde el celular.
          </p>
        </form>
      </div>
      <aside className="space-y-6 rounded-3xl border border-border bg-white p-8 shadow-subtle">
        <h2>¿Por qué elegir NERIN?</h2>
        <ul className="space-y-3 text-sm text-slate-600">
          {site.contactPage.highlightBullets.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
        <div className="rounded-2xl bg-muted p-6 text-sm text-slate-600">
          <p className="font-semibold text-foreground">WhatsApp directo</p>
          <p>{site.contact.whatsappNumber}</p>
          <p className="mt-3 font-semibold text-foreground">Correo</p>
          <p>{site.contact.email}</p>
          <p className="mt-3 font-semibold text-foreground">Oficina técnica</p>
          <p>{site.contact.address}</p>
          <p className="mt-3 font-semibold text-foreground">Horarios</p>
          <p>{site.contact.schedule}</p>
          <p className="mt-3 font-semibold text-foreground">Área de cobertura</p>
          <p>{site.contact.serviceArea}</p>
          {site.contact.secondaryPhones.length > 0 && (
            <div className="mt-3">
              <p className="font-semibold text-foreground">Teléfonos alternativos</p>
              <ul className="mt-1 space-y-1">
                {site.contact.secondaryPhones.map((phone) => (
                  <li key={phone}>{phone}</li>
                ))}
              </ul>
            </div>
          )}
          <Button asChild size="sm" variant="secondary" className="mt-4">
            <a href={whatsappHref} target="_blank" rel="noreferrer">
              Iniciar conversación
            </a>
          </Button>
        </div>
      </aside>
    </div>
  )
}
