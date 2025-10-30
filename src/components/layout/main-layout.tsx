"use client"

import type React from "react"

import { Sidebar } from "./sidebar"
import { Header } from "./header"

interface MainLayoutProps {
    children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <div className="lg:pl-64"> {/* Padding left untuk desktop, mengikuti lebar sidebar */}
                <Header />
                <main className="p-4 lg:p-8 pt-24 lg:pt-28"> {/* Increased padding top for better spacing on laptop screens */}
                    {children}
                </main>
            </div>
        </div>
    )
}
