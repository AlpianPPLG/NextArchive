"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface Classification {
    id: number
    code: string
    description: string
}

interface IncomingLetter {
    id: string
    letter_number: string
    sender: string
    incoming_date: string
    subject: string
    classification_id: number | null
    number_of_copies: number
    archive_file_number: string | null
}

interface FormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: () => void
    letter?: IncomingLetter | null
}

export function FormDialog({ open, onOpenChange, onSubmit, letter }: FormDialogProps) {
    const [loading, setLoading] = useState(false)
    const [classifications, setClassifications] = useState<Classification[]>([])
    const [formData, setFormData] = useState({
        letterNumber: "",
        sender: "",
        incomingDate: "",
        subject: "",
        classificationId: "",
        numberOfCopies: "1",
        archiveFileNumber: "",
    })

    useEffect(() => {
        const fetchClassifications = async () => {
            try {
                const response = await fetch("/api/classifications")
                if (response.ok) {
                    const data = await response.json()
                    setClassifications(data)
                }
            } catch (error) {
                console.error("Failed to fetch classifications:", error)
            }
        }

        fetchClassifications()
    }, [])

    useEffect(() => {
        if (letter) {
            setFormData({
                letterNumber: letter.letter_number,
                sender: letter.sender,
                incomingDate: letter.incoming_date,
                subject: letter.subject,
                classificationId: letter.classification_id?.toString() || "",
                numberOfCopies: letter.number_of_copies.toString(),
                archiveFileNumber: letter.archive_file_number || "",
            })
        } else {
            setFormData({
                letterNumber: "",
                sender: "",
                incomingDate: "",
                subject: "",
                classificationId: "",
                numberOfCopies: "1",
                archiveFileNumber: "",
            })
        }
    }, [letter, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = letter ? `/api/incoming-letters/${letter.id}` : "/api/incoming-letters"
            const method = letter ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    letterNumber: formData.letterNumber,
                    sender: formData.sender,
                    incomingDate: formData.incomingDate,
                    subject: formData.subject,
                    classificationId: formData.classificationId ? Number.parseInt(formData.classificationId) : null,
                    numberOfCopies: Number.parseInt(formData.numberOfCopies),
                    archiveFileNumber: formData.archiveFileNumber,
                }),
            })

            if (response.ok) {
                toast.success(letter ? "Surat berhasil diperbarui" : "Surat berhasil ditambahkan")
                onOpenChange(false)
                onSubmit()
            } else {
                const data = await response.json()
                toast.error(data.error || "Gagal menyimpan surat")
            }
        } catch (error) {
            toast.error("Terjadi kesalahan")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{letter ? "Edit Surat Masuk" : "Tambah Surat Masuk"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="letterNumber">No. Surat</Label>
                            <Input
                                id="letterNumber"
                                value={formData.letterNumber}
                                onChange={(e) => setFormData({ ...formData, letterNumber: e.target.value })}
                                placeholder="DIR-123/IX/2025"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="incomingDate">Tanggal Masuk</Label>
                            <Input
                                id="incomingDate"
                                type="date"
                                value={formData.incomingDate}
                                onChange={(e) => setFormData({ ...formData, incomingDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sender">Pengirim</Label>
                        <Input
                            id="sender"
                            value={formData.sender}
                            onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
                            placeholder="Nama Pengirim"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subject">Perihal</Label>
                        <Textarea
                            id="subject"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            placeholder="Uraian Informasi"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="classification">Kode Klasifikasi</Label>
                            <Select
                                value={formData.classificationId}
                                onValueChange={(value) => setFormData({ ...formData, classificationId: value })}
                            >
                                <SelectTrigger id="classification">
                                    <SelectValue placeholder="Pilih Klasifikasi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classifications.map((c) => (
                                        <SelectItem key={c.id} value={c.id.toString()}>
                                            {c.code} - {c.description}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="numberOfCopies">Jumlah</Label>
                            <Input
                                id="numberOfCopies"
                                type="number"
                                min="1"
                                value={formData.numberOfCopies}
                                onChange={(e) => setFormData({ ...formData, numberOfCopies: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="archiveFileNumber">No. Isi Berkas</Label>
                        <Input
                            id="archiveFileNumber"
                            value={formData.archiveFileNumber}
                            onChange={(e) => setFormData({ ...formData, archiveFileNumber: e.target.value })}
                            placeholder="A001"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Batal
                        </Button>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
                            {loading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
