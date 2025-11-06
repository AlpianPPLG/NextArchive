import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'

interface FileUpload {
    id: string
    originalName: string
    fileType: string
    fileSize: number
}

const allowedFileTypes = new Map([
    ['application/pdf', 'pdf'],
    ['image/png', 'png'],
    ['image/jpeg', 'jpg'],
    ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'xlsx'],
    ['application/vnd.ms-excel', 'xls'],
    ['text/csv', 'csv'],
])

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("auth_token")?.value
        const payload = verifyToken(token || "")

        if (!payload) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const formData = await request.formData()
        const file = formData.get('file') as File | null
        const referenceType = formData.get('referenceType') as string
        const referenceId = formData.get('referenceId') as string

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        // Validate reference type
        if (!['incoming_letter', 'outgoing_letter'].includes(referenceType)) {
            return NextResponse.json(
                { error: 'Invalid reference type' },
                { status: 400 }
            )
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File size exceeds 10MB limit' },
                { status: 400 }
            )
        }

        const fileType = allowedFileTypes.get(file.type)
        if (!fileType) {
            return NextResponse.json(
                { error: 'File type not allowed' },
                { status: 400 }
            )
        }

        // Convert file to Buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const fileId = uuidv4()

        // Store file in database
        await db.execute(
            `INSERT INTO files (id, original_name, file_data, file_type, file_size, uploaded_by_user_id, reference_type, reference_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                fileId,
                file.name,
                buffer,
                fileType,
                file.size,
                payload.userId,
                referenceType,
                referenceId,
            ]
        )

        const response: FileUpload = {
            id: fileId,
            originalName: file.name,
            fileType: fileType,
            fileSize: file.size,
        }

        // Return file URL that points to our file retrieval endpoint
        return NextResponse.json({
            ...response,
            url: `/api/files/${fileId}`
        })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        )
    }
}
