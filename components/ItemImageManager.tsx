'use client'

import { MediaUploader, type MediaRecord } from '@/components/MediaUploader'
import { createClient } from '@/lib/supabase/browser'

export function ItemImageManager({ festivalSlug, itemId, itemName, media, onChange }: { festivalSlug: string; itemId: string; itemName: string; media?: MediaRecord | null; onChange: (media: MediaRecord | null) => void }) {
  async function save(record: MediaRecord | null) { const supabase = createClient(); if (!supabase) return; await supabase.from('festival_items').update({ media_id: record?.id ?? null }).eq('id', itemId); onChange(record) }
  async function remove() { const supabase = createClient(); if (supabase) await supabase.from('festival_items').update({ media_id: null }).eq('id', itemId) }
  return <MediaUploader label={`Imagem · ${itemName}`} context={`items/${festivalSlug}/${itemId}`} mediaType="item" slug={festivalSlug} media={media} onChange={save} onRemove={remove} />
}
