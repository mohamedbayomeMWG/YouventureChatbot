import './globals.css'

export const metadata = {
  title: 'You Ventures — HR Assistant',
  description: 'Internal HR Chatbot for You Ventures Group',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
