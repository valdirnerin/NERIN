'use client'

import { useFormState } from 'react-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createPack, initialPackFormState } from '../actions'

export function PackForm() {
  const [state, formAction] = useFormState(createPack, initialPackFormState)

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input id="nombre" name="nombre" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea id="descripcion" name="descripcion" required />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="bocasIncluidas">Bocas incluidas</Label>
          <Input id="bocasIncluidas" name="bocasIncluidas" type="number" required />
        </div>
        <div>
          <Label htmlFor="ambientesReferencia">Ambientes</Label>
          <Input id="ambientesReferencia" name="ambientesReferencia" type="number" required />
        </div>
        <div>
          <Label htmlFor="precioManoObraBase">Precio mano de obra</Label>
          <Input id="precioManoObraBase" name="precioManoObraBase" type="number" required />
        </div>
      </div>
      <div>
        <Label htmlFor="alcanceDetallado">Alcance (una línea por ítem)</Label>
        <Textarea id="alcanceDetallado" name="alcanceDetallado" required />
      </div>
      <Button type="submit">Crear pack</Button>
      {state.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : state.success ? (
        <p className="text-sm text-emerald-600">Pack guardado correctamente.</p>
      ) : null}
    </form>
  )
}
