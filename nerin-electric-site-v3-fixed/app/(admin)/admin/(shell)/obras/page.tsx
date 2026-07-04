import { redirect } from 'next/navigation'

export default function RedirectLegacyAdminPage() {
  redirect('/admin/contenido')
}
