'use client'

import { useRef, useState } from 'react'
import { ImagePlus, Trash2, Upload } from 'lucide-react'
import { createClient } from '@/lib/supabase/browser'

export type MediaRecord = {
  id: string
  file_name: string
  url: string
  storage_path: string
  media_type: string
  file_size: number | null
  mime_type: string | null
  context_key: string | null
  uses?: string[]
}

type MediaUploaderProps = {
  label: string
  context: string
  mediaType: 'branding' | 'landing' | 'festival' | 'item' | 'uncategorized'
  slug: string
  media?: MediaRecord | null
  onChange: (media: MediaRecord | null) => void
  onRemove?: () => Promise<void> | void
}

export function MediaUploader({ label, context, mediaType, slug, media, onChange, onRemove }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  async function upload(file: File) {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/x-icon'].includes(file.type)) return setStatus('Use JPG, PNG, WEBP ou ICO.')
    if (file.size > 5 * 1024 * 1024) return setStatus('A imagem deve ter no máximo 5 MB.')
    const supabase = createClient()
    if (!supabase) return setStatus('Configure o Supabase para enviar imagens.')
    setBusy(true); setStatus('Enviando...')
    const safeName = file.name.replace(/[^a-z0-9.-]/gi, '-').toLowerCase()
    const path = `japaz/${context}/${Date.now()}-${safeName}`
    const uploadResult = await supabase.storage.from('japaz-media').upload(path, file, { contentType: file.type, upsert: false })
    if (uploadResult.error) { setStatus('Não foi possível enviar a imagem.'); setBusy(false); return }
    const { data: publicUrl } = supabase.storage.from('japaz-media').getPublicUrl(path)
    const { data, error } = await supabase.from('media').insert({ file_name: file.name, storage_path: path, url: publicUrl.publicUrl, media_type: mediaType, context_key: `${slug}/${context}`, file_size: file.size, mime_type: file.type }).select().single()
    if (error) { setStatus('Imagem enviada, mas não foi registrada.'); setBusy(false); return }
    onChange(data as MediaRecord); setStatus('Imagem salva ✓'); setBusy(false)
  }
  async function remove() {
    if (!media || !confirm(`Tem certeza que deseja remover ${media.file_name}?`)) return
    setBusy(true); setStatus('Removendo...'); await onRemove?.()
    // Detach the contextual reference but keep the physical file/media record.
    // The library can clean orphaned files later without breaking another reference.
    onChange(null); setStatus('Imagem removida ✓'); setBusy(false)
  }
  return <div className="media-uploader"><div className="media-uploader-header"><div><p className="admin-eyebrow">{label}</p><span>JPG, PNG ou WEBP · até 5 MB</span></div>{media && <button type="button" className="media-remove" onClick={remove} disabled={busy}><Trash2 size={15} /> Remover</button>}</div><div className={`media-preview ${media ? 'has-image' : ''}`} style={media ? { backgroundImage: `url(${media.url})` } : undefined}>{!media && <ImagePlus size={23} />}</div><input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp,.ico,image/jpeg,image/png,image/webp,image/x-icon" hidden onChange={(event) => event.target.files?.[0] && upload(event.target.files[0])} /><button type="button" className="admin-outline media-upload-button" onClick={() => inputRef.current?.click()} disabled={busy}><Upload size={15} /> {media ? 'Alterar imagem' : 'Upload de nova imagem'}</button>{status && <small className="media-status">{status}</small>}</div>
}
