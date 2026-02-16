import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import AuthProvider from "@/context/AuthProvider"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"


const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const session = await getServerSession(authOptions);

  return (
     <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <AuthProvider session={session}>
          {children}
        </AuthProvider>

        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
