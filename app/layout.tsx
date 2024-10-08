import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { MUIThemeProvider } from './theme'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'savepoint',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <MUIThemeProvider>
          {children}
        </MUIThemeProvider>
      </body>
    </html>
  )
}
