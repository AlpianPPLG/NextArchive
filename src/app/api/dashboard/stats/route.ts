import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("auth_token")?.value

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 })
        }

        // Get statistics with a single optimized query
        const results = await query(`
            SELECT 
                SUM(CASE WHEN table_name = 'incoming' AND is_archived = FALSE THEN 1 ELSE 0 END) as incoming_pending,
                SUM(CASE WHEN table_name = 'incoming' AND is_archived = TRUE THEN 1 ELSE 0 END) as incoming_archived,
                SUM(CASE WHEN table_name = 'outgoing' AND is_archived = FALSE THEN 1 ELSE 0 END) as outgoing_pending,
                SUM(CASE WHEN table_name = 'outgoing' AND is_archived = TRUE THEN 1 ELSE 0 END) as outgoing_archived
            FROM (
                SELECT 'incoming' as table_name, is_archived FROM incoming_letters
                UNION ALL
                SELECT 'outgoing' as table_name, is_archived FROM outgoing_letters
            ) as combined_letters
        `)

        const row = (results as any[])[0] || {}
        const stats = {
            suratMasuk: Number(row.incoming_pending) || 0,
            laporanMasuk: Number(row.incoming_archived) || 0,
            suratKeluar: Number(row.outgoing_pending) || 0,
            laporanKeluar: Number(row.outgoing_archived) || 0,
        }

        return NextResponse.json(stats, { status: 200 })
    } catch (error) {
        console.error("Dashboard stats error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
