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
import { toast } from "sonner"

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

    // Function to export chart as PNG - Using SVG approach to avoid CSS parsing
    const exportChartAsPNG = async (chartId: string, chartName: string) => {
        const loadingToast = toast.loading("Mengexport chart...")

        try {
            const chartElement = document.getElementById(chartId)
            if (!chartElement) {
                toast.dismiss(loadingToast)
                toast.error("Chart tidak ditemukan")
                return
            }

            // Wait for chart to render
            await new Promise(resolve => setTimeout(resolve, 500))

            // Find the ResponsiveContainer which contains the actual chart
            const containerElement = chartElement.querySelector('.recharts-responsive-container')
            if (!containerElement) {
                toast.dismiss(loadingToast)
                toast.error("Chart container tidak ditemukan")
                return
            }

            // Find the SVG element within the container
            const svgElement = containerElement.querySelector('svg')
            if (!svgElement) {
                toast.dismiss(loadingToast)
                toast.error("Chart SVG tidak ditemukan")
                return
            }

            // Get the chart title from the card header
            const titleElement = chartElement.querySelector('h3')
            const title = titleElement?.textContent || chartName

            // Get SVG dimensions
            const svgRect = svgElement.getBoundingClientRect()
            const svgWidth = svgRect.width
            const svgHeight = svgRect.height

            // Create canvas with padding for title and borders
            const padding = 40
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (!ctx) {
                toast.dismiss(loadingToast)
                toast.error("Tidak dapat membuat canvas")
                return
            }

            // Set canvas size with padding
            canvas.width = (svgWidth + padding * 2) * 2 // 2x for quality
            canvas.height = (svgHeight + padding * 3) * 2 // Extra padding for title

            // Scale for high quality
            ctx.scale(2, 2)

            // Fill white background
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Draw title
            ctx.fillStyle = '#000000'
            ctx.font = 'bold 16px system-ui, -apple-system, sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText(title, svgWidth / 2 + padding, padding / 2 + 10)

            // Draw border
            ctx.strokeStyle = '#e5e7eb'
            ctx.lineWidth = 1
            ctx.strokeRect(padding / 2, padding, svgWidth + padding, svgHeight + padding)

            // Clone SVG to avoid modifying the original
            const svgClone = svgElement.cloneNode(true) as SVGElement
            
            // Get computed styles and apply them inline to avoid CSS variable issues
            const applyComputedStyles = (element: Element, clonedElement: Element) => {
                const computedStyle = window.getComputedStyle(element)
                const clonedStyle = (clonedElement as HTMLElement).style
                
                // Copy important style properties
                const importantProps = ['fill', 'stroke', 'color', 'font-size', 'font-family', 'font-weight']
                importantProps.forEach(prop => {
                    const value = computedStyle.getPropertyValue(prop)
                    if (value && value !== 'none') {
                        clonedStyle.setProperty(prop, value)
                    }
                })
                
                // Recursively apply to children
                Array.from(element.children).forEach((child, index) => {
                    if (clonedElement.children[index]) {
                        applyComputedStyles(child, clonedElement.children[index])
                    }
                })
            }
            
            applyComputedStyles(svgElement, svgClone)
            
            // Serialize the cloned SVG
            const serializer = new XMLSerializer()
            let svgString = serializer.serializeToString(svgClone)

            // Create blob from SVG
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
            const url = URL.createObjectURL(svgBlob)

            // Load SVG as image
            const img = new Image()
            img.onload = () => {
                // Draw SVG image on canvas
                ctx.drawImage(img, padding, padding + 20, svgWidth, svgHeight)
                URL.revokeObjectURL(url)

                // Convert canvas to blob and download
                canvas.toBlob((blob) => {
                    toast.dismiss(loadingToast)

                    if (blob) {
                        const downloadUrl = URL.createObjectURL(blob)
                        const link = document.createElement('a')
                        const filename = `${chartName}_${new Date().toISOString().split('T')[0]}.png`
                        link.href = downloadUrl
                        link.download = filename
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                        URL.revokeObjectURL(downloadUrl)

                        toast.success(`Chart berhasil diexport sebagai ${filename}`)
                    } else {
                        toast.error("Gagal mengexport chart")
                    }
                }, 'image/png')
            }

            img.onerror = () => {
                URL.revokeObjectURL(url)
                toast.dismiss(loadingToast)
                toast.error("Gagal memuat SVG chart")
            }

            img.src = url
        } catch (error) {
            console.error("Export error:", error)
            toast.dismiss(loadingToast)
            toast.error("Terjadi kesalahan saat mengexport chart")
        }
    }

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
                            onClick={() => exportChartAsPNG("bar-chart", "Statistik_Surat")}
                            title="Export sebagai PNG"
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
                            onClick={() => exportChartAsPNG("pie-chart", "Distribusi_Surat")}
                            title="Export sebagai PNG"
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
                            onClick={() => exportChartAsPNG("line-chart", "Trend_Surat_Bulanan")}
                            title="Export sebagai PNG"
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
                            onClick={() => exportChartAsPNG("area-chart", "Trend_Kumulatif")}
                            title="Export sebagai PNG"
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
                            onClick={() => exportChartAsPNG("radar-chart", "Metrik_Performa")}
                            title="Export sebagai PNG"
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
