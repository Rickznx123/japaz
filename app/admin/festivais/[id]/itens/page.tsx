import { notFound } from 'next/navigation'
import { getAdminFestivals } from '@/lib/catalog'
import { AdminItemsClient } from '@/components/AdminItemsClient'

export default async function FestivalItemsPage({ params }: { params: { id: string } }) {
  const festivals = await getAdminFestivals()
  const festival = festivals.find((item) => item.slug === params.id || item.id === params.id)
  if (!festival) notFound()
  return <AdminItemsClient festival={festival} />
}
