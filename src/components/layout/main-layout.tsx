"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

export function MainLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login")
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 w-full lg:ml-64">
                <Header />
                <main className="mt-16 p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">{children}</main>
            </div>
        </div>
    )
}
