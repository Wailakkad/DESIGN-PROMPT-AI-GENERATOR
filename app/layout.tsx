import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { PromptProvider } from "./context/PromptContext";
import Header from '../components/Header';
import Footer from '../components/Footer';
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DP - AI Prompt Generation for Designers & Creators',
  description: 'Generate professional AI prompts for designers, POD sellers, and creators. Tailored prompts for your audience with instant results.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <PromptProvider>
      <body className={`${inter.className} antialiased bg-white text-neutral-900`}>
        <Header />
        {children}
        <Footer />
      </body>
      </PromptProvider>
    </html>
  )
}



