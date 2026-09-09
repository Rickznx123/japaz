'use client'

import { useMemo, useState } from 'react'
import { Eye, Trash2 } from 'lucide-react'
import type { MediaRecord } from '@/components/MediaUploader'
import { createClient } from '@/lib/supabase/browser'

export function MediaLibraryClient({ initialMedia }: { initialMedia: MediaRecord[] }) {
  const [filter, setFilter] = useState('all')
  const [media, setMedia] = useState(initialMedia)
  const [message, setMessage] = useState('')
  const filtered = useMemo(() => filter === 'all' ? media : media.filter((item) => item.media_type === filter), [filter, media])
  async function remove(item: MediaRecord) {
    const supabase = createClient()
    if (!supabase) return setMessage('Configure o Supabase para excluir.')
    const [festival, gallery, menu, settings] = await Promise.all([
      supabase.from('festivals').select('name').eq('cover_media_id', item.id).maybeSingle(),
      supabase.from('festival_images').select('festival_id, festivals(name)').eq('media_id', item.id).maybeSingle(),
      supabase.from('festival_items').select('name, festival_categories(name, festivals(name))').eq('media_id', item.id).maybeSingle(),
      supabase.from('site_settings').select('key,value'),
    ])
    const settingUse = (settings.data ?? []).find((row) => row.value?.media_id === item.id)
    const usage = item.uses?.length ? `\n\nUso: ${item.uses.join(' · ')}` : festival.data?.name ? `\n\nUso: ${festival.data.name} → Capa` : gallery.data ? '\n\nUso: Galeria de festival' : menu.data ? '\n\nUso: Item do cardápio' : settingUse ? `\n\nUso: ${settingUse.key}` : ''
    if (usage && !confirm(`Esta imagem está sendo utilizada.${usage}\n\nDeseja realmente excluir?`)) return
    if (!usage && !confirm(`Tem certeza que deseja excluir ${item.file_name}?`)) return
    const result = await supabase.from('media').delete().eq('id', item.id)
    if (result.error) return setMessage('Esta imagem está sendo utilizada. Remova o vínculo primeiro.')
    await supabase.storage.from('japaz-media').remove([item.storage_path])
    setMedia(media.filter((current) => current.id !== item.id)); setMessage('Imagem excluída ✓')
  }
  const filters = [['all', 'Todas'], ['branding', 'Identidade visual'], ['landing', 'Landing Page'], ['festival', 'Festivais'], ['item', 'Itens'], ['uncategorized', 'Sem categoria']]
  return <div className="admin-narrow"><div className="admin-page-heading compact"><div><p className="admin-eyebrow">MÍDIA</p><h1>Biblioteca de mídia</h1><p>Consulte imagens por contexto. Para alterar, entre no conteúdo correspondente.</p></div></div>{message && <p className="admin-save-message">{message}</p>}<div className="media-filters">{filters.map(([value, label]) => <button key={value} className={filter === value ? 'active' : ''} onClick={() => setFilter(value)}>{label}</button>)}</div>{filtered.length === 0 ? <div className="admin-empty">Nenhuma imagem neste contexto.</div> : <div className="media-library-grid">{filtered.map((item) => <article className="media-library-card" key={item.id}><div style={{ backgroundImage: `url(${item.url})` }} /><strong>{item.file_name}</strong><small>{item.media_type} · {item.file_size ? `${Math.round(item.file_size / 1024)} KB` : 'tamanho indisponível'}</small><small>{item.uses?.length ? item.uses.join(' · ') : item.context_key || 'Sem vínculo'}</small><div><a href={item.url} target="_blank" rel="noreferrer"><Eye size={15} /> Visualizar</a><button onClick={() => remove(item)}><Trash2 size={15} /> Excluir</button></div></article>)}</div>}</div>
}
