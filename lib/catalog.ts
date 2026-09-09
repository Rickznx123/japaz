import { festivals as fallbackFestivals, type Festival, type FestivalItem } from '@/data/festivals'
import { createClient } from '@/lib/supabase/server'

type DbMedia = { id: string; url: string; file_name: string; storage_path: string; media_type: string; file_size: number | null; mime_type: string | null; context_key: string | null }
type DbItem = { id: string; name: string; description: string; image_url: string | null; media_id: string | null; media: DbMedia | null; subitems: string[] | null; display_order: number; active: boolean }
type DbCategory = { id: string; name: string; display_order: number; active: boolean; festival_items: DbItem[] }
type DbFestival = { id: string; name: string; slug: string; description: string; price: number; price_label: string; image_url: string | null; secondary_image_url: string | null; cover_media_id: string | null; cover_media: DbMedia | null; active: boolean; display_order: number; schedule: string[]; children_info: string[]; rules: string[]; festival_categories: DbCategory[] }

function imageFor(imageUrl: string | null, mediaId: string | null, mediaUrl?: string | null) {
  if (mediaUrl) return mediaUrl
  if (mediaId) return ''
  if (imageUrl) return imageUrl
  return ''
}

function mapFestival(row: DbFestival): Festival {
  return {
    id: row.slug,
    eyebrow: `${String(row.display_order).padStart(2, '0')} / japaz sushi`,
    name: row.name,
    description: row.description,
    price: row.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    image: imageFor(null, row.cover_media_id, row.cover_media?.url),
    imageAlt: row.name,
    accent: row.slug === 'prime' ? '#c9a26a' : row.slug === 'salmao' ? '#ef5c4d' : '#e50909',
    categories: (row.festival_categories ?? []).filter((category) => category.active).sort((a, b) => a.display_order - b.display_order).map((category) => ({
      name: category.name,
      items: (category.festival_items ?? []).filter((item) => item.active).sort((a, b) => a.display_order - b.display_order).map((item): FestivalItem => ({ name: item.name, items: item.subitems ?? undefined, image: item.media?.url || item.image_url || undefined })),
    })),
    information: { schedule: row.schedule ?? [], children: row.children_info ?? [], rules: row.rules ?? [] },
  }
}

export type PublicGalleryImage = { id: string; title: string; description: string; display_order: number; url: string; active: boolean }

export async function getPublicFestival(slug: string) {
  const supabase = createClient()
  if (!supabase) {
    const fallback = fallbackFestivals.find((festival) => festival.id === slug)
    return fallback ? { festival: fallback, gallery: [] as PublicGalleryImage[] } : null
  }
  const { data, error } = await supabase.from('festivals').select('*, cover_media:media!festivals_cover_media_id_fkey(*), festival_categories(*, festival_items(*, media:media!festival_items_media_id_fkey(*))), festival_images!festival_images_festival_id_fkey(id,title,description,display_order,active,media:media!festival_images_media_id_fkey(url))').eq('slug', slug).eq('active', true).maybeSingle()
  if (error) throw new Error('Não foi possível carregar o festival.')
  if (!data) return null
  const row = data as unknown as DbFestival & { festival_images?: Array<{ id: string; title: string; description: string; display_order: number; active: boolean; media: { url: string } | null }> }
  return { festival: mapFestival(row), gallery: (row.festival_images ?? []).filter((image) => image.active && image.media?.url).sort((a, b) => a.display_order - b.display_order).map((image) => ({ id: image.id, title: image.title, description: image.description, display_order: image.display_order, active: image.active, url: image.media?.url || '' })) }
}

export async function getPublicFestivals(): Promise<Festival[]> {
  const supabase = createClient()
  if (!supabase) return fallbackFestivals
  const { data, error } = await supabase.from('festivals').select('*, cover_media:media!festivals_cover_media_id_fkey(*), festival_categories(*, festival_items(*, media:media!festival_items_media_id_fkey(*)))').eq('active', true).order('display_order')
  if (error) throw new Error('Não foi possível carregar o catálogo público.')
  if (!data) return []
  return (data as DbFestival[]).map(mapFestival)
}

export async function getAdminFestivals() {
  const supabase = createClient()
  if (!supabase) return []
  const { data, error } = await supabase.from('festivals').select('*, cover_media:media!festivals_cover_media_id_fkey(*), festival_categories(*, festival_items(*, media:media!festival_items_media_id_fkey(*)))').order('display_order')
  if (error) throw new Error('Não foi possível carregar os festivais administrativos.')
  return (data ?? []) as DbFestival[]
}
