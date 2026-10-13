import './globals.css'
import { StoreProvider } from '@/context/StoreContext'

export const metadata = {
  title: 'Kasir App - Sistem Point of Sale',
  description: 'Aplikasi kasir modern dengan fitur lengkap',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  )
}