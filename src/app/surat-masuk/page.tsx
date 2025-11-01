"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { FormDialog } from "@/components/surat-masuk/form-dialog"
import { DataTable } from "@/components/surat-masuk/data-table"
import { AdvancedSearch, SearchFilters } from "@/components/shared/advanced-search"
import { Classification } from "@/lib/types"

interface IncomingLetter {
    id: string
    letter_number: string
    sender: string
    incoming_date: string
    subject: string
    file_url?: string
    classification_id: number | null
    number_of_copies: number
    archive_file_number: string | null
    code?: string
    description?: string
}

export default function SuratMasukPage() {
    const [data, setData] = useState<IncomingLetter[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedLetter, setSelectedLetter] = useState<IncomingLetter | null>(null)
    const [classifications, setClassifications] = useState<Classification[]>([])

    const fetchData = async (filters?: SearchFilters) => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (filters?.search) params.append("search", filters.search)
            if (filters?.startDate) params.append("startDate", filters.startDate)
            if (filters?.endDate) params.append("endDate", filters.endDate)
            if (filters?.classification && filters.classification !== "all") {
                params.append("classificationId", filters.classification)
            }
            if (filters?.sender) params.append("sender", filters.sender)

            const response = await fetch(`/api/incoming-letters?${params}`)
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
        fetchData()
    }, [])

    const handleSearch = (filters: SearchFilters) => {
        fetchData(filters)
    }

    const handleEdit = (letter: IncomingLetter) => {
        setSelectedLetter(letter)
        setDialogOpen(true)
    }

    const handleDelete = (id: string) => {
        setData(data.filter((item) => item.id !== id))
    }

    const handleDialogSubmit = () => {
        setSelectedLetter(null)
        fetchData()
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Surat Masuk</h1>
                    <Button onClick={() => setDialogOpen(true)} className="bg-green-600 hover:bg-green-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Surat
                    </Button>
                </div>

                {/* Advanced Search */}
                <AdvancedSearch
                    onSearch={handleSearch}
                    classifications={classifications}
                    type="incoming"
                />

                {/* Table */}
                <DataTable data={data} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />
            </div>

            {/* Form Dialog */}
            <FormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleDialogSubmit}
                letter={selectedLetter}
            />
        </MainLayout>
    )
}
