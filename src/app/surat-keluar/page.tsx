"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { FormDialog } from "@/components/surat-keluar/form-dialog"
import { DataTable } from "@/components/surat-keluar/data-table"
import { AdvancedSearch, SearchFilters } from "@/components/shared/advanced-search"
import { Classification } from "@/lib/types"

interface OutgoingLetter {
    id: string
    letter_number: string
    destination: string
    outgoing_date: string
    subject: string
    file_url?: string
    classification_id: number | null
    code: string | null
    description: string | null
    number_of_copies: number
    archive_file_number: string | null
}

export default function SuratKeluarPage() {
    const [data, setData] = useState<OutgoingLetter[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedLetter, setSelectedLetter] = useState<OutgoingLetter | null>(null)
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
            if (filters?.destination) params.append("destination", filters.destination)

            const response = await fetch(`/api/outgoing-letters?${params}`)
            const result = await response.json()

            if (response.ok) {
                setData(result)
            } else {
                console.error("Failed to fetch data:", result.error || 'Failed to fetch data')
                setData([])
            }
        } catch (error) {
            console.error("Failed to fetch data:", error)
            setData([])
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
        void fetchData()
    }, [])

    const handleSearch = (filters: SearchFilters) => {
        fetchData(filters)
    }

    const handleEdit = (letter: OutgoingLetter) => {
        setSelectedLetter(letter)
        setDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/outgoing-letters/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setData(data.filter((item) => item.id !== id));
            } else {
                const error = await response.json();
                console.error('Failed to delete letter:', error.message || 'Failed to delete letter');
            }
        } catch (error) {
            console.error('Failed to delete letter:', error);
        }
    }

    const handleDialogSubmit = () => {
        setSelectedLetter(null)
        void fetchData()
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Surat Keluar</h1>
                    <Button onClick={() => setDialogOpen(true)} className="bg-green-600 hover:bg-green-700 text-white">
                        <Plus className="w-4 h-4 mr-2"/>
                        Tambah Surat
                    </Button>
                </div>

                {/* Advanced Search */}
                <AdvancedSearch
                    onSearch={handleSearch}
                    classifications={classifications}
                    type="outgoing"
                />

                {/* Table */}
                <DataTable data={data} onEdit={handleEdit} onDelete={handleDelete} loading={loading}/>
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
