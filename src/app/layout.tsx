import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/ui/theme-provider"

const geistSans = Geist({
    subsets: ["latin"],
    variable: "--font-geist-sans"
})

const geistMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-geist-mono"
})

export const metadata: Metadata = {
    title: "e-Arsip Digital",
    description: "Sistem Manajemen Arsip Digital",
    generator: "v0.app",
}

export default function RootLayout({
        children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="id" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
            <Toaster />
            <Analytics />
        </ThemeProvider>
        </body>
        </html>
    )
}
