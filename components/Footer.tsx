export function Footer({ settings }: { settings?: { company?: string; primary?: string; secondary?: string; copyright?: string } }) {
  return (
    <footer className="site-footer" id="contato">
      <div className="footer-brand"><span className="brand-mark">J</span><div><strong>{settings?.company || 'JAPAZ'}</strong><small>SUSHI</small></div></div>
      <p>{settings?.primary || 'Tradição japonesa • sabor em cada detalhe'}</p>
      <div className="footer-meta"><span>{settings?.secondary || 'São Paulo · Brasil'}</span><span>{settings?.copyright || '© Japaz Sushi'}</span></div>
    </footer>
  )
}
