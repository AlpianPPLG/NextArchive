"use client"

import { Calendar, Download, FileSpreadsheet, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface ReportFiltersProps {
    onExportPDF: () => void
    onExportExcel: () => void
    onPrint: () => void
    periodType: "all" | "monthly" | "yearly" | "custom"
    onPeriodTypeChange: (value: string) => void
    selectedMonth?: string
    onMonthChange?: (value: string) => void
    selectedYear?: string
    onYearChange?: (value: string) => void
    startDate?: Date
    endDate?: Date
    onStartDateChange?: (date: Date | undefined) => void
    onEndDateChange?: (date: Date | undefined) => void
    isExporting?: boolean
}

export function ReportFilters({
    onExportPDF,
    onExportExcel,
    onPrint,
    periodType,
    onPeriodTypeChange,
    selectedMonth,
    onMonthChange,
    selectedYear,
    onYearChange,
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    isExporting = false
}: ReportFiltersProps) {
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 10 }, (_, i) => (currentYear - i).toString())

    const months = [
        { value: "01", label: "Januari" },
        { value: "02", label: "Februari" },
        { value: "03", label: "Maret" },
        { value: "04", label: "April" },
        { value: "05", label: "Mei" },
        { value: "06", label: "Juni" },
        { value: "07", label: "Juli" },
        { value: "08", label: "Agustus" },
        { value: "09", label: "September" },
        { value: "10", label: "Oktober" },
        { value: "11", label: "November" },
        { value: "12", label: "Desember" },
    ]

    return (
        <div className="space-y-4">
            {/* Period Selection */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tipe Periode</label>
                    <Select value={periodType} onValueChange={onPeriodTypeChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih Periode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Data</SelectItem>
                            <SelectItem value="monthly">Bulanan</SelectItem>
                            <SelectItem value="yearly">Tahunan</SelectItem>
                            <SelectItem value="custom">Kustom</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {periodType === "monthly" && (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Bulan</label>
                            <Select value={selectedMonth} onValueChange={onMonthChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Bulan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map((month) => (
                                        <SelectItem key={month.value} value={month.value}>
                                            {month.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Tahun</label>
                            <Select value={selectedYear} onValueChange={onYearChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                )}

                {periodType === "yearly" && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Tahun</label>
                        <Select value={selectedYear} onValueChange={onYearChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Tahun" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((year) => (
                                    <SelectItem key={year} value={year}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {periodType === "custom" && (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Tanggal Mulai</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {startDate ? format(startDate, "dd MMM yyyy", { locale: id }) : "Pilih tanggal"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <CalendarComponent
                                        mode="single"
                                        selected={startDate}
                                        onSelect={onStartDateChange}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Tanggal Akhir</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {endDate ? format(endDate, "dd MMM yyyy", { locale: id }) : "Pilih tanggal"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <CalendarComponent
                                        mode="single"
                                        selected={endDate}
                                        onSelect={onEndDateChange}
                                        disabled={(date) => startDate ? date < startDate : false}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </>
                )}
            </div>

            {/* Export Buttons */}
            <div className="flex flex-wrap gap-2">
                <Button
                    onClick={onExportPDF}
                    disabled={isExporting}
                    className="bg-red-600 hover:bg-red-700 text-white"
                >
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                </Button>
                <Button
                    onClick={onExportExcel}
                    disabled={isExporting}
                    className="bg-green-600 hover:bg-green-700 text-white"
                >
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Export Excel
                </Button>
                <Button
                    onClick={onPrint}
                    disabled={isExporting}
                    variant="outline"
                    className="border-gray-300"
                >
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                </Button>
            </div>
        </div>
    )
}
