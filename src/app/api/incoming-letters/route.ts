import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { generateUUID } from "@/lib/utils/uuid"

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("auth_token")?.value
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const searchParams = request.nextUrl.searchParams
        const search = searchParams.get("search") || ""
        const classificationId = searchParams.get("classificationId")
        const startDate = searchParams.get("startDate")
        const endDate = searchParams.get("endDate")

        let sql = `
      SELECT il.*, c.code, c.description,
             (SELECT f.id FROM files f 
              WHERE f.reference_type = 'incoming_letter' 
              AND f.reference_id = il.id 
              ORDER BY f.created_at DESC LIMIT 1) as file_id,
             (SELECT f.original_name FROM files f 
              WHERE f.reference_type = 'incoming_letter' 
              AND f.reference_id = il.id 
              ORDER BY f.created_at DESC LIMIT 1) as file_name,
             (SELECT f.file_type FROM files f 
              WHERE f.reference_type = 'incoming_letter' 
              AND f.reference_id = il.id 
              ORDER BY f.created_at DESC LIMIT 1) as file_type
      FROM incoming_letters il
      LEFT JOIN classifications c ON il.classification_id = c.id
      WHERE il.is_archived = FALSE
    `
        const params: any[] = []

        if (classificationId) {
            sql += ` AND il.classification_id = ?`
            params.push(Number.parseInt(classificationId))
        }

        if (startDate) {
            sql += ` AND DATE(il.incoming_date) >= ?`
            params.push(startDate)
        }

        if (endDate) {
            sql += ` AND DATE(il.incoming_date) <= ?`
            params.push(endDate)
        }

        if (search) {
            sql += ` AND (il.letter_number LIKE ? OR il.subject LIKE ? OR il.sender LIKE ?)`
            params.push(`%${search}%`, `%${search}%`, `%${search}%`)
        }

        sql += ` ORDER BY il.created_at DESC`

        const results = await query(sql, params)
        return NextResponse.json(results, { status: 200 })
    } catch (error) {
        console.error("Get incoming letters error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("auth_token")?.value
        const payload = verifyToken(token || "")

        if (!payload) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { letterNumber, sender, incomingDate, subject, classificationId, numberOfCopies, archiveFileNumber } = body

        if (!letterNumber || !sender || !incomingDate || !subject) {
            return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
        }

        const id = generateUUID()

        await query(
            `INSERT INTO incoming_letters 
       (id, letter_number, sender, incoming_date, subject, classification_id, number_of_copies, archive_file_number, recorded_by_user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                letterNumber,
                sender,
                incomingDate,
                subject,
                classificationId || null,
                numberOfCopies || 1,
                archiveFileNumber || null,
                payload.userId,
            ],
        )

        return NextResponse.json({ id, success: true }, { status: 201 })
    } catch (error) {
        console.error("Create incoming letter error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
