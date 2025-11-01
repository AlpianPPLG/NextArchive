"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileSpreadsheet, FileText, Printer } from "lucide-react"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface ReportData {
    letter_number: string
    sender?: string
    destination?: string
    incoming_date?: string
    outgoing_date?: string
    subject: string
    code: string | null
    description?: string
    number_of_copies: number
    archive_file_number: string | null
}

interface ExportReportProps {
    data: ReportData[]
    reportType: "incoming" | "outgoing"
    title: string
    period?: { startDate?: string; endDate?: string }
}

export function ExportReport({ data, reportType, title, period }: ExportReportProps) {
    const [exporting, setExporting] = useState(false)

    // Export to Excel
    const exportToExcel = () => {
        try {
            setExporting(true)

            // Prepare data for Excel
            const excelData = data.map((item, index) => ({
                "No": index + 1,
                "No. Surat": item.letter_number,
                [reportType === "incoming" ? "Pengirim" : "Tujuan"]: 
                    reportType === "incoming" ? item.sender : item.destination,
                "Tanggal": new Date(
                    (reportType === "incoming" ? item.incoming_date : item.outgoing_date) || ""
                ).toLocaleDateString("id-ID"),
                "Perihal": item.subject,
                "Klasifikasi": item.code ? `${item.code} - ${item.description}` : "-",
                "Jumlah": item.number_of_copies,
                "No. Berkas": item.archive_file_number || "-"
            }))

            // Create workbook and worksheet
            const wb = XLSX.utils.book_new()
            const ws = XLSX.utils.json_to_sheet(excelData)

            // Set column widths
            ws["!cols"] = [
                { wch: 5 },  // No
                { wch: 20 }, // No. Surat
                { wch: 25 }, // Pengirim/Tujuan
                { wch: 15 }, // Tanggal
                { wch: 40 }, // Perihal
                { wch: 30 }, // Klasifikasi
                { wch: 10 }, // Jumlah
                { wch: 15 }  // No. Berkas
            ]

            XLSX.utils.book_append_sheet(wb, ws, "Laporan")

            // Generate filename
            const filename = `${title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`

            // Download
            XLSX.writeFile(wb, filename)
            toast.success("Laporan berhasil diexport ke Excel")
        } catch (error) {
            console.error("Export error:", error)
            toast.error("Gagal export laporan")
        } finally {
            setExporting(false)
        }
    }

    // Export to PDF
    const exportToPDF = () => {
        try {
            setExporting(true)

            const doc = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4"
            })

            // Add title
            doc.setFontSize(16)
            doc.text(title, 14, 15)

            // Add period if exists
            if (period?.startDate && period?.endDate) {
                doc.setFontSize(10)
                doc.text(
                    `Periode: ${new Date(period.startDate).toLocaleDateString("id-ID")} - ${new Date(period.endDate).toLocaleDateString("id-ID")}`,
                    14,
                    22
                )
            }

            // Add date generated
            doc.setFontSize(8)
            doc.text(
                `Dicetak: ${new Date().toLocaleString("id-ID")}`,
                14,
                period?.startDate ? 28 : 22
            )

            // Prepare table data
            const tableData = data.map((item, index) => [
                index + 1,
                item.letter_number,
                reportType === "incoming" ? (item.sender || "-") : (item.destination || "-"),
                new Date(
                    (reportType === "incoming" ? item.incoming_date : item.outgoing_date) || ""
                ).toLocaleDateString("id-ID"),
                item.subject.length > 40 ? item.subject.substring(0, 37) + "..." : item.subject,
                item.code || "-",
                item.number_of_copies,
                item.archive_file_number || "-"
            ])

            // Add table
            autoTable(doc, {
                startY: period?.startDate ? 32 : 26,
                head: [[
                    "No",
                    "No. Surat",
                    reportType === "incoming" ? "Pengirim" : "Tujuan",
                    "Tanggal",
                    "Perihal",
                    "Klasifikasi",
                    "Jumlah",
                    "No. Berkas"
                ]],
                body: tableData,
                theme: "grid",
                headStyles: {
                    fillColor: [34, 197, 94], // green-500
                    textColor: 255,
                    fontStyle: "bold"
                },
                styles: {
                    fontSize: 8,
                    cellPadding: 2
                },
                columnStyles: {
                    0: { cellWidth: 10 },  // No
                    1: { cellWidth: 30 },  // No. Surat
                    2: { cellWidth: 35 },  // Pengirim/Tujuan
                    3: { cellWidth: 25 },  // Tanggal
                    4: { cellWidth: 60 },  // Perihal
                    5: { cellWidth: 25 },  // Klasifikasi
                    6: { cellWidth: 15 },  // Jumlah
                    7: { cellWidth: 20 }   // No. Berkas
                }
            })

            // Add footer with page numbers
            const pageCount = doc.getNumberOfPages()
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i)
                doc.setFontSize(8)
                doc.text(
                    `Halaman ${i} dari ${pageCount}`,
                    doc.internal.pageSize.width / 2,
                    doc.internal.pageSize.height - 10,
                    { align: "center" }
                )
            }

            // Generate filename
            const filename = `${title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`

            // Download
            doc.save(filename)
            toast.success("Laporan berhasil diexport ke PDF")
        } catch (error) {
            console.error("Export error:", error)
            toast.error("Gagal export laporan")
        } finally {
            setExporting(false)
        }
    }

    // Print Report
    const printReport = () => {
        try {
            const printWindow = window.open("", "_blank")
            if (!printWindow) {
                toast.error("Popup blocked. Mohon izinkan popup untuk print.")
                return
            }

            const tableRows = data.map((item, index) => `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${index + 1}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.letter_number}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">
                        ${reportType === "incoming" ? (item.sender || "-") : (item.destination || "-")}
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                        ${new Date(
                            (reportType === "incoming" ? item.incoming_date : item.outgoing_date) || ""
                        ).toLocaleDateString("id-ID")}
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.subject}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.code || "-"}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.number_of_copies}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.archive_file_number || "-"}</td>
                </tr>
            `).join("")

            const html = `
                <!DOCTYPE html>
                <html lang="id">
                <head>
                    <title>${title}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                        }
                        h1 {
                            text-align: center;
                            color: #333;
                            margin-bottom: 10px;
                        }
                        .period {
                            text-align: center;
                            color: #666;
                            margin-bottom: 20px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                        }
                        th {
                            background-color: #22c55e;
                            color: white;
                            padding: 12px;
                            text-align: left;
                            border: 1px solid #ddd;
                        }
                        @media print {
                            button { display: none; }
                            @page { margin: 1cm; }
                        }
                        .print-button {
                            background-color: #22c55e;
                            color: white;
                            padding: 10px 20px;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            margin: 20px auto;
                            display: block;
                        }
                    </style>
                </head>
                <body>
                    <h1>${title}</h1>
                    ${period?.startDate && period?.endDate ? `
                        <p class="period">
                            Periode: ${new Date(period.startDate).toLocaleDateString("id-ID")} - 
                            ${new Date(period.endDate).toLocaleDateString("id-ID")}
                        </p>
                    ` : ""}
                    <p style="text-align: center; color: #666; font-size: 12px;">
                        Dicetak: ${new Date().toLocaleString("id-ID")}
                    </p>
                    <button class="print-button" onclick="window.print()">🖨️ Print Laporan</button>
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>No. Surat</th>
                                <th>${reportType === "incoming" ? "Pengirim" : "Tujuan"}</th>
                                <th>Tanggal</th>
                                <th>Perihal</th>
                                <th>Klasifikasi</th>
                                <th>Jumlah</th>
                                <th>No. Berkas</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </body>
                </html>
            `

            printWindow.document.write(html)
            printWindow.document.close()
            toast.success("Laporan siap untuk dicetak")
        } catch (error) {
            console.error("Print error:", error)
            toast.error("Gagal membuka halaman print")
        }
    }

    return (
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Laporan</h3>
                    <p className="text-sm text-gray-600">
                        Download atau cetak laporan dalam format Excel, PDF, atau Print
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button
                        onClick={exportToExcel}
                        disabled={exporting || data.length === 0}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Export ke Excel
                    </Button>

                    <Button
                        onClick={exportToPDF}
                        disabled={exporting || data.length === 0}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Export ke PDF
                    </Button>

                    <Button
                        onClick={printReport}
                        disabled={exporting || data.length === 0}
                        variant="outline"
                        className="border-green-600 text-green-600 hover:bg-green-50"
                    >
                        <Printer className="w-4 h-4 mr-2" />
                        Print Laporan
                    </Button>
                </div>

                {data.length === 0 && (
                    <p className="text-sm text-gray-500 text-center">
                        Tidak ada data untuk diexport. Silakan lakukan pencarian terlebih dahulu.
                    </p>
                )}
            </div>
        </Card>
    )
}
