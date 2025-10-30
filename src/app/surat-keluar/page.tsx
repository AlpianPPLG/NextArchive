"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { FormDialog } from "@/components/surat-keluar/form-dialog"
import { DataTable } from "@/components/surat-keluar/data-table"
import { useDebounce } from "@/hooks/use-debounce"

interface OutgoingLetter {
    id: string
    letter_number: string
    destination: string
    outgoing_date: string
    subject: string
    code: string | null
    description: string | null
    classification_id: number | null
    number_of_copies: number
    archive_file_number: string | null
}

function SuratKeluarPage() {
    const [data, setData] = useState<OutgoingLetter[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedLetter, setSelectedLetter] = useState<OutgoingLetter | null>(null)

    // Debounce search to avoid excessive API calls
    const debouncedSearch = useDebounce(search, 300)

    const fetchData = async (searchQuery = "") => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (searchQuery) params.append("search", searchQuery)

            const response = await fetch(`/api/outgoing-letters?${params}`)
            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Failed to fetch data')
            }

            setData(result)
        } catch (error) {
            console.error("Failed to fetch data:", error)
            setData([])
            // You might want to show a toast notification here for better UX
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData(debouncedSearch)
    }, [debouncedSearch])

    const handleEdit = (letter: OutgoingLetter) => {
        setSelectedLetter(letter)
        setDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/outgoing-letters/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete letter');
            }

            setData(data.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Failed to delete letter:', error);
            // You might want to show a toast notification here for better UX
        }
    }

    const handleDialogSubmit = () => {
        setSelectedLetter(null)
        fetchData(debouncedSearch)
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Surat Keluar</h1>
                    <Button onClick={() => setDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                        <Plus className="w-4 h-4 mr-2"/>
                        Tambah Surat
                    </Button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400"/>
                    <Input
                        placeholder="Search...."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

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

export default SuratKeluarPage
