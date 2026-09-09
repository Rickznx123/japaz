'use client'

import { useEffect, useState } from 'react'
import { MediaUploader, type MediaRecord } from '@/components/MediaUploader'
import { createClient } from '@/lib/supabase/browser'

const slots = [{ key: 'branding.logo', label: 'Logo do header público', context: 'branding/logo' }, { key: 'branding.admin-logo', label: 'Logo do menu administrativo', context: 'branding/logo' }, { key: 'branding.footer-logo', label: 'Logo do Footer', context: 'branding/logo' }, { key: 'branding.logo-dark', label: 'Logo para fundo escuro', context: 'branding/logo' }, { key: 'branding.favicon', label: 'Favicon', context: 'branding/favicon' }]
export default function IdentityPage() {
  const [media, setMedia] = useState<Record<string, MediaRecord | null>>({})
  useEffect(() => { const load = async () => { const supabase = createClient(); if (!supabase) return; const { data } = await supabase.from('site_settings').select('key, value').in('key', slots.map((slot) => slot.key)); const next: Record<string, MediaRecord | null> = {}; for (const row of data ?? []) { if (row.value?.media_id) { const result = await supabase.from('media').select('*').eq('id', row.value.media_id).maybeSingle(); next[row.key] = result.data as MediaRecord | null } } setMedia(next) }; load() }, [])
  async function setSlot(key: string, record: MediaRecord | null) { setMedia({ ...media, [key]: record }); const supabase = createClient(); await supabase?.from('site_settings').upsert({ key, value: { media_id: record?.id ?? null } }, { onConflict: 'key' }) }
  return <div className="admin-narrow"><div className="admin-page-heading compact"><div><p className="admin-eyebrow">MARCA</p><h1>Identidade visual</h1><p>Configure os arquivos institucionais sem procurar em uma biblioteca genérica.</p></div></div><div className="context-media-grid">{slots.map((slot) => <MediaUploader key={slot.key} label={slot.label} context={slot.context} mediaType="branding" slug="site" media={media[slot.key]} onChange={(record) => setSlot(slot.key, record)} />)}</div></div>
}
