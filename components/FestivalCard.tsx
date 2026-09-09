'use client'

import type { Festival } from '@/data/festivals'
import Image from 'next/image'

type FestivalCardProps = {
  festival: Festival
  index: number
  onOpen: (festival: Festival) => void
}

export function FestivalCard({ festival, index, onOpen }: FestivalCardProps) {
  return (
    <article className={`festival-card festival-card-${index + 1}`} style={{ '--accent': festival.accent } as React.CSSProperties}>
      <div className="card-image-wrap">
        <Image src={festival.image} alt={festival.imageAlt} className="card-image" width={900} height={700} unoptimized />
        <span className="card-index">{festival.eyebrow}</span>
        <span className="card-stamp">J</span>
      </div>
      <div className="card-content">
        <h3>{festival.name}</h3>
        <p>{festival.description}</p>
        <div className="card-footer">
          <div className="price"><strong>{festival.price}</strong><span>por pessoa</span></div>
          <button className="card-button" onClick={() => onOpen(festival)}>Ver cardápio <span>→</span></button>
        </div>
      </div>
    </article>
  )
}
