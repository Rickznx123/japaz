'use client'

import type { Festival } from '@/data/festivals'
import Image from 'next/image'

type FestivalDetailsProps = {
  festival: Festival | null
  onClose: () => void
}

export function FestivalDetails({ festival, onClose }: FestivalDetailsProps) {
  if (!festival) return null

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="details-modal" role="dialog" aria-modal="true" aria-labelledby="details-title" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Fechar detalhes">×</button>
        <div className="modal-heading">
          <p className="kicker"><span /> menu do festival</p>
          <h2 id="details-title">{festival.name}</h2>
          <p>{festival.description}</p>
        </div>
        <div className="categories-grid">
          {festival.categories.map((category) => (
            <div className="category" key={category.name}>
              <h3>{category.name}</h3>
              <ul>{category.items.map((item) => (
                <li key={item.name} className="menu-item-with-image">
                  {item.image && <Image src={item.image} alt={item.name} width={56} height={56} unoptimized />}
                  <span>{item.name}</span>
                  {item.items && <ul className="category-subitems">{item.items.map((subitem) => <li key={subitem}>{subitem}</li>)}</ul>}
                </li>
              ))}</ul>
            </div>
          ))}
        </div>
        <div className="festival-information">
          <div className="information-block">
            <h3>Informações</h3>
            <ul>{festival.information.schedule.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className="information-block">
            <h3>Crianças</h3>
            <ul>{festival.information.children.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className="information-block">
            <h3>Regras</h3>
            <ul>{festival.information.rules.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
        <div className="modal-price"><span>valor por pessoa</span><strong>{festival.price}</strong></div>
        <a className="modal-public-link" href={`/festivais/${festival.id}`}>Ver página completa do festival →</a>
      </section>
    </div>
  )
}
