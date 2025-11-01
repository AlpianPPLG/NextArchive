"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ReportData {
    id: string
    letter_number: string
    sender?: string
    destination?: string
    subject: string
    code: string | null
    description?: string
    number_of_copies: number
    archive_file_number: string | null
    incoming_date?: string
    outgoing_date?: string
}

interface ReportTableProps {
    data: ReportData[]
    loading: boolean
    type: "incoming" | "outgoing"
}

export function ReportTable({ data, loading, type }: ReportTableProps) {
    if (loading) {
        return <div className="text-center py-8 text-gray-500">Memuat data...</div>
    }

    if (data.length === 0) {
        return <div className="text-center py-8 text-gray-500">Tidak ada data laporan</div>
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
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell className="whitespace-nowrap">{item.code || "-"}</TableCell>
                                <TableCell className="max-w-[300px] truncate" title={item.subject}>
                                    {item.subject}
                                </TableCell>
                                <TableCell>{item.number_of_copies}</TableCell>
                                <TableCell className="whitespace-nowrap">{item.archive_file_number || "-"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
