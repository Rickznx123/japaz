import { notFound } from 'next/navigation'
import { getPublicFestival } from '@/lib/catalog'
import { getPublicSettings } from '@/lib/site-settings'
import { PublicFestivalPage } from '@/components/PublicFestivalPage'

export const dynamic = 'force-dynamic'

export default async function PublicFestivalRoute({ params }: { params: { slug: string } }) {
  const [result, settings] = await Promise.all([getPublicFestival(params.slug), getPublicSettings()])
  if (!result) notFound()
  return <PublicFestivalPage festival={result.festival} gallery={result.gallery} settings={settings} />
}
