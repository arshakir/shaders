import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Fira_Code } from 'next/font/google'
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"] })
const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-fira-code',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Shader Portfolio</title>
        <meta name="description" content="A portfolio of fragment shader creations" />
        <script src="https://cdn.counter.dev/script.js" data-id="ac1f80ae-aec6-4df6-8d22-4ef3d1ab78b2" data-utcoffset="-4"></script>
      </head>
      <body className={firaCode.variable}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
