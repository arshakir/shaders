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
        <script defer src="https://cloud.umami.is/script.js" data-website-id="1d2cb4fb-3c31-4177-a3ea-dddec2983e20"></script>
      </head>
      <body className={firaCode.variable}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
