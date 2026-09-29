'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateLandingContent() {
  revalidatePath('/')
  revalidatePath('/festivais')
}