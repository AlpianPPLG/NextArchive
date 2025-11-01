"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/shared/file-upload"
import { toast } from "sonner"

interface Classification {
    id: number
    code: string
    description: string
}

interface OutgoingLetter {
    id: string
    letter_number: string
    destination: string
    outgoing_date: string
    subject: string
    file_url?: string | null
    classification_id: number | null
    number_of_copies: number
    archive_file_number: string | null
}

interface FormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: () => void
    letter?: OutgoingLetter | null
}

export function FormDialog({ open, onOpenChange, onSubmit, letter }: FormDialogProps) {
    const [loading, setLoading] = useState(false)
    const [classifications, setClassifications] = useState<Classification[]>([])
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [formData, setFormData] = useState({
        letterNumber: "",
        destination: "",
        outgoingDate: "",
        subject: "",
        classificationId: "",
        numberOfCopies: "1",
        archiveFileNumber: "",
        fileUrl: "",
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
                destination: letter.destination,
                outgoingDate: letter.outgoing_date,
                fileUrl: letter.file_url || "",
                subject: letter.subject,
                classificationId: letter.classification_id?.toString() || "",
                numberOfCopies: letter.number_of_copies.toString(),
                archiveFileNumber: letter.archive_file_number || "",
            })
        } else {
            setFormData({
                letterNumber: "",
                destination: "",
                outgoingDate: "",
                fileUrl: "",
                subject: "",
                classificationId: "",
                numberOfCopies: "1",
                archiveFileNumber: "",
            })
        }
        setSelectedFile(null)
    }, [letter, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            let fileUrl = formData.fileUrl

            // Upload file if selected
            if (selectedFile) {
                const uploadFormData = new FormData()
                uploadFormData.append('file', selectedFile)

                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadFormData,
                })

                if (uploadResponse.ok) {
                    const uploadData = await uploadResponse.json()
                    fileUrl = uploadData.url
                } else {
                    toast.error("Gagal mengupload file")
                    setLoading(false)
                    return
                }
            }

            const url = letter ? `/api/outgoing-letters/${letter.id}` : "/api/outgoing-letters"
            const method = letter ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    letterNumber: formData.letterNumber,
                    destination: formData.destination,
                    outgoingDate: formData.outgoingDate,
                    subject: formData.subject,
                    fileUrl: fileUrl || null,
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
                    <DialogTitle>{letter ? "Edit Surat Keluar" : "Tambah Surat Keluar"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="letterNumber">No. Surat</Label>
                            <Input
                                id="letterNumber"
                                value={formData.letterNumber}
                                onChange={(e) => setFormData({ ...formData, letterNumber: e.target.value })}
                                placeholder="BALAS/2025/001"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="outgoingDate">Tanggal Keluar</Label>
                            <Input
                                id="outgoingDate"
                                type="date"
                                value={formData.outgoingDate}
                                onChange={(e) => setFormData({ ...formData, outgoingDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="destination">Tujuan</Label>
                        <Input
                            id="destination"
                            value={formData.destination}
                            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                            placeholder="Nama Tujuan"
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
                            placeholder="A002"
                        />
                    </div>

                    <FileUpload
                        onFileSelect={(file) => setSelectedFile(file)}
                        onFileRemove={() => setSelectedFile(null)}
                        currentFileUrl={formData.fileUrl}
                        disabled={loading}
                    />

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
