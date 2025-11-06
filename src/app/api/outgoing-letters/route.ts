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
      SELECT ol.*, c.code, c.description,
             (SELECT f.id FROM files f 
              WHERE f.reference_type = 'outgoing_letter' 
              AND f.reference_id = ol.id 
              ORDER BY f.created_at DESC LIMIT 1) as file_id,
             (SELECT f.original_name FROM files f 
              WHERE f.reference_type = 'outgoing_letter' 
              AND f.reference_id = ol.id 
              ORDER BY f.created_at DESC LIMIT 1) as file_name,
             (SELECT f.file_type FROM files f 
              WHERE f.reference_type = 'outgoing_letter' 
              AND f.reference_id = ol.id 
              ORDER BY f.created_at DESC LIMIT 1) as file_type
      FROM outgoing_letters ol
      LEFT JOIN classifications c ON ol.classification_id = c.id
      WHERE ol.is_archived = FALSE
    `
        const params: any[] = []

        if (classificationId) {
            sql += ` AND ol.classification_id = ?`
            params.push(Number.parseInt(classificationId))
        }

        if (startDate) {
            sql += ` AND DATE(ol.outgoing_date) >= ?`
            params.push(startDate)
        }

        if (endDate) {
            sql += ` AND DATE(ol.outgoing_date) <= ?`
            params.push(endDate)
        }

        if (search) {
            sql += ` AND (ol.letter_number LIKE ? OR ol.subject LIKE ? OR ol.destination LIKE ?)`
            params.push(`%${search}%`, `%${search}%`, `%${search}%`)
        }

        sql += ` ORDER BY ol.created_at DESC`

        const results = await query(sql, params)
        return NextResponse.json(results, { status: 200 })
    } catch (error) {
        console.error("Get outgoing letters error:", error)
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
        const { letterNumber, destination, outgoingDate, subject, classificationId, numberOfCopies, archiveFileNumber } =
            body

        if (!letterNumber || !destination || !outgoingDate || !subject) {
            return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
        }

        const id = generateUUID()

        await query(
            `INSERT INTO outgoing_letters 
       (id, letter_number, destination, outgoing_date, subject, classification_id, number_of_copies, archive_file_number, recorded_by_user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                letterNumber,
                destination,
                outgoingDate,
                subject,
                classificationId || null,
                numberOfCopies || 1,
                archiveFileNumber || null,
                payload.userId,
            ],
        )

        return NextResponse.json({ id, success: true }, { status: 201 })
    } catch (error) {
        console.error("Create outgoing letter error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
