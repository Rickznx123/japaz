import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Japaz Sushi | Festivais',
  description: 'Uma nova forma de viver o sushi. Escolha seu festival Japaz.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
