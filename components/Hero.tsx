const fallbackMainImage = 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=900&q=85'
const fallbackSecondaryImage = 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=85'

export function Hero({ settings }: { settings?: { title?: string; subtitle?: string; description?: string; button?: string; imageUrl?: string | null; secondaryImageUrl?: string | null; decorativeImageUrl?: string | null } }) {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="kicker"><span /> Entrada pelo QR code</p>
        <h1><span>Japaz</span> {settings?.title || 'Festivais'}</h1>
        <p className="hero-subtitle">{settings?.subtitle || 'Três experiências. Um só sabor.'}</p>
        <p className="hero-description">{settings?.description || 'Escolha seu festival e descubra uma nova forma de viver o sushi.'}</p>
        <a href="#festivais" className="scroll-cue"><span>↓</span> {settings?.button || 'explorar o menu'}</a>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="hero-circle" />
        <div className="hero-image hero-image-back" style={{ backgroundImage: `linear-gradient(135deg, rgba(229,9,9,.35), transparent 50%), url("${settings?.secondaryImageUrl || fallbackSecondaryImage}")` }} />
        <div className="hero-image hero-image-front" style={{ backgroundImage: `linear-gradient(0deg, rgba(7,7,7,.2), transparent), url("${settings?.imageUrl || fallbackMainImage}")` }} />
      </div>
      <div className="hero-number">01 <span>/</span> 03</div>
    </section>
  )
}
