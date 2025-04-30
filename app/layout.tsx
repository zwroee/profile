import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'zwroe',
  description: 'zwr',
  generator: 'zwr',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
