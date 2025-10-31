"use client"

import type React from "react"

import { Sidebar } from "./sidebar"
import { Header } from "./header"

interface MainLayoutProps {
    children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Sidebar />
            <div className="lg:pl-64 flex-1 flex flex-col"> {/* Padding left untuk desktop, mengikuti lebar sidebar */}
                <Header />
                <main className="p-4 lg:p-8 pt-24 lg:pt-28 flex-1"> {/* Increased padding top for better spacing on laptop screens */}
                    {children}
                </main>
                {/* Footer */}
                <footer className="border-t bg-card/50 backdrop-blur-sm">
                    <div className="p-4 lg:p-6">
                        <div className="text-center text-sm text-muted-foreground">
                            <p>© Copyright 2025. All Rights Reserved</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}
