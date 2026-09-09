import { festivals as fallbackFestivals, type Festival, type FestivalItem } from '@/data/festivals'
import { createClient } from '@/lib/supabase/server'

type DbItem = { id: string; name: string; description: string; image_url: string | null; subitems: string[] | null; display_order: number; active: boolean }
type DbCategory = { id: string; name: string; display_order: number; active: boolean; festival_items: DbItem[] }
type DbFestival = { id: string; name: string; slug: string; description: string; price: number; price_label: string; image_url: string | null; secondary_image_url: string | null; active: boolean; display_order: number; schedule: string[]; children_info: string[]; rules: string[]; festival_categories: DbCategory[] }

function imageFor(slug: string, imageUrl: string | null) {
  if (imageUrl) return imageUrl
  return fallbackFestivals.find((festival) => festival.id === slug)?.image ?? ''
}

function mapFestival(row: DbFestival): Festival {
  return {
    id: row.slug,
    eyebrow: `${String(row.display_order).padStart(2, '0')} / japaz sushi`,
    name: row.name,
    description: row.description,
    price: row.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    image: imageFor(row.slug, row.image_url),
    imageAlt: row.name,
    accent: row.slug === 'prime' ? '#c9a26a' : row.slug === 'salmao' ? '#ef5c4d' : '#e50909',
    categories: (row.festival_categories ?? []).filter((category) => category.active).sort((a, b) => a.display_order - b.display_order).map((category) => ({
      name: category.name,
      items: (category.festival_items ?? []).filter((item) => item.active).sort((a, b) => a.display_order - b.display_order).map((item): FestivalItem => ({ name: item.name, items: item.subitems ?? undefined })),
    })),
    information: { schedule: row.schedule ?? [], children: row.children_info ?? [], rules: row.rules ?? [] },
  }
}

export async function getPublicFestivals(): Promise<Festival[]> {
  const supabase = createClient()
  if (!supabase) return fallbackFestivals
  const { data, error } = await supabase.from('festivals').select('*, festival_categories(*, festival_items(*))').eq('active', true).order('display_order')
  if (error) throw new Error('Não foi possível carregar o catálogo público.')
  if (!data) return []
  return (data as DbFestival[]).map(mapFestival)
}

export async function getAdminFestivals() {
  const supabase = createClient()
  if (!supabase) return []
  const { data, error } = await supabase.from('festivals').select('*, festival_categories(*, festival_items(*))').order('display_order')
  if (error) throw new Error('Não foi possível carregar os festivais administrativos.')
  return (data ?? []) as DbFestival[]
}
