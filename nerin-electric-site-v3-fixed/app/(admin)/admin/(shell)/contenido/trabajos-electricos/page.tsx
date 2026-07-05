import { getElectricalAdminContent } from '@/lib/electrical-admin-content'
import { ElectricalContentManager } from '../../trabajos-electricos/ElectricalContentManager'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AdminContenidoTrabajosElectricosPage() {
  const content = await getElectricalAdminContent()
  return <ElectricalContentManager initialContent={content} />
}
