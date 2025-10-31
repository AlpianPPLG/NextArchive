"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"

interface ChartOverviewProps {
    data: {
        incomingTotal: number
        outgoingTotal: number
        archivedTotal: number
        pendingTotal: number
    }
}

export function ChartOverview({ data }: ChartOverviewProps) {
    // Data untuk Bar Chart
    const barChartData = [
        { name: "Surat Masuk", value: data.incomingTotal, fill: "#3b82f6" },
        { name: "Surat Keluar", value: data.outgoingTotal, fill: "#10b981" },
        { name: "Arsip", value: data.archivedTotal, fill: "#8b5cf6" },
        { name: "Menunggu", value: data.pendingTotal, fill: "#f59e0b" }
    ]

    // Data untuk Pie Chart
    const pieChartData = [
        { name: "Surat Masuk", value: data.incomingTotal, color: "#3b82f6" },
        { name: "Surat Keluar", value: data.outgoingTotal, color: "#10b981" },
        { name: "Arsip", value: data.archivedTotal, color: "#8b5cf6" },
        { name: "Menunggu", value: data.pendingTotal, color: "#f59e0b" }
    ]

    // Data untuk Line Chart (simulasi trend mingguan)
    const lineChartData = [
        { name: "Minggu 1", masuk: data.incomingTotal * 0.2, keluar: data.outgoingTotal * 0.15 },
        { name: "Minggu 2", masuk: data.incomingTotal * 0.3, keluar: data.outgoingTotal * 0.25 },
        { name: "Minggu 3", masuk: data.incomingTotal * 0.25, keluar: data.outgoingTotal * 0.35 },
        { name: "Minggu 4", masuk: data.incomingTotal * 0.25, keluar: data.outgoingTotal * 0.25 }
    ]

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart - Statistik Keseluruhan */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Statistik Surat</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barChartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="name"
                            className="text-xs"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            className="text-xs"
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px"
                            }}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            {/* Pie Chart - Distribusi */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Distribusi Surat</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            label={(entry: any) => {
                                const percent = entry.percent || 0
                                return `${entry.name}: ${(percent * 100).toFixed(0)}%`
                            }}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px"
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </Card>

            {/* Line Chart - Trend */}
            <Card className="p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Trend Surat Bulanan</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={lineChartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="name"
                            className="text-xs"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            className="text-xs"
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px"
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="masuk"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            name="Surat Masuk"
                            dot={{ r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="keluar"
                            stroke="#10b981"
                            strokeWidth={2}
                            name="Surat Keluar"
                            dot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        </div>
    )
}
