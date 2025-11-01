"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, FileText } from "lucide-react"
import { validateFile } from "@/lib/utils/upload"
import { toast } from "sonner"

interface FileUploadProps {
    onFileSelect: (file: File) => void
    onFileRemove: () => void
    currentFileUrl?: string
    disabled?: boolean
}

export function FileUpload({ onFileSelect, onFileRemove, currentFileUrl, disabled }: FileUploadProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (file: File | null) => {
        if (!file) return

        const validation = validateFile(file)
        if (!validation.valid) {
            toast.error(validation.error || "File tidak valid")
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
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                        disabled={disabled}
                    />
                    <div className="flex flex-col items-center gap-2">
                        <Upload className="h-10 w-10 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Klik atau drag & drop file</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                PDF, DOC, DOCX, JPG, PNG (Maks. 10MB)
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

