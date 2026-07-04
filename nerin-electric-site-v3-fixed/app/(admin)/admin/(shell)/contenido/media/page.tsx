import { getAdminTechnicalStatus } from '@/lib/admin-technical-status'
import { getMediaLibrary } from '@/lib/media-library'
import { MediaLibraryManager } from './MediaLibraryManager'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AdminMediaPage() {
  const [technicalStatus, media] = await Promise.all([getAdminTechnicalStatus(), getMediaLibrary()])
  return <MediaLibraryManager initialMedia={media} technicalStatus={technicalStatus} />
}
