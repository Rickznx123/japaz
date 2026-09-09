'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, PanelsTopLeft, UtensilsCrossed, Tags, Images, Settings, Menu, ExternalLink, LogOut, Palette } from 'lucide-react'
import { createClient } from '@/lib/supabase/browser'
import Image from 'next/image'

const links = [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard }, { href: '/admin/landing', label: 'Landing Page', icon: PanelsTopLeft }, { href: '/admin/identidade', label: 'Identidade visual', icon: Palette }, { href: '/admin/festivais', label: 'Festivais', icon: UtensilsCrossed }, { href: '/admin/categorias', label: 'Categorias', icon: Tags }, { href: '/admin/imagens', label: 'Biblioteca de mídia', icon: Images }, { href: '/admin/configuracoes', label: 'Configurações', icon: Settings }]

export function AdminShell({ children, logoUrl }: { children: React.ReactNode; logoUrl?: string | null }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  if (pathname === '/admin/login') return <>{children}</>
  async function signOut() { const supabase = createClient(); await supabase?.auth.signOut(); router.push('/admin/login'); router.refresh() }
  return <div className="admin-app"><aside className={`admin-sidebar ${open ? 'is-open' : ''}`}><div className="admin-logo">{logoUrl ? <Image src={logoUrl} alt="Japaz Sushi" width={120} height={40} unoptimized /> : <span>J</span>}<div><strong>JAPAZ</strong><small>SUSHI / ADMIN</small></div></div><nav>{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={pathname === href || (href !== '/admin' && pathname.startsWith(href)) ? 'active' : ''} onClick={() => setOpen(false)}><Icon size={17} />{label}</Link>)}</nav><button className="admin-logout" onClick={signOut}><LogOut size={16} /> Sair</button></aside><div className="admin-main"><header className="admin-header"><button className="admin-menu-button" onClick={() => setOpen(!open)} aria-label="Abrir menu"><Menu size={20} /></button><div><span>JAPAZ SUSHI</span><strong>Painel Administrativo</strong></div><Link href="/festivais" target="_blank" className="public-link">Abrir cardápio <ExternalLink size={15} /></Link></header><div className="admin-content">{children}</div></div></div>
}
