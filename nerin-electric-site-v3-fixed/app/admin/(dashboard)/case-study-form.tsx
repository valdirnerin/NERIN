'use client'

import { useFormState } from 'react-dom'

import { upsertCaseStudy } from '../actions'
import { initialCaseStudyState } from '../constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function CaseStudyForm() {
  const [state, formAction] = useFormState(upsertCaseStudy, initialCaseStudyState)

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="case-titulo">Título</Label>
        <Input id="case-titulo" name="titulo" required />
      </div>
      <p className="text-xs text-slate-500">El slug se genera automáticamente a partir del título.</p>
      <div className="grid gap-2">
        <Label htmlFor="case-resumen">Resumen</Label>
        <Textarea id="case-resumen" name="resumen" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="case-contenido">Contenido</Label>
        <Textarea id="case-contenido" name="contenido" rows={6} required />
      </div>
      <Button type="submit">Publicar caso</Button>
      {state.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : state.success ? (
        <p className="text-sm text-emerald-600">Caso de éxito guardado correctamente.</p>
      ) : null}
    </form>
  )
}
