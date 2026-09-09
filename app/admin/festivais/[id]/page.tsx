'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MediaUploader, type MediaRecord } from '@/components/MediaUploader'
import { createClient } from '@/lib/supabase/browser'

type Festival = { id: string; name: string; slug: string; price: number; image_url: string | null; cover_media_id: string | null }
export default function FestivalEditPage({ params }: { params: { id: string } }) {
  const [festival, setFestival] = useState<Festival | null>(null); const [cover, setCover] = useState<MediaRecord | null>(null); const [message, setMessage] = useState('')
  const router = useRouter()
  useEffect(() => { const load = async () => { const supabase = createClient(); if (!supabase) return; const { data } = await supabase.from('festivals').select('id,name,slug,price,image_url,cover_media_id,cover_media:media!festivals_cover_media_id_fkey(*)').eq('slug', params.id).maybeSingle(); if (data) { const row = data as unknown as Festival & { cover_media?: MediaRecord | null }; setFestival(row); setCover(row.cover_media || null) } }; load() }, [params.id])
  async function changeCover(record: MediaRecord | null) { const supabase = createClient(); if (!supabase || !festival) return; const { data, error } = await supabase.from('festivals').update({ cover_media_id: record?.id ?? null }).eq('id', festival.id).select('id,cover_media_id').single(); if (error || data?.cover_media_id !== (record?.id ?? null)) { setMessage('Não foi possível vincular a capa ao festival.'); return } setCover(record); setMessage('Capa salva ✓'); router.refresh() }
  async function removeCover() { const supabase = createClient(); if (!supabase || !festival) return; const { data, error } = await supabase.from('festivals').update({ cover_media_id: null }).eq('id', festival.id).select('id,cover_media_id').single(); if (error || data?.cover_media_id !== null) { setMessage('Não foi possível remover a capa.'); return } setCover(null); setMessage('Capa removida ✓'); router.refresh() }
  if (!festival) return <div className="admin-empty">Carregando festival...</div>
  return <div className="admin-narrow"><div className="admin-page-heading compact"><div><p className="admin-eyebrow">{festival.name}</p><h1>Editar festival</h1><p>Informações e imagens pertencentes somente a este festival.</p></div></div>{message && <p className="admin-save-message">{message}</p>}<section className="admin-panel"><h2 className="admin-section-title">IMAGEM DE CAPA</h2><p className="admin-field-note">Esta imagem aparece no card do festival na página principal.</p><MediaUploader label="Imagem de capa" context={`festivals/${festival.slug}/cover`} mediaType="festival" slug={festival.slug} media={cover} onChange={changeCover} onRemove={removeCover} /><div className="festival-context-links"><Link href={`/admin/festivais/${festival.slug}/imagens`}>Gerenciar imagens internas →</Link><Link href={`/admin/festivais/${festival.slug}/itens`}>Gerenciar cardápio →</Link></div></section></div>
}
