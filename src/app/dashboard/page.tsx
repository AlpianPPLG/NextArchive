"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { KPICard } from "@/components/dashboard/kpi-card"
import { Mail, BarChart3, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Stats {
    suratMasuk: number
    laporanMasuk: number
    suratKeluar: number
    laporanKeluar: number
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch("/api/dashboard/stats")
                if (response.ok) {
                    const data = await response.json()
                    setStats(data)
                } else {
                    setError("Gagal memuat statistik")
                }
            } catch (err) {
                setError("Terjadi kesalahan saat memuat data")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    return (
        <MainLayout>
            <div className="space-y-8">
                {/* Greeting Banner */}
                <Alert className="bg-green-50 border-green-200">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 font-medium">Selamat Datang Admin!</AlertDescription>
                </Alert>

                {/* KPI Cards */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
                        ))}
                    </div>
                ) : error ? (
                    <Alert className="bg-red-50 border-red-200">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                ) : stats ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <KPICard title="Surat Masuk" value={stats.suratMasuk} icon={Mail} color="blue" />
                        <KPICard title="Laporan Surat Masuk" value={stats.laporanMasuk} icon={BarChart3} color="red" />
                        <KPICard title="Surat Keluar" value={stats.suratKeluar} icon={Mail} color="green" />
                        <KPICard title="Laporan Surat Keluar" value={stats.laporanKeluar} icon={BarChart3} color="yellow" />
                    </div>
                ) : null}
            </div>
        </MainLayout>
    )
}
