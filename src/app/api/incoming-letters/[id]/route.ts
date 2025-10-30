import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const token = request.cookies.get("auth_token")?.value
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const results = await query(
            `SELECT il.*, c.code, c.description 
       FROM incoming_letters il
       LEFT JOIN classifications c ON il.classification_id = c.id
       WHERE il.id = ?`,
            [params.id],
        )

        const letters = results as any[]
        if (letters.length === 0) {
            return NextResponse.json({ error: "Surat tidak ditemukan" }, { status: 404 })
        }

        return NextResponse.json(letters[0], { status: 200 })
    } catch (error) {
        console.error("Get incoming letter error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const token = request.cookies.get("auth_token")?.value
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const {
            letterNumber,
            sender,
            incomingDate,
            subject,
            classificationId,
            numberOfCopies,
            archiveFileNumber,
            isArchived,
        } = body

        await query(
            `UPDATE incoming_letters 
       SET letter_number = ?, sender = ?, incoming_date = ?, subject = ?, 
           classification_id = ?, number_of_copies = ?, archive_file_number = ?, is_archived = ?
       WHERE id = ?`,
            [
                letterNumber,
                sender,
                incomingDate,
                subject,
                classificationId || null,
                numberOfCopies || 1,
                archiveFileNumber || null,
                isArchived || false,
                params.id,
            ],
        )

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error("Update incoming letter error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const token = request.cookies.get("auth_token")?.value
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await query("DELETE FROM incoming_letters WHERE id = ?", [params.id])

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error("Delete incoming letter error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
