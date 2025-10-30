"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, Edit } from "lucide-react"
import { toast } from "sonner"

interface IncomingLetter {
    id: string
    letter_number: string
    sender: string
    incoming_date: string
    subject: string
    code: string | null
    description: string | null
    classification_id: number | null
    number_of_copies: number
    archive_file_number: string | null
}

interface DataTableProps {
    data: IncomingLetter[]
    onEdit: (letter: IncomingLetter) => void
    onDelete: (id: string) => void
    loading: boolean
}

export function DataTable({ data, onEdit, onDelete, loading }: DataTableProps) {
    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus surat ini?")) return

        try {
            const response = await fetch(`/api/incoming-letters/${id}`, { method: "DELETE" })
            if (response.ok) {
                toast.success("Surat berhasil dihapus")
                onDelete(id)
            } else {
                toast.error("Gagal menghapus surat")
            }
        } catch (error) {
            toast.error("Terjadi kesalahan")
            console.error(error)
        }
    }

    if (loading) {
        return <div className="text-center py-8 text-gray-500">Memuat data...</div>
    }

    if (data.length === 0) {
        return <div className="text-center py-8 text-gray-500">Tidak ada data surat masuk</div>
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <Table className="min-w-[800px]">
                    <TableHeader>
                        <TableRow className="bg-green-600 hover:bg-green-600">
                            <TableHead className="text-white whitespace-nowrap">No. Urut</TableHead>
                            <TableHead className="text-white whitespace-nowrap">Kode Klasifikasi</TableHead>
                            <TableHead className="text-white whitespace-nowrap">Uraian Informasi</TableHead>
                            <TableHead className="text-white whitespace-nowrap">Jumlah</TableHead>
                            <TableHead className="text-white whitespace-nowrap">No. Isi Berkas</TableHead>
                            <TableHead className="text-white whitespace-nowrap">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((letter, index) => (
                            <TableRow key={letter.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell className="whitespace-nowrap">{letter.code || "-"}</TableCell>
                                <TableCell className="max-w-[300px] truncate" title={letter.subject}>
                                    {letter.subject}
                                </TableCell>
                                <TableCell>{letter.number_of_copies}</TableCell>
                                <TableCell className="whitespace-nowrap">{letter.archive_file_number || "-"}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2 whitespace-nowrap">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => onEdit(letter)}
                                            className="text-green-600 hover:bg-green-50"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDelete(letter.id)}
                                            className="text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
