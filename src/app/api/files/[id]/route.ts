import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { RowDataPacket } from 'mysql2'

interface FileRecord extends RowDataPacket {
    file_data: Buffer
    original_name: string
    file_type: 'pdf' | 'png' | 'jpg' | 'xlsx' | 'xls' | 'csv'
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.cookies.get("auth_token")?.value
        if (!token || !verifyToken(token)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Await params in Next.js 15+
        const { id } = await params

        const [rows] = await db.execute<FileRecord[]>(
            'SELECT file_data, original_name, file_type FROM files WHERE id = ?',
            [id]
        )

        if (!Array.isArray(rows) || rows.length === 0) {
            return NextResponse.json(
                { error: 'File not found' },
                { status: 404 }
            )
        }

        const file = rows[0]
        const buffer = Buffer.from(file.file_data)

        // Set appropriate content type based on file type
        const contentType =
            file.file_type === 'pdf' ? 'application/pdf' :
            file.file_type === 'png' ? 'image/png' :
            file.file_type === 'jpg' ? 'image/jpeg' :
            file.file_type === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
            file.file_type === 'xls' ? 'application/vnd.ms-excel' :
            file.file_type === 'csv' ? 'text/csv' :
            'application/octet-stream'

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `inline; filename="${file.original_name}"`,
            },
        })
    } catch (error) {
        console.error('File retrieval error:', error)
        return NextResponse.json(
            { error: 'Failed to retrieve file' },
            { status: 500 }
        )
    }
}
