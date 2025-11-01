"use client"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts"
import { Download, Maximize2, TrendingUp, TrendingDown } from "lucide-react"

interface ChartData {
    incomingTotal: number
    outgoingTotal: number
    archivedTotal: number
    pendingTotal: number
    monthlyData?: MonthlyData[]
    classificationData?: ClassificationData[]
}

interface MonthlyData {
    month: string
    incoming: number
    outgoing: number
}

interface ClassificationData {
    name: string
    count: number
}

interface EnhancedChartOverviewProps {
    data: ChartData
}

// Move TrendIndicator outside to avoid React Hooks error
const TrendIndicator = ({ value }: { value: string }) => {
    const numValue = parseFloat(value)
    const isPositive = numValue >= 0
    return (
        <span className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {Math.abs(numValue)}%
        </span>
    )
}

export function EnhancedChartOverview({ data }: EnhancedChartOverviewProps) {
    const [selectedChart, setSelectedChart] = useState<string | null>(null)
    const chartRef = useRef<HTMLDivElement>(null)

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

    // Data untuk Line Chart (simulasi trend 6 bulan terakhir)
    const lineChartData = data.monthlyData || [
        { month: "Jul", incoming: Math.round(data.incomingTotal * 0.15), outgoing: Math.round(data.outgoingTotal * 0.12) },
        { month: "Agu", incoming: Math.round(data.incomingTotal * 0.18), outgoing: Math.round(data.outgoingTotal * 0.16) },
        { month: "Sep", incoming: Math.round(data.incomingTotal * 0.22), outgoing: Math.round(data.outgoingTotal * 0.20) },
        { month: "Okt", incoming: Math.round(data.incomingTotal * 0.20), outgoing: Math.round(data.outgoingTotal * 0.24) },
        { month: "Nov", incoming: Math.round(data.incomingTotal * 0.25), outgoing: Math.round(data.outgoingTotal * 0.28) }
    ]

    // Data untuk Area Chart (Trend Kumulatif)
    const areaChartData = lineChartData.map((item, index) => {
        const prevTotal = lineChartData.slice(0, index).reduce((sum, d) => sum + d.incoming + d.outgoing, 0)
        return {
            month: item.month,
            total: prevTotal + item.incoming + item.outgoing,
            incoming: item.incoming,
            outgoing: item.outgoing
        }
    })

    // Data untuk Radar Chart (Performance Metrics)
    const radarData = [
        { subject: "Kecepatan", value: 85 },
        { subject: "Akurasi", value: 90 },
        { subject: "Kelengkapan", value: 78 },
        { subject: "Ketepatan", value: 88 },
        { subject: "Efisiensi", value: 82 }
    ]

    // Calculate trend
    const calculateTrend = (current: number, previous: number) => {
        if (previous === 0) return "0"
        return ((current - previous) / previous * 100).toFixed(1)
    }

    const incomingTrend = calculateTrend(
        lineChartData[lineChartData.length - 1]?.incoming || 0,
        lineChartData[lineChartData.length - 2]?.incoming || 0
    )

    const outgoingTrend = calculateTrend(
        lineChartData[lineChartData.length - 1]?.outgoing || 0,
        lineChartData[lineChartData.length - 2]?.outgoing || 0
    )

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" ref={chartRef}>
            {/* Bar Chart - Statistik Keseluruhan */}
            <Card className="p-6" id="bar-chart">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Statistik Surat</h3>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                // Export to PNG without html2canvas for now
                                console.log("Export bar-chart")
                            }}
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedChart(selectedChart === "bar" ? null : "bar")}
                        >
                            <Maximize2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={selectedChart === "bar" ? 500 : 300}>
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
                            cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar
                            dataKey="value"
                            radius={[8, 8, 0, 0]}
                            onClick={(data) => alert(`Klik pada: ${data.name} dengan nilai: ${data.value}`)}
                            style={{ cursor: 'pointer' }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            {/* Pie Chart - Distribusi */}
            <Card className="p-6" id="pie-chart">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Distribusi Surat</h3>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                console.log("Export pie-chart")
                            }}
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedChart(selectedChart === "pie" ? null : "pie")}
                        >
                            <Maximize2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={selectedChart === "pie" ? 500 : 300}>
                    <PieChart>
                        <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(props) => {
                                const RADIAN = Math.PI / 180
                                const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props
                                const radius = (innerRadius as number) + ((outerRadius as number) - (innerRadius as number)) * 0.5
                                const x = (cx as number) + radius * Math.cos(-(midAngle as number) * RADIAN)
                                const y = (cy as number) + radius * Math.sin(-(midAngle as number) * RADIAN)

                                return (
                                    <text
                                        x={x}
                                        y={y}
                                        fill="white"
                                        textAnchor={x > (cx as number) ? 'start' : 'end'}
                                        dominantBaseline="central"
                                        className="text-xs font-semibold"
                                    >
                                        {`${name}: ${(((percent as number) || 0) * 100).toFixed(0)}%`}
                                    </text>
                                )
                            }}
                            outerRadius={selectedChart === "pie" ? 150 : 80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {pieChartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => alert(`${entry.name}: ${entry.value} surat`)}
                                />
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

            {/* Line Chart - Trend dengan Indikator */}
            <Card className="p-6 lg:col-span-2" id="line-chart">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold">Trend Surat Bulanan</h3>
                        <div className="flex gap-4 mt-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Surat Masuk:</span>
                                <TrendIndicator value={incomingTrend} />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Surat Keluar:</span>
                                <TrendIndicator value={outgoingTrend} />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                console.log("Export line-chart")
                            }}
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedChart(selectedChart === "line" ? null : "line")}
                        >
                            <Maximize2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={selectedChart === "line" ? 500 : 300}>
                    <LineChart data={lineChartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="month"
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
                            dataKey="incoming"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            name="Surat Masuk"
                            dot={{ r: 4, strokeWidth: 2 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="outgoing"
                            stroke="#10b981"
                            strokeWidth={2}
                            name="Surat Keluar"
                            dot={{ r: 4, strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            {/* Area Chart - Trend Kumulatif */}
            <Card className="p-6" id="area-chart">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Trend Kumulatif</h3>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                console.log("Export area-chart")
                            }}
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={areaChartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 12 }} />
                        <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px"
                            }}
                        />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="total"
                            stackId="1"
                            stroke="#8b5cf6"
                            fill="#8b5cf6"
                            fillOpacity={0.6}
                            name="Total Kumulatif"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </Card>

            {/* Radar Chart - Performance Metrics */}
            <Card className="p-6" id="radar-chart">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Metrik Performa</h3>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                console.log("Export radar-chart")
                            }}
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar
                            name="Performa"
                            dataKey="value"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.6}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px"
                            }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    )
}
