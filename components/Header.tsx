'use client'

import { useState } from 'react'
import Image from 'next/image'

export function Header({ logoUrl }: { logoUrl?: string | null }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Japaz Sushi, início">
        {logoUrl ? <Image className="brand-image" src={logoUrl} alt="Japaz Sushi" width={120} height={31} unoptimized /> : <span className="brand-mark">J</span>}
        <span className="brand-text"><strong>JAPAZ</strong><small>SUSHI</small></span>
      </a>
      <button className={`menu-toggle ${isOpen ? 'is-open' : ''}`} onClick={() => setIsOpen(!isOpen)} aria-label="Abrir menu" aria-expanded={isOpen}>
        <span /><span />
      </button>
      {isOpen && (
        <nav className="mobile-menu" aria-label="Navegação principal">
          <a href="#festivais" onClick={() => setIsOpen(false)}>Os festivais</a>
          <a href="#atualizacao" onClick={() => setIsOpen(false)}>Informações</a>
          <a href="#contato" onClick={() => setIsOpen(false)}>Contato</a>
        </nav>
      )}
    </header>
  )
}
