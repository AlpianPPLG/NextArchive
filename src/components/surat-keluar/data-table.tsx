"use client"

import { LetterDataTable } from "@/components/shared/letter-data-table"

interface OutgoingLetter {
    id: string
    letter_number: string
    destination: string
    outgoing_date: string
    subject: string
    classification_id: number | null
    code: string | null
    description: string | null
    number_of_copies: number
    archive_file_number: string | null
}

interface DataTableProps {
    data: OutgoingLetter[]
    onEdit: (letter: OutgoingLetter) => void
    onDelete: (id: string) => void
    loading: boolean
}

export function DataTable({ data, onEdit, onDelete, loading }: DataTableProps) {
    return (
        <LetterDataTable
            data={data}
            onEdit={onEdit}
            onDelete={onDelete}
            loading={loading}
            apiEndpoint="/api/outgoing-letters"
            emptyMessage="Tidak ada data surat keluar"
        />
    )
}
