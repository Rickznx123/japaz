import { FestivalsPageClient } from '@/components/FestivalsPageClient'
import { getPublicFestivals } from '@/lib/catalog'
import { getPublicSettings } from '@/lib/site-settings'

export const revalidate = 0

export default async function FestivalsPage() {
  const [festivals, settings] = await Promise.all([getPublicFestivals(), getPublicSettings()])
  return <FestivalsPageClient festivals={festivals} settings={settings} />
}
