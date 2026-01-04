import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Open Bento - Your Personal Link Page',
  description: 'Create and host your own bento-style profile page',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
