import { getElectricalAdminContent } from '@/lib/electrical-admin-content'
import { ElectricalContentManager } from './ElectricalContentManager'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AdminTrabajosElectricosPage() {
  const content = await getElectricalAdminContent()
  return <ElectricalContentManager initialContent={content} />
}
