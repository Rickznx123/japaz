'use client'

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="system-error"><p className="kicker"><span /> Japaz Sushi</p><h1>Não foi possível carregar esta página.</h1><p>Verifique a conexão e tente novamente.</p><button className="admin-primary" onClick={() => reset()}>Tentar novamente</button></main>
}
