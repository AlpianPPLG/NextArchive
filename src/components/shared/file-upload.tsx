"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, FileText } from "lucide-react"
import { validateFile } from "@/lib/utils/upload"
import { toast } from "sonner"

type FileType = 'pdf' | 'jpg' | 'png' | 'xls' | 'xlsx' | 'csv'

interface FileUploadProps {
    onFileSelect: (file: File) => void
    onFileRemove: () => void
    currentFileUrl?: string
    disabled?: boolean
}

export function FileUpload({ onFileSelect, onFileRemove, currentFileUrl, disabled }: FileUploadProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [selectedFileType, setSelectedFileType] = useState<FileType>('pdf')
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const fileTypeConfig: Record<FileType, { accept: string; label: string; mimeTypes: string[] }> = {
        pdf: { accept: '.pdf', label: 'PDF', mimeTypes: ['application/pdf'] },
        jpg: { accept: '.jpg,.jpeg', label: 'JPG/JPEG', mimeTypes: ['image/jpeg', 'image/jpg'] },
        png: { accept: '.png', label: 'PNG', mimeTypes: ['image/png'] },
        xls: { accept: '.xls', label: 'XLS', mimeTypes: ['application/vnd.ms-excel'] },
        xlsx: { accept: '.xlsx', label: 'XLSX', mimeTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] },
        csv: { accept: '.csv', label: 'CSV', mimeTypes: ['text/csv'] }
    }

    const handleFileChange = (file: File | null) => {
        if (!file) return

        // Validate file type based on selected type
        const config = fileTypeConfig[selectedFileType]
        if (!config.mimeTypes.includes(file.type)) {
            toast.error(`File harus bertipe ${config.label}`)
            return
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Ukuran file maksimal 10MB')
            return
        }

        setSelectedFile(file)
        onFileSelect(file)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files[0]
        handleFileChange(file)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleRemove = () => {
        setSelectedFile(null)
        onFileRemove()
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="space-y-2">
            <Label>Upload Dokumen (Opsional)</Label>
            
            <div className="space-y-2">
                <Label htmlFor="fileType" className="text-sm">Tipe File</Label>
                <Select value={selectedFileType} onValueChange={(value) => setSelectedFileType(value as FileType)} disabled={disabled}>
                    <SelectTrigger id="fileType">
                        <SelectValue placeholder="Pilih tipe file" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="jpg">JPG/JPEG</SelectItem>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="xls">XLS</SelectItem>
                        <SelectItem value="xlsx">XLSX</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {!selectedFile && !currentFileUrl ? (
                <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        isDragging 
                            ? "border-primary bg-primary/5" 
                            : "border-muted-foreground/25 hover:border-primary/50"
                    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={!disabled ? handleClick : undefined}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept={fileTypeConfig[selectedFileType].accept}
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                        disabled={disabled}
                        aria-label={`Upload file ${fileTypeConfig[selectedFileType].label}`}
                        title={`Upload file ${fileTypeConfig[selectedFileType].label}`}
                    />
                    <div className="flex flex-col items-center gap-2">
                        <Upload className="h-10 w-10 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Klik atau drag & drop file</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {fileTypeConfig[selectedFileType].label} (Maks. 10MB)
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="border rounded-lg p-4 flex items-center justify-between bg-muted/30">
                    <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                            <p className="text-sm font-medium">
                                {selectedFile?.name || "File saat ini"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {selectedFile
                                    ? `${(selectedFile.size / 1024).toFixed(2)} KB`
                                    : "File sudah diupload"
                                }
                            </p>
                        </div>
                    </div>
                    {!disabled && (
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={handleRemove}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            )}

            {currentFileUrl && !selectedFile && (
                <a
                    href={currentFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                >
                    <FileText className="h-3 w-3" />
                    Lihat file yang sudah diupload
                </a>
            )}
        </div>
    )
}

