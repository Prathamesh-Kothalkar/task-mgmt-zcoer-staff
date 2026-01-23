import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ZCOER Staff Portal",
  description: "Developed by Prathamesh Kothalkar",
  generator: "Next.js",
  icons: {
    icon: [
      {
        url: "/images/images.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/images/images.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/images/images.png",
        type: "image/png",
      },
    ],
    apple: "/images/images.png",
    manifest: "/manifest.json",
    themeColor: "#0f172a"
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased bg-muted/30`}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
