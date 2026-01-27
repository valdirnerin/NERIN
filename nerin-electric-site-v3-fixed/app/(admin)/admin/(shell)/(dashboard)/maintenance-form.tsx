'use client'

import { useFormState } from 'react-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createMaintenance } from '../../actions'
import { initialMaintenanceFormState } from '../constants'

export function MaintenanceForm() {
  const [state, formAction] = useFormState(createMaintenance, initialMaintenanceFormState)

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="plan-nombre">Nombre</Label>
        <Input id="plan-nombre" name="nombre" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="plan-slug">Slug</Label>
        <Input id="plan-slug" name="slug" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="plan-visitas">Visitas mensuales</Label>
          <Input id="plan-visitas" name="visitasMes" type="number" required />
        </div>
        <div>
          <Label htmlFor="plan-precio">Precio mensual</Label>
          <Input id="plan-precio" name="precioMensual" type="number" required />
        </div>
      </div>
      <div>
        <Label htmlFor="plan-incluye">Tareas fijas (una por línea)</Label>
        <Textarea id="plan-incluye" name="incluye" required />
      </div>
      <Button type="submit">Crear plan</Button>
      {state.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : state.success ? (
        <p className="text-sm text-emerald-600">Plan de mantenimiento guardado correctamente.</p>
      ) : null}
    </form>
  )
}
