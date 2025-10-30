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

        // Get statistics
        const incomingPending = await query("SELECT COUNT(*) as count FROM incoming_letters WHERE is_archived = FALSE")
        const incomingArchived = await query("SELECT COUNT(*) as count FROM incoming_letters WHERE is_archived = TRUE")
        const outgoingPending = await query("SELECT COUNT(*) as count FROM outgoing_letters WHERE is_archived = FALSE")
        const outgoingArchived = await query("SELECT COUNT(*) as count FROM outgoing_letters WHERE is_archived = TRUE")

        const stats = {
            suratMasuk: (incomingPending as any[])[0]?.count || 0,
            laporanMasuk: (incomingArchived as any[])[0]?.count || 0,
            suratKeluar: (outgoingPending as any[])[0]?.count || 0,
            laporanKeluar: (outgoingArchived as any[])[0]?.count || 0,
        }

        return NextResponse.json(stats, { status: 200 })
    } catch (error) {
        console.error("Dashboard stats error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
