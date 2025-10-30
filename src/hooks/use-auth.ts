"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export interface User {
    userId: string
    username: string
    email: string
    fullName: string
    role: string
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("/api/auth/me")
                if (response.ok) {
                    const data = await response.json()
                    setUser(data.user)
                } else {
                    setUser(null)
                }
            } catch (error) {
                console.error("Auth check failed:", error)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" })
            setUser(null)
            router.push("/")
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    return { user, loading, logout }
}
