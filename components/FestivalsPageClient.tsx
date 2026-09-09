'use client'

import { useState } from 'react'
import type { Festival } from '@/data/festivals'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { FestivalCard } from '@/components/FestivalCard'
import { FestivalDetails } from '@/components/FestivalDetails'
import { UpdatedPrices } from '@/components/UpdatedPrices'
import { Footer } from '@/components/Footer'
import type { PublicSettings } from '@/lib/site-settings'

export function FestivalsPageClient({ festivals, settings }: { festivals: Festival[]; settings: PublicSettings }) {
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null)
  return <main>
    <Header logoUrl={settings.branding.logoUrl} /><Hero settings={settings.hero} />
    <section className="festival-section" id="festivais">
      <div className="section-intro"><div><p className="kicker"><span /> escolha sua experiência</p><h2>Três formas<br /><em>de celebrar.</em></h2></div><p className="section-note">Uma seleção pensada para cada momento.<br />Feita para ser compartilhada.</p></div>
      <div className="festival-grid">{festivals.map((festival, index) => <FestivalCard key={festival.id} festival={festival} index={index} onOpen={setSelectedFestival} />)}</div>
    </section>
    <UpdatedPrices settings={settings.updated} /><Footer settings={{ ...settings.footer, logoUrl: settings.branding.footerLogoUrl || settings.branding.logoUrl }} /><FestivalDetails festival={selectedFestival} onClose={() => setSelectedFestival(null)} />
  </main>
}
