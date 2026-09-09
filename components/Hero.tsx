export function Hero({ settings }: { settings?: { title?: string; subtitle?: string; description?: string } }) {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="kicker"><span /> Entrada pelo QR code</p>
        <h1><span>Japaz</span> {settings?.title || 'Festivais'}</h1>
        <p className="hero-subtitle">{settings?.subtitle || 'Três experiências. Um só sabor.'}</p>
        <p className="hero-description">{settings?.description || 'Escolha seu festival e descubra uma nova forma de viver o sushi.'}</p>
        <a href="#festivais" className="scroll-cue"><span>↓</span> explorar o menu</a>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="hero-circle" />
        <div className="hero-image hero-image-back" />
        <div className="hero-image hero-image-front" />
        <span className="hero-vertical">festival week · japaz sushi</span>
      </div>
      <div className="hero-number">01 <span>/</span> 03</div>
    </section>
  )
}
