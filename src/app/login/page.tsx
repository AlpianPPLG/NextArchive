"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function LoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (searchParams.get("registered") === "true") {
            toast.success("Registrasi berhasil! Silakan login dengan akun Anda.")
        }
    }, [searchParams])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            })

            if (response.ok) {
                toast.success("Login berhasil!")
                router.push("/dashboard")
            } else {
                const data = await response.json()
                toast.error(data.error || "Login gagal")
            }
        } catch (error) {
            toast.error("Terjadi kesalahan")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Mail className="w-8 h-8 text-green-600" />
                        <div>
                            <h1 className="font-bold text-lg">Surat Masuk dan</h1>
                            <h1 className="font-bold text-lg">Surat Keluar</h1>
                        </div>
                    </div>
                    <CardTitle className="text-center">Login Admin</CardTitle>
                    <CardDescription className="text-center">Masukkan kredensial Anda untuk mengakses sistem</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="admin_arsip"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                            {loading ? "Memproses..." : "Login"}
                        </Button>
                    </form>
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                        <p className="font-semibold mb-2">Demo Credentials:</p>
                        <p>
                            Username: <code className="bg-blue-100 px-2 py-1 rounded">admin_arsip</code>
                        </p>
                        <p>
                            Password: <code className="bg-blue-100 px-2 py-1 rounded">password123</code>
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-600">
                        Belum punya akun?{" "}
                        <Link href="/register" className="text-green-600 hover:underline font-medium">
                            Daftar di sini
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
