"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { ReportTable } from "@/components/report/report-table"
import { useDebounce } from "@/hooks/use-debounce"
import { useClassifications } from "@/hooks/use-classifications"

interface ReportData {
    id: string
    letter_number: string
    sender: string
    subject: string
    code: string | null
    description: string | null
    number_of_copies: number
    archive_file_number: string | null
    incoming_date: string
}

export default function LaporanMasukPage() {
    const [data, setData] = useState<ReportData[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [classificationId, setClassificationId] = useState("all") // Updated default value

    // Debounce search to avoid excessive API calls
    const debouncedSearch = useDebounce(search, 300)
    const { classifications } = useClassifications()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const params = new URLSearchParams()
                if (classificationId !== "all") params.append("classificationId", classificationId)
                if (debouncedSearch) params.append("search", debouncedSearch)

                const response = await fetch(`/api/incoming-letters/archived?${params}`)
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
    }, [classificationId, debouncedSearch])

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <h1 className="text-3xl font-bold text-gray-900">Laporan Surat Masuk</h1>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Kode Klasifikasi</label>
                        <Select value={classificationId} onValueChange={setClassificationId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Klasifikasi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Klasifikasi</SelectItem> {/* Updated value */}
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
                                placeholder="Search...."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <ReportTable data={data} loading={loading} type="incoming" />
            </div>
        </MainLayout>
    )
}
