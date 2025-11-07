"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export interface User {
  userId: string
  username: string
  email: string
  fullName: string
  role: string
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
  refresh: () => Promise<void>
  updateUser: (next: Partial<User>) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error("AuthProvider check failed:", err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth().then(() => {})
  }, [])

  const refresh = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/auth/me", { credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error("AuthProvider refresh failed:", err)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
      setUser(null)
      router.push("/")
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  const updateUser = (next: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return next as User
      return { ...prev, ...next }
    })
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, refresh, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

