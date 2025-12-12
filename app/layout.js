import './globals.css'
import { Toaster } from '@/components/ui/toaster'

export const metadata = {
  title: 'YouTube Membership Referral System',
  description: 'Join, verify your membership, and build your referral network',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}