import Link from 'next/link'
import { getAdminFestivals } from '@/lib/catalog'

export default async function AdminDashboard() {
  const festivals = await getAdminFestivals()
  const categories = festivals.reduce((total, festival) => total + (festival.festival_categories?.length ?? 0), 0)
  const items = festivals.reduce((total, festival) => total + (festival.festival_categories ?? []).reduce((sum, category) => sum + (category.festival_items?.length ?? 0), 0), 0)
  return <><div className="admin-page-heading"><div><p className="admin-eyebrow">VISÃO GERAL</p><h1>Bom dia, Japaz.</h1><p>O seu cardápio está sob controle.</p></div><Link href="/festivais" target="_blank" className="admin-outline">Visualizar página ↗</Link></div><div className="admin-stat-grid"><div><span>Festivais ativos</span><strong>{festivals.length || 3}</strong><small>catálogo atual</small></div><div><span>Categorias</span><strong>{categories || '—'}</strong><small>organizadas no menu</small></div><div><span>Itens cadastrados</span><strong>{items || '—'}</strong><small>pratos disponíveis</small></div><div><span>Última atualização</span><strong>Agora</strong><small>sincronização manual</small></div></div><section className="admin-panel dashboard-panel"><div className="panel-heading"><div><p className="admin-eyebrow">ACESSO RÁPIDO</p><h2>Seu catálogo</h2></div><Link href="/admin/festivais" className="admin-text-link">Ver todos →</Link></div><div className="dashboard-festivals">{festivals.slice(0, 3).map((festival) => <Link href={`/admin/festivais/${festival.id}/itens`} key={festival.id}><span>{festival.name}</span><strong>R$ {Number(festival.price).toFixed(2).replace('.', ',')}</strong><small>{festival.festival_categories?.length ?? 0} categorias</small></Link>)}</div></section></>
}
