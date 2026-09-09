import { createClient } from '@/lib/supabase/server'

type HeroSettings = { logo?: string; title?: string; subtitle?: string; description?: string; button?: string; imageMediaId?: string | null; secondaryImageMediaId?: string | null; decorativeImageMediaId?: string | null; imageUrl?: string | null; secondaryImageUrl?: string | null; decorativeImageUrl?: string | null }
type UpdatedSettings = { title?: string; description?: string; complement?: string; imageMediaId?: string | null; imageUrl?: string | null }
type FooterSettings = { company?: string; primary?: string; secondary?: string; instagram?: string; whatsapp?: string; address?: string; hours?: string; copyright?: string; logoUrl?: string | null }
type BrandingSettings = { logoUrl?: string | null; adminLogoUrl?: string | null; footerLogoUrl?: string | null; logoDarkUrl?: string | null; faviconUrl?: string | null }
export type PublicSettings = { hero: HeroSettings; updated: UpdatedSettings; footer: FooterSettings; branding: BrandingSettings }

const fallback: PublicSettings = { hero: {}, updated: {}, footer: {}, branding: {} }
export async function getPublicSettings(): Promise<PublicSettings> {
  const supabase = createClient()
  if (!supabase) return fallback
  const keys = ['landing.hero', 'landing.updated', 'footer', 'branding.logo', 'branding.admin-logo', 'branding.footer-logo', 'branding.logo-dark', 'branding.favicon']
  const { data, error } = await supabase.from('site_settings').select('key, value').in('key', keys)
  if (error) throw new Error('Não foi possível carregar as configurações públicas.')
  if (!data) return fallback
  const ids = { logo: '', adminLogo: '', footerLogo: '', dark: '', favicon: '' }
  const settings = data.reduce((result, row) => {
    if (row.key === 'landing.hero') result.hero = row.value as HeroSettings
    if (row.key === 'landing.updated') result.updated = row.value as UpdatedSettings
    if (row.key === 'footer') result.footer = row.value as FooterSettings
    if (row.key === 'branding.logo') ids.logo = row.value?.media_id || ''
    if (row.key === 'branding.admin-logo') ids.adminLogo = row.value?.media_id || ''
    if (row.key === 'branding.footer-logo') ids.footerLogo = row.value?.media_id || ''
    if (row.key === 'branding.logo-dark') ids.dark = row.value?.media_id || ''
    if (row.key === 'branding.favicon') ids.favicon = row.value?.media_id || ''
    return result
  }, { ...fallback })
  const mediaIds = [...Object.values(ids), settings.hero.imageMediaId, settings.hero.secondaryImageMediaId, settings.hero.decorativeImageMediaId, settings.updated.imageMediaId].filter(Boolean) as string[]
  if (mediaIds.length) {
    const { data: media } = await supabase.from('media').select('id, url').in('id', mediaIds)
    const urls = new Map((media ?? []).map((item) => [item.id, item.url]))
    settings.branding.logoUrl = urls.get(ids.logo) || null
    settings.branding.adminLogoUrl = urls.get(ids.adminLogo) || null
    settings.branding.footerLogoUrl = urls.get(ids.footerLogo) || null
    settings.branding.logoDarkUrl = urls.get(ids.dark) || null
    settings.branding.faviconUrl = urls.get(ids.favicon) || null
    settings.hero.imageUrl = urls.get(settings.hero.imageMediaId || '') || null
    settings.hero.secondaryImageUrl = urls.get(settings.hero.secondaryImageMediaId || '') || null
    settings.hero.decorativeImageUrl = urls.get(settings.hero.decorativeImageMediaId || '') || null
    settings.updated.imageUrl = urls.get(settings.updated.imageMediaId || '') || null
  }
  return settings
}
