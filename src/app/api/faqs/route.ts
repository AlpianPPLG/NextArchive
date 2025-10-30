import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("auth_token")?.value
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const results = await query("SELECT * FROM faqs ORDER BY sort_order ASC")
        return NextResponse.json(results, { status: 200 })
    } catch (error) {
        console.error("Get FAQs error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
