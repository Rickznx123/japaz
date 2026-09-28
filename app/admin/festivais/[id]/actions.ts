'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type SavePriceResult = { success: true; price: number } | { success: false; message: string }

export async function saveFestivalPrice(slug: string, input: string): Promise<SavePriceResult> {
  const value = input.trim()
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(value)) {
    return { success: false, message: 'Informe um valor válido com no máximo duas casas decimais.' }
  }

  const price = Number(value.replace(',', '.'))
  if (!Number.isFinite(price) || price <= 0) {
    return { success: false, message: 'O preço deve ser maior que zero.' }
  }

  const supabase = createClient()
  if (!supabase) return { success: false, message: 'Supabase não está configurado.' }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Sua sessão expirou. Entre novamente.' }

  const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin')
  if (adminError || !isAdmin) return { success: false, message: 'Você não tem permissão para alterar este preço.' }

  const { data, error } = await supabase
    .from('festivals')
    .update({ price })
    .eq('slug', slug)
    .select('slug')
    .maybeSingle()

  if (error || !data) return { success: false, message: 'Não foi possível salvar o preço.' }

  revalidatePath('/')
  revalidatePath('/festivais')
  revalidatePath(`/festivais/${slug}`)
  revalidatePath('/admin/festivais')
  revalidatePath(`/admin/festivais/${slug}`)

  return { success: true, price }
}