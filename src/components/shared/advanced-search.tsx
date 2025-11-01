"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Search, X, Filter } from "lucide-react"
import { Classification } from "@/lib/types"

interface AdvancedSearchProps {
    onSearch: (filters: SearchFilters) => void
    classifications: Classification[]
    type: "incoming" | "outgoing"
}

export interface SearchFilters {
    search: string
    startDate: string
    endDate: string
    classification: string
    sender?: string
    destination?: string
}

export function AdvancedSearch({ onSearch, classifications, type }: AdvancedSearchProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [filters, setFilters] = useState<SearchFilters>({
        search: "",
        startDate: "",
        endDate: "",
        classification: "",
        sender: "",
        destination: ""
    })

    const handleSearch = () => {
        onSearch(filters)
        setIsOpen(false)
    }

    const handleReset = () => {
        const resetFilters = {
            search: "",
            startDate: "",
            endDate: "",
            classification: "",
            sender: "",
            destination: ""
        }
        setFilters(resetFilters)
        onSearch(resetFilters)
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Cari berdasarkan nomor surat, subjek..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="pl-10"
                    />
                </div>
                <Button
                    variant={isOpen ? "default" : "outline"}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                </Button>
                <Button onClick={handleSearch}>
                    <Search className="h-4 w-4 mr-2" />
                    Cari
                </Button>
            </div>

            {isOpen && (
                <Card className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Tanggal Mulai</Label>
                            <Input
                                type="date"
                                value={filters.startDate}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Tanggal Akhir</Label>
                            <Input
                                type="date"
                                value={filters.endDate}
                                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Klasifikasi</Label>
                            <Select
                                value={filters.classification}
                                onValueChange={(value) => setFilters({ ...filters, classification: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih klasifikasi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Klasifikasi</SelectItem>
                                    {classifications.map((cls) => (
                                        <SelectItem key={cls.id} value={cls.id.toString()}>
                                            {cls.code} - {cls.description}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {type === "incoming" && (
                            <div className="space-y-2">
                                <Label>Pengirim</Label>
                                <Input
                                    placeholder="Nama pengirim"
                                    value={filters.sender}
                                    onChange={(e) => setFilters({ ...filters, sender: e.target.value })}
                                />
                            </div>
                        )}

                        {type === "outgoing" && (
                            <div className="space-y-2">
                                <Label>Tujuan</Label>
                                <Input
                                    placeholder="Nama tujuan"
                                    value={filters.destination}
                                    onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 mt-4">
                        <Button onClick={handleSearch} className="flex-1">
                            Terapkan Filter
                        </Button>
                        <Button variant="outline" onClick={handleReset}>
                            <X className="h-4 w-4 mr-2" />
                            Reset
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    )
}
