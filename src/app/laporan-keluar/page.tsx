"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { ReportTable } from "@/components/report/report-table"
import { ReportFilters } from "@/components/report/report-filters"
import { exportToPDF, exportToExcel, printReport } from "@/lib/utils/export"
import { format } from "date-fns"
import { toast } from "sonner"

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
    description: string | null
    number_of_copies: number
    archive_file_number: string | null
    outgoing_date: string
}

export default function LaporanKeluarPage() {
    const [data, setData] = useState<ReportData[]>([])
    const [loading, setLoading] = useState(true)
    const [isExporting, setIsExporting] = useState(false)
    const [search, setSearch] = useState("")
    const [classificationId, setClassificationId] = useState("all")
    const [classifications, setClassifications] = useState<Classification[]>([])

    // Period filters
    const [periodType, setPeriodType] = useState<"all" | "monthly" | "yearly" | "custom">("all")
    const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), "MM"))
    const [selectedYear, setSelectedYear] = useState<string>(format(new Date(), "yyyy"))
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()

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

                // Add period filters
                if (periodType === "monthly" && selectedMonth && selectedYear) {
                    params.append("month", selectedMonth)
                    params.append("year", selectedYear)
                } else if (periodType === "yearly" && selectedYear) {
                    params.append("year", selectedYear)
                } else if (periodType === "custom" && startDate && endDate) {
                    params.append("startDate", format(startDate, "yyyy-MM-dd"))
                    params.append("endDate", format(endDate, "yyyy-MM-dd"))
                }

                const response = await fetch(`/api/outgoing-letters/archived?${params}`)
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
    }, [classificationId, search, periodType, selectedMonth, selectedYear, startDate, endDate])

    const getPeriodInfo = () => {
        if (periodType === "monthly" && selectedMonth && selectedYear) {
            const months = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
            return `${months[parseInt(selectedMonth)]} ${selectedYear}`
        } else if (periodType === "yearly" && selectedYear) {
            return `Tahun ${selectedYear}`
        } else if (periodType === "custom" && startDate && endDate) {
            return `${format(startDate, "dd/MM/yyyy")} - ${format(endDate, "dd/MM/yyyy")}`
        }
        return "Semua Periode"
    }

    const getClassificationName = () => {
        if (classificationId === "all") return "Semua Klasifikasi"
        const classification = classifications.find(c => c.id.toString() === classificationId)
        return classification ? `${classification.code} - ${classification.description}` : ""
    }

    const handleExportPDF = () => {
        if (data.length === 0) {
            toast.error("Tidak ada data untuk diekspor")
            return
        }

        setIsExporting(true)
        try {
            const filters = {
                period: getPeriodInfo(),
                startDate: startDate ? format(startDate, "dd/MM/yyyy") : undefined,
                endDate: endDate ? format(endDate, "dd/MM/yyyy") : undefined,
                classification: getClassificationName()
            }
            exportToPDF(data, "outgoing", filters)
            toast.success("Laporan PDF berhasil diunduh")
        } catch {
            toast.error("Gagal mengekspor PDF")
        } finally {
            setIsExporting(false)
        }
    }

    const handleExportExcel = () => {
        if (data.length === 0) {
            toast.error("Tidak ada data untuk diekspor")
            return
        }

        setIsExporting(true)
        try {
            const filters = {
                period: getPeriodInfo(),
                startDate: startDate ? format(startDate, "dd/MM/yyyy") : undefined,
                endDate: endDate ? format(endDate, "dd/MM/yyyy") : undefined,
                classification: getClassificationName()
            }
            exportToExcel(data, "outgoing", filters)
            toast.success("Laporan Excel berhasil diunduh")
        } catch {
            toast.error("Gagal mengekspor Excel")
        } finally {
            setIsExporting(false)
        }
    }

    const handlePrint = () => {
        if (data.length === 0) {
            toast.error("Tidak ada data untuk dicetak")
            return
        }

        try {
            const filters = {
                period: getPeriodInfo(),
                startDate: startDate ? format(startDate, "dd/MM/yyyy") : undefined,
                endDate: endDate ? format(endDate, "dd/MM/yyyy") : undefined,
                classification: getClassificationName()
            }
            printReport(data, "outgoing", filters)
        } catch {
            toast.error("Gagal mencetak laporan")
        }
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Laporan Surat Keluar</h1>
                    <p className="text-gray-600 mt-1">Kelola dan ekspor laporan surat keluar</p>
                </div>

                {/* Report Filters - Period & Export */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">Filter & Export Laporan</h2>
                    <ReportFilters
                        onExportPDF={handleExportPDF}
                        onExportExcel={handleExportExcel}
                        onPrint={handlePrint}
                        periodType={periodType}
                        onPeriodTypeChange={(value) => setPeriodType(value as "all" | "monthly" | "yearly" | "custom")}
                        selectedMonth={selectedMonth}
                        onMonthChange={setSelectedMonth}
                        selectedYear={selectedYear}
                        onYearChange={setSelectedYear}
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                        isExporting={isExporting}
                    />
                </div>

                {/* Additional Filters */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">Filter Tambahan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Kode Klasifikasi</label>
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
                            <label className="text-sm font-medium text-gray-700">Pencarian</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <Input
                                    placeholder="Cari berdasarkan nomor surat, tujuan, atau perihal..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Data Laporan</h2>
                        <div className="text-sm text-gray-600">
                            Total: <span className="font-semibold text-gray-900">{data.length}</span> data
                        </div>
                    </div>
                    <ReportTable data={data} loading={loading} type="outgoing" />
                </div>
            </div>
        </MainLayout>
    )
}

