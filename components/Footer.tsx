import Image from 'next/image'

export function Footer({ settings }: { settings?: { company?: string; primary?: string; secondary?: string; copyright?: string; logoUrl?: string | null } }) {
  return (
    <footer className="site-footer" id="contato">
      <div className="footer-brand">{settings?.logoUrl ? <Image className="brand-image footer-logo-image" src={settings.logoUrl} alt="Japaz Sushi" width={105} height={39} unoptimized /> : <span className="brand-mark">J</span>}<div><strong>{settings?.company || 'JAPAZ'}</strong><small>SUSHI</small></div></div>
      <p>{settings?.primary || 'Tradição japonesa • sabor em cada detalhe'}</p>
      <div className="footer-meta"><span>{settings?.secondary || 'São Paulo · Brasil'}</span><span>{settings?.copyright || '© Japaz Sushi'}</span></div>
    </footer>
  )
}
