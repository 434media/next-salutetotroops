import type React from "react"
import type { Metadata } from "next"
import { Geist, Azeret_Mono as Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://salutetotroops.com"),
  title: {
    default: "Salute to Troops | Event Marketing Platform",
    template: "%s | Salute to Troops",
  },
  description:
    "Salute to Troops is a unique event marketing platform fostering collaboration between Academia, Industry, and the Military. We drive innovation, build community, and address military recruitment, retention, and reintegration challenges.",
  keywords: ["Salute to Troops", "Military", "Academia", "Industry", "Event Marketing", "Innovation", "Community"],
  authors: [{ name: "434 MEDIA" }],
  creator: "434 MEDIA",
  publisher: "434 MEDIA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Salute to Troops | Event Marketing Platform",
    description:
      "Fostering collaboration between Academia, Industry, and the Military to drive innovation and build community.",
    url: "https://salutetotroops.com",
    siteName: "Salute to Troops",
    images: [
      {
        url: "https://salutetotroops.com/opengraph-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salute to Troops | Event Marketing Platform",
    description:
      "Fostering collaboration between Academia, Industry, and the Military to drive innovation and build community.",
    images: ["https://salutetotroops.com/opengraph-image.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  )
}

