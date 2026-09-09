'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  async function submit(event: FormEvent) { event.preventDefault(); setLoading(true); setError(''); const supabase = createClient(); if (!supabase) { setError('Configure as variáveis do Supabase para entrar.'); setLoading(false); return } const { error: authError } = await supabase.auth.signInWithPassword({ email, password }); if (authError) setError('E-mail ou senha inválidos.'); else { router.push('/admin'); router.refresh() } setLoading(false) }
  return <main className="admin-login"><div className="admin-login-mark">J</div><p className="admin-eyebrow">JAPAZ SUSHI / ADMIN</p><h1>Acesso reservado.</h1><p className="admin-login-copy">Gerencie o cardápio Japaz com simplicidade.</p><form onSubmit={submit}><label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="voce@japaz.com" /></label><label>Senha<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="••••••••" /></label>{error && <p className="admin-error">{error}</p>}<button className="admin-primary" disabled={loading}>{loading ? 'ENTRANDO...' : 'ENTRAR'}</button></form><a className="back-public" href="/festivais">← Voltar ao cardápio</a></main>
}
