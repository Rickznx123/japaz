import { createClient } from '@/lib/supabase/server'

export type MediaRecord = { id: string; file_name: string; url: string; storage_path: string; alt_text: string | null; media_type: string; file_size: number | null; mime_type: string | null; context_key: string | null; created_at: string; uses?: string[] }

export async function getMediaById(id: string | null | undefined) {
  if (!id) return null
  const supabase = createClient()
  if (!supabase) return null
  const { data, error } = await supabase.from('media').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error('Não foi possível carregar a imagem.')
  return data as MediaRecord | null
}

export async function getMediaLibrary() {
  const supabase = createClient()
  if (!supabase) return [] as MediaRecord[]
  const [{ data, error }, { data: festivals }, { data: galleries }, { data: items }, { data: settings }] = await Promise.all([
    supabase.from('media').select('*').order('created_at', { ascending: false }),
    supabase.from('festivals').select('id,name,cover_media_id'),
    supabase.from('festival_images').select('media_id,festival_id,festivals(name)'),
    supabase.from('festival_items').select('media_id,name,festival_categories(name,festivals(name))'),
    supabase.from('site_settings').select('key,value'),
  ])
  if (error) throw new Error('Não foi possível carregar a biblioteca de mídia.')
  const uses = new Map<string, string[]>()
  const addUse = (id: string | null, label: string) => { if (!id) return; uses.set(id, [...(uses.get(id) || []), label]) }
  for (const festival of festivals ?? []) addUse(festival.cover_media_id, `${festival.name} → Capa`)
  for (const gallery of galleries ?? []) { const festival = (gallery.festivals as unknown as { name: string } | null); addUse(gallery.media_id, `${festival?.name || 'Festival'} → Galeria`) }
  for (const item of items ?? []) { const category = (item.festival_categories as unknown as { name: string; festivals?: { name: string } | null } | null); addUse(item.media_id, `${category?.festivals?.name || 'Festival'} → ${item.name}`) }
  for (const setting of settings ?? []) if (setting.value?.media_id) addUse(setting.value.media_id, setting.key.replace('branding.', 'Identidade → '))
  return (data ?? []).map((item) => ({ ...item, uses: uses.get(item.id) || [] })) as MediaRecord[]
}
