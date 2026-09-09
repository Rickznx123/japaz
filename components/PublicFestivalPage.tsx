import Image from 'next/image'
import type { Festival } from '@/data/festivals'
import type { PublicGalleryImage } from '@/lib/catalog'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import type { PublicSettings } from '@/lib/site-settings'

export function PublicFestivalPage({ festival, gallery, settings }: { festival: Festival; gallery: PublicGalleryImage[]; settings: PublicSettings }) {
  return <main className="public-festival-page"><Header logoUrl={settings.branding.logoUrl} /><section className="public-festival-hero"><div><p className="kicker"><span /> cardápio do festival</p><h1>{festival.name}</h1><p>{festival.description}</p><strong>{festival.price} <small>por pessoa</small></strong></div>{festival.image && <Image src={festival.image} alt={festival.imageAlt} width={900} height={650} unoptimized />}</section>{gallery.length > 0 && <section className="public-gallery"><p className="kicker"><span /> imagens do festival</p><h2>Uma experiência em cada detalhe.</h2><div>{gallery.map((image) => <figure key={image.id}><Image src={image.url} alt={image.title || festival.name} width={700} height={500} unoptimized /><figcaption>{image.title}{image.description && <small>{image.description}</small>}</figcaption></figure>)}</div></section>}<section className="public-menu"><p className="kicker"><span /> seleção completa</p><h2>O menu</h2><div>{festival.categories.map((category) => <article key={category.name}><h3>{category.name}</h3><ul>{category.items.map((item) => <li key={item.name}>{item.name}{item.items && <small>{item.items.join(' · ')}</small>}</li>)}</ul></article>)}</div></section><Footer settings={{ ...settings.footer, logoUrl: settings.branding.footerLogoUrl || settings.branding.logoUrl }} /></main>
}
