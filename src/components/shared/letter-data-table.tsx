"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, Edit, FileText } from "lucide-react"
import { TableSkeleton } from "@/components/shared/table-skeleton"
import { toast } from "sonner"

interface BaseLetter {
    id: string
    letter_number: string
    file_url?: string | null
    file_id?: string | null
    file_name?: string | null
    file_type?: string | null
    subject: string
    classification_id: number | null
    number_of_copies: number
    archive_file_number: string | null
    code?: string | null
    description?: string | null
}

interface LetterDataTableProps<T extends BaseLetter> {
    data: T[]
    onEdit: (letter: T) => void
    onDelete: (id: string) => void
    loading: boolean
    apiEndpoint: string
    emptyMessage: string
}

export function LetterDataTable<T extends BaseLetter>({
    data,
    onEdit,
    onDelete,
    loading,
    apiEndpoint,
    emptyMessage
}: LetterDataTableProps<T>) {
    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus surat ini?")) return

        try {
            const response = await fetch(`${apiEndpoint}/${id}`, { method: "DELETE" })
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
        return <TableSkeleton rows={5} columns={7} />
    }

    if (data.length === 0) {
        return <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
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
                            <TableHead className="text-white whitespace-nowrap">File</TableHead>
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
                                <TableCell>
                                    {letter.file_id || letter.file_url ? (
                                        <div className="flex flex-col gap-1">
                                            <a
                                                href={letter.file_id ? `/api/files/${letter.file_id}` : (letter.file_url || '#')}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                            >
                                                <FileText className="w-4 h-4" />
                                                <span className="text-sm">Lihat</span>
                                            </a>
                                            {letter.file_type && (
                                                <span className="text-xs text-gray-500 uppercase">
                                                    {letter.file_type}
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-sm">-</span>
                                    )}
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
