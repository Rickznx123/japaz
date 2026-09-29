'use client'

import { FormEvent, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { MediaUploader, type MediaRecord } from '@/components/MediaUploader'
import { revalidateLandingContent } from './actions'

const initial = { title: 'FESTIVAIS', subtitle: 'Três experiências. Um só sabor.', description: 'Escolha seu festival e descubra uma nova forma de viver o sushi.', button: 'VER FESTIVAIS', updatedTitle: 'PREÇOS ATUALIZADOS', updatedDescription: 'Nosso cardápio é digital e pode ser atualizado sempre que necessário.', updatedComplement: 'Consulte sempre a versão mais recente.', company: 'JAPAZ SUSHI', footerPrimary: 'TRADIÇÃO JAPONESA • SABOR EM CADA DETALHE', footerSecondary: 'São Paulo · Brasil', copyright: '© Japaz Sushi' }
type LandingMedia = { hero?: MediaRecord | null; secondary?: MediaRecord | null; decorative?: MediaRecord | null; updated?: MediaRecord | null }

export default function LandingAdminPage() {
  const [form, setForm] = useState(initial)
  const [media, setMedia] = useState<LandingMedia>({})
  const [status, setStatus] = useState('')
  useEffect(() => {
    let active = true
    const load = async () => {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase.from('site_settings').select('key,value').in('key', ['landing.hero', 'landing.updated', 'footer'])
      if (!active) return
      const hero = data?.find((row) => row.key === 'landing.hero')?.value || {}
      const updated = data?.find((row) => row.key === 'landing.updated')?.value || {}
      const footer = data?.find((row) => row.key === 'footer')?.value || {}
      const ids = [hero.imageMediaId, hero.secondaryImageMediaId, hero.decorativeImageMediaId, updated.imageMediaId].filter(Boolean) as string[]
      const { data: records } = ids.length ? await supabase.from('media').select('*').in('id', ids) : { data: [] }
      if (!active) return
      const mediaById = new Map((records ?? []).map((record) => [record.id, record as MediaRecord]))
      setForm((current) => ({
        ...current,
        title: hero.title ?? current.title,
        subtitle: hero.subtitle ?? current.subtitle,
        description: hero.description ?? current.description,
        button: hero.button ?? current.button,
        updatedTitle: updated.title ?? current.updatedTitle,
        updatedDescription: updated.description ?? current.updatedDescription,
        updatedComplement: updated.complement ?? current.updatedComplement,
        company: footer.company ?? current.company,
        footerPrimary: footer.primary ?? current.footerPrimary,
        footerSecondary: footer.secondary ?? current.footerSecondary,
        copyright: footer.copyright ?? current.copyright,
      }))
      setMedia({
        hero: mediaById.get(hero.imageMediaId) || null,
        secondary: mediaById.get(hero.secondaryImageMediaId) || null,
        decorative: mediaById.get(hero.decorativeImageMediaId) || null,
        updated: mediaById.get(updated.imageMediaId) || null,
      })
    }
    void load()
    return () => { active = false }
  }, [])
  function setMediaSlot(slot: keyof LandingMedia, record: MediaRecord | null) { setMedia((current) => ({ ...current, [slot]: record })) }
  async function save(event: FormEvent) {
    event.preventDefault()
    const supabase = createClient()
    if (!supabase) return setStatus('Configure as variáveis do Supabase para salvar.')
    const results = await Promise.all([
      supabase.from('site_settings').upsert({ key: 'landing.hero', value: { title: form.title, subtitle: form.subtitle, description: form.description, button: form.button, imageMediaId: media.hero?.id || null, secondaryImageMediaId: media.secondary?.id || null, decorativeImageMediaId: media.decorative?.id || null } }, { onConflict: 'key' }),
      supabase.from('site_settings').upsert({ key: 'landing.updated', value: { title: form.updatedTitle, description: form.updatedDescription, complement: form.updatedComplement, imageMediaId: media.updated?.id || null } }, { onConflict: 'key' }),
      supabase.from('site_settings').upsert({ key: 'footer', value: { company: form.company, primary: form.footerPrimary, secondary: form.footerSecondary, copyright: form.copyright } }, { onConflict: 'key' }),
    ])
    if (results.some((result) => result.error)) return setStatus('Não foi possível salvar as alterações.')
    await revalidateLandingContent()
    setStatus('Alterações salvas ✓')
  }
  const field = (key: keyof typeof form, label: string) => <label key={key}>{label}<input value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} /></label>
  return <div className="admin-narrow"><div className="admin-page-heading compact"><div><p className="admin-eyebrow">CONTEÚDO PÚBLICO</p><h1>Landing Page</h1><p>Textos e imagens exclusivos da página inicial.</p></div></div>{status && <p className="admin-save-message">{status}</p>}<form className="admin-panel admin-form" onSubmit={save}><div className="panel-heading"><div><p className="admin-eyebrow">HERO</p><h2>Primeiro impacto</h2></div></div>{field('title', 'Título principal')}{field('subtitle', 'Subtítulo')}<label>Descrição<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>{field('button', 'Texto do botão')}<div className="landing-media-grid"><MediaUploader label="Imagem principal" context="landing/hero" mediaType="landing" slug="site" media={media.hero} onChange={(record) => setMediaSlot('hero', record)} /><MediaUploader label="Imagem secundária" context="landing/hero" mediaType="landing" slug="site" media={media.secondary} onChange={(record) => setMediaSlot('secondary', record)} /><MediaUploader label="Imagem decorativa" context="landing/hero" mediaType="landing" slug="site" media={media.decorative} onChange={(record) => setMediaSlot('decorative', record)} /></div><div className="panel-heading section-divider"><div><p className="admin-eyebrow">ATUALIZAÇÃO</p><h2>Aviso de preços</h2></div></div>{field('updatedTitle', 'Título')}{field('updatedDescription', 'Descrição')}{field('updatedComplement', 'Texto complementar')}<MediaUploader label="Ícone / imagem do aviso" context="landing/sections" mediaType="landing" slug="site" media={media.updated} onChange={(record) => setMediaSlot('updated', record)} /><div className="panel-heading section-divider"><div><p className="admin-eyebrow">FOOTER</p><h2>Rodapé institucional</h2></div></div>{field('company', 'Nome da empresa')}{field('footerPrimary', 'Texto principal')}{field('footerSecondary', 'Texto secundário')}{field('copyright', 'Direitos autorais')}<p className="admin-field-note">Logo do Footer é gerenciada em Identidade visual para evitar duplicidade.</p><button className="admin-primary">SALVAR ALTERAÇÕES</button></form></div>
}
