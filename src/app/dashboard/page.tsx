"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { EnhancedChartOverview } from "@/components/dashboard/enhanced-chart-overview"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { Mail, Send, Archive, Clock } from "lucide-react"

export default function DashboardPage() {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        incomingTotal: 0,
        outgoingTotal: 0,
        archivedTotal: 0,
        pendingTotal: 0
    })

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true)
            try {
                const response = await fetch("/api/dashboard/stats")
                if (response.ok) {
                    const data = await response.json()
                    setStats(data)
                }
            } catch (error) {
                console.error("Failed to fetch stats:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats().then(r => r)
    }, [])

    const kpiCards = [
        {
            title: "Surat Masuk",
            value: stats.incomingTotal,
            icon: Mail,
            description: "Total surat masuk",
            color: "text-blue-500",
            trend: "+12%",
            trendDirection: "up" as const
        },
        {
            title: "Surat Keluar",
            value: stats.outgoingTotal,
            icon: Send,
            description: "Total surat keluar",
            color: "text-green-500",
            trend: "+8%",
            trendDirection: "up" as const
        },
        {
            title: "Arsip",
            value: stats.archivedTotal,
            icon: Archive,
            description: "Total arsip tersimpan",
            color: "text-purple-500",
            trend: "+15%",
            trendDirection: "up" as const
        },
        {
            title: "Menunggu",
            value: stats.pendingTotal,
            icon: Clock,
            description: "Surat yang perlu ditindak",
            color: "text-orange-500",
            trend: "-5%",
            trendDirection: "down" as const
        }
    ]

    if (loading) {
        return (
            <MainLayout>
                <DashboardSkeleton />
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Welcome Message - Responsive Text */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Selamat Datang di Dashboard</h1>
                    <p className="text-muted-foreground mt-2">
                        Berikut adalah ringkasan aktivitas sistem arsip digital Anda
                    </p>
                </div>

                {/* KPI Cards Grid - Responsive Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpiCards.map((card, index) => (
                        <KpiCard
                            key={index}
                            title={card.title}
                            value={card.value}
                            icon={card.icon}
                            description={card.description}
                            iconColor={card.color}
                            trend={card.trend}
                            trendDirection={card.trendDirection}
                        />
                    ))}
                </div>

                {/* Chart Overview Section */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xl font-semibold">Laporan Statistik</h2>
                        <p className="text-muted-foreground text-sm">Visualisasi data surat dalam bentuk grafik interaktif</p>
                    </div>
                    <EnhancedChartOverview data={stats} />
                </div>
            </div>
        </MainLayout>
    )
}
