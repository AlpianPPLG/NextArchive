"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import { ReportTable } from "@/components/report/report-table"
import { ExportReport } from "@/components/report/export-report"

interface Classification {
    id: number
    code: string
    description: string
}

interface ReportData {
    id: string
    letter_number: string
    destination: string
    subject: string
    code: string | null
    description?: string
    number_of_copies: number
    archive_file_number: string | null
    outgoing_date: string
}

export default function LaporanKeluarPage() {
    const [data, setData] = useState<ReportData[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [classificationId, setClassificationId] = useState("all")
    const [classifications, setClassifications] = useState<Classification[]>([])
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    useEffect(() => {
        const fetchClassifications = async () => {
            try {
                const response = await fetch("/api/classifications")
                if (response.ok) {
                    const data = await response.json()
                    setClassifications(data)
                }
            } catch (error) {
                console.error("Failed to fetch classifications:", error)
            }
        }

        fetchClassifications()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const params = new URLSearchParams()
                if (classificationId !== "all") params.append("classificationId", classificationId)
                if (search) params.append("search", search)
                if (startDate) params.append("startDate", startDate)
                if (endDate) params.append("endDate", endDate)

                // Fetch ALL outgoing letters (not just archived)
                const response = await fetch(`/api/outgoing-letters?${params}`)
                if (response.ok) {
                    const result = await response.json()
                    setData(result)
                }
            } catch (error) {
                console.error("Failed to fetch data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [classificationId, search, startDate, endDate])

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Laporan Surat Keluar</h1>
                    <p className="text-muted-foreground mt-1">Kelola dan ekspor laporan surat keluar yang telah diarsipkan</p>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label>Tanggal Mulai</Label>
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Tanggal Akhir</Label>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Klasifikasi</Label>
                        <Select value={classificationId} onValueChange={setClassificationId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Klasifikasi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Klasifikasi</SelectItem>
                                {classifications.map((c) => (
                                    <SelectItem key={c.id} value={c.id.toString()}>
                                        {c.code} - {c.description}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Pencarian</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari surat..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                </div>

                {/* Export Report */}
                <ExportReport
                    data={data}
                    reportType="outgoing"
                    title="Laporan Surat Keluar"
                    period={{ startDate, endDate }}
                />

                {/* Table */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Data Laporan</h2>
                        <div className="text-sm text-muted-foreground">
                            Total: <span className="font-semibold">{data.length}</span> data
                        </div>
                    </div>
                    <ReportTable data={data} loading={loading} type="outgoing" />
                </div>
            </div>
        </MainLayout>
    )
}
