import { put } from '@vercel/blob'

export async function uploadFile(file: File): Promise<string> {
    try {
        const blob = await put(file.name, file, {
            access: 'public',
        })
        return blob.url
    } catch (error) {
        console.error('Error uploading file:', error)
        throw new Error('Failed to upload file')
    }
}

export function validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png'
    ]

    if (file.size > maxSize) {
        return { valid: false, error: 'Ukuran file maksimal 10MB' }
    }

    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'Tipe file tidak didukung. Gunakan PDF, DOC, DOCX, atau gambar' }
    }

    return { valid: true }
}

