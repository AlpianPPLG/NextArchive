"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { FormDialog } from "@/components/surat-masuk/form-dialog"
import { DataTable } from "@/components/surat-masuk/data-table"

interface IncomingLetter {
    id: string
    letter_number: string
    sender: string
    incoming_date: string
    subject: string
    classification_id: number | null
    number_of_copies: number
    archive_file_number: string | null
    code?: string
    description?: string
}

export default function SuratMasukPage() {
    const [data, setData] = useState<IncomingLetter[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedLetter, setSelectedLetter] = useState<IncomingLetter | null>(null)

    const fetchData = async (searchQuery = "") => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (searchQuery) params.append("search", searchQuery)

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
        fetchData()
    }, [])

    const handleSearch = (value: string) => {
        setSearch(value)
        fetchData(value)
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
        fetchData(search)
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Surat Masuk</h1>
                    <Button onClick={() => setDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Surat
                    </Button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Search...."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

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
