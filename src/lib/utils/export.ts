import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import { format } from "date-fns"

interface ReportData {
    id: string
    letter_number: string
    sender?: string
    destination?: string
    subject: string
    code: string | null
    description: string | null
    number_of_copies: number
    archive_file_number: string | null
    incoming_date?: string
    outgoing_date?: string
}

export const exportToPDF = (
    data: ReportData[],
    type: "incoming" | "outgoing",
    filters: {
        period?: string
        startDate?: string
        endDate?: string
        classification?: string
    }
) => {
    const doc = new jsPDF()

    // Title
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    const title = type === "incoming" ? "LAPORAN SURAT MASUK" : "LAPORAN SURAT KELUAR"
    doc.text(title, 105, 15, { align: "center" })

    // Subtitle with filters
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    let yPos = 25

    if (filters.period) {
        doc.text(`Periode: ${filters.period}`, 14, yPos)
        yPos += 5
    }

    if (filters.startDate && filters.endDate) {
        doc.text(`Tanggal: ${filters.startDate} s/d ${filters.endDate}`, 14, yPos)
        yPos += 5
    }

    if (filters.classification && filters.classification !== "all") {
        doc.text(`Klasifikasi: ${filters.classification}`, 14, yPos)
        yPos += 5
    }

    doc.text(`Total Data: ${data.length}`, 14, yPos)
    doc.text(`Dicetak: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 14, yPos + 5)

    // Table
    const tableData = data.map((item, index) => [
        (index + 1).toString(),
        item.letter_number,
        type === "incoming" ? (item.sender || "-") : (item.destination || "-"),
        item.subject,
        item.code || "-",
        item.number_of_copies.toString(),
        item.archive_file_number || "-",
        type === "incoming"
            ? format(new Date(item.incoming_date!), "dd/MM/yyyy")
            : format(new Date(item.outgoing_date!), "dd/MM/yyyy")
    ])

    autoTable(doc, {
        startY: yPos + 10,
        head: [[
            "No",
            "No. Surat",
            type === "incoming" ? "Pengirim" : "Tujuan",
            "Perihal",
            "Kode",
            "Jml",
            "No. Berkas",
            "Tanggal"
        ]],
        body: tableData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [34, 197, 94], textColor: 255 },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        margin: { top: 10 },
    })

    // Footer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pageCount = (doc as any).internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.text(
            `Halaman ${i} dari ${pageCount}`,
            105,
            doc.internal.pageSize.height - 10,
            { align: "center" }
        )
    }

    const fileName = `laporan-${type === "incoming" ? "masuk" : "keluar"}-${format(new Date(), "yyyyMMdd-HHmmss")}.pdf`
    doc.save(fileName)
}

export const exportToExcel = (
    data: ReportData[],
    type: "incoming" | "outgoing",
    filters: {
        period?: string
        startDate?: string
        endDate?: string
        classification?: string
    }
) => {
    // Prepare data for Excel
    const excelData = data.map((item, index) => ({
        "No": index + 1,
        "No. Surat": item.letter_number,
        [type === "incoming" ? "Pengirim" : "Tujuan"]: type === "incoming" ? item.sender : item.destination,
        "Perihal": item.subject,
        "Kode Klasifikasi": item.code || "-",
        "Deskripsi": item.description || "-",
        "Jumlah": item.number_of_copies,
        "No. Berkas": item.archive_file_number || "-",
        "Tanggal": type === "incoming"
            ? format(new Date(item.incoming_date!), "dd/MM/yyyy")
            : format(new Date(item.outgoing_date!), "dd/MM/yyyy")
    }))

    // Create workbook
    const wb = XLSX.utils.book_new()

    // Add metadata sheet
    const metaData = [
        ["LAPORAN SURAT " + (type === "incoming" ? "MASUK" : "KELUAR")],
        [""],
        ["Periode", filters.period || "-"],
        ["Tanggal", filters.startDate && filters.endDate ? `${filters.startDate} s/d ${filters.endDate}` : "-"],
        ["Klasifikasi", filters.classification && filters.classification !== "all" ? filters.classification : "Semua"],
        ["Total Data", data.length],
        ["Dicetak", format(new Date(), "dd/MM/yyyy HH:mm:ss")],
        [""],
    ]

    const wsData = [...metaData, Object.keys(excelData[0] || {}), ...excelData.map(obj => Object.values(obj))]
    const ws = XLSX.utils.aoa_to_sheet(wsData)

    // Set column widths
    ws["!cols"] = [
        { wch: 5 },  // No
        { wch: 20 }, // No. Surat
        { wch: 25 }, // Pengirim/Tujuan
        { wch: 40 }, // Perihal
        { wch: 15 }, // Kode
        { wch: 30 }, // Deskripsi
        { wch: 8 },  // Jumlah
        { wch: 15 }, // No. Berkas
        { wch: 12 }, // Tanggal
    ]

    XLSX.utils.book_append_sheet(wb, ws, "Laporan")

    // Save file
    const fileName = `laporan-${type === "incoming" ? "masuk" : "keluar"}-${format(new Date(), "yyyyMMdd-HHmmss")}.xlsx`
    XLSX.writeFile(wb, fileName)
}

export const printReport = (
    data: ReportData[],
    type: "incoming" | "outgoing",
    filters: {
        period?: string
        startDate?: string
        endDate?: string
        classification?: string
    }
) => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const title = type === "incoming" ? "LAPORAN SURAT MASUK" : "LAPORAN SURAT KELUAR"

    const tableRows = data.map((item, index) => `
        <tr>
            <td class="border border-gray-300 px-2 py-1 text-center">${index + 1}</td>
            <td class="border border-gray-300 px-2 py-1">${item.code || "-"}</td>
            <td class="border border-gray-300 px-2 py-1">${item.subject}</td>
            <td class="border border-gray-300 px-2 py-1 text-center">${item.number_of_copies}</td>
            <td class="border border-gray-300 px-2 py-1">${item.archive_file_number || "-"}</td>
            <td class="border border-gray-300 px-2 py-1 text-center">${
                type === "incoming" 
                    ? format(new Date(item.incoming_date!), "dd/MM/yyyy")
                    : format(new Date(item.outgoing_date!), "dd/MM/yyyy")
            }</td>
        </tr>
    `).join("")

    const html = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <title>${title}</title>
            <style>
                @page {
                    size: A4;
                    margin: 1cm;
                }
                body {
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                    margin: 0;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .header h1 {
                    margin: 0 0 10px 0;
                    font-size: 18px;
                    text-transform: uppercase;
                }
                .info {
                    margin-bottom: 15px;
                    font-size: 11px;
                }
                .info-row {
                    margin-bottom: 3px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                th {
                    background-color: #22c55e;
                    color: white;
                    font-weight: bold;
                    padding: 8px;
                    border: 1px solid #000;
                    font-size: 11px;
                }
                td {
                    font-size: 10px;
                }
                .footer {
                    margin-top: 30px;
                    text-align: right;
                    font-size: 11px;
                }
                @media print {
                    body {
                        padding: 0;
                    }
                    .no-print {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>${title}</h1>
            </div>
            
            <div class="info">
                ${filters.period ? `<div class="info-row"><strong>Periode:</strong> ${filters.period}</div>` : ""}
                ${filters.startDate && filters.endDate ? `<div class="info-row"><strong>Tanggal:</strong> ${filters.startDate} s/d ${filters.endDate}</div>` : ""}
                ${filters.classification && filters.classification !== "all" ? `<div class="info-row"><strong>Klasifikasi:</strong> ${filters.classification}</div>` : ""}
                <div class="info-row"><strong>Total Data:</strong> ${data.length}</div>
                <div class="info-row"><strong>Dicetak:</strong> ${format(new Date(), "dd/MM/yyyy HH:mm:ss")}</div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th style="width: 5%">No</th>
                        <th style="width: 12%">Kode Klasifikasi</th>
                        <th style="width: 40%">Uraian Informasi</th>
                        <th style="width: 8%">Jumlah</th>
                        <th style="width: 15%">No. Isi Berkas</th>
                        <th style="width: 12%">Tanggal</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
            
            <div class="footer">
                <p>Dicetak pada: ${format(new Date(), "dd MMMM yyyy, HH:mm:ss")}</p>
            </div>
            
            <script>
                window.onload = function() {
                    window.print();
                }
            </script>
        </body>
        </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
}

