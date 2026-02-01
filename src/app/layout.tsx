import type { Metadata } from 'next'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
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
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white">
          Skip to content
        </a>
        <SessionProvider>
          <ThemeProvider>
            <div id="main-content">
              {children}
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
