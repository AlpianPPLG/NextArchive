"use client"

import { LetterDataTable } from "@/components/shared/letter-data-table"

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

interface DataTableProps {
    data: IncomingLetter[]
    onEdit: (letter: IncomingLetter) => void
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
            apiEndpoint="/api/incoming-letters"
            emptyMessage="Tidak ada data surat masuk"
        />
    )
}
