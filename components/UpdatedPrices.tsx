export function UpdatedPrices({ settings }: { settings?: { title?: string; description?: string; complement?: string } }) {
  return (
    <section className="updated-prices" id="atualizacao">
      <div className="update-icon" aria-hidden="true">↗</div>
      <div>
        <p className="kicker">informação importante</p>
        <h2>{settings?.title || 'Preços atualizados'}</h2>
        <p>{settings?.description || 'Este cardápio é digital. Os valores podem ser atualizados sempre que necessário.'}</p>
        {settings?.complement && <p>{settings.complement}</p>}
      </div>
      <span className="update-code">JZ / 2024</span>
    </section>
  )
}
