import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import type { OutgoingLetter } from "@/lib/types"

interface OutgoingLetterWithClassification extends OutgoingLetter {
    code?: string
    description?: string
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = request.cookies.get("auth_token")?.value
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params

        const results = await query(
            `SELECT ol.*, c.code, c.description 
       FROM outgoing_letters ol
       LEFT JOIN classifications c ON ol.classification_id = c.id
       WHERE ol.id = ?`,
            [id],
        )

        const letters = results as OutgoingLetterWithClassification[]
        if (letters.length === 0) {
            return NextResponse.json({ error: "Surat tidak ditemukan" }, { status: 404 })
        }

        return NextResponse.json(letters[0], { status: 200 })
    } catch (error) {
        console.error("Get outgoing letter error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = request.cookies.get("auth_token")?.value
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params

        const body = await request.json()
        const {
            letterNumber,
            destination,
            outgoingDate,
            subject,
            classificationId,
            numberOfCopies,
            archiveFileNumber,
            isArchived,
        } = body

        await query(
            `UPDATE outgoing_letters 
       SET letter_number = ?, destination = ?, outgoing_date = ?, subject = ?, 
           classification_id = ?, number_of_copies = ?, archive_file_number = ?, is_archived = ?
       WHERE id = ?`,
            [
                letterNumber,
                destination,
                outgoingDate,
                subject,
                classificationId || null,
                numberOfCopies || 1,
                archiveFileNumber || null,
                isArchived || false,
                id,
            ],
        )

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error("Update outgoing letter error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = request.cookies.get("auth_token")?.value
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params

        await query("DELETE FROM outgoing_letters WHERE id = ?", [id])

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error("Delete outgoing letter error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
