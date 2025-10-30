import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("auth_token")?.value
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const searchParams = request.nextUrl.searchParams
        const classificationId = searchParams.get("classificationId")
        const search = searchParams.get("search") || ""

        let sql = `
      SELECT ol.*, c.code, c.description 
      FROM outgoing_letters ol
      LEFT JOIN classifications c ON ol.classification_id = c.id
      WHERE ol.is_archived = TRUE
    `
        const params: any[] = []

        if (classificationId) {
            sql += ` AND ol.classification_id = ?`
            params.push(Number.parseInt(classificationId))
        }

        if (search) {
            sql += ` AND (ol.letter_number LIKE ? OR ol.subject LIKE ? OR ol.destination LIKE ?)`
            params.push(`%${search}%`, `%${search}%`, `%${search}%`)
        }

        sql += ` ORDER BY ol.created_at DESC`

        const results = await query(sql, params)
        return NextResponse.json(results, { status: 200 })
    } catch (error) {
        console.error("Get archived outgoing letters error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
