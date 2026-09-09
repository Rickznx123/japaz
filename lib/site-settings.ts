import { createClient } from '@/lib/supabase/server'

type HeroSettings = { logo?: string; title?: string; subtitle?: string; description?: string; button?: string }
type UpdatedSettings = { title?: string; description?: string; complement?: string }
type FooterSettings = { company?: string; primary?: string; secondary?: string; instagram?: string; whatsapp?: string; address?: string; hours?: string; copyright?: string }
export type PublicSettings = { hero: HeroSettings; updated: UpdatedSettings; footer: FooterSettings }

const fallback: PublicSettings = { hero: {}, updated: {}, footer: {} }
export async function getPublicSettings(): Promise<PublicSettings> {
  const supabase = createClient()
  if (!supabase) return fallback
  const { data, error } = await supabase.from('site_settings').select('key, value').in('key', ['landing.hero', 'landing.updated', 'footer'])
  if (error) throw new Error('Não foi possível carregar as configurações públicas.')
  if (!data) return fallback
  return data.reduce((settings, row) => { if (row.key === 'landing.hero') settings.hero = row.value as HeroSettings; if (row.key === 'landing.updated') settings.updated = row.value as UpdatedSettings; if (row.key === 'footer') settings.footer = row.value as FooterSettings; return settings }, { ...fallback })
}
