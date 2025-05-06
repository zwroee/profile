import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import CustomCursor from "@/components/custom-cursor"
import TabTitleEffect from "@/components/tab-title-effect"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "zwroe",
  description: "⚡",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TabTitleEffect />
        {children}
        <CustomCursor />
      </body>
    </html>
  )
}
