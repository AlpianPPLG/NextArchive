import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("auth_token")?.value

        if (!token) {
            return NextResponse.json({ error: "Tidak ada token" }, { status: 401 })
        }

        const payload = verifyToken(token)

        if (!payload) {
            return NextResponse.json({ error: "Token tidak valid" }, { status: 401 })
        }

        return NextResponse.json({ user: payload }, { status: 200 })
    } catch (error) {
        console.error("Auth check error:", error)
        return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 })
    }
}
