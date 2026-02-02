import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "FastFind360 - Government Property Intelligence Platform",
  description:
    "Discover unregistered properties and unlock billions in lost revenue with satellite imagery and AI. Built for Nigerian state governments.",
  generator: "FastFind360",
  keywords: ["property tax", "satellite imagery", "GovTech", "Nigeria", "revenue recovery", "cadastre"],
}

export const viewport: Viewport = {
  themeColor: "#1E3A5F",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
