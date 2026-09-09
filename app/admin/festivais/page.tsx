import { getAdminFestivals } from '@/lib/catalog'
import { AdminFestivalsClient } from '@/components/AdminFestivalsClient'

export default async function AdminFestivalsPage() {
  const festivals = await getAdminFestivals()
  return <AdminFestivalsClient initialFestivals={festivals} />
}
