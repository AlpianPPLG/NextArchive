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
        const month = searchParams.get("month")
        const year = searchParams.get("year")
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
      WHERE il.is_archived = TRUE
    `
        const params: any[] = []

        if (classificationId) {
            sql += ` AND il.classification_id = ?`
            params.push(Number.parseInt(classificationId))
        }

        if (search) {
            sql += ` AND (il.letter_number LIKE ? OR il.subject LIKE ? OR il.sender LIKE ?)`
            params.push(`%${search}%`, `%${search}%`, `%${search}%`)
        }

        // Period filters
        if (month && year) {
            // Monthly filter
            sql += ` AND MONTH(il.incoming_date) = ? AND YEAR(il.incoming_date) = ?`
            params.push(Number.parseInt(month), Number.parseInt(year))
        } else if (year && !month) {
            // Yearly filter
            sql += ` AND YEAR(il.incoming_date) = ?`
            params.push(Number.parseInt(year))
        } else if (startDate && endDate) {
            // Custom date range filter
            sql += ` AND DATE(il.incoming_date) BETWEEN ? AND ?`
            params.push(startDate, endDate)
        }

        sql += ` ORDER BY il.incoming_date DESC, il.created_at DESC`

        const results = await query(sql, params)
        return NextResponse.json(results, { status: 200 })
    } catch (error) {
        console.error("Get archived incoming letters error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
