import './styles/globals.css'
import type { Metadata } from 'next'
import Layout from "./components/Layout"


export const metadata: Metadata = {
  title: 'Azima Tour Editor',
 
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Layout>{children}</Layout>
    </html>
  )
}
