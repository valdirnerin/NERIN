import Link from 'next/link'
import { FormSection } from '@/components/admin/ui/FormSection'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <FormSection
        title="Configuración general"
        description="Accesos rápidos para actualizar los textos del sitio, packs y parámetros operativos."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border/60 p-4 text-sm text-slate-600">
            <p className="font-semibold text-foreground">Contenido del sitio</p>
            <p className="mt-1">Actualizá los textos, métricas y secciones públicas.</p>
            <Button asChild className="mt-4" size="sm">
              <Link href="/admin">Editar contenido</Link>
            </Button>
          </div>
          <div className="rounded-2xl border border-border/60 p-4 text-sm text-slate-600">
            <p className="font-semibold text-foreground">Operativo CAC/IVA</p>
            <p className="mt-1">Gestioná certificados y pagos operativos.</p>
            <Button asChild className="mt-4" size="sm" variant="secondary">
              <Link href="/admin/operativo">Abrir operativo</Link>
            </Button>
          </div>
        </div>
      </FormSection>
    </div>
  )
}
